// Import dependencies
const express = require('express');
const supabase = require('../utils/supabase'); // Supabase connection utility
const pinecone = require('../utils/pinecone'); // Pinecone connection utility
const { calculateCompatibility } = require('../utils/recommendation'); // Compatibility algorithm

const router = express.Router();

/**
 * POST /api/recommendations
 * Generates personalized wine recommendations for a user based on their preferences, reviews, and wine metadata.
 */
router.post('/', async (req, res) => {
  const { user_id, filters } = req.body; // Accept user ID and optional filters in the request body

  try {
    // Step 1: Fetch the user's preferences and ratings from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();
    if (userError) throw userError;

    // Step 2: Fetch all wine metadata from Supabase
    const { data: wines, error: winesError } = await supabase
      .from('wine_inventory')
      .select('*');
    if (winesError) throw winesError;

    // Step 3: Apply optional filters (e.g., by region, style, or price range) to the wine list
    let filteredWines = wines;
    if (filters) {
      if (filters.region) {
        filteredWines = filteredWines.filter((wine) => wine.region === filters.region);
      }
      if (filters.style) {
        filteredWines = filteredWines.filter((wine) => wine.style === filters.style);
      }
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        filteredWines = filteredWines.filter((wine) => wine.price >= minPrice && wine.price <= maxPrice);
      }
    }

    // Step 4: Fetch vectorized wine metadata and wine theory from Pinecone
    const wineVectors = await pinecone.index('wine-metadata').fetchAll();
    const wineTheory = await pinecone.index('wine-theory').fetchAll();

    // Step 5: Calculate compatibility scores for each filtered wine
    const recommendations = filteredWines.map((wine) => {
      const wineVector = wineVectors[wine.id]; // Vector representation of this wine
      const compatibilityScore = calculateCompatibility(user, wineVector, wineTheory); // Compatibility score
      return { ...wine, compatibilityScore }; // Return wine metadata + compatibility score
    });

    // Step 6: Sort recommendations by compatibility score in descending order
    recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Step 7: Send the sorted recommendations back to the frontend
    res.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    res.status(500).send('Error generating recommendations');
  }
});

module.exports = router;
