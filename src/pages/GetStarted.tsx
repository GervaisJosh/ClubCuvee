import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RegistrationSteps from '../components/registration/RegistrationSteps';
import { LoadingSpinner, ErrorDisplay } from '../components/shared/LoadingStates';
import { restaurantService } from '../services/restaurantService';
import { membershipService } from '../services/membershipService';
import { authService } from '../services/authService';
import { stripeService } from '../services/stripeService';
import type { RestaurantFormData, MembershipTier, FormErrors } from '../types';

const GetStarted: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  const sessionId = searchParams.get('session_id');
  const status = searchParams.get('status');

  // State
  const [loading, setLoading] = useState(true);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    restaurant?: FormErrors;
    tiers?: string;
    general?: string;
  }>({});
  const [restaurantId, setRestaurantId] = useState<string | undefined>();
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [customerSignupURL, setCustomerSignupURL] = useState('');

  // Initialize referral data if provided
  const [initialRestaurantData, setInitialRestaurantData] = useState<RestaurantFormData>({
    restaurantName: '',
    adminName: '',
    email: '',
    website: '',
    logo: null,
    password: '',
    confirmPassword: '',
    sessionId: sessionId || undefined,
  });

  // Check payment status when component loads
  useEffect(() => {
    const verifyPayment = async () => {
      setVerifyingPayment(true);
      
      try {
        // If we have a session ID and success status, verify with Stripe
        if (sessionId && status === 'success') {
          const isValid = await stripeService.verifyPaymentSession(sessionId);
          setPaymentVerified(isValid);
          
          if (isValid) {
            // Optional: record payment in your own DB
            await stripeService.recordPayment(sessionId, {
              tier: 'basic',
              amount: 0.60, // Or whatever your subscription amount is
            });
          }
        } else {
          // For development, you might want an option to bypass payment
          const devMode = import.meta.env.VITE_DEV_MODE === 'true';
          setPaymentVerified(devMode);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentVerified(false);
      } finally {
        setVerifyingPayment(false);
        setLoading(false);
      }
    };

    // Process referral code if present
    const processReferral = async () => {
      if (refCode) {
        try {
          // Here you would typically load the restaurant details based on the ref code
          // For now, we'll just pre-fill the restaurant name
          setInitialRestaurantData(prevData => ({
            ...prevData,
            restaurantName: `${refCode}'s Restaurant`
          }));
        } catch (error) {
          console.error('Error processing referral:', error);
        }
      }
      
      if (!sessionId) {
        setLoading(false);
      }
    };

    processReferral();
    if (sessionId) {
      verifyPayment();
    }
  }, [refCode, sessionId, status]);

  // Handle the complete registration process
  const handleRegistrationComplete = async (data: {
    restaurant: RestaurantFormData;
    tiers: MembershipTier[];
    restaurantId?: string;
  }) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // If we already have a restaurant ID (rare, usually from a previous step)
      // we'll use it, otherwise create a new restaurant
      let newRestaurantId = data.restaurantId;
      
      if (!newRestaurantId) {
        // Step 1: Create the restaurant
        const restaurant = await restaurantService.createRestaurant({
          ...data.restaurant,
          tier: 'basic', // or whatever tier they paid for
          sessionId: sessionId || undefined,
        });
        
        newRestaurantId = restaurant.id;
        setRestaurantId(newRestaurantId);
        
        // Step 2: Upload logo if provided
        if (data.restaurant.logo) {
          try {
            await restaurantService.uploadLogo(newRestaurantId, data.restaurant.logo);
          } catch (logoError) {
            console.error('Logo upload error:', logoError);
            // Continue with registration even if logo upload fails
          }
        }
        
        // Step 3: Create admin user
        const { user, error: authError } = await authService.restaurantSignUp(
          data.restaurant,
          newRestaurantId
        );
        
        if (authError) {
          // If auth fails, we should delete the restaurant we just created
          // This would require an API endpoint with admin permissions
          throw authError;
        }
      }
      
      // Step 4: Save membership tiers
      if (newRestaurantId) {
        // Process all tiers in parallel
        const tierPromises = data.tiers.map(tier => 
          membershipService.createMembershipTier(tier, newRestaurantId!)
        );
        
        await Promise.all(tierPromises);
      }
      
      // Everything succeeded - show success UI
      setCustomerSignupURL(`${window.location.origin}/join/${newRestaurantId}`);
      setRegistrationComplete(true);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general: error.message || 'An unexpected error occurred during registration'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Initializing registration...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-200`}
    >
      <Header />

      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative h-[300px] bg-[#2A3D45]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('/images/wine-cellar-how.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(4px)'
            }}
          ></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <h1
              className="text-4xl lg:text-5xl font-bold text-white text-center"
              style={{ fontFamily: 'HV Florentino' }}
            >
              Join Club Cuvée Today
            </h1>
            <p
              className="mt-4 text-xl text-white text-center max-w-2xl"
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              Transform your wine program with our innovative platform. Leverage your existing
              inventory, and pair your loyal customers with their perfect bottles.
            </p>
          </div>
        </div>

        {/* Registration Content */}
        {registrationComplete ? (
          <div className="min-h-[calc(100vh-500px)] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
              <div className="mb-6 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1
                className="text-3xl font-bold mb-4 text-[#872657]"
                style={{ fontFamily: 'HV Florentino' }}
              >
                Registration Complete!
              </h1>
              <p className="text-lg mb-8" style={{ fontFamily: 'Libre Baskerville' }}>
                Your Club Cuvée account has been successfully created.
              </p>

              <div className="bg-gray-100 p-4 rounded-lg mb-8">
                <p className="text-sm mb-2 text-gray-700">Your customer signup URL:</p>
                <p className="font-mono text-sm mb-4 break-all">{customerSignupURL}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(customerSignupURL)}
                  className="text-sm bg-[#2A3D45] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                  Copy URL
                </button>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-[#872657] text-white py-3 rounded-md hover:bg-opacity-90 font-bold"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <RegistrationSteps
            initialRestaurantData={initialRestaurantData}
            onComplete={handleRegistrationComplete}
            isSubmitting={isSubmitting}
            sessionId={sessionId || undefined}
            errors={errors}
            restaurantId={restaurantId}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default GetStarted;