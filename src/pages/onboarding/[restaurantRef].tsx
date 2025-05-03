import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, CheckCircle, Wine } from 'lucide-react';
import { supabase } from '../../supabase';
import { restaurantService } from '../../services/restaurantService';
import { membershipService } from '../../services/membershipService';
import { BusinessOnboardingService } from '../../services/BusinessOnboardingService';
import RegistrationSteps from '../../components/registration/RegistrationSteps';
import type { RestaurantFormData, MembershipTier, FormErrors } from '../../types';

export const RestaurantOnboarding: React.FC = () => {
  const { restaurantRef } = useParams<{ restaurantRef: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const sessionId = queryParams.get('session_id');
  const paymentStatus = queryParams.get('status');
  const pricingTier = queryParams.get('tier') || 'EstablishedShop'; // Default to EstablishedShop if not provided

  const [isLoading, setIsLoading] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    restaurant?: FormErrors;
    tiers?: string;
    general?: string;
  }>({});
  const [tierInfo, setTierInfo] = useState<{
    name: string;
    monthlyPrice: string;
    description: string;
  } | null>(null);

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
  const [paymentVerified, setPaymentVerified] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        setIsLoading(true);
        
        // Validate the pricing tier
        if (!BusinessOnboardingService.validatePricingTier(pricingTier)) {
          setErrors({
            general: 'Invalid pricing tier specified. Please use a valid tier or contact support.'
          });
          setIsLoading(false);
          return;
        }
        
        // Get pricing tier info for display
        const tierDetails = BusinessOnboardingService.getBusinessPricingTierInfo(pricingTier);
        setTierInfo(tierDetails);
        
        if (sessionId && paymentStatus === 'success') {
          setPaymentVerified(true);
        }
        
        if (restaurantRef) {
          const invitation = await restaurantService.getInvitationByToken(restaurantRef);
          
          if (invitation) {
            if (invitation.status === 'expired') {
              setErrors({
                general: 'This invitation link has expired. Please request a new invitation.'
              });
              setIsLoading(false);
              return;
            }
            
            setRestaurantData({
              restaurantName: invitation.restaurant_name,
              adminName: invitation.admin_name || '',
              email: invitation.email,
              website: invitation.website || '',
              password: '',
              confirmPassword: '',
              tier: invitation.tier,
              invitationToken: invitation.token,
              pricingTier: pricingTier // Store the pricing tier from URL
            });
            
            if (invitation.status === 'paid' || invitation.payment_session_id) {
              setPaymentVerified(true);
            }
            
            if (invitation.restaurant_id) {
              setRestaurantId(invitation.restaurant_id);
              setCurrentStep(2);
              
              try {
                // Use membershipService instead of direct Supabase query to ensure proper typing
                const existingTiers = await membershipService.getMembershipTiersByRestaurant(invitation.restaurant_id);
                if (existingTiers && existingTiers.length > 0) {
                  setTiers(existingTiers);
                }
              } catch (err) {
                console.error('Error fetching existing tiers:', err);
              }
            }
            
            if (invitation.status === 'pending') {
              await restaurantService.updateInvitationStatus(invitation.token, 'accepted');
            }
          } else {
            setErrors({
              general: 'Invalid invitation token. Please check your invitation email or contact support.'
            });
          }
        } else {
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
  }, [restaurantRef, sessionId, paymentStatus, pricingTier]);

  const handleRestaurantSubmit = async (data: RestaurantFormData) => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const createdRestaurant = await restaurantService.createRestaurant({
        ...data,
        tier: data.tier || 'standard',
      });
      
      setRestaurantId(createdRestaurant.id);
      
      if (data.logo) {
        await restaurantService.uploadLogo(createdRestaurant.id, data.logo);
      }
      
      setRestaurantData(data);
      
      if (data.invitationToken) {
        await restaurantService.updateInvitationStatus(
          data.invitationToken, 
          'accepted', 
          createdRestaurant.id
        );
      }
      
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
  
  const handleRegistrationComplete = async (data: {
    restaurant: RestaurantFormData;
    tiers: MembershipTier[];
    restaurantId?: string;
  }) => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // For new restaurants, use the BusinessOnboardingService for complete onboarding flow
      if (!restaurantId && data.restaurant.invitationToken) {
        // Create restaurant data object for BusinessOnboardingService
        const restaurantCreationData = {
          name: data.restaurant.restaurantName,
          website: data.restaurant.website,
          admin_email: data.restaurant.email,
          logo_url: data.restaurant.logo ? URL.createObjectURL(data.restaurant.logo) : undefined
        };
        
        // Convert tiers to the format expected by BusinessOnboardingService
        const membershipTierConfigs = data.tiers.map(tier => ({
          name: tier.name,
          price: tier.price,
          description: tier.description
        }));
        
        // Call the BusinessOnboardingService to complete onboarding
        const result = await BusinessOnboardingService.completeOnboarding(
          data.restaurant.invitationToken,
          restaurantCreationData,
          membershipTierConfigs,
          pricingTier // Pass the pricing tier from URL
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to complete onboarding');
        }
        
        setRestaurantId(result.restaurantId!);
        
        // Sign up the user with Supabase auth
        const { error } = await supabase.auth.signUp({
          email: data.restaurant.email,
          password: data.restaurant.password,
          options: {
            data: {
              restaurant_id: result.restaurantId,
              full_name: data.restaurant.adminName,
              role: 'restaurant_admin',
            }
          }
        });
        
        if (error) {
          console.error('Error creating user account:', error);
        }
        
        setRegistrationComplete(true);
      } 
      // For existing restaurants, use the previous flow
      else {
        const finalRestaurantId = data.restaurantId || restaurantId;
        if (!finalRestaurantId) {
          throw new Error('Missing restaurant ID');
        }
        
        const tierPromises = data.tiers.map(async (tier) => {
          if (
            tier.id &&
            tier.stripe_product_id &&
            tier.stripe_price_id &&
            tier.restaurant_id === finalRestaurantId
          ) {
            return tier;
          }
          
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
        
        await Promise.all(tierPromises);
        
        await restaurantService.updateRestaurant(finalRestaurantId, {
          registration_complete: true,
          updated_at: new Date().toISOString(),
        });
        
        if (restaurantData.invitationToken) {
          await restaurantService.updateInvitationStatus(
            restaurantData.invitationToken,
            'completed',
            finalRestaurantId
          );
        }
        
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
        }
        
        setRegistrationComplete(true);
      }
    } catch (error: any) {
      console.error('Error completing registration:', error);
      setErrors({
        general: error.message || 'Failed to complete registration'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
        <div className="text-center max-w-7xl w-full mx-auto p-8">
          <Loader2 className="h-12 w-12 animate-spin text-[#872657] mx-auto mb-6" />
          <p className="text-gray-600 text-lg" style={{ fontFamily: 'TayBasal' }}>Loading your restaurant registration...</p>
        </div>
      </div>
    );
  }
  
  if (registrationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 text-center">
            <div className="mb-8 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>You're All Set!</h1>
            <p className="mb-8 text-gray-700 text-lg" style={{ fontFamily: 'TayBasal' }}>
              Your restaurant has been registered with Club Cuvee and your membership tiers are ready.
              You can now access your dashboard to manage your wine club.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="w-full sm:w-auto sm:px-8 bg-[#872657] text-white py-4 rounded-lg hover:bg-opacity-90 font-bold transition-all duration-300"
                style={{ fontFamily: 'TayBasal' }}
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => navigate('/preview-wine-club')} 
                className="w-full sm:w-auto sm:px-8 bg-white border border-[#872657] text-[#872657] py-4 rounded-lg hover:bg-gray-50 font-bold transition-all duration-300"
                style={{ fontFamily: 'TayBasal' }}
              >
                Preview Your Wine Club
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Didn't mean to register? <a href="mailto:support@clubcuvee.com" className="text-[#800020] underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (errors.general && !restaurantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 text-center">
            <div className="mb-8 p-4 bg-red-100 rounded-full inline-flex items-center justify-center">
              <Wine className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>Invitation Error</h1>
            <p className="mb-4 text-gray-700 text-lg" style={{ fontFamily: 'TayBasal' }}>
              {errors.general}
            </p>
            <p className="text-sm text-gray-500 mb-8" style={{ fontFamily: 'TayBasal' }}>
              Please check your email for a valid invitation or contact support for assistance.
            </p>
            <button 
              onClick={() => window.location.href = "https://clubcuvee.com/contact"} 
              className="w-full sm:w-auto sm:px-8 bg-[#872657] text-white py-4 rounded-lg hover:bg-opacity-90 font-bold mx-auto transition-all duration-300"
              style={{ fontFamily: 'TayBasal' }}
            >
              Contact Support
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Didn't mean to register? <a href="mailto:support@clubcuvee.com" className="text-[#800020] underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#872657] mb-6" style={{ fontFamily: 'HV Florentino' }}>Welcome to Club Cuvee</h1>
          <p className="text-xl text-gray-600" style={{ fontFamily: 'TayBasal' }}>
            Set up your custom wine club and start offering personalized wine memberships to your guests
          </p>
        </div>
        
        <RegistrationSteps
          initialStep={currentStep}
          initialRestaurantData={{
            ...restaurantData,
            pricingTierInfo: tierInfo || undefined
          }}
          initialTiers={tiers}
          onComplete={handleRegistrationComplete}
          isSubmitting={isSubmitting}
          sessionId={sessionId || undefined}
          errors={errors}
          restaurantId={restaurantId}
        />
      </div>
    </div>
  );
};

export default RestaurantOnboarding;