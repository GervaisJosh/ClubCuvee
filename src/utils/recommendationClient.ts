// recommendationClient.ts
import { supabase } from '../supabase.js';

interface WineData {
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
  metadata: Record<string, unknown>;
}

interface RecommendationEntry {
  compatibility_score: number;
  updated_at: string;
  wine_inventory: {
    id: string;
    name: string;
    producer: string;
    region: string | null;
    sub_region: string | null;
    country: string;
    varietal: string;
    vintage: number;
    price: number;
    style: string;
    image_path: string | null;
    alcohol_perc: number;
    metadata: Record<string, unknown> | null;
  };
}

export interface RecommendationResponse {
  wines: WineData[];
  scores: Record<string, number>;
  lastUpdated: string | null;
}

export async function fetchRecommendations(
  userId: string
): Promise<RecommendationResponse> {
  try {
    // First, find the local_id that corresponds to this auth user_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('local_id')
      .eq('auth_id', userId)
      .single();
    
    if (userError) {
      console.log('No user profile found for auth_id:', userId);
      return { wines: [], scores: {}, lastUpdated: null };
    }

    // Now use the local_id to get recommendations
    const localId = userData?.local_id;
    if (!localId) {
      console.log('User profile exists but has no local_id');
      return { wines: [], scores: {}, lastUpdated: null };
    }

    // Try to find recommendations for this user
    try {
      const { data, error } = await supabase
        .from('user_recommendations')
        .select(`
          compatibility_score,
          updated_at,
          wine_inventory!inner (
            id, name, producer, region, sub_region, country,
            varietal, vintage, price, style, image_path, alcohol_perc, metadata
          )
        `)
        .eq('user_id', localId)
        .order('compatibility_score', { ascending: false })
        .limit(10)
        .returns<RecommendationEntry[]>();

      if (error) {
        console.log('No recommendations found for user:', localId);
        return { wines: [], scores: {}, lastUpdated: null };
      }

      if (!data || data.length === 0) {
        console.log('User has no recommendations yet');
        return { wines: [], scores: {}, lastUpdated: null };
      }

      const lastUpdated = data[0].updated_at;
      
      const wines: WineData[] = data.map(entry => ({
        id: entry.wine_inventory.id,
        name: entry.wine_inventory.name,
        producer: entry.wine_inventory.producer,
        region: entry.wine_inventory.region || 'Unknown Region',
        sub_region: entry.wine_inventory.sub_region || 'Unknown Sub-Region',
        country: entry.wine_inventory.country,
        varietal: entry.wine_inventory.varietal,
        vintage: entry.wine_inventory.vintage,
        price: entry.wine_inventory.price,
        style: entry.wine_inventory.style,
        image_path: entry.wine_inventory.image_path || '/default-wine.png',
        alcohol_perc: entry.wine_inventory.alcohol_perc,
        metadata: entry.wine_inventory.metadata || {}
      }));

      const scores = data.reduce((acc, entry) => {
        acc[entry.wine_inventory.id] = entry.compatibility_score;
        return acc;
      }, {} as Record<string, number>);

      return { wines, scores, lastUpdated };
    } catch (innerError) {
      // This could be a 400 error from the inner join if user has no recommendations
      // or if wine_inventory is empty
      console.log('Error in recommendation query, likely due to no matching records');
      return { wines: [], scores: {}, lastUpdated: null };
    }
  } catch (error) {
    console.error('Unhandled error in fetchRecommendations:', error);
    return { wines: [], scores: {}, lastUpdated: null };
  }
}

export function isEmptyRecommendation(response: RecommendationResponse): boolean {
  return response.wines.length === 0;
}

export function sortWinesByScore(response: RecommendationResponse): WineData[] {
  return [...response.wines].sort((a, b) => (response.scores[b.id] || 0) - (response.scores[a.id] || 0));
}
