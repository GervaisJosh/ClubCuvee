import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Wine, CheckCircle, AlertCircle, User, CreditCard, Star } from 'lucide-react';

interface InvitationData {
  token: string;
  businessId: string;
  businessName: string;
  email: string;
  tierId?: string;
  tierName?: string;
  tierDescription?: string;
  tierPrice?: number;
  expiresAt: string;
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  priceMarkupPercentage: number;
  stripePriceId: string;
}

const PrivateRegistration: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [availableTiers, setAvailableTiers] = useState<MembershipTier[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'validate' | 'register' | 'select-tier' | 'checkout'>('validate');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided');
      setLoading(false);
      return;
    }

    validateInvitation();
  }, [token]);

  // If user is already logged in, check if they have access to this business
  useEffect(() => {
    if (user && invitationData) {
      checkExistingAccess();
    }
  }, [user, invitationData]);

  const validateInvitation = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.get<{
        success: boolean;
        data: InvitationData;
        availableTiers?: MembershipTier[];
      }>(`/api/validate-customer-invitation?token=${token}`);

      if (response.success) {
        setInvitationData(response.data);
        setAvailableTiers(response.availableTiers || []);
        
        // Pre-select tier if specified in invitation
        if (response.data.tierId) {
          setSelectedTierId(response.data.tierId);
        }
        
        setStep(user ? 'select-tier' : 'register');
      } else {
        setError('Invalid or expired invitation');
      }
    } catch (err: any) {
      console.error('Error validating invitation:', err);
      setError('Failed to validate invitation');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingAccess = async () => {
    try {
      // Check if user already has access to this business
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('business_id')
        .eq('id', user!.id)
        .eq('business_id', invitationData!.businessId)
        .single();

      if (profile) {
        // User already has access, redirect to dashboard
        navigate('/customer/dashboard');
        return;
      }
    } catch (err) {
      // User doesn't have access yet, continue with flow
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateRegistrationForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegistrationForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitationData!.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            business_id: invitationData!.businessId
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('User registration failed');
      }

      // Create customer profile
      const { error: profileError } = await supabase
        .from('customer_profiles')
        .insert({
          id: authData.user.id,
          business_id: invitationData!.businessId,
          email: invitationData!.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        });

      if (profileError) {
        console.error('Error creating customer profile:', profileError);
        // Don't fail completely if profile creation fails
      }

      setStep('select-tier');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTierSelection = () => {
    if (!selectedTierId) {
      setError('Please select a membership tier');
      return;
    }
    setStep('checkout');
    handleCheckout();
  };

  const handleCheckout = async () => {
    if (!selectedTierId) {
      setError('No tier selected');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const selectedTier = availableTiers.find(t => t.id === selectedTierId);
      if (!selectedTier) {
        throw new Error('Selected tier not found');
      }

      const response = await apiClient.post<{
        success: boolean;
        data: {
          checkoutUrl: string;
        };
      }>('/api/create-private-customer-checkout', {
        invitationToken: token,
        tierId: selectedTierId,
        stripePriceId: selectedTier.stripePriceId
      });

      if (response.success) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout');
      setSubmitting(false);
    }
  };

  const getTierPrice = (tier: MembershipTier): string => {
    // Base price calculation (would normally come from Stripe)
    const basePrice = 29.99;
    const finalPrice = basePrice + (basePrice * tier.priceMarkupPercentage / 100);
    return finalPrice.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!invitationData) return null;

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Wine className="h-16 w-16 text-[#800020] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join {invitationData.businessName}
          </h1>
          <p className="text-xl text-gray-600">
            You've been invited to join our exclusive wine club
          </p>
        </div>

        {/* Registration Form */}
        {step === 'register' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Create Your Account
            </h2>
            
            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={invitationData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Card>
        )}

        {/* Tier Selection */}
        {step === 'select-tier' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Choose Your Membership
            </h2>
            
            <div className="space-y-4 mb-6">
              {availableTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTierId === tier.id
                      ? 'border-[#800020] bg-[#800020]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTierId(tier.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="tier"
                        value={tier.id}
                        checked={selectedTierId === tier.id}
                        onChange={() => setSelectedTierId(tier.id)}
                        className="mr-3"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          {tier.name}
                          {tier.id === invitationData.tierId && (
                            <Star className="w-4 h-4 text-yellow-500 ml-2" />
                          )}
                        </h3>
                        <p className="text-gray-600">{tier.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#800020]">
                        ${getTierPrice(tier)}
                      </p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              onClick={handleTierSelection}
              disabled={!selectedTierId || submitting}
              className="w-full"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {submitting ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </Card>
        )}

        {/* Processing Checkout */}
        {step === 'checkout' && (
          <Card className="p-8 text-center">
            <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Redirecting to Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your secure payment...
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrivateRegistration;