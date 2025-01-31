import { supabase } from '../supabase';

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
  wine_inventory: Omit<WineData, 'id'> & { id: string };
}

export interface RecommendationResponse {
  wines: WineData[];
  scores: Record<string, number>;
}

export async function fetchRecommendations(
  userId: string
): Promise<RecommendationResponse> {
  try {
    const { data } = await supabase
      .from('user_recommendations')
      .select(`
        compatibility_score,
        wine_inventory: wine_id (
          id, name, producer, region, sub_region, country,
          varietal, vintage, price, style, image_path, alcohol_perc, metadata
        )
      `)
      .eq('user_id', userId)
      .order('compatibility_score', { ascending: false })
      .limit(10)
      .returns<RecommendationEntry[]>();

    if (!data) return { wines: [], scores: {} };

    const wines: WineData[] = data.map(entry => ({
      id: entry.wine_inventory.id,
      name: entry.wine_inventory.name,
      producer: entry.wine_inventory.producer,
      region: entry.wine_inventory.region,
      sub_region: entry.wine_inventory.sub_region,
      country: entry.wine_inventory.country,
      varietal: entry.wine_inventory.varietal,
      vintage: entry.wine_inventory.vintage,
      price: entry.wine_inventory.price,
      style: entry.wine_inventory.style,
      image_path: entry.wine_inventory.image_path,
      alcohol_perc: entry.wine_inventory.alcohol_perc,
      metadata: entry.wine_inventory.metadata || {}
    }));

    const scores = data.reduce((acc, entry) => ({
      ...acc,
      [entry.wine_inventory.id]: entry.compatibility_score
    }), {} as Record<string, number>);

    return { wines, scores };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { wines: [], scores: {} };
  }
}

// Helper Functions
export function isEmptyRecommendation(response: RecommendationResponse): boolean {
  return response.wines.length === 0;
}

export function sortWinesByScore(response: RecommendationResponse): WineData[] {
  return [...response.wines].sort((a, b) => 
    (response.scores[b.id] || 0) - (response.scores[a.id] || 0)
  );
}