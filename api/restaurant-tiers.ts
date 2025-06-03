import { NextRequest } from 'next/server';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { errorHandler } from './utils/errorHandler';

export default async function handler(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const business_id = url.searchParams.get('business_id');

    if (!business_id) {
      return Response.json(
        { success: false, error: 'business_id parameter is required' },
        { status: 400 }
      );
    }

    switch (req.method) {
      case 'GET':
        return await handleGetTiers(business_id);
      
      case 'DELETE':
        const tier_id = url.searchParams.get('tier_id');
        if (!tier_id) {
          return Response.json(
            { success: false, error: 'tier_id parameter is required for DELETE' },
            { status: 400 }
          );
        }
        return await handleDeleteTier(business_id, tier_id);
      
      default:
        return Response.json(
          { success: false, error: 'Method not allowed' },
          { status: 405 }
        );
    }

  } catch (error) {
    console.error('Error in restaurant-tiers handler:', error);
    return errorHandler(error);
  }
}

async function handleGetTiers(business_id: string) {
  try {
    // Verify business exists
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name')
      .eq('id', business_id)
      .single();

    if (businessError || !business) {
      return Response.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }

    // Get all tiers for this business (including non-ready ones for management)
    const { data: tiers, error: tiersError } = await supabaseAdmin
      .from('restaurant_membership_tiers')
      .select('*')
      .eq('business_id', business_id)
      .order('created_at', { ascending: true });

    if (tiersError) {
      return Response.json(
        { success: false, error: 'Failed to fetch tiers' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: {
        business: business,
        tiers: tiers || []
      }
    });

  } catch (error) {
    console.error('Error getting tiers:', error);
    throw error;
  }
}

async function handleDeleteTier(business_id: string, tier_id: string) {
  try {
    // Verify the tier exists and belongs to this business
    const { data: tier, error: tierError } = await supabaseAdmin
      .from('restaurant_membership_tiers')
      .select('*')
      .eq('id', tier_id)
      .eq('business_id', business_id)
      .single();

    if (tierError || !tier) {
      return Response.json(
        { success: false, error: 'Tier not found or access denied' },
        { status: 404 }
      );
    }

    // TODO: Consider archiving Stripe products instead of deleting
    // For now, we'll just delete the database record
    // The Stripe products will remain (to preserve payment history)
    
    const { error: deleteError } = await supabaseAdmin
      .from('restaurant_membership_tiers')
      .delete()
      .eq('id', tier_id)
      .eq('business_id', business_id);

    if (deleteError) {
      return Response.json(
        { success: false, error: 'Failed to delete tier' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      data: {
        message: 'Tier deleted successfully',
        deleted_tier_id: tier_id
      }
    });

  } catch (error) {
    console.error('Error deleting tier:', error);
    throw error;
  }
}