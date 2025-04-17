import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle, Wine } from 'lucide-react';
import { supabase } from '../../supabase';
import { restaurantService } from '../../services/restaurantService';
import { membershipService } from '../../services/membershipService';
import RegistrationSteps from '../../components/registration/RegistrationSteps';
import AuthLayout from '../../components/AuthLayout';
import type { RestaurantFormData, MembershipTier, FormErrors } from '../../types';

/**
 * Restaurant Onboarding Page
 * 
 * This component is part of the restaurant registration flow, accessed via:
 * 1. A secure token URL from an email invitation
 * 2. Direct navigation to /onboarding/[token]
 * 
 * The page guides restaurants through the onboarding process:
 * - Validating the invitation token
 * - Collecting restaurant/admin information
 * - Creating membership tiers
 * - Setting up Stripe integration
 * - Completing registration
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
  
  // For handling Stripe payment verification - defaults to true for simplicity in this version
  // In a full implementation, you might want to verify payment status with Stripe
  const [paymentVerified, setPaymentVerified] = useState(true);

  // Check for existing registration or validate invitation token
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        setIsLoading(true);
        
        // If we have a sessionId and status=success from Stripe redirect
        if (sessionId && paymentStatus === 'success') {
          setPaymentVerified(true);
        }
        
        // If we have a restaurant reference token, try to load data
        if (restaurantRef) {
          // First check if it's an invitation token
          const invitation = await restaurantService.getInvitationByToken(restaurantRef);
          
          if (invitation) {
            // If invitation is expired, show error
            if (invitation.status === 'expired') {
              setErrors({
                general: 'This invitation link has expired. Please request a new invitation.'
              });
              setIsLoading(false);
              return;
            }
            
            // Pre-fill data from invitation
            setRestaurantData({
              restaurantName: invitation.restaurant_name,
              adminName: invitation.admin_name || '',
              email: invitation.email,
              website: invitation.website || '',
              password: '',
              confirmPassword: '',
              tier: invitation.tier,
              invitationToken: invitation.token
            });
            
            // If invitation has payment verified, set payment verified
            if (invitation.status === 'paid' || invitation.payment_session_id) {
              setPaymentVerified(true);
            }
            
            // If invitation already has a restaurant ID, set it and skip to membership tiers
            if (invitation.restaurant_id) {
              setRestaurantId(invitation.restaurant_id);
              setCurrentStep(2); // Skip to membership tiers step
              
              // Also fetch existing tiers
              try {
                const { data: existingTiers, error: tiersError } = await supabase
                  .from('membership_tiers')
                  .select('*')
                  .eq('restaurant_id', invitation.restaurant_id);
                  
                if (!tiersError && existingTiers && existingTiers.length > 0) {
                  setTiers(existingTiers);
                }
              } catch (err) {
                console.error('Error fetching existing tiers:', err);
              }
            }
            
            // Mark invitation as accepted if it's still pending
            if (invitation.status === 'pending') {
              await restaurantService.updateInvitationStatus(invitation.token, 'accepted');
            }
          } else {
            // Invalid token
            setErrors({
              general: 'Invalid invitation token. Please check your invitation email or contact support.'
            });
          }
        } else {
          // No token provided
          setErrors({
            general: 'No invitation token provided. Please use the link from your invitation email.'
          });
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        setErrors({
          general: 'Error loading registration data. Please try again or contact support.'
        });
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
      // Create the restaurant account
      const createdRestaurant = await restaurantService.createRestaurant({
        ...data,
        tier: data.tier || 'standard', // Use specified tier or default
      });
      
      setRestaurantId(createdRestaurant.id);
      
      // If a logo was provided, upload it
      if (data.logo) {
        await restaurantService.uploadLogo(createdRestaurant.id, data.logo);
      }
      
      // Store updated restaurant data
      setRestaurantData(data);
      
      // Handle invitation token if present
      if (data.invitationToken) {
        await restaurantService.updateInvitationStatus(
          data.invitationToken, 
          'accepted', 
          createdRestaurant.id
        );
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
      
      // If invitation token exists, update status to completed
      if (restaurantData.invitationToken) {
        await restaurantService.updateInvitationStatus(
          restaurantData.invitationToken,
          'completed',
          finalRestaurantId
        );
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
      
      // Registration is complete!
      setRegistrationComplete(true);
      
    } catch (error: any) {
      console.error('Error completing registration:', error);
      setErrors({
        general: error.message || 'Failed to complete registration'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <AuthLayout>
        <div className="min-h-screen flex items-center justify-center py-16 px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto">
            <Loader2 className="h-12 w-12 animate-spin text-[#872657] mx-auto mb-6" />
            <p className="text-gray-600 text-lg">Loading your restaurant registration...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }
  
  // Registration complete state
  if (registrationComplete) {
    return (
      <AuthLayout>
        <div className="min-h-screen flex items-center justify-center py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-xl w-full p-8 md:p-10 bg-white rounded-xl shadow-lg text-center">
            <div className="mb-6 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-[#872657]">You're All Set!</h1>
            <p className="mb-8 text-gray-700">
              Your restaurant has been registered with Club Cuvee and your membership tiers are ready.
              You can now access your dashboard to manage your wine club.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="w-full sm:w-auto sm:px-8 bg-[#872657] text-white py-3 rounded-md hover:bg-opacity-90 font-bold"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => navigate('/preview-wine-club')} 
                className="w-full sm:w-auto sm:px-8 bg-white border border-[#872657] text-[#872657] py-3 rounded-md hover:bg-gray-50 font-bold"
              >
                Preview Your Wine Club
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }
  
  // Error state - invalid or expired token
  if (errors.general && !restaurantId) {
    return (
      <AuthLayout>
        <div className="min-h-screen flex items-center justify-center py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-xl w-full p-8 md:p-10 bg-white rounded-xl shadow-lg text-center">
            <div className="mb-6 p-4 bg-red-100 rounded-full inline-flex items-center justify-center">
              <Wine className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-[#872657]">Invitation Error</h1>
            <p className="mb-4 text-gray-700">
              {errors.general}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Please check your email for a valid invitation or contact support for assistance.
            </p>
            <button 
              onClick={() => window.location.href = "https://clubcuvee.com/contact"} 
              className="w-full sm:w-auto sm:px-8 bg-[#872657] text-white py-3 rounded-md hover:bg-opacity-90 font-bold mx-auto"
            >
              Contact Support
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Main registration UI
  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#872657] mb-4">Welcome to Club Cuvee</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Set up your custom wine club and start offering personalized wine memberships to your guests
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
    </AuthLayout>
  );
};

export default RestaurantOnboarding;