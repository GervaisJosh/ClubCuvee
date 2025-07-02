import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessId, businessSlug, tierId, priceId } = req.body;

    if (!businessId || !tierId || !priceId) {
      return res.status(400).json({ 
        error: 'Missing required parameters: businessId, tierId, and priceId are required' 
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        businessId,
        tierId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://club-cuvee.com'}/customer/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://club-cuvee.com'}/join/${businessSlug || businessId}`,
      allow_promotion_codes: true,
    });

    return res.status(200).json({ 
      success: true,
      checkoutUrl: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to create checkout session' 
    });
  }
}