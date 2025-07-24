import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
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
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: sessionId' 
      });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed' 
      });
    }

    // Get subscription details
    const subscription = session.subscription as Stripe.Subscription;
    const customer = session.customer as Stripe.Customer;

    if (!subscription || !customer) {
      return res.status(400).json({ 
        error: 'Invalid subscription or customer data' 
      });
    }

    // Get metadata from the session
    const metadata = session.metadata || {};

    return res.status(200).json({ 
      success: true,
      stripeCustomerId: customer.id,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.items.data[0]?.current_period_end || 0,
      email: customer.email || session.customer_email,
      metadata: {
        businessId: metadata.businessId,
        tierId: metadata.tierId,
        customerName: metadata.customerName,
        customerPhone: metadata.customerPhone,
        customerAddress: metadata.customerAddress,
        customerCity: metadata.customerCity,
        customerState: metadata.customerState,
        customerZipCode: metadata.customerZipCode,
        customerWinePreferences: metadata.customerWinePreferences,
        customerSpecialRequests: metadata.customerSpecialRequests,
      }
    });
  } catch (error) {
    console.error('Error verifying Stripe session:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to verify payment session' 
    });
  }
}