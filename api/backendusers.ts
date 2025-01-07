import axios from 'axios';

/**
 * Fetch user data from the backend.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} User data from the backend.
 */
export const fetchBackendUserData = async (userId: string) => {
  try {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching backend user data:', error);
    throw error;
  }
};
