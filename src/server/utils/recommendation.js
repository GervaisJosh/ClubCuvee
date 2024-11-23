/**
 * Helper function: Calculates cosine similarity between two vectors.
 * @param {number[]} vec1 - First vector.
 * @param {number[]} vec2 - Second vector.
 * @returns {number} Cosine similarity score between vec1 and vec2.
 */
const cosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Converts user preferences into a numerical vector.
 * This helps the algorithm understand user preferences mathematically.
 * @param {Object} user - User object containing preferences like favorite regions and styles.
 * @returns {number[]} User preference vector.
 */
const createUserVector = (user) => {
  // Example logic: Convert favorite regions and styles into a numerical vector
  const vector = [
    ...user.favorite_regions.map((region) => (region === 'Italy' ? 1 : 0)), // Simplified logic
    ...user.favorite_styles.map((style) => (style === 'Red' ? 1 : 0)),
  ];
  return vector;
};

/**
 * Calculates a compatibility score between the user vector and a wine vector.
 * The score is adjusted by the abstract wine theory vector.
 * @param {Object} user - User object.
 * @param {number[]} wineVector - Vector representation of a wine.
 * @param {number[]} wineTheory - Abstract wine theory vector.
 * @returns {number} Compatibility score for the wine.
 */
const calculateCompatibility = (user, wineVector, wineTheory) => {
  const userVector = createUserVector(user); // Generate user vector
  const similarity = cosineSimilarity(userVector, wineVector); // Compare user and wine vectors
  const theoryAdjustment = cosineSimilarity(userVector, wineTheory); // Factor in wine theory
  return similarity + 0.5 * theoryAdjustment; // Weighted score
};

module.exports = { cosineSimilarity, createUserVector, calculateCompatibility };
