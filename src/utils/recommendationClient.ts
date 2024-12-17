import axios from 'axios';

export interface WineData {
  id: string;
  name: string;
  varietal: string;
  region: string;
  sub_region: string;
  vintage: number;
  price: number;
  producer: string;
  country: string;
  image_path: string;
  style: string;
  metadata?: any;
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

export const fetchRecommendations = async (
  userId: string, 
  filters: RecommendationFilters = {}
): Promise<RecommendationResponse> => {
  try {
    const response = await axios.post('/api/recommendations', {
      user_id: userId,
      filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};