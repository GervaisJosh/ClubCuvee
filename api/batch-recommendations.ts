import type { VercelRequest } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Pinecone } from '@pinecone-database/pinecone';

// Inline Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const config = {
  maxDuration: 300,
};

export default async function handler(request: VercelRequest) {
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.time(`[MAIN BATCH] Total execution`);
  console.log(`[MAIN BATCH] Started at ${new Date().toISOString()}`);

  try {
    // Initialize Pinecone using the new format:
    console.time(`[PINECONE] Client init`);
    // @ts-ignore - Intentionally initialized for future vector operations
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
    const pc = new Pinecone({ apiKey: process.env.VITE_PINECONE_API_KEY! });
    console.timeEnd(`[PINECONE] Client init`);

    // Clean up any existing batches
    console.time(`[SUPABASE] Batch cleanup`);
    const { error: deleteError } = await supabase
      .from('recommendation_batches')
      .delete()
      .neq('batch_id', -1);
    console.timeEnd(`[SUPABASE] Batch cleanup`);
    if (deleteError) throw deleteError;

    // Count users
    console.time(`[SUPABASE] User count`);
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    console.timeEnd(`[SUPABASE] User count`);

    if (!count) {
      console.log(`[MAIN BATCH] No users found`);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Setup batches (using a batch size of 50 users per batch)
    console.time(`[SUPABASE] Batch setup`);
    const totalBatches = Math.ceil(count / 50);
    const batchInserts = Array.from({ length: totalBatches }, (_, i) => ({
      batch_id: i,
      status: 'pending'
    }));

    const { error: insertError } = await supabase
      .from('recommendation_batches')
      .insert(batchInserts);
    if (insertError) throw insertError;
    console.timeEnd(`[SUPABASE] Batch setup`);

    // Trigger the first batch
    console.time(`[TRIGGER] First batch`);
    const triggerUrl = `${process.env.BASE_URL}/api/process-batch?batchId=0`;
    await fetch(triggerUrl, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    console.timeEnd(`[TRIGGER] First batch`);

    console.log(`[MAIN BATCH] Initialized ${totalBatches} batches`);
    console.timeEnd(`[MAIN BATCH] Total execution`);
    return new Response(
      JSON.stringify({ success: true, totalBatches }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`[MAIN BATCH ERROR]`, error);
    console.timeEnd(`[MAIN BATCH] Total execution`);
    return new Response(
      JSON.stringify({
        error: 'Initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
}
