import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Upload, Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MembershipTierModal, { MembershipTier } from '../components/membership-tier-modal';

// Define proper types for TypeScript
interface FormData {
  restaurantName: string;
  adminName: string;
  email: string;
  website: string;
  logo: File | null;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  restaurantName?: string;
  adminName?: string;
  email?: string;
  website?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}


// Main Registration Component
const SofiesWineBarRegistration = () => {
  // URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const status = urlParams.get('status');

  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    restaurantName: "Sofie's Wine Bar", // Pre-filled for testing
    adminName: '',
    email: '',
    website: '',
    logo: null,
    password: '',
    confirmPassword: '',
  });

  // Membership tiers state
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [showTierModal, setShowTierModal] = useState(false);
  const [currentTier, setCurrentTier] = useState<MembershipTier>({
    id: '',
    name: '',
    price: '',
    description: '',
  });
  const [isEditingTier, setIsEditingTier] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [customerSignupURL, setCustomerSignupURL] = useState('');
  const [restaurantId, setRestaurantId] = useState('');

  // Check payment status when component loads
  useEffect(() => {
    const verifyPayment = async () => {
      // Clear any stored state that might be persisting
      sessionStorage.removeItem('paymentVerified');
      localStorage.removeItem('paymentVerified');

      try {
        // Only verify if we have session_id and success status
        if (sessionId && status === 'success') {
          try {
            // First check if we have a payment_tracking table
            const { error: tableCheckError } = await supabase
              .from('payment_tracking')
              .select('count', { count: 'exact', head: true });

            // Only insert if the table exists
            if (!tableCheckError) {
              // Record the payment in our tracking table for future reference
              const { error } = await supabase.from('payment_tracking').insert([
                {
                  stripe_session_id: sessionId,
                  tier: 'test',
                  amount: 0.6, // Test tier price
                  status: 'paid',
                  created_at: new Date().toISOString(),
                },
              ]);

              if (error) {
                console.error('Error recording payment:', error);
              }
            } else {
              console.warn(
                "payment_tracking table doesn't exist yet, skipping payment recording"
              );
            }
          } catch (error) {
            console.error('Error with payment tracking:', error);
            // Don't block verification for this error
          }

          // Set payment as verified only if we have valid session ID and success status
          setPaymentVerified(true);
        } else {
          // FOR DEVELOPMENT: Allow bypassing payment verification
          // Remove this in production or control with env var
          const devMode = import.meta.env.VITE_DEV_MODE === 'true';
          if (devMode) {
            setPaymentVerified(true);
          } else {
            setPaymentVerified(false);
          }
        }
      } catch (error) {
        console.error('Error in payment verification:', error);
        // Don't show the form in case of errors with no session ID
        setPaymentVerified(false);
      } finally {
        setVerificationLoading(false);
      }
    };

    verifyPayment();

    // Cleanup function to ensure state is reset when component unmounts
    return () => {
      sessionStorage.removeItem('paymentVerified');
      localStorage.removeItem('paymentVerified');
    };
  }, [sessionId, status]);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password: string) => {
    const issues = [];
    if (password.length < 8) {
      issues.push('at least 8 characters');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      issues.push('at least one special character');
    }
    if (!/\d/.test(password)) {
      issues.push('at least one number');
    }
    if (!/[A-Z]/.test(password)) {
      issues.push('at least one uppercase letter');
    }
    return issues;
  };

  // Real-time form validation
  const validateFormField = useCallback(
    (name: string, value: string) => {
      let error: string | undefined = undefined;

      switch (name) {
        case 'email':
          if (value && !validateEmail(value)) {
            error = 'Please enter a valid email address';
          }
          break;
        case 'password':
          if (value) {
            const issues = validatePassword(value);
            if (issues.length > 0) {
              error = `Password must contain ${issues.join(', ')}`;
            }
          }
          break;
        case 'confirmPassword':
          if (value && value !== formData.password) {
            error = 'Passwords do not match';
          }
          break;
      }

      return error;
    },
    [formData.password]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Perform real-time validation
    const validationError = validateFormField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors({ general: 'Only JPG, PNG, and WEBP images are allowed' });
      return;
    }

    if (file.size > MAX_SIZE) {
      setErrors({ general: 'File size must be less than 5MB' });
      return;
    }

    setFormData({ ...formData, logo: file });
  };

  // Handler functions for the membership tier modal
  const openAddTierModal = () => {
    setIsEditingTier(false);
    setCurrentTier({
      id: '',
      name: '',
      price: '',
      description: '',
    });
    setShowTierModal(true);
  };

  const openEditTierModal = (tier: MembershipTier) => {
    setIsEditingTier(true);
    setCurrentTier(tier);
    setShowTierModal(true);
  };

  const handleCloseTierModal = () => {
    setShowTierModal(false);
  };

  const handleSaveTier = (tierData: MembershipTier) => {
    if (isEditingTier) {
      // Update existing tier
      setMembershipTiers((tiers) =>
        tiers.map((tier) => (tier.id === tierData.id ? tierData : tier))
      );
    } else {
      // Add new tier
      setMembershipTiers((tiers) => [...tiers, tierData]);
    }
  };

  const handleDeleteTier = (id: string) => {
    setMembershipTiers((tiers) => tiers.filter((tier) => tier.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Check required fields
    if (!formData.restaurantName.trim()) newErrors.restaurantName = 'Restaurant name is required';
    if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    // Validate email if provided
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password if provided
    if (formData.password) {
      const passwordIssues = validatePassword(formData.password);
      if (passwordIssues.length > 0) {
        newErrors.password = `Password must contain ${passwordIssues.join(', ')}`;
      }
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check membership tiers
    if (membershipTiers.length === 0) {
      newErrors.general = 'Please create at least one membership tier';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Step A: First try creating the restaurant record
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([
          {
            name: formData.restaurantName,
            website: formData.website || '',
            admin_email: formData.email,
            subscription_tier: 'test',
            payment_session_id: sessionId || '',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (restaurantError) {
        console.error('Restaurant creation error:', restaurantError);
        throw new Error(`Restaurant creation failed: ${restaurantError.message}`);
      }

      if (!restaurantData || restaurantData.length === 0) {
        throw new Error('Failed to create restaurant record');
      }

      const newRestaurantId = restaurantData[0].id;
      setRestaurantId(newRestaurantId);

      // Step B: Then create the auth user with the restaurant ID
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.adminName,
            restaurant_id: newRestaurantId,
            role: 'admin',
          },
        },
      });

      if (authError) {
        // If auth fails, we should delete the restaurant we just created
        await supabase.from('restaurants').delete().eq('id', newRestaurantId);
        throw authError;
      }

      // Step C: Save membership tiers using our API endpoint instead of direct Supabase insertion
      try {
        // Create an array of promises to process all tiers in parallel
        const tierPromises = membershipTiers.map(async (tier) => {
          try {
            // Call our new API endpoint for each tier
            const response = await fetch('/api/membership-tiers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: tier.name,
                price: tier.price,
                description: tier.description,
                restaurant_id: newRestaurantId,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error(`Error creating tier "${tier.name}":`, errorData);
              return null;
            }

            return await response.json();
          } catch (tierError) {
            console.error(`Error creating tier "${tier.name}":`, tierError);
            return null;
          }
        });

        // Wait for all tier creation promises to resolve
        await Promise.all(tierPromises);

        // If some tiers failed to create, log it but continue with registration
        console.log(`Created ${tierPromises.length} membership tiers`);
      } catch (tiersError) {
        console.error('Error creating membership tiers:', tiersError);
        // Continue with registration even if tiers fail - we can add them later
      }

      // Handle logo upload if provided
      try {
        let logoUrl = '';
        if (formData.logo) {
          try {
            // Check if we can access the bucket
            const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(
              'restaurant-logos'
            );

            if (bucketError) {
              console.warn(
                'Cannot access restaurant-logos bucket, skipping logo upload'
              );
            } else {
              const fileExt = formData.logo.name.split('.').pop();
              const fileName = `${newRestaurantId}/logo.${fileExt}`;

              const { error: uploadError } = await supabase.storage
                .from('restaurant-logos')
                .upload(fileName, formData.logo);

              if (!uploadError) {
                logoUrl = `${supabaseUrl}/storage/v1/object/public/restaurant-logos/${fileName}`;

                // Update restaurant with logo URL
                await supabase
                  .from('restaurants')
                  .update({ logo_url: logoUrl })
                  .eq('id', newRestaurantId);
              } else {
                console.error('Logo upload error:', uploadError);
              }
            }
          } catch (uploadError) {
            console.error('Error handling logo upload:', uploadError);
            // Continue without failing the registration
          }
        }

        // Try to update payment tracking with restaurant ID and email
        // But don't fail if this doesn't work
        if (sessionId) {
          try {
            const { error: tableCheckError } = await supabase
              .from('payment_tracking')
              .select('count', { count: 'exact', head: true });

            if (!tableCheckError) {
              await supabase
                .from('payment_tracking')
                .update({
                  customer_email: formData.email,
                  restaurant_id: newRestaurantId,
                })
                .eq('stripe_session_id', sessionId);
            }
          } catch (trackingError) {
            console.error('Error updating payment tracking:', trackingError);
            // Continue without failing the registration
          }
        }
      } catch (error) {
        console.error('Error in post-registration steps:', error);
        // These errors shouldn't prevent registration completion
      }

      setCustomerSignupURL(`${window.location.origin}/join/${newRestaurantId}`);
      setRegistrationComplete(true);
    } catch (error) {
      console.error('Full error details:', error);

      let errorMessage = 'Unknown error';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract useful information from error object safely
        const errorObj = error as Record<string, unknown>;
        errorMessage =
          (errorObj.message as string) ||
          (errorObj.error as string) ||
          (errorObj.msg as string) ||
          (errorObj.details ? JSON.stringify(errorObj.details) : 'Unknown error');
      }

      setErrors({
        general: `Registration failed: ${errorMessage}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If registration is complete, show success page
  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
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
            Your Club Cuvée account has been successfully created for Sofie's Wine Bar.
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

          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <p className="text-sm mb-2 text-gray-700">Your Restaurant ID:</p>
            <p className="font-mono text-sm mb-4 break-all">{restaurantId}</p>
          </div>

          <button
            onClick={() => (window.location.href = '/dashboard')}
            className="w-full bg-[#872657] text-white py-3 rounded-md hover:bg-opacity-90 font-bold"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => {
              // Clear URL parameters and return to registration page
              window.location.href = window.location.pathname;
            }}
            className="w-full mt-4 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 font-medium"
          >
            Register Another Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <img
          src="/images/sofies-wine-bar.jpg" // Replace with your actual image
          alt="Sofie's Wine Bar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: 'HV Florentino' }}
            >
              Sofie's Wine Bar
            </h1>
            <p
              className="text-xl md:text-2xl italic"
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              Join Club Cuvée and offer your customers an exclusive wine membership
              experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Payment section */}
        {!paymentVerified && !verificationLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center mb-8 border border-[#872657]/20">
            <h2
              className="text-2xl font-bold mb-4 text-[#872657]"
              style={{ fontFamily: 'HV Florentino' }}
            >
              Test Subscription - Sofie's Wine Bar
            </h2>
            <p className="mb-6" style={{ fontFamily: 'Libre Baskerville' }}>
              Please complete your payment to continue with registration.
            </p>
            <a
              href="https://buy.stripe.com/00g3g6bMWd415uU7st"
              className="bg-[#872657] text-white px-6 py-3 rounded-md hover:bg-opacity-90 font-bold inline-block"
            >
              Proceed to Payment ($0.60)
            </a>
          </div>
        ) : verificationLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center mb-8 border border-[#872657]/20">
            <p className="mb-4">Verifying payment...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#872657] mx-auto"></div>
          </div>
        ) : (
          <div className="bg-green-50 p-8 rounded-lg shadow-lg text-center mb-8 border border-green-200">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h2
              className="text-xl font-bold mb-2 text-[#872657]"
              style={{ fontFamily: 'HV Florentino' }}
            >
              Payment Successful!
            </h2>
            <p className="mb-4" style={{ fontFamily: 'Libre Baskerville' }}>
              Thank you for your payment. Please complete your registration below.
            </p>
          </div>
        )}

        {/* Registration form - only shown after payment */}
        {paymentVerified && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {errors.general && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                {errors.general}
              </div>
            )}

            <div className="bg-white p-8 rounded-lg shadow-lg border border-[#872657]/10">
              <h2
                className="text-2xl font-bold mb-6 text-[#872657]"
                style={{ fontFamily: 'HV Florentino' }}
              >
                Restaurant Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    required
                    className={`w-full px-4 py-2 border ${
                      errors.restaurantName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    onChange={handleInputChange}
                  />
                  {errors.restaurantName && (
                    <p className="mt-1 text-sm text-red-500">{errors.restaurantName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Name *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    required
                    className={`w-full px-4 py-2 border ${
                      errors.adminName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                  {errors.adminName && (
                    <p className="mt-1 text-sm text-red-500">{errors.adminName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    required
                    className={`w-full px-4 py-2 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    onChange={handleInputChange}
                    placeholder="admin@sofieswinebar.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657]"
                    onChange={handleInputChange}
                    placeholder="https://www.sofieswinebar.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-[#2A3D45] text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                      <Upload className="inline-block w-5 h-5 mr-2" />
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {formData.logo && (
                      <span className="text-sm text-gray-600">
                        File selected: {formData.logo.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    required
                    className={`w-full px-4 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    onChange={handleInputChange}
                    placeholder="At least 8 characters"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    required
                    className={`w-full px-4 py-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-[#872657]`}
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Membership Tiers Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-[#872657]/10">
              <h2
                className="text-2xl font-bold mb-6 text-[#872657]"
                style={{ fontFamily: 'HV Florentino' }}
              >
                Membership Tiers
              </h2>

              <p className="mb-6 text-gray-700" style={{ fontFamily: 'Libre Baskerville' }}>
                Define the membership tiers that your customers can subscribe to.
                Each tier should have a unique name, pricing, and description of benefits.
              </p>

              {membershipTiers.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {membershipTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-lg text-[#872657]">
                          {tier.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ${parseFloat(tier.price).toFixed(2)}/month
                        </p>
                        <p className="text-sm mt-1">{tier.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditTierModal(tier)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTier(tier.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 mb-6">
                  <p className="text-gray-500 mb-2">No membership tiers added yet</p>
                  <p className="text-sm text-gray-400">
                    Click the button below to add your first tier
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={openAddTierModal}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-[#872657] text-[#872657] rounded-md hover:bg-[#872657]/5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Membership Tier
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 bg-[#872657] text-white py-4 rounded-md hover:bg-opacity-90 font-bold text-lg ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>

      {/* Use the external membership tier modal component */}
      <MembershipTierModal
        isOpen={showTierModal}
        onClose={handleCloseTierModal}
        onSave={handleSaveTier}
        initialData={currentTier}
        isEditing={isEditingTier}
        // restaurantId={restaurantId} // If needed
      />
    </div>
  );
};

export default SofiesWineBarRegistration;
