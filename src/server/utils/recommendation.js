const express = require('express');
const supabase = require('../utils/supabase');
const pinecone = require('../utils/pinecone');
const { calculateCompatibility } = require('../utils/recommendation');

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id } = req.body;

  try {
    // Fetch user preferences
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();
    if (userError) throw userError;

    // Fetch wine metadata
    const { data: wines, error: winesError } = await supabase
      .from('wine_inventory')
      .select('*');
    if (winesError) throw winesError;

    // Fetch vectorized wine data from Pinecone
    const wineVectors = await pinecone.index('wine-metadata').fetchAll();
    const wineTheory = await pinecone.index('wine-theory').fetchAll();

    // Compute compatibility scores
    const recommendations = wines.map((wine) => {
      const wineVector = wineVectors[wine.id];
      const compatibilityScore = calculateCompatibility(user, wineVector, wineTheory);
      return { ...wine, compatibilityScore };
    });

    // Sort by compatibility
    recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    res.status(500).send('Error generating recommendations');
  }
});

module.exports = router;
