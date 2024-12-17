import { createClient } from '@supabase/supabase-js';
import { Pinecone } from '@pinecone-database/pinecone';
import { calculateCompatibility } from '@/utils/recommendation';
import type { User } from '@/utils/recommendation';

interface Wine {
  id: string;
  region: string;
  style: string;
  price: number;
  [key: string]: any;
}

interface RequestBody {
  user_id: string;
  filters?: {
    region?: string;
    style?: string;
    priceRange?: [number, number];
  };
}

interface ApiResponse {
  wines: Wine[];
  scores: Record<string, number>;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Pinecone client
const pc = new Pinecone({ apiKey: import.meta.env.VITE_PINECONE_API_KEY! });

/**
 * Fetch user preferences from Supabase.
 */
async function fetchUserPreferences(user_id: string): Promise<User> {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user_id)
    .single();
  if (error) throw new Error(`User fetch error: ${error.message}`);
  return user as User;
}

/**
 * Fetch wine metadata from Supabase.
 */
async function fetchWineInventory(): Promise<Wine[]> {
  const { data: wines, error } = await supabase.from('wine_inventory').select('*');
  if (error) throw new Error(`Wine fetch error: ${error.message}`);
  return wines as Wine[];
}

/**
 * Fetch vectors from Pinecone for given IDs.
 */
async function fetchVectors(indexName: string, ids: string[]): Promise<Record<string, number[]>> {
  const index = pc.index(indexName);

  try {
    const response = await index.fetch(ids);
    return response.records
      ? Object.fromEntries(
          Object.entries(response.records).map(([key, record]) => [
            key,
            (record as { vector?: number[] }).vector ?? [],
          ])
        )
      : {};
  } catch (error) {
    console.error(`Error fetching vectors from ${indexName}:`, error);
    return {};
  }
}

/**
 * Filter wines based on user-provided filters.
 */
function applyFilters(wines: Wine[], filters?: RequestBody['filters']): Wine[] {
  if (!filters) return wines;

  return wines.filter(wine => {
    const matchesRegion = filters.region ? wine.region === filters.region : true;
    const matchesStyle = filters.style ? wine.style === filters.style : true;
    const matchesPrice =
      filters.priceRange && filters.priceRange.length === 2
        ? wine.price >= filters.priceRange[0] && wine.price <= filters.priceRange[1]
        : true;

    return matchesRegion && matchesStyle && matchesPrice;
  });
}

/**
 * Main API Handler
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { user_id, filters } = (await req.json()) as RequestBody;

    // Step 1: Fetch user preferences
    const user = await fetchUserPreferences(user_id);

    // Step 2: Fetch wine metadata and apply filters
    const allWines = await fetchWineInventory();
    const filteredWines = applyFilters(allWines, filters);

    // Step 3: Fetch vectors from Pinecone
    const wineIds = filteredWines.map(w => w.id);
    const [wineVectors, theoryVectors] = await Promise.all([
      fetchVectors('wine-metadata', wineIds),
      fetchVectors('wine-theory', ['theory-vector']),
    ]);

    const theoryVector = theoryVectors['theory-vector'] ?? [];

    // Step 4: Calculate compatibility scores
    const recommendations = filteredWines.map(wine => {
      const wineVector = wineVectors[wine.id] ?? [];
      const score = calculateCompatibility(user, wineVector, theoryVector);

      return {
        ...wine,
        compatibilityScore: score,
      };
    });

    // Step 5: Sort recommendations by score
    recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Step 6: Prepare and return response
    const response: ApiResponse = {
      wines: recommendations.slice(0, 5),
      scores: Object.fromEntries(
        recommendations.map(r => [r.id, r.compatibilityScore])
      ),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
