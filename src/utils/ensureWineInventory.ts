import { supabase } from '../supabase';

/**
 * Ensures there's at least one wine in the wine_inventory table for testing
 * Only runs in development mode to prevent adding test data to production
 */
export const ensureWineInventoryExists = async (): Promise<void> => {
  // Only run in development mode
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  
  try {
    // Check if wine_inventory has any records
    const { data, error } = await supabase
      .from('wine_inventory')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Error checking wine inventory:', error);
      return;
    }
    
    // If inventory already has wines, we're good
    if (data && data.length > 0) {
      console.log('Wine inventory already has data');
      return;
    }
    
    console.log('Adding test wines to wine_inventory');
    
    // Add some test wines
    const testWines = [
      {
        name: 'Test Cabernet',
        producer: 'Test Winery',
        region: 'Napa Valley',
        sub_region: 'Oakville',
        country: 'USA',
        varietal: 'Cabernet Sauvignon',
        vintage: 2019,
        price: 59.99,
        style: 'Red',
        alcohol_perc: 14.5,
        image_path: '/images/red-wine-glass.jpg',
        stock: 10,
        metadata: {
          tasting_notes: 'Rich black currant, cedar, and vanilla with firm tannins',
          food_pairings: ['Ribeye steak', 'Lamb chops', 'Aged cheeses'],
          acidity: 'Medium',
          body: 'Full',
          tannins: 'Firm',
          sweetness: 'Dry'
        }
      },
      {
        name: 'Test Chardonnay',
        producer: 'Test Vineyard',
        region: 'Sonoma',
        sub_region: 'Russian River Valley',
        country: 'USA',
        varietal: 'Chardonnay',
        vintage: 2020,
        price: 45.99,
        style: 'White',
        alcohol_perc: 13.5,
        image_path: '/images/wine-dining.jpg',
        stock: 15,
        metadata: {
          tasting_notes: 'Crisp green apple, buttery oak, and toasted vanilla',
          food_pairings: ['Roast chicken', 'Creamy pasta', 'Lobster'],
          acidity: 'Medium-high',
          body: 'Medium',
          tannins: 'None',
          sweetness: 'Dry'
        }
      },
      {
        name: 'Test Pinot Noir',
        producer: 'Test Estate',
        region: 'Willamette Valley',
        sub_region: 'Dundee Hills',
        country: 'USA',
        varietal: 'Pinot Noir',
        vintage: 2018,
        price: 52.99,
        style: 'Red',
        alcohol_perc: 13.0,
        image_path: '/images/wine-cellar-how.jpg',
        stock: 8,
        metadata: {
          tasting_notes: 'Bright cherry, earth, and subtle spice with silky tannins',
          food_pairings: ['Duck breast', 'Mushroom risotto', 'Grilled salmon'],
          acidity: 'High',
          body: 'Medium',
          tannins: 'Silky',
          sweetness: 'Dry'
        }
      }
    ];
    
    const { error: insertError } = await supabase
      .from('wine_inventory')
      .insert(testWines);
      
    if (insertError) {
      console.error('Error adding test wines:', insertError);
    } else {
      console.log('Successfully added test wines to inventory');
    }
  } catch (error) {
    console.error('Error in ensureWineInventoryExists:', error);
  }
};