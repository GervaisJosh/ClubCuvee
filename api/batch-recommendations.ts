import type { VercelRequest } from '@vercel/node';
import { supabase } from '../src/supabase';
import { Pinecone } from '@pinecone-database/pinecone';
import { calculateCompatibility, computeUserVector, EnhancedUser, WineRating } from '../src/utils/recommendation';

interface WineRecord {
  id: string;
}

interface WineRatingsReviewRow {
  user_id: string;
  region: string | null;
  style: string | null;
  rating: number;
  review: string | null;
}

const PINECONE_VECTOR_DIM = 768;
const MAX_RECOMMENDATIONS = 10;

const trackError = (event: string, details: Record<string, unknown>) => {
  console.error(`[ERROR] ${event}`, details);
};

export default async function handler(request: VercelRequest) {
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log(`[BATCH] Started at ${new Date().toISOString()}`);

  try {
    const pc = new Pinecone({ apiKey: process.env.VITE_PINECONE_API_KEY! });
    const wineIndex = pc.Index('wine-metadata');

    // 1. Fetch user ratings
    const { data: allRatings, error: ratingsError } = await supabase
      .from('wine_ratings_reviews')
      .select('user_id, region, style, rating, review')
      .returns<WineRatingsReviewRow[]>();
    
    if (ratingsError) throw ratingsError;
    if (!allRatings?.length) throw new Error('No ratings found');

    // 2. Group ratings by user
    const userMap = new Map<string, EnhancedUser>();
    allRatings.forEach((rating) => {
      const user = userMap.get(rating.user_id) || {
        id: rating.user_id,
        ratings: [] as WineRating[]
      };
      user.ratings.push({
        region: rating.region ?? 'Other',
        style: rating.style ?? 'Other',
        rating: rating.rating,
        review: rating.review ?? ''
      });
      userMap.set(rating.user_id, user);
    });
    const users = Array.from(userMap.values());

    // 3. Fetch all wines
    const { data: wines, error: winesError } = await supabase
      .from('wine_inventory')
      .select('id')
      .returns<WineRecord[]>();
    
    if (winesError) throw winesError;
    if (!wines?.length) throw new Error('No wines found');

    // 4. Fetch vectors from Pinecone
    const vectorResponse = await wineIndex.fetch(wines.map(w => w.id));
    const wineVectorCache = new Map<string, number[]>(
      Object.entries(vectorResponse.records).map(([id, record]) => [id, record.values])
    );

    // 5. Process recommendations
    for (const user of users) {
      console.time(`[USER] ${user.id}`);
      try {
        const scores: Array<{ wine_id: string; score: number }> = [];
        const userVector = computeUserVector(user);

        wines.forEach(wine => {
          const vector = wineVectorCache.get(wine.id);
          if (!vector || vector.length !== PINECONE_VECTOR_DIM) {
            trackError('invalid_vector', { wine_id: wine.id });
            return;
          }

          const score = calculateCompatibility(user, vector);
          scores.push({ wine_id: wine.id, score });
        });

        // 6. Store recommendations
        const topRecommendations = scores
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_RECOMMENDATIONS)
          .map(rec => ({
            user_id: user.id,
            wine_id: rec.wine_id,
            compatibility_score: rec.score,
            updated_at: new Date().toISOString()
          }));

        const { error: upsertError } = await supabase
          .from('user_recommendations')
          .upsert(topRecommendations, {
            onConflict: 'user_id, wine_id'
          });

        if (upsertError) throw upsertError;

      } catch (error) {
        trackError('user_processing_failed', {
          user_id: user.id,
          error: error instanceof Error ? error.message : 'Unknown'
        });
        throw error;
      } finally {
        console.timeEnd(`[USER] ${user.id}`);
      }
    }

    console.log(`[BATCH] Completed successfully at ${new Date().toISOString()}`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    trackError('batch_failed', {
      error: error instanceof Error ? error.message : 'Unknown'
    });
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown'
    }), { status: 500 });
  }
}