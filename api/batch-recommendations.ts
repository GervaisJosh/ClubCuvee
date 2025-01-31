import type { VercelRequest } from '@vercel/node';
import { supabase } from '../src/supabase';
import { calculateCompatibility, createUserVector } from '../src/utils/recommendation';
import { Pinecone } from '@pinecone-database/pinecone';

interface WineRecord {
  id: string;
}

export default async function handler(request: VercelRequest) {
    // Authorization check (NEW)
    const authHeader = request.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
    const pc = new Pinecone({ apiKey: process.env.VITE_PINECONE_API_KEY! });
    const wineIndex = pc.Index('wine-metadata');

    // 1. Fetch users
    const { data: users } = await supabase
      .from('users')
      .select('id, favorite_regions, favorite_styles, average_rating');
    
    if (!users) throw new Error('No users found');

    // 2. Fetch wine IDs
    const { data: wines } = await supabase
      .from('wine_inventory')
      .select('id');
    
    if (!wines) throw new Error('No wines found');

    // 3. Type-safe Pinecone fetch
    const vectorResponse = await wineIndex.fetch(wines.map(w => w.id));

    // 4. Process recommendations
    for (const user of users) {
      const scores: Array<{ wine_id: string; score: number }> = [];
      const userVector = createUserVector(user);

      wines.forEach(wine => {
        const vector = vectorResponse.records?.[wine.id]?.values;
        if (!vector) return;

        const score = calculateCompatibility(user, vector, []);
        scores.push({ wine_id: wine.id, score });
      });

      // Store top 10
      await supabase.from('user_recommendations').upsert(
        scores.sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map(rec => ({
            user_id: user.id,
            wine_id: rec.wine_id,
            compatibility_score: rec.score
          }))
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Batch error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown' }), { status: 500 });
  }
}