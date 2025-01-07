import { createClient } from '@supabase/supabase-js';
import { Pinecone } from '@pinecone-database/pinecone';
import { 
  calculateCompatibility, 
  createUserVector, 
  type User 
} from '../src/utils/recommendation';

interface UserRating {
  wine_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

interface RequestContext {
  ratings: UserRating[];
  preferences: {
    favorite_regions: string[];
    favorite_styles: string[];
    average_rating: number;
    price_range?: number;
    primary_region?: string;
    primary_country?: string;
  };
}

interface RequestBody {
  user_id: string;
  filters?: {
    region?: string;
    style?: string;
    priceRange?: [number, number];
  };
  context: RequestContext;
}

interface Wine {
  id: string;
  name: string;
  producer: string;
  region: string;
  sub_region: string;
  country: string;
  varietal: string;
  vintage: number;
  price: number;
  style: string;
  image_path: string;
  alcohol_perc: number;
  metadata: Record<string, any>;
}

interface ApiResponse {
  wines: Wine[];
  scores: Record<string, number>;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Initialize Pinecone client
const pc = new Pinecone({ apiKey: process.env.VITE_PINECONE_API_KEY! });

async function fetchUserData(user_id: string): Promise<User> {
  const { data: user, error } = await supabase
    .from('users')
    .select('favorite_regions, favorite_styles, average_rating')
    .eq('id', user_id)
    .single();
    
  if (error) throw new Error(`User fetch error: ${error.message}`);
  return user as User;
}

async function fetchWineInventory(): Promise<Wine[]> {
  const { data: wines, error } = await supabase
    .from('wine_inventory')
    .select('*');
    
  if (error) throw new Error(`Wine fetch error: ${error.message}`);
  return wines as Wine[];
}

async function fetchVectors(indexName: string, ids: string[]): Promise<Record<string, number[]>> {
  const index = pc.index(indexName);
  
  try {
    const response = await index.fetch(ids);
    if (!response.records) return {};

    return Object.fromEntries(
      Object.entries(response.records).map(([key, record]) => [
        key,
        (record as { vector?: number[] }).vector ?? [],
      ])
    );
  } catch (error) {
    console.error(`Error fetching vectors from ${indexName}:`, error);
    return {};
  }
}

function applyFilters(wines: Wine[], filters?: RequestBody['filters']): Wine[] {
  if (!filters) return wines;

  return wines.filter(wine => {
    const matchesRegion = !filters.region || wine.region === filters.region;
    const matchesStyle = !filters.style || wine.style === filters.style;
    const matchesPrice = !filters.priceRange || 
      (wine.price >= filters.priceRange[0] && wine.price <= filters.priceRange[1]);

    return matchesRegion && matchesStyle && matchesPrice;
  });
}

function calculateUserTasteProfile(ratings: UserRating[]): Record<string, number> {
  const profile: Record<string, number> = {};
  
  ratings.forEach(rating => {
    if (rating.rating) {
      profile[rating.wine_id] = rating.rating / 100; // Normalize to 0-1 range
    }
  });
  
  return profile;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Method not allowed' }), 
      { status: 405, headers: { 'Content-Type': 'application/json' }}
    );
  }

  try {
    const { user_id, filters, context } = (await req.json()) as RequestBody;

    // Step 1: Fetch necessary data
    const [user, allWines] = await Promise.all([
      fetchUserData(user_id),
      fetchWineInventory()
    ]);

    // Step 2: Apply filters to wines
    const filteredWines = applyFilters(allWines, filters);

    // Step 3: Fetch wine vectors from Pinecone
    const wineIds = filteredWines.map(w => w.id);
    const [wineVectors, theoryVectors] = await Promise.all([
      fetchVectors('wine-metadata', wineIds),
      fetchVectors('wine-theory', ['theory-vector'])
    ]);

    const theoryVector = theoryVectors['theory-vector'] ?? [];
    const tasteProfile = calculateUserTasteProfile(context.ratings);
    const userVector = createUserVector(user);

    // Step 4: Calculate compatibility scores
    const recommendations = filteredWines.map(wine => {
      const wineVector = wineVectors[wine.id] ?? [];
      const baseScore = calculateCompatibility(user, wineVector, theoryVector);
      
      // Adjust score based on user's rating history
      const ratingAdjustment = tasteProfile[wine.id] || 0;
      const finalScore = Math.min(100, baseScore * (1 + ratingAdjustment));

      return {
        ...wine,
        compatibilityScore: finalScore,
      };
    });

    // Step 5: Sort and prepare response
    recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    const response: ApiResponse = {
      wines: recommendations.slice(0, 5).map(({ compatibilityScore, ...wine }) => wine),
      scores: Object.fromEntries(
        recommendations.slice(0, 5).map(r => [r.id, r.compatibilityScore])
      ),
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' }}
    );

  } catch (error) {
    console.error('Error in recommendations API:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' }}
    );
  }
}