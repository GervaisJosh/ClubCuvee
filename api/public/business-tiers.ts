import { NextRequest } from 'next/server';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { errorHandler } from '../utils/errorHandler';

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const url = new URL(req.url);
    const business_id = url.searchParams.get('business_id');

    if (!business_id) {
      return Response.json(
        { success: false, error: 'business_id parameter is required' },
        { status: 400 }
      );
    }

    // Get business details
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, description')
      .eq('id', business_id)
      .single();

    if (businessError || !business) {
      return Response.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    // Get ready membership tiers for this business
    const { data: tiers, error: tiersError } = await supabaseAdmin.rpc('get_restaurant_membership_tiers', {
      p_business_id: business_id
    });

    if (tiersError) {
      console.error('Error fetching restaurant membership tiers:', tiersError);
      return Response.json(
        { success: false, error: 'Failed to fetch membership tiers' },
        { status: 500 }
      );
    }

    // Format price display for frontend
    const formattedTiers = (tiers || []).map(tier => ({
      ...tier,
      price_display: `$${(tier.price_cents / 100).toFixed(2)}`,
      price_per_interval: `$${(tier.price_cents / 100).toFixed(2)}/${tier.interval}`
    }));

    return Response.json({
      success: true,
      data: {
        business: business,
        tiers: formattedTiers,
        has_tiers: formattedTiers.length > 0
      }
    });

  } catch (error) {
    console.error('Error in public business-tiers handler:', error);
    return errorHandler(error);
  }
}