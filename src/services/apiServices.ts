import { supabase } from '../lib/supabase';
import axios from 'axios';

interface APIKeys {
  binwise_key: string;
  toast_key: string;
  opentable_key: string;
}

async function getAPIKeys(restaurantId: string): Promise<APIKeys> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('binwise_key, toast_key, opentable_key')
    .eq('restaurant_id', restaurantId)
    .single();

  if (error) throw new Error('Failed to fetch API keys');
  return data as APIKeys;
}

async function connectToBinWise(apiKey: string) {
  try {
    const baseUrl = 'https://api.binwise.com/v1'; // Replace with actual BinWise API URL
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // Get restaurant details
    const restaurantResponse = await axios.get(`${baseUrl}/get_restaurants`, { headers });
    const restaurantDetails = restaurantResponse.data;

    // Get inventory scans
    const inventoryResponse = await axios.get(`${baseUrl}/inventory_scans`, { headers });
    const inventory = inventoryResponse.data;

    return {
      restaurantDetails,
      inventory
    };
  } catch (error) {
    console.error('Error connecting to BinWise:', error);
    throw new Error('Failed to connect to BinWise');
  }
}

async function connectToToast(apiKey: string) {
  try {
    const baseUrl = 'https://api.toasttab.com/v1'; // Replace with actual Toast API URL
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // Get wine sales data
    const salesResponse = await axios.get(`${baseUrl}/orders`, { headers });
    const sales = salesResponse.data;

    // Get stock data
    const stockResponse = await axios.get(`${baseUrl}/stock`, { headers });
    const stock = stockResponse.data;

    return {
      sales,
      stock
    };
  } catch (error) {
    console.error('Error connecting to Toast:', error);
    throw new Error('Failed to connect to Toast');
  }
}

async function connectToOpenTable(apiKey: string) {
  try {
    const baseUrl = 'https://api.opentable.com/v1'; // Replace with actual OpenTable API URL
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // Get reservations data
    const reservationsResponse = await axios.get(`${baseUrl}/reservations`, { headers });
    const reservations = reservationsResponse.data;

    return {
      reservations
    };
  } catch (error) {
    console.error('Error connecting to OpenTable:', error);
    throw new Error('Failed to connect to OpenTable');
  }
}

export { getAPIKeys, connectToBinWise, connectToToast, connectToOpenTable };
