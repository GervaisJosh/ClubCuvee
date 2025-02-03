// batch-recommendations.ts
import type { VercelRequest } from '@vercel/node';
import { supabase } from '../src/supabase.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { processUserRecommendations, EnhancedUser, WineRating } from '../src/utils/recommendation.js';

interface WineRecord {
  id: string;
  country: string;
  vintage: number;
  alcohol_perc: number;
  price: number;
}

interface WineRatingsReviewRow {
  user_id: string;
  wine_id: string;
  region: string | null;
  style: string | null;
  rating: number;
  review: string | null;
  wine_inventory: WineRecord | null;
}

interface UserPreference {
  id: string;
  primary_region?: string;
  primary_style?: string;
  primary_country?: string;
}

const PINECONE_VECTOR_DIM = 768;
const BATCH_SIZE = 50;
const CURRENT_YEAR = new Date().getFullYear();

const trackError = (event: string, details: Record<string, unknown>) => {
  console.error(`[ERROR] ${event}`, JSON.stringify(details, null, 2));
};

export default async function handler(request: VercelRequest) {
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log(`[BATCH] Started at ${new Date().toISOString()}`);

  try {
    // Initialize Pinecone client
    const pc = new Pinecone({ apiKey: process.env.VITE_PINECONE_API_KEY! });
    const hostOverride = process.env.VITE_PINECONE_HOST!;
    const wineIndex = pc.Index('wine-knowledgebase', hostOverride);

    // 1. Fetch wine ratings with joined wine data
    const { data: allRatings, error: ratingsError } = await supabase
      .from('wine_ratings_reviews')
      .select(`
        user_id,
        wine_id,
        region,
        style,
        rating,
        review,
        wine_inventory: wine_id (
          country,
          vintage,
          alcohol_perc,
          price
        )
      `)
      .returns<WineRatingsReviewRow[]>();

    if (ratingsError) throw ratingsError;
    if (!allRatings?.length) {
      console.log('[BATCH] No ratings found - exiting gracefully');
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 2. Build EnhancedUser objects with complete wine data
    const userMap = new Map<string, EnhancedUser>();
    allRatings.forEach((rating) => {
      const wineData = rating.wine_inventory;
      if (!wineData) {
        trackError('missing_wine_data', { wine_id: rating.wine_id });
        return;
      }

      const existingUser = userMap.get(rating.user_id) || { 
        id: rating.user_id, 
        ratings: [] as WineRating[] 
      };

      existingUser.ratings.push({
        user_id: rating.user_id,
        wine_id: rating.wine_id,
        country: wineData.country || 'Unknown',
        region: rating.region || 'Other',
        style: rating.style || 'Other',
        vintage: wineData.vintage || CURRENT_YEAR - 1,
        alcohol_perc: wineData.alcohol_perc || 13.5,
        price: wineData.price || 50,
        rating: rating.rating,
        review: rating.review || ''
      });

      userMap.set(rating.user_id, existingUser);
    });

    // 3. Enrich with user preferences
    const { data: userPrefs, error: userPrefsError } = await supabase
      .from('users')
      .select('id, primary_region, primary_style, primary_country')
      .returns<UserPreference[]>();

    if (userPrefsError) throw userPrefsError;
    userPrefs?.forEach((pref) => {
      const user = userMap.get(pref.id);
      if (user) {
        user.primary_region = pref.primary_region;
        user.primary_style = pref.primary_style;
        user.primary_country = pref.primary_country;
      }
    });

    const users = Array.from(userMap.values());
    if (users.length === 0) {
      console.log('[BATCH] No users with valid ratings found');
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 4. Fetch all wine IDs with inventory
    const { data: wines, error: winesError } = await supabase
      .from('wine_inventory')
      .select('id')
      .returns<WineRecord[]>();

    if (winesError) throw winesError;
    if (!wines?.length) throw new Error('No wines found in inventory');

    // 5. Batch fetch embeddings from Pinecone with validation
    const wineIds = wines.map(w => w.id);
    const vectorCache = new Map<string, number[]>();
    
    for (let i = 0; i < wineIds.length; i += BATCH_SIZE) {
      const batchIds = wineIds.slice(i, i + BATCH_SIZE);
      const { records } = await wineIndex.namespace('wine_inventory').fetch(batchIds);

      Object.entries(records).forEach(([id, record]) => {
        if (record.values.length === PINECONE_VECTOR_DIM) {
          vectorCache.set(id, record.values);
        } else {
          trackError('invalid_vector_dimension', { 
            wine_id: id, 
            length: record.values.length 
          });
        }
      });
    }

    if (vectorCache.size === 0) {
      throw new Error('No valid wine vectors found in Pinecone index');
    }

    // 6. Process recommendations in batches
    for (const user of users) {
      console.time(`[USER] ${user.id}`);
      try {
        const recommendations = await processUserRecommendations(user, vectorCache);
        
        // Split into batches for upsert
        for (let i = 0; i < recommendations.length; i += BATCH_SIZE) {
          const batch = recommendations.slice(i, i + BATCH_SIZE);
          const { error } = await supabase
            .from('user_recommendations')
            .upsert(batch, { onConflict: 'user_id, wine_id' });

          if (error) throw error;
        }
      } catch (error) {
        trackError('user_processing_failed', {
          user_id: user.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        console.timeEnd(`[USER] ${user.id}`);
      }
    }

    console.log(`[BATCH] Completed successfully at ${new Date().toISOString()}`);
    return new Response(JSON.stringify({ 
      success: true, 
      usersProcessed: users.length,
      winesConsidered: vectorCache.size
    }), { status: 200 });
    
  } catch (error) {
    trackError('batch_failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    return new Response(
      JSON.stringify({ 
        error: 'Batch processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    );
  }
}