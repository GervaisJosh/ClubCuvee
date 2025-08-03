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
    const { tierId, imageUrl, businessId } = req.body;

    if (!tierId || !imageUrl) {
      return res.status(400).json({ 
        error: 'Missing required parameters: tierId and imageUrl' 
      });
    }

    console.log('Updating tier image:', { tierId, imageUrl, businessId });

    // Verify the tier belongs to the business (if businessId provided)
    if (businessId) {
      const { data: tier, error: tierError } = await supabaseAdmin
        .from('membership_tiers')
        .select('business_id')
        .eq('id', tierId)
        .single();

      if (tierError || !tier) {
        return res.status(404).json({ error: 'Tier not found' });
      }

      if (tier.business_id !== businessId) {
        return res.status(403).json({ error: 'Tier does not belong to this business' });
      }
    }

    // Update the tier with the image URL
    const { data, error } = await supabaseAdmin
      .from('membership_tiers')
      .update({ image_url: imageUrl })
      .eq('id', tierId)
      .select()
      .single();

    if (error) {
      console.error('Error updating tier image:', error);
      return res.status(500).json({ 
        error: 'Failed to update tier image',
        details: error.message
      });
    }

    console.log('Tier image updated successfully:', data);

    return res.status(200).json({ 
      success: true,
      tier: data
    });

  } catch (error) {
    console.error('Error in update-tier-image:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}