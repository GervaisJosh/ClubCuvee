import React, { useState, useEffect } from 'react';
import { CheckCircle, Upload } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

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

// Initialize Supabase with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure we have the required credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
    },
  },
});

// Main Registration Component
const RestaurantRegistrationTest = () => {
  // URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const status = urlParams.get('status');
  
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    restaurantName: '',
    adminName: '',
    email: '',
    website: '',
    logo: null,
    password: '',
    confirmPassword: '',
  });
  
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
              const { error } = await supabase.from('payment_tracking').insert([{
                stripe_session_id: sessionId,
                tier: 'test',
                amount: 0.60, // Test tier price
                status: 'paid',
                created_at: new Date().toISOString()
              }]);
              
              if (error) {
                console.error("Error recording payment:", error);
              }
            } else {
              console.warn("payment_tracking table doesn't exist yet, skipping payment recording");
            }
          } catch (error) {
            console.error("Error with payment tracking:", error);
            // Don't block verification for this error
          }
          
          // Set payment as verified only if we have valid session ID and success status
          setPaymentVerified(true);
        } else {
          // If no session ID or success status, don't verify payment
          setPaymentVerified(false);
        }
      } catch (error) {
        console.error("Error in payment verification:", error);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.restaurantName.trim()) newErrors.restaurantName = 'Restaurant name is required';
    if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Step 1: First try creating the restaurant record
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([{
          name: formData.restaurantName,
          website: formData.website || '',
          admin_email: formData.email,
          subscription_tier: 'test',
          payment_session_id: sessionId || '',
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (restaurantError) {
        console.error("Restaurant creation error:", restaurantError);
        throw new Error(`Restaurant creation failed: ${restaurantError.message}`);
      }
      
      if (!restaurantData || restaurantData.length === 0) {
        throw new Error("Failed to create restaurant record");
      }
      
      const newRestaurantId = restaurantData[0].id;
      setRestaurantId(newRestaurantId);
      
      // Step 2: Then create the auth user with the restaurant ID
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.adminName,
            restaurant_id: newRestaurantId,
            role: 'admin'
          }
        }
      });

      if (authError) {
        // If auth fails, we should delete the restaurant we just created
        await supabase.from('restaurants').delete().eq('id', newRestaurantId);
        throw authError;
      }

      // Handle logo upload if provided
      try {
        let logoUrl = '';
        if (formData.logo) {
          try {
            // Check if we can access the bucket
            const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('restaurant-logos');
            
            if (bucketError) {
              console.warn("Cannot access restaurant-logos bucket, skipping logo upload");
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
                console.error("Logo upload error:", uploadError);
              }
            }
          } catch (uploadError) {
            console.error("Error handling logo upload:", uploadError);
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
                  restaurant_id: newRestaurantId 
                })
                .eq('stripe_session_id', sessionId);
            }
          } catch (trackingError) {
            console.error("Error updating payment tracking:", trackingError);
            // Continue without failing the registration
          }
        }
      } catch (error) {
        console.error("Error in post-registration steps:", error);
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
        general: `Registration failed: ${errorMessage}`
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
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
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
          
          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <p className="text-sm mb-2 text-gray-700">Your Restaurant ID:</p>
            <p className="font-mono text-sm mb-4 break-all">{restaurantId}</p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/dashboard'} 
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
      <div className="relative h-[400px]">
        <img
          src="/images/wine-cellar-how.jpg"
          alt="Wine Cellar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'HV Florentino' }}>
              Join Club Cuvée
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: 'Libre Baskerville' }}>
              Premium wine membership management for distinguished restaurants
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Payment section */}
        {!paymentVerified && !verificationLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
              Test Subscription - Neighborhood Cellar
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
          <div className="bg-white p-8 rounded-lg shadow-lg text-center mb-8">
            <p className="mb-4">Verifying payment...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#872657] mx-auto"></div>
          </div>
        ) : (
          <div className="bg-green-50 p-8 rounded-lg shadow-lg text-center mb-8">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
              Payment Successful!
            </h2>
            <p className="mb-4" style={{ fontFamily: 'Libre Baskerville' }}>
              Thank you for your payment. Please complete your registration below.
            </p>
          </div>
        )}

        {/* Registration form - only shown after payment */}
        {paymentVerified && (
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
            {errors.general && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}
            
            <h2 className="text-2xl font-bold mb-6 text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>
              Complete Your Registration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  required
                  className={`w-full px-4 py-2 border ${errors.restaurantName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
                  onChange={handleInputChange}
                />
                {errors.restaurantName && <p className="mt-1 text-sm text-red-500">{errors.restaurantName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name *</label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  required
                  className={`w-full px-4 py-2 border ${errors.adminName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
                  onChange={handleInputChange}
                />
                {errors.adminName && <p className="mt-1 text-sm text-red-500">{errors.adminName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  required
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#872657]"
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Optional)</label>
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
                  {formData.logo && <span className="text-sm text-gray-600">File selected: {formData.logo.name}</span>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  required
                  className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
                  onChange={handleInputChange}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  required
                  className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#872657]`}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 bg-[#872657] text-white py-3 rounded-md hover:bg-opacity-90 font-bold text-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RestaurantRegistrationTest;