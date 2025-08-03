import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessId, logoUrl } = req.body;

    if (!businessId || !logoUrl) {
      return res.status(400).json({ 
        error: 'Missing required parameters: businessId and logoUrl' 
      });
    }

    console.log('Updating business logo:', { businessId, logoUrl });

    // Update the business with the logo URL
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .update({ logo_url: logoUrl })
      .eq('id', businessId)
      .select()
      .single();

    if (error) {
      console.error('Error updating business logo:', error);
      return res.status(500).json({ 
        error: 'Failed to update business logo',
        details: error.message
      });
    }

    console.log('Business logo updated successfully:', data);

    return res.status(200).json({ 
      success: true,
      business: data
    });

  } catch (error) {
    console.error('Error in update-business-logo:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}