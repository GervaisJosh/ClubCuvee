import type { VercelRequest } from '@vercel/node';
import { supabase } from '../src/supabase.js';
import { Pinecone } from '@pinecone-database/pinecone';

interface WineRecord {
  id: string;
  country: string;
  vintage: number;
  alcohol_perc: number;
  price: number;
}

const PINECONE_VECTOR_DIM = 768;
const BATCH_SIZE = 50;

export const config = {
  maxDuration: 300 // 300 seconds (5 minutes) for Pro plan
};

export default async function handler(request: VercelRequest) {
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log(`[MAIN BATCH] Started at ${new Date().toISOString()}`);

  try {
    // Initialize Pinecone client
    const pc = new Pinecone({ apiKey: process.env.VITE_PINECONE_API_KEY! });
    const hostOverride = process.env.VITE_PINECONE_HOST!;
    const wineIndex = pc.Index('wine-knowledgebase', hostOverride);

    // 1. Fetch all wine IDs and cache vectors
    const { data: wines, error: winesError } = await supabase
      .from('wine_inventory')
      .select('id')
      .returns<WineRecord[]>();

    if (winesError) throw winesError;
    if (!wines?.length) throw new Error('No wines found in inventory');

    const wineIds = wines.map(w => w.id);
    const vectorCache = new Map<string, number[]>();
    
    for (let i = 0; i < wineIds.length; i += BATCH_SIZE) {
      const batchIds = wineIds.slice(i, i + BATCH_SIZE);
      const { records } = await wineIndex.namespace('wine_inventory').fetch(batchIds);

      Object.entries(records).forEach(([id, record]) => {
        if (record.values.length === PINECONE_VECTOR_DIM) {
          vectorCache.set(id, record.values);
        }
      });
    }

    // 2. Get total user count
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (!count) {
      console.log('[MAIN BATCH] No users found');
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 3. Create batches in Supabase
    const BATCH_SIZE_USERS = 50; // Process 50 users per batch
    const totalBatches = Math.ceil(count / BATCH_SIZE_USERS);

    // Clear previous batches
    await supabase.from('recommendation_batches').delete().neq('batch_id', 0);

    // Create new batches
    for (let batchId = 0; batchId < totalBatches; batchId++) {
      await supabase.from('recommendation_batches').upsert({
        batch_id: batchId,
        status: 'pending',
        vector_cache: Array.from(vectorCache.entries()) // Store vector cache
      });
    }

    // 4. Trigger first batch (others will be triggered recursively)
    const triggerUrl = `${process.env.VERCEL_URL}/api/process-batch?batchId=0`;
    await fetch(triggerUrl, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` }
    });

    console.log(`[MAIN BATCH] Initialized ${totalBatches} batches`);
    return new Response(JSON.stringify({ 
      success: true,
      totalBatches,
      totalWines: vectorCache.size
    }), { status: 200 });

  } catch (error) {
    console.error('[MAIN BATCH ERROR]', error);
    return new Response(JSON.stringify({ 
      error: 'Batch initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
}