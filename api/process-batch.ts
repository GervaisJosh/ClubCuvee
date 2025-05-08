import type { VercelRequest } from '@vercel/node';
import { supabase } from '../src/supabase.js';
import { processUserRecommendations } from '../src/utils/recommendation.js';
import type { EnhancedUser } from '../src/utils/recommendation.js';
import { Pinecone } from '@pinecone-database/pinecone';

interface WineRatingsReviewRow {
  user_id: string;
  wine_id: string;
  rating: number;
  region: string | null;
  style: string | null;
  review: string | null;
  wine_inventory: {
    country: string;
    vintage: number;
    alcohol_perc: number;
    price: number;
  } | null;
}

const PINECONE_VECTOR_DIM = 1536;
const PINECONE_BATCH_SIZE = 200;
const USER_BATCH_SIZE = 50;

export const config = {
  maxDuration: 300,
};

export default async function handler(req: VercelRequest) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { batchId } = req.query;
  const batchTag = `[BATCH ${batchId}]`;
  console.time(`${batchTag} Total processing`);
  console.log(`${batchTag} Started at ${new Date().toISOString()}`);

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '/';

    // Initialize Pinecone with updated 2025 format
    console.time(`${batchTag} Pinecone init`);
    const pc = new Pinecone({
      apiKey: process.env.VITE_PINECONE_API_KEY!,
    });
    const wineIndex = pc.Index('wine-knowledgebase', process.env.VITE_PINECONE_HOST!);
    console.timeEnd(`${batchTag} Pinecone init`);

    // Fetch all wine IDs with pagination
    console.time(`${batchTag} Wine ID fetch`);
    let allWines: { id: string }[] = [];
    let page = 0;
    while (true) {
      const { data, error } = await supabase
        .from('wine_inventory')
        .select('id')
        .range(page * 1000, (page + 1) * 1000 - 1);
      if (error) throw error;
      if (!data?.length) break;
      allWines = [...allWines, ...data];
      page++;
    }
    console.timeEnd(`${batchTag} Wine ID fetch`);

    // Build vector cache with batched Pinecone fetches
    console.time(`${batchTag} Vector fetch`);
    const vectorCache = new Map<string, number[]>();
    for (let i = 0; i < allWines.length; i += PINECONE_BATCH_SIZE) {
      const batchIds = allWines.slice(i, i + PINECONE_BATCH_SIZE).map(w => w.id);
      const { records } = await wineIndex.namespace('wine_inventory').fetch(batchIds);
      Object.entries(records).forEach(([id, record]) => {
        if (record.values?.length === PINECONE_VECTOR_DIM) {
          vectorCache.set(id, record.values);
        }
      });
    }
    console.timeEnd(`${batchTag} Vector fetch`);
    console.log(`${batchTag} Cached ${vectorCache.size}/${allWines.length} vectors`);

    // Fetch users using the unified preferences field
    console.time(`${batchTag} User fetch`);
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`id, preferences, price_range`)
      .range(Number(batchId) * USER_BATCH_SIZE, (Number(batchId) + 1) * USER_BATCH_SIZE - 1);
    if (usersError) throw usersError;
    if (!users?.length) {
      console.log(`${batchTag} No users in batch`);
      await supabase.from('recommendation_batches').update({ status: 'complete' }).eq('batch_id', batchId);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    console.timeEnd(`${batchTag} User fetch`);

    // Process users with comprehensive preference handling
    const processingMetrics = {
      totalUsers: users.length,
      processedUsers: 0,
      errors: 0,
      timings: [] as number[],
    };

    await Promise.all(users.map(async (user) => {
      const userTag = `[USER ${user.id}]`;
      const startTime = Date.now();
      try {
        console.time(`${userTag} Total`);

        // Remove any existing recommendations for this user
        await supabase.from('user_recommendations').delete().eq('user_id', user.id);

        // Fetch ratings with inventory data
        console.time(`${userTag} Ratings fetch`);
        const { data: ratings } = await supabase
          .from('wine_ratings_reviews')
          .select(`
            user_id,
            wine_id,
            rating,
            region,
            style,
            review,
            wine_inventory: wine_id (country, vintage, alcohol_perc, price)
          `)
          .eq('user_id', user.id)
          .returns<WineRatingsReviewRow[]>();
        console.timeEnd(`${userTag} Ratings fetch`);

        // Filter valid ratings with vectors
        const validRatings = (ratings || [])
          .filter(r => vectorCache.has(r.wine_id) && r.wine_inventory)
          .map(r => ({
            user_id: r.user_id,
            wine_id: r.wine_id,
            country: r.wine_inventory!.country,
            region: r.region ?? '',
            style: r.style ?? '',
            vintage: r.wine_inventory!.vintage,
            alcohol_perc: r.wine_inventory!.alcohol_perc,
            price: r.wine_inventory!.price,
            rating: r.rating,
            review: r.review ?? ''
          }));

        // Check for empty preferences (only skip if no data in the unified preferences field)
        const userPrefs = user.preferences || {};
        const hasPreferences = Object.keys(userPrefs).length > 0;
        if (!hasPreferences) {
          console.log(`${userTag} Skipped - No preferences data`);
          return;
        }

        // Build enhanced user profile using the unified preferences JSON
        const enhancedUser: EnhancedUser = {
          id: user.id,
          ratings: validRatings,
          primary_region: (userPrefs.regions && userPrefs.regions.length > 0) ? userPrefs.regions[0] : null,
          primary_style: (userPrefs.styles && userPrefs.styles.length > 0) ? userPrefs.styles[0] : null,
          primary_country: (userPrefs.countries && userPrefs.countries.length > 0) ? userPrefs.countries[0] : null,
          price_range: user.price_range,
          preferences: {
            regions: userPrefs.regions || [],
            styles: userPrefs.styles || [],
            countries: userPrefs.countries || []
          }
        };

        // Generate recommendations with fallback preferences
        console.time(`${userTag} Processing`);
        const recommendations = await processUserRecommendations(enhancedUser, vectorCache);
        console.timeEnd(`${userTag} Processing`);

        if (recommendations.length > 0) {
          console.time(`${userTag} Upsert`);
          await supabase.from('user_recommendations').upsert(recommendations, {
            onConflict: 'user_id, wine_id'
          });
          console.timeEnd(`${userTag} Upsert`);
          processingMetrics.processedUsers++;
        }
      } catch (error) {
        console.error(`${userTag} Error:`, error instanceof Error ? error.message : 'Unknown error');
        processingMetrics.errors++;
      } finally {
        processingMetrics.timings.push(Date.now() - startTime);
        console.timeEnd(`${userTag} Total`);
      }
    }));

    // Update batch status
    console.time(`${batchTag} Status update`);
    await supabase
      .from('recommendation_batches')
      .update({ status: 'complete' })
      .eq('batch_id', batchId);
    console.timeEnd(`${batchTag} Status update`);

    // Determine if there is a next batch. If so, trigger it without awaiting.
    const nextBatchId = Number(batchId) + 1;
    const { count: pendingCount } = await supabase
      .from('recommendation_batches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    if (pendingCount && nextBatchId < pendingCount) {
      console.log(`${batchTag} Triggering next batch ${nextBatchId}`);
      // Trigger next batch and don't await its response so that we can exit gracefully.
      fetch(`${baseUrl}/api/process-batch?batchId=${nextBatchId}`, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      }).catch((err) => console.error('Next batch trigger error:', err));
    }

    console.log(`${batchTag} Completed`, {
      ...processingMetrics,
      avgTime: Math.round(processingMetrics.timings.reduce((a, b) => a + b, 0) / processingMetrics.timings.length)
    });
    console.timeEnd(`${batchTag} Total processing`);

    // Return success immediately. This will end the current function without waiting for the next batch.
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(`${batchTag} Failed:`, error);
    await supabase
      .from('recommendation_batches')
      .update({ status: 'failed' })
      .eq('batch_id', batchId);
    console.timeEnd(`${batchTag} Total processing`);
    return new Response(JSON.stringify({
      error: 'Batch processing failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), { status: 500 });
  }
}

