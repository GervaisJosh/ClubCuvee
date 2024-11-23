import axios from 'axios';

/**
 * Fetch personalized recommendations for a user.
 * @param {string} userId - The ID of the user.
 * @param {Object} filters - Optional filters (e.g., region, style).
 * @returns {Promise<any>} A list of recommended wines.
 */
export const fetchRecommendations = async (userId: string, filters: any = {}) => {
  try {
    const response = await axios.post('/api/recommendations', { user_id: userId, filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};
