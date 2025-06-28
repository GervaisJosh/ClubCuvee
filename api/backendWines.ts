import axios from 'axios';

/**
 * Fetch all wines from the backend.
 * @returns {Promise<any>} A list of wines from the backend.
 */
export const fetchBackendWines = async () => {
  try {
    const response = await axios.get('/api/wines');
    return response.data;
  } catch (error) {
    console.error('Error fetching backend wines:', error);
    throw error;
  }
};
