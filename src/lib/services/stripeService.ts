import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export async function createStripeCustomerAndSubscription(email: string, tier: string) {
  // You should map tier to a Stripe price ID in production
  const priceId = getPriceIdForTier(tier);
  if (!priceId) throw new Error('Invalid tier for Stripe subscription');

  const customer = await stripe.customers.create({ email });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
  return { customerId: customer.id, subscriptionId: subscription.id };
}

function getPriceIdForTier(tier: string): string | null {
  // TODO: Replace with your actual mapping
  const priceMap: Record<string, string> = {
    'Neighborhood Cellar': process.env.STRIPE_PRICE_ID_NEIGHBORHOOD || '',
    'World Class': process.env.STRIPE_PRICE_ID_WORLDCLASS || '',
  };
  return priceMap[tier] || null;
} 