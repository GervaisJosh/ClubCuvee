const express = require('express');
const supabase = require('../utils/supabase');
const pinecone = require('../utils/pinecone');
const { calculateCompatibility } = require('../utils/recommendation');

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id } = req.body;

  try {
    const { data: user } = await supabase.from('users').select('*').eq('id', user_id).single();
    const { data: wines } = await supabase.from('wine_inventory').select('*');
    const wineVectors = await pinecone.index('wine-metadata').fetchAll();
    const wineTheory = await pinecone.index('wine-theory').fetchAll();

    const recommendations = wines.map((wine) => {
      const wineVector = wineVectors[wine.id];
      const compatibilityScore = calculateCompatibility(user, wineVector, wineTheory);
      return { ...wine, compatibilityScore };
    });

    recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating recommendations');
  }
});

module.exports = router;
