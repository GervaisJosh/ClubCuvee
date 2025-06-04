import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { withErrorHandler, APIError } from '../utils/error-handler';

export default withErrorHandler(async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'GET') {
    throw new APIError(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const business_id = req.query.business_id as string;

  if (!business_id) {
    throw new APIError(400, 'business_id parameter is required', 'MISSING_BUSINESS_ID');
  }

  // Get business details
  const { data: business, error: businessError } = await supabaseAdmin
    .from('businesses')
    .select('id, name, email')
    .eq('id', business_id)
    .single();

  if (businessError || !business) {
    throw new APIError(404, 'Business not found', 'BUSINESS_NOT_FOUND');
  }

  // Get ready membership tiers for this business
  const { data: tiers, error: tiersError } = await supabaseAdmin.rpc('get_restaurant_membership_tiers', {
    p_business_id: business_id
  });

  if (tiersError) {
    console.error('Error fetching restaurant membership tiers:', tiersError);
    throw new APIError(500, 'Failed to fetch membership tiers', 'FETCH_TIERS_FAILED');
  }

  // Format price display for frontend
  const formattedTiers = (tiers || []).map(tier => ({
    ...tier,
    price_display: `$${(tier.price_cents / 100).toFixed(2)}`,
    price_per_interval: `$${(tier.price_cents / 100).toFixed(2)}/${tier.interval}`
  }));

  res.status(200).json({
    success: true,
    data: {
      business: business,
      tiers: formattedTiers,
      has_tiers: formattedTiers.length > 0
    }
  });
});