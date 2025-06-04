import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/types/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!supabaseUrl || !supabaseServiceKey || !webhookSecret) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  
  if (!signature || typeof signature !== 'string') {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  if (session.mode === 'subscription' && session.subscription) {
    const metadata = session.metadata || {};
    
    // Handle business onboarding checkout
    if (metadata.onboarding_token) {
      await handleBusinessOnboardingCheckout(session, metadata.onboarding_token);
    }
    
    // Handle customer membership checkout
    else if (metadata.business_id && metadata.tier_id) {
      await handleCustomerMembershipCheckout(session, metadata.business_id, metadata.tier_id);
    }
  }
}

async function handleBusinessOnboardingCheckout(session: Stripe.Checkout.Session, token: string) {
  try {
    // Update onboarding token status
    const { error: tokenError } = await supabase
      .from('onboarding_tokens')
      .update({
        status: 'payment_completed',
        stripe_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('token', token);

    if (tokenError) {
      console.error('Error updating onboarding token:', tokenError);
    }

    console.log(`Business onboarding payment completed for token: ${token}`);
  } catch (error) {
    console.error('Error handling business onboarding checkout:', error);
  }
}

async function handleCustomerMembershipCheckout(session: Stripe.Checkout.Session, businessId: string, tierId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const metadata = session.metadata || {};
    
    // Handle private invitation flow
    if (metadata.invitation_token) {
      await handlePrivateInvitationCheckout(session, metadata.invitation_token, businessId, tierId);
    } else {
      // Legacy public checkout (deprecated)
      const { error: membershipError } = await supabase
        .from('customer_memberships')
        .insert({
          business_id: businessId,
          tier_id: tierId,
          stripe_subscription_id: subscription.id,
          status: 'active'
        });

      if (membershipError) {
        console.error('Error creating customer membership:', membershipError);
      } else {
        console.log(`Customer membership created for business: ${businessId}, tier: ${tierId}`);
      }
    }
  } catch (error) {
    console.error('Error handling customer membership checkout:', error);
  }
}

async function handlePrivateInvitationCheckout(session: Stripe.Checkout.Session, invitationToken: string, businessId: string, tierId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    // Get the invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from('customer_invitations')
      .select('*')
      .eq('token', invitationToken)
      .single();

    if (inviteError || !invitation) {
      console.error('Error finding invitation:', inviteError);
      return;
    }

    // Mark invitation as used
    const { error: updateInviteError } = await supabase
      .from('customer_invitations')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (updateInviteError) {
      console.error('Error updating invitation status:', updateInviteError);
    }

    // Find the customer user by email from auth.users
    const { data: authUsers, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError || !authUsers.users) {
      console.error('Error finding customer user:', userError);
      return;
    }

    const customerUser = authUsers.users.find(user => user.email === invitation.email);
    
    if (!customerUser) {
      console.error('Customer user not found for email:', invitation.email);
      return;
    }

    // Create customer membership record
    const { error: membershipError } = await supabase
      .from('customer_memberships')
      .insert({
        customer_user_id: customerUser.id,
        business_id: businessId,
        tier_id: tierId,
        stripe_subscription_id: subscription.id,
        invitation_token: invitationToken,
        status: 'active'
      });

    if (membershipError) {
      console.error('Error creating customer membership:', membershipError);
    } else {
      console.log(`Private customer membership created for invitation: ${invitationToken}`);
    }

  } catch (error) {
    console.error('Error handling private invitation checkout:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_succeeded:', invoice.id);

  if (invoice.subscription) {
    // Update subscription status to active
    await updateSubscriptionStatus(invoice.subscription as string, 'active');
    
    // Update customer membership status if applicable
    await updateCustomerMembershipStatus(invoice.subscription as string, 'active');
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  if (invoice.subscription) {
    // Update subscription status to past_due
    await updateSubscriptionStatus(invoice.subscription as string, 'past_due');
    
    // Update customer membership status if applicable
    await updateCustomerMembershipStatus(invoice.subscription as string, 'past_due');
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.created:', subscription.id);

  // Create or update subscription record
  await upsertSubscriptionRecord(subscription);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated:', subscription.id);

  // Update subscription record
  await upsertSubscriptionRecord(subscription);
  
  // Update customer membership if status changed
  if (subscription.status === 'active') {
    await updateCustomerMembershipStatus(subscription.id, 'active');
  } else if (['past_due', 'canceled', 'unpaid'].includes(subscription.status)) {
    await updateCustomerMembershipStatus(subscription.id, subscription.status);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted:', subscription.id);

  // Mark subscription as canceled
  await updateSubscriptionStatus(subscription.id, 'canceled');
  
  // Update customer membership status
  await updateCustomerMembershipStatus(subscription.id, 'canceled');
}

async function updateSubscriptionStatus(subscriptionId: string, status: string) {
  try {
    // Update business subscriptions
    const { error: businessSubError } = await supabase
      .from('subscriptions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (businessSubError) {
      console.error('Error updating business subscription status:', businessSubError);
    }

    // Update business status based on subscription
    if (status === 'active') {
      // First get the business IDs
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('business_id')
        .eq('stripe_subscription_id', subscriptionId);

      if (subscriptionData && subscriptionData.length > 0) {
        const businessIds = subscriptionData.map(sub => sub.business_id);
        
        const { error: businessError } = await supabase
          .from('businesses')
          .update({
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .in('id', businessIds);

        if (businessError) {
          console.error('Error updating business status:', businessError);
        }
      }
    }
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function updateCustomerMembershipStatus(subscriptionId: string, status: string) {
  try {
    const { error } = await supabase
      .from('customer_memberships')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      console.error('Error updating customer membership status:', error);
    }
  } catch (error) {
    console.error('Error updating customer membership status:', error);
  }
}

async function upsertSubscriptionRecord(subscription: Stripe.Subscription) {
  try {
    const metadata = subscription.metadata || {};
    
    // For business subscriptions
    if (metadata.business_id) {
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          business_id: metadata.business_id,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          stripe_price_id: subscription.items.data[0]?.price.id || '',
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error upserting business subscription:', error);
      }
    }
  } catch (error) {
    console.error('Error upserting subscription record:', error);
  }
}