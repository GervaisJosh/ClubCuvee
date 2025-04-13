import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabase';
import { restaurantService } from '../../services/restaurantService';
import { membershipService } from '../../services/membershipService';
import { stripeService } from '../../services/stripeService';
import RegistrationSteps from '../../components/registration/RegistrationSteps';
import Layout from '../../components/Layout';
import type { RestaurantFormData, MembershipTier, FormErrors } from '../../types';

/**
 * Restaurant Onboarding Wizard
 * 
 * This component orchestrates the entire restaurant registration flow:
 * 1. Info collection (restaurant details, admin account)
 * 2. Membership tier configuration
 * 3. Payment processing via Stripe
 * 4. Finalization and dashboard redirect
 */
const RestaurantOnboarding: React.FC = () => {
  const { restaurantRef } = useParams<{ restaurantRef: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Possible URL params for Stripe checkout return
  const sessionId = queryParams.get('session_id');
  const paymentStatus = queryParams.get('status');

  // State for each step of the registration process
  const [isLoading, setIsLoading] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    restaurant?: FormErrors;
    tiers?: string;
    general?: string;
  }>({});

  // Data state
  const [restaurantData, setRestaurantData] = useState<RestaurantFormData>({
    restaurantName: '',
    adminName: '',
    email: '',
    website: '',
    logo: null,
    password: '',
    confirmPassword: '',
  });
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('');
  
  // For handling Stripe payment verification
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Check for existing registration or payment status
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        setIsLoading(true);
        
        // If we have a sessionId and status=success from Stripe redirect
        if (sessionId && paymentStatus === 'success') {
          setPaymentVerified(true);
          
          // Optionally: verify the session with Stripe
          // const isValid = await stripeService.verifyPaymentSession(sessionId);
          
          // If there was a partially completed registration, we could fetch it here
          // and pre-populate the form
          // const { data } = await supabase.from('temp_registrations')
          //  .select('*').eq('payment_session_id', sessionId).single();
        }
        
        // If we have a restaurant reference token, try to load data
        if (restaurantRef && restaurantRef !== 'new') {
          // Check if this is a valid token for resuming registration
          const { data: tokenData, error: tokenError } = await supabase
            .from('registration_tokens')
            .select('*')
            .eq('token', restaurantRef)
            .single();
            
          if (!tokenError && tokenData) {
            // Found valid registration data to resume
            if (tokenData.restaurant_data) {
              setRestaurantData(tokenData.restaurant_data as RestaurantFormData);
            }
            
            if (tokenData.tiers) {
              setTiers(tokenData.tiers as MembershipTier[]);
            }
            
            if (tokenData.restaurant_id) {
              setRestaurantId(tokenData.restaurant_id);
              setCurrentStep(2); // Skip to membership tiers step
            }
            
            if (tokenData.payment_session_id) {
              setPaymentVerified(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkRegistrationStatus();
  }, [restaurantRef, sessionId, paymentStatus]);

  // Handle restaurant form submission (Step 1)
  const handleRestaurantSubmit = async (data: RestaurantFormData) => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // If we need to collect payment first, create a checkout session
      if (!paymentVerified && !data.sessionId) {
        const checkoutData = {
          customerId: 'pending', // Will be updated after account creation
          customerEmail: data.email,
          restaurantId: 'pending',
          successUrl: `${window.location.origin}/onboarding/${restaurantRef || 'new'}?session_id={CHECKOUT_SESSION_ID}&status=success`,
          cancelUrl: `${window.location.origin}/onboarding/${restaurantRef || 'new'}`
        };
        
        const sessionId = await stripeService.createCheckoutSession(checkoutData);
        await stripeService.redirectToCheckout(sessionId);
        return; // Redirect in progress, stop execution
      }
      
      // Otherwise, create the restaurant account
      const createdRestaurant = await restaurantService.createRestaurant({
        ...data,
        tier: 'standard', // Default tier
        sessionId: sessionId || undefined,
      });
      
      setRestaurantId(createdRestaurant.id);
      
      // If a logo was provided, upload it
      if (data.logo) {
        await restaurantService.uploadLogo(createdRestaurant.id, data.logo);
      }
      
      // Store updated restaurant data
      setRestaurantData(data);
      
      // If we're resuming with a token, also save progress
      if (restaurantRef && restaurantRef !== 'new') {
        await supabase
          .from('registration_tokens')
          .update({
            restaurant_data: data,
            restaurant_id: createdRestaurant.id,
            last_updated: new Date().toISOString(),
          })
          .eq('token', restaurantRef);
      } else {
        // Generate a new token for resuming later if needed
        const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        
        await supabase
          .from('registration_tokens')
          .insert([{
            token,
            restaurant_data: data,
            restaurant_id: createdRestaurant.id,
            payment_session_id: sessionId || null,
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
          }]);
          
        // Update URL with token for bookmark/sharing
        navigate(`/onboarding/${token}${sessionId ? `?session_id=${sessionId}&status=success` : ''}`, { replace: true });
      }
      
      // Proceed to next step
      setCurrentStep(2);
    } catch (error: any) {
      console.error('Error creating restaurant:', error);
      setErrors({
        restaurant: {
          general: error.message || 'Failed to create restaurant account'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle completion of all steps
  const handleRegistrationComplete = async (data: {
    restaurant: RestaurantFormData;
    tiers: MembershipTier[];
    restaurantId?: string;
  }) => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Ensure we have a restaurant ID
      const finalRestaurantId = data.restaurantId || restaurantId;
      if (!finalRestaurantId) {
        throw new Error('Missing restaurant ID');
      }
      
      // Create any membership tiers that don't have IDs yet
      const tierPromises = data.tiers.map(async (tier) => {
        // Skip tiers that are already created (have an ID and stripe IDs)
        if (
          tier.id &&
          tier.stripe_product_id &&
          tier.stripe_price_id &&
          tier.restaurant_id === finalRestaurantId
        ) {
          return tier;
        }
        
        // Otherwise create the tier
        return await membershipService.createMembershipTier(
          {
            name: tier.name,
            price: tier.price,
            description: tier.description,
            stripe_product_id: tier.stripe_product_id,
            stripe_price_id: tier.stripe_price_id,
          },
          finalRestaurantId
        );
      });
      
      // Wait for all tier creations to complete
      await Promise.all(tierPromises);
      
      // Update restaurant to mark registration complete
      await restaurantService.updateRestaurant(finalRestaurantId, {
        registration_complete: true,
        updated_at: new Date().toISOString(),
      });
      
      // Registration is complete!
      setRegistrationComplete(true);
      
      // Clean up registration token if it exists
      if (restaurantRef && restaurantRef !== 'new') {
        await supabase
          .from('registration_tokens')
          .delete()
          .eq('token', restaurantRef);
      }
      
      // Create user authentication and link to restaurant
      const { error } = await supabase.auth.signUp({
        email: data.restaurant.email,
        password: data.restaurant.password,
        options: {
          data: {
            restaurant_id: finalRestaurantId,
            full_name: data.restaurant.adminName,
            role: 'restaurant_admin',
          }
        }
      });
      
      if (error) {
        console.error('Error creating user account:', error);
        // Don't fail the process - we can handle this separately
      }
      
    } catch (error: any) {
      console.error('Error completing registration:', error);
      setErrors({
        general: error.message || 'Failed to complete registration'
      });
      setIsSubmitting(false);
    }
  };

  // State for Layout component props
  const [viewMode, setViewMode] = useState<string>('registration');
  const userRole = 'restaurant_admin'; // Default role for registration process
  
  // Loading state
  if (isLoading) {
    return (
      <Layout userRole={userRole} setViewMode={setViewMode}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#872657]" />
        </div>
      </Layout>
    );
  }
  
  // Registration complete state
  if (registrationComplete) {
    return (
      <Layout userRole={userRole} setViewMode={setViewMode}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
            <div className="mb-6 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-[#872657]">Registration Complete!</h1>
            <p className="mb-8 text-gray-700">
              Your restaurant has been successfully registered with Club Cuvee.
              You can now access your dashboard to start configuring your wine club.
            </p>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-full bg-[#872657] text-white py-3 rounded-md hover:bg-opacity-90 font-bold"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Main registration UI
  return (
    <Layout userRole={userRole} setViewMode={setViewMode}>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#872657]">Register Your Restaurant</h1>
            <p className="text-gray-600">
              Set up your membership tiers and begin offering personalized wine clubs to your guests
            </p>
          </div>
          
          <RegistrationSteps
            initialStep={currentStep}
            initialRestaurantData={restaurantData}
            initialTiers={tiers}
            onComplete={handleRegistrationComplete}
            isSubmitting={isSubmitting}
            sessionId={sessionId || undefined}
            errors={errors}
            restaurantId={restaurantId}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantOnboarding;