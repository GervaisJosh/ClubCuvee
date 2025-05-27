// sync-wine-vectors.ts
import { supabase } from '../../supabase.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { getOpenAIEmbedding } from '../embeddingService.js';

// Updated configuration to match text-embedding-ada-002
const CONFIG = {
  pinecone: {
    indexName: 'wine-knowledgebase',
    namespace: 'wine_inventory',
    dimension: 1536, // Dimension for text-embedding-ada-002
    batchSize: 50,
    retries: 3,
    retryDelay: 2000
  },
  openai: {
    batchDelay: 1500,
    maxRetries: 5,
    retryDelay: 5000
  },
  supabase: {
    table: 'wine_inventory',
    pageSize: 1000
  }
} as const;

const PRICE_GROUP_DESCRIPTIONS: Record<number, string> = {
  1: "ultra-budget price range",
  2: "budget-friendly price range",
  3: "affordable price range",
  4: "moderate price range",
  5: "mid-tier price range",
  6: "premium price range",
  7: "high-end price range",
  8: "luxury price range",
  9: "elite price range",
  10: "investment grade price range"
};

interface WineRecord {
  id: string;
  name: string;
  varietal: string;
  region: string | null;
  sub_region: string | null;
  country: string;
  vintage: number | null;          // Allow null
  producer: string | null;         // Allow null
  alcohol_percentage: number | null; // Allow null
  price_group: number | null;      // Allow null
  created_at: string;
  updated_at: string | null;       // Allow null
}

const DRY_RUN = false;

/**
 * Generates a natural language description for the wine.
 * Only includes a field if it exists.
 */
function generateWineDescription(wine: WineRecord): string {
  const priceDesc = wine.price_group != null ? (PRICE_GROUP_DESCRIPTIONS[wine.price_group] || "") : "";
  const regionParts = [wine.region, wine.sub_region, wine.country].filter(part => part && part.trim() !== "");
  
  const descriptionParts = [
    `${wine.name} (${wine.varietal})`,
    regionParts.length > 0 ? `from ${regionParts.join(', ')}` : "",
    wine.vintage ? `vintage ${wine.vintage}` : "",
    wine.producer ? `produced by ${wine.producer}` : "",
    wine.alcohol_percentage ? `at ${wine.alcohol_percentage}% alcohol` : "",
    priceDesc ? `in the ${priceDesc}` : ""
  ];

  return descriptionParts.filter(part => part !== "").join(', ');
}

/**
 * Fetches all wine records from Supabase in pages.
 */
async function fetchAllWines(): Promise<WineRecord[]> {
  let page = 0;
  let allWines: WineRecord[] = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from(CONFIG.supabase.table)
      .select('*')
      .range(
        page * CONFIG.supabase.pageSize,
        (page + 1) * CONFIG.supabase.pageSize - 1
      )
      .returns<WineRecord[]>();

    if (error) throw error;
    if (!data || data.length === 0) {
      hasMore = false;
      continue;
    }

    allWines = [...allWines, ...data];
    page++;
    console.log(`Fetched page ${page} (${data.length} records)`);
  }

  return allWines;
}

/**
 * Processes a batch of wines: creates a natural language description,
 * retrieves an embedding, and formats metadata so that no value is null.
 */
async function processWineBatch(batch: WineRecord[]): Promise<any[]> {
  const vectors = [];
  for (const wine of batch) {
    try {
      const description = generateWineDescription(wine);
      const embedding = await getOpenAIEmbeddingWithRetry(description);
      
      if (embedding.length !== CONFIG.pinecone.dimension) {
        throw new Error(`Invalid embedding dimension: ${embedding.length}`);
      }

      vectors.push({
        id: wine.id,
        values: embedding,
        metadata: {
          description,
          name: wine.name || "",
          varietal: wine.varietal || "",
          region: wine.region || "",
          sub_region: wine.sub_region || "",
          country: wine.country || "",
          // Convert numeric values to strings; if null, use empty string
          vintage: wine.vintage != null ? wine.vintage.toString() : "",
          producer: wine.producer || "",
          alcohol_percentage: wine.alcohol_percentage != null ? wine.alcohol_percentage.toString() : "",
          price_group: wine.price_group != null ? wine.price_group.toString() : "",
          price_group_description: wine.price_group != null ? (PRICE_GROUP_DESCRIPTIONS[wine.price_group] || "") : "",
          updated_at: wine.updated_at || ""
        }
      });
    } catch (error) {
      console.error(`Failed processing wine ${wine.id}:`, error instanceof Error ? error.message : error);
    }
  }
  return vectors;
}

/**
 * Retrieves an OpenAI embedding with retries if rate-limited.
 */
async function getOpenAIEmbeddingWithRetry(text: string, attempt = 1): Promise<number[]> {
  try {
    return await getOpenAIEmbedding(text);
  } catch (error) {
    const status = (error as any)?.status;
    if (status === 429 && attempt <= CONFIG.openai.maxRetries) {
      const delay = CONFIG.openai.retryDelay * attempt;
      console.log(`Rate limited - retrying attempt ${attempt} in ${delay}ms`);
      await new Promise(res => setTimeout(res, delay));
      return getOpenAIEmbeddingWithRetry(text, attempt + 1);
    }
    throw error;
  }
}

/**
 * Upserts vectors to Pinecone in chunks.
 */
async function chunkedUpsert(index: any, vectors: any[], batchSize: number) {
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
    console.log(`Upserted batch ${Math.ceil(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
  }
}

/**
 * Main sync function: fetches wines, generates embeddings, clears the namespace,
 * and upserts the new vectors.
 */
async function syncWinesToPinecone() {
  console.time('Full sync duration');
  
  try {
    console.time('[PINECONE] Client init');
    const pinecone = new Pinecone({ 
      apiKey: import.meta.env.VITE_PINECONE_API_KEY! 
    });
    const index = pinecone.Index(CONFIG.pinecone.indexName);
    console.timeEnd('[PINECONE] Client init');

    console.log('Fetching wines from Supabase...');
    const wines = await fetchAllWines();
    
    if (DRY_RUN) {
      console.log(`Dry Run: Would process ${wines.length} wines`);
      console.log('Sample description:', generateWineDescription(wines[0]));
      return;
    }

    console.log(`Processing ${wines.length} wines...`);
    const allVectors = [];
    for (let i = 0; i < wines.length; i += CONFIG.pinecone.batchSize) {
      const batch = wines.slice(i, i + CONFIG.pinecone.batchSize);
      const vectors = await processWineBatch(batch);
      allVectors.push(...vectors);
      console.log(`Processed batch ${Math.ceil(i / CONFIG.pinecone.batchSize) + 1}/${Math.ceil(wines.length / CONFIG.pinecone.batchSize)}`);
      await new Promise(res => setTimeout(res, CONFIG.openai.batchDelay));
    }

    // Attempt to clear the namespace. If the namespace is empty, catch and log the error.
    try {
      console.log('Clearing Pinecone namespace...');
      await index.deleteMany({ deleteAll: true, namespace: CONFIG.pinecone.namespace });
    } catch (deleteError) {
      console.warn(
        'Warning: Unable to clear namespace (this may be expected if the namespace is already empty):',
        deleteError instanceof Error ? deleteError.message : deleteError
      );
    }

    console.log(`Upserting ${allVectors.length} vectors...`);
    await chunkedUpsert(index.namespace(CONFIG.pinecone.namespace), allVectors, CONFIG.pinecone.batchSize);

    const stats = await index.describeIndexStats();
    console.log('\nSync completed successfully:');
    console.log('- Total vectors:', stats.namespaces?.[CONFIG.pinecone.namespace]?.recordCount || 0);
    console.log('- Source records:', wines.length);
    console.log('- Vectors created:', allVectors.length);

  } catch (error) {
    console.error('Sync failed:', error instanceof Error ? error.message : error);
    throw error;
  } finally {
    console.timeEnd('Full sync duration');
  }
}

syncWinesToPinecone()
  .then(() => console.log('Sync completed'))
  .catch(err => console.error('Critical error:', err instanceof Error ? err.message : err));
