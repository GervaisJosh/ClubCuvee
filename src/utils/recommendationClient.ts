import { supabase } from '../supabase';

export interface WineData {
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

export interface UserRating {
  wine_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

export interface UserPreferences {
  favorite_regions: string[];
  favorite_styles: string[];
  average_rating: number;
  price_range?: number;
  primary_region?: string;
  primary_country?: string;
}

export interface RecommendationFilters {
  region?: string;
  style?: string;
  priceRange?: [number, number];
}

export interface RecommendationResponse {
  wines: WineData[];
  scores: Record<string, number>;
}

async function fetchUserRatings(userId: string): Promise<UserRating[]> {
  try {
    const { data, error } = await supabase
      .from('wine_ratings_reviews')
      .select('wine_id, rating, review, created_at')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    return [];
  }
}

async function fetchUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('favorite_regions, favorite_styles, average_rating, price_range, primary_region, primary_country')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
}

export async function fetchRecommendations(
  userId: string,
  filters?: RecommendationFilters
): Promise<RecommendationResponse> {
  try {
    // Fetch user data in parallel
    const [userRatings, userPreferences] = await Promise.all([
      fetchUserRatings(userId),
      fetchUserPreferences(userId)
    ]);

    if (!userPreferences) {
      throw new Error('User preferences not found');
    }

    // Call recommendations API with user context
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        filters,
        context: {
          ratings: userRatings,
          preferences: userPreferences
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Fetch complete wine data from Supabase for recommended wines
    const { data: wines, error: winesError } = await supabase
      .from('wine_inventory')
      .select('*')
      .in('id', data.wines.map((w: any) => w.id));

    if (winesError) throw winesError;

    // Combine API recommendation scores with complete wine data
    return {
      wines: wines.map((wine: WineData) => ({
        ...wine,
        // Ensure all required fields are present
        name: wine.name || '',
        producer: wine.producer || '',
        region: wine.region || '',
        sub_region: wine.sub_region || '',
        country: wine.country || '',
        varietal: wine.varietal || '',
        vintage: wine.vintage || 0,
        price: wine.price || 0,
        style: wine.style || '',
        image_path: wine.image_path || '/placeholder-wine.png',
        alcohol_perc: wine.alcohol_perc || 0,
        metadata: wine.metadata || {}
      })),
      scores: data.scores || {}
    };
  } catch (error) {
    console.error('Error in fetchRecommendations:', error);
    // Return empty response instead of throwing
    return {
      wines: [],
      scores: {}
    };
  }
}

// Helper function to check if a recommendation response is empty
export function isEmptyRecommendation(response: RecommendationResponse): boolean {
  return response.wines.length === 0;
}

// Helper function to sort wines by recommendation score
export function sortWinesByScore(response: RecommendationResponse): WineData[] {
  return [...response.wines].sort((a, b) => 
    (response.scores[b.id] || 0) - (response.scores[a.id] || 0)
  );
}
