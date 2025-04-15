import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, CreditCard, Lock, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Supabase client and Stripe promise
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

const stripePromise = loadStripe(stripePublicKey);

// Interfaces for type safety
interface Restaurant {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
}

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  restaurant_id: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

/**
 * CustomerSignup Component
 * 
 * Implements a three-step registration process:
 * 1. Select membership tier (pulled from Supabase)
 * 2. Create account (Supabase Auth + customers table)
 * 3. Review & confirm payment (Stripe Checkout integration)
 */
const CustomerSignup: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();

  // State for restaurant and tiers
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    termsAccepted?: string;
    general?: string;
  }>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Tier selection, 2: Account, 3: Payment review
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Check for post-payment success from query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const status = urlParams.get('status');
    if (sessionId && status === 'success') {
      setRegistrationComplete(true);
    }
  }, []);

  // Fetch restaurant data and membership tiers from Supabase
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!restaurantId) {
        setError('No restaurant ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch restaurant details
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .single();
        if (restaurantError) throw new Error(restaurantError.message);
        if (!restaurantData) throw new Error('Restaurant not found');
        setRestaurant(restaurantData);

        // Fetch membership tiers for this restaurant
        const { data: tiersData, error: tiersError } = await supabase
          .from('membership_tiers')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('price', { ascending: true });
        if (tiersError) throw new Error(tiersError.message);
        setMembershipTiers(tiersData || []);

        // If only one tier exists, pre-select it
        if (tiersData && tiersData.length === 1) {
          setSelectedTier(tiersData[0]);
        }
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'termsAccepted') {
      setTermsAccepted(checked);
      if (checked && formErrors.termsAccepted) {
        setFormErrors((prev) => ({ ...prev, termsAccepted: undefined }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
      // Validate password match on change
      if (name === 'confirmPassword' && value !== formData.password) {
        setFormErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setFormErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      }
    }
  };

  // Validate form fields before submission
  const validateForm = () => {
    const errors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      termsAccepted?: string;
      general?: string;
    } = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!termsAccepted) errors.termsAccepted = 'You must accept the terms and conditions';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Tier selection handler
  const handleTierSelect = (tier: MembershipTier) => {
    setSelectedTier(tier);
    setFormErrors((prev) => ({ ...prev, general: undefined }));
  };

  // Move to next step based on currentStep validations
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedTier) {
        setFormErrors({ general: 'Please select a membership tier' });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateForm()) {
        setCurrentStep(3);
      }
    }
  };

  // Handle final form submission and payment redirection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedTier) return;
    setIsSubmitting(true);
    setFormErrors({});

    try {
      // 1. Create the user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            restaurant_id: restaurantId,
            phone: formData.phone || ''
          }
        }
      });
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Failed to create user account');

      // 2. Store customer record in "customers" table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            user_id: authData.user.id,
            restaurant_id: restaurantId,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone || '',
            tier_id: selectedTier.id,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      if (customerError) throw new Error(customerError.message);

      // 3. Create a Stripe checkout session
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to load Stripe');

      const checkoutData: CheckoutSessionData = {
        customerId: customerData.id,
        customerEmail: formData.email,
        restaurantId,
        successUrl: `${window.location.origin}/join/${restaurantId}?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancelUrl: `${window.location.origin}/join/${restaurantId}`,
        metadata: {
          type: 'customer_subscription',
          customer_id: customerData.id,
          restaurant_id: restaurantId,
          tier_id: selectedTier.id
        },
        type: 'customer_subscription'
      };

      if (selectedTier.stripe_price_id) {
        checkoutData.priceId = selectedTier.stripe_price_id;
      } else {
        checkoutData.createPrice = true;
        checkoutData.tierData = {
          name: selectedTier.name,
          description: selectedTier.description,
          price: selectedTier.price
        };
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      });
      const session = await response.json();
      if (session.error) throw new Error(session.error);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) throw new Error(result.error.message || 'Error redirecting to checkout');

      // If redirection fails (unlikely), mark registration complete
      setRegistrationComplete(true);
    } catch (err) {
      console.error('Registration error:', err);
      setFormErrors({
        general: err instanceof Error ? err.message : 'An unknown error occurred during registration'
      });
      setCurrentStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872657]"></div>
      </div>
    );
  }

  // Render error state if restaurant not found or other errors occur
  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Oops! Something went wrong</h1>
          <p className="mb-6 text-gray-700">
            {error || "Could not find the restaurant you're looking for."}
          </p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#872657] text-white rounded-md">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render registration complete state
  if (registrationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="mb-6 p-4 bg-green-100 rounded-full inline-flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-[#872657]">Registration Complete!</h1>
          <p className="mb-8 text-gray-700">
            Welcome to {restaurant.name}'s membership program. You'll receive a confirmation email shortly.
          </p>
          <button onClick={() => navigate('/dashboard')} className="w-full bg-[#872657] text-white py-3 rounded-md hover:bg-opacity-90 font-bold">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main registration UI with three steps
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Restaurant Branding */}
      <div className="relative h-[300px] bg-[#2A3D45]">
        {restaurant.logo_url && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${restaurant.logo_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)'
            }}
          ></div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {restaurant.logo_url && (
            <img
              src={restaurant.logo_url}
              alt={`${restaurant.name} logo`}
              className="h-24 mb-6 rounded-lg shadow-lg"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center" style={{ fontFamily: 'HV Florentino' }}>
            Join {restaurant.name}
          </h1>
          <p className="mt-4 text-xl text-white text-center max-w-2xl" style={{ fontFamily: 'Libre Baskerville' }}>
            Become a member of our exclusive club and enjoy premium wine selections
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#872657]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}>
                1
              </div>
              <span className="mt-2 text-sm">Select Tier</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-[#872657]' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#872657]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}>
                2
              </div>
              <span className="mt-2 text-sm">Create Account</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-[#872657]' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#872657]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-[#872657] bg-[#872657] text-white' : 'border-gray-300 text-gray-400'}`}>
                3
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
          </div>
        </div>

        {/* Step 1: Membership Tier Selection */}
        {currentStep === 1 && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
              Choose Your Membership Level
            </h2>

            {formErrors.general && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {formErrors.general}
              </div>
            )}

            <div className="space-y-4 mb-8">
              {membershipTiers.length > 0 ? (
                membershipTiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => handleTierSelect(tier)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTier?.id === tier.id ? 'border-[#872657] bg-[#872657]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">{tier.name}</h3>
                        <p className="text-lg font-bold text-[#872657] mt-1">${tier.price.toFixed(2)}/month</p>
                        <p className="text-gray-600 mt-2">{tier.description}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedTier?.id === tier.id ? 'border-[#872657] bg-[#872657]' : 'border-gray-300'
                        }`}
                      >
                        {selectedTier?.id === tier.id && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No membership tiers available</p>
                </div>
              )}
            </div>

            <button
              onClick={handleNextStep}
              disabled={!selectedTier}
              className={`w-full py-3 px-4 rounded-md text-white font-bold flex items-center justify-center ${
                selectedTier ? 'bg-[#872657] hover:bg-opacity-90' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue to Account Creation
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Account Creation */}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
              Create Your Account
            </h2>

            {formErrors.general && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {formErrors.general}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`pl-10 w-full px-4 py-2 border ${
                      formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    placeholder="Your full name"
                    required
                  />
                </div>
                {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 w-full px-4 py-2 border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657]"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 w-full px-4 py-2 border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    placeholder="At least 8 characters"
                    required
                  />
                </div>
                {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 w-full px-4 py-2 border ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>}
              </div>

              <div className="mt-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="termsAccepted"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#872657] border-gray-300 rounded focus:ring-[#872657]"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the <a href="#" className="text-[#872657]">Terms of Service</a> and <a href="#" className="text-[#872657]">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                {formErrors.termsAccepted && <p className="mt-1 text-sm text-red-500">{formErrors.termsAccepted}</p>}
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-[#872657] text-white rounded-md hover:bg-opacity-90 font-bold"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Payment Review */}
        {currentStep === 3 && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
              Review Your Membership
            </h2>

            {formErrors.general && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {formErrors.general}
              </div>
            )}

            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-2">Membership Details</h3>
                {selectedTier && (
                  <div className="border-b pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{selectedTier.name} Membership</p>
                        <p className="text-gray-600 text-sm mt-1">{selectedTier.description}</p>
                      </div>
                      <p className="font-bold text-[#872657]">${selectedTier.price.toFixed(2)}/month</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  {formData.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 py-3 bg-[#872657] text-white rounded-md hover:bg-opacity-90 font-bold flex items-center justify-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Complete Signup
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSignup;
