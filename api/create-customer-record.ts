import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

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

    console.log('Creating customer record for session:', sessionId);

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

    // Get subscription and customer details
    const subscription = session.subscription as Stripe.Subscription;
    const customer = session.customer as Stripe.Customer;

    if (!subscription || !customer) {
      return res.status(400).json({ 
        error: 'Invalid subscription or customer data' 
      });
    }

    // Get metadata from the session
    const metadata = session.metadata || {};
    
    // Validate required metadata
    if (!metadata.businessId || !metadata.tierId) {
      return res.status(400).json({ 
        error: 'Missing required metadata: businessId and tierId' 
      });
    }

    console.log('Stripe data retrieved:', {
      customerId: customer.id,
      subscriptionId: subscription.id,
      email: customer.email || session.customer_email,
      metadata
    });

    // Check if customer already exists
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', customer.id)
      .single();

    if (existingCustomer) {
      console.log('Customer already exists:', existingCustomer.id);
      
      // Return existing customer data
      const { data: customerData, error: fetchError } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('id', existingCustomer.id)
        .single();

      if (fetchError) {
        console.error('Error fetching existing customer:', fetchError);
        return res.status(500).json({ 
          error: 'Failed to fetch existing customer' 
        });
      }

      return res.status(200).json({ 
        success: true,
        customer: customerData,
        isNew: false
      });
    }

    // Get the password from metadata
    const customerPassword = metadata.customerPassword;
    const customerEmail = customer.email || session.customer_email || '';
    
    if (!customerPassword) {
      console.error('No password provided in metadata');
      return res.status(400).json({ 
        error: 'Password is required to create customer account' 
      });
    }

    // Create auth account for the customer
    console.log('Creating auth account for customer:', customerEmail);
    
    let customerAuthId: string | null = null;
    
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true, // Auto-confirm since payment is complete
        password: customerPassword,
        user_metadata: {
          name: metadata.customerName || 'Customer',
          role: 'customer',
          business_id: metadata.businessId
        },
        // CRITICAL: Ensure NO admin metadata
        app_metadata: {}
      });

      if (authError) {
        // Check if user already exists
        if (authError.message?.includes('already exists')) {
          console.log('Auth user already exists for email, updating password...');
          // Update password for existing user
          const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = users.find(u => u.email === customerEmail);
          
          if (existingUser) {
            // Update the password AND metadata - ensure they're marked as customer
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              existingUser.id,
              { 
                password: customerPassword,
                user_metadata: {
                  name: metadata.customerName || 'Customer',
                  role: 'customer',
                  business_id: metadata.businessId
                },
                // CRITICAL: Clear any app_metadata that might mark them as admin/business
                app_metadata: {}
              }
            );
            
            if (updateError) {
              console.error('Error updating password:', updateError);
              throw updateError;
            }
            
            // Log the user's metadata to debug
            console.log('Updated existing user metadata:', {
              userId: existingUser.id,
              email: existingUser.email,
              old_app_metadata: existingUser.app_metadata,
              old_user_metadata: existingUser.user_metadata,
              new_metadata: { role: 'customer', business_id: metadata.businessId }
            });
            
            customerAuthId = existingUser.id;
            console.log('Updated password for existing auth user:', customerAuthId);
          } else {
            throw new Error('Could not find existing auth user');
          }
        } else {
          console.error('Error creating auth user:', authError);
          throw authError;
        }
      } else if (authData?.user) {
        customerAuthId = authData.user.id;
        console.log('Created new auth user with ID:', customerAuthId);
        console.log('New customer auth metadata:', {
          userId: authData.user.id,
          email: authData.user.email,
          app_metadata: authData.user.app_metadata,
          user_metadata: authData.user.user_metadata
        });
      }
    } catch (authError) {
      console.error('Failed to create/update auth account:', authError);
      // Don't fail the entire process if auth creation fails
      // Customer can still be created and auth can be fixed later
    }

    // Create new customer record with correct column names
    const customerData = {
      business_id: metadata.businessId,
      tier_id: metadata.tierId,
      auth_id: customerAuthId, // Link to the auth account we just created
      name: metadata.customerName || 'Unknown',
      email: customerEmail,
      phone: metadata.customerPhone || '',
      address: metadata.customerAddress || '',
      city: metadata.customerCity || '',
      state: metadata.customerState || '',
      zip_code: metadata.customerZipCode || '',
      wine_preferences: metadata.customerWinePreferences || null,
      special_requests: metadata.customerSpecialRequests || null,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      subscription_status: 'active', // Using subscription_status instead of status
      subscription_start_date: new Date().toISOString(),
      has_completed_survey: false,
      has_seen_tutorial: false
    };

    console.log('Creating customer with data:', customerData);

    const { data: newCustomer, error: insertError } = await supabaseAdmin
      .from('customers')
      .insert(customerData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating customer:', insertError);
      return res.status(500).json({ 
        error: 'Failed to create customer record',
        details: insertError.message
      });
    }

    console.log('Customer created successfully:', newCustomer.id);

    return res.status(200).json({ 
      success: true,
      customer: newCustomer,
      isNew: true
    });

  } catch (error) {
    console.error('Error in create-customer-record:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to process customer creation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}