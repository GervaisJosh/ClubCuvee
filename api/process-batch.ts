import type { VercelRequest } from '@vercel/node';
import { supabase } from '../src/supabase.js';
import { processUserRecommendations } from '../src/utils/recommendation.js';
import type { EnhancedUser, WineRating } from '../src/utils/recommendation.js';

interface WineRatingsReviewRow {
  user_id: string;
  wine_id: string;
  region: string | null;
  style: string | null;
  rating: number;
  review: string | null;
  wine_inventory: {
    country: string;
    vintage: number;
    alcohol_perc: number;
    price: number;
  } | null;
}

interface BatchData {
  batch_id: number;
  vector_cache: [string, number[]][];
}

export const config = {
  maxDuration: 300 // 5 minutes per batch
};

export default async function handler(req: VercelRequest) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { batchId } = req.query;
  console.log(`[BATCH ${batchId}] Processing started`);

  try {
    // 1. Get batch data with vector cache
    const { data: batchData, error: batchError } = await supabase
      .from('recommendation_batches')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (batchError || !batchData) throw new Error('Batch data not found');
    
    const vectorCache = new Map<string, number[]>(batchData.vector_cache);
    const CURRENT_YEAR = new Date().getFullYear();

    // 2. Get users for this batch
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .range(Number(batchId) * 50, (Number(batchId) + 1) * 50 - 1);

    if (!users?.length) {
      console.log(`[BATCH ${batchId}] No users in batch`);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 3. Process users in parallel
    await Promise.all(users.map(async (user) => {
      try {
        // Get user ratings
        const { data: ratings } = await supabase
          .from('wine_ratings_reviews')
          .select(`
            user_id,
            wine_id,
            region,
            style,
            rating,
            review,
            wine_inventory: wine_id (country, vintage, alcohol_perc, price)
          `)
          .eq('user_id', user.id)
          .returns<WineRatingsReviewRow[]>();

        if (!ratings?.length) return;

        // Build EnhancedUser object
        const enhancedUser: EnhancedUser = {
          id: user.id,
          ratings: ratings.map(rating => ({
            user_id: rating.user_id,
            wine_id: rating.wine_id,
            country: rating.wine_inventory?.country || 'Unknown',
            region: rating.region || 'Other',
            style: rating.style || 'Other',
            vintage: rating.wine_inventory?.vintage || CURRENT_YEAR - 1,
            alcohol_perc: rating.wine_inventory?.alcohol_perc || 13.5,
            price: rating.wine_inventory?.price || 50,
            rating: rating.rating,
            review: rating.review || ''
          }))
        };

        // Get user preferences
        const { data: preferences } = await supabase
          .from('users')
          .select('primary_region, primary_style, primary_country')
          .eq('id', user.id)
          .single();

        if (preferences) {
          enhancedUser.primary_region = preferences.primary_region;
          enhancedUser.primary_style = preferences.primary_style;
          enhancedUser.primary_country = preferences.primary_country;
        }

        // Generate recommendations
        const recommendations = await processUserRecommendations(enhancedUser, vectorCache);
        
        // Upsert recommendations
        if (recommendations.length > 0) {
          await supabase
            .from('user_recommendations')
            .upsert(recommendations, { onConflict: 'user_id, wine_id' });
        }

      } catch (error) {
        console.error(`[BATCH ${batchId}] Error processing user ${user.id}:`, error);
      }
    }));

    // 4. Update batch status and trigger next batch
    await supabase
      .from('recommendation_batches')
      .update({ status: 'complete' })
      .eq('batch_id', batchId);

    // Trigger next batch if exists
    const nextBatchId = Number(batchId) + 1;
    const { count } = await supabase
      .from('recommendation_batches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (count && nextBatchId <= count) {
      const nextUrl = `${process.env.VERCEL_URL}/api/process-batch?batchId=${nextBatchId}`;
      await fetch(nextUrl, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` }
      });
    }

    console.log(`[BATCH ${batchId}] Completed successfully`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(`[BATCH ${batchId} ERROR]`, error);
    await supabase
      .from('recommendation_batches')
      .update({ status: 'failed' })
      .eq('batch_id', batchId);
      
    return new Response(JSON.stringify({ 
      error: 'Batch processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
}