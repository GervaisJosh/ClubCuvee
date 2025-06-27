import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, AlertCircle, CreditCard, Users, ArrowRight, Clock } from 'lucide-react';

interface CustomerInvitationData {
  business: {
    id: string;
    name: string;
    website?: string;
    logo_url?: string;
  };
  membershipTiers: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    stripe_price_id: string;
  }>;
  invitation: {
    id: string;
    expires_at: string;
    status: string;
  };
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  wine_preferences: string;
  dietary_restrictions: string;
  special_requests: string;
  selected_tier_id: string;
}

const CustomerRegistration: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [invitationData, setInvitationData] = useState<CustomerInvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select-tier' | 'fill-form' | 'processing'>('select-tier');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    wine_preferences: '',
    dietary_restrictions: '',
    special_requests: '',
    selected_tier_id: ''
  });

  // Load invitation data
  useEffect(() => {
    const loadInvitationData = async () => {
      if (!token) {
        setError('No invitation token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/validate-customer-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Invalid or expired invitation');
        }

        const data = await response.json();
        setInvitationData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invitation data');
      } finally {
        setLoading(false);
      }
    };

    loadInvitationData();
  }, [token]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle tier selection
  const handleTierSelection = (tierId: string) => {
    setSelectedTierId(tierId);
    setFormData(prev => ({
      ...prev,
      selected_tier_id: tierId
    }));
  };

  // Proceed to form step
  const proceedToForm = () => {
    if (!selectedTierId) {
      setError('Please select a membership tier');
      return;
    }
    setError(null);
    setStep('fill-form');
  };

  // Submit form and create Stripe checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'address', 'city', 'state', 'zip_code'];
    for (const field of requiredFields) {
      if (!formData[field as keyof CustomerFormData]) {
        setError(`Please fill in the ${field.replace('_', ' ')} field`);
        return;
      }
    }

    try {
      setProcessingPayment(true);
      setError(null);

      const response = await fetch('/api/create-customer-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          customerData: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process registration');
      setProcessingPayment(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] dark:bg-black px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !invitationData) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] dark:bg-black px-6 py-10 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!invitationData) return null;

  const selectedTier = invitationData.membershipTiers.find(tier => tier.id === selectedTierId);
  const expiresAt = new Date(invitationData.invitation.expires_at);
  const timeUntilExpiry = expiresAt.getTime() - Date.now();
  const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));

  // Processing state
  if (processingPayment) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] dark:bg-black px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Creating your checkout session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] dark:bg-black px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join {invitationData.business.name}'s Wine Club
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Discover curated wines delivered to your door
          </p>
        </div>

        {/* Expiry Warning */}
        {hoursUntilExpiry < 48 && hoursUntilExpiry > 0 && (
          <Card className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This invitation expires in {hoursUntilExpiry} hours. Complete your registration soon!
              </p>
            </div>
          </Card>
        )}

        {/* Step 1: Tier Selection */}
        {step === 'select-tier' && (
          <Card className="p-8 mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Choose Your Membership
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {invitationData.membershipTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTierId === tier.id
                      ? 'border-[#800020] bg-[#800020]/5 dark:bg-[#800020]/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#800020]/30 dark:hover:border-[#800020]/30'
                  }`}
                  onClick={() => handleTierSelection(tier.id)}
                >
                  <div className="text-center">
                    <div className="h-12 w-12 bg-[#800020] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-2xl font-bold text-[#800020] mb-2">
                      ${parseFloat(tier.price).toFixed(2)}/month
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {tier.description}
                    </p>
                    {selectedTierId === tier.id && (
                      <div className="flex items-center justify-center space-x-2 text-[#800020]">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg mb-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="text-center">
              <Button onClick={proceedToForm} disabled={!selectedTierId}>
                Continue to Registration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Registration Form */}
        {step === 'fill-form' && selectedTier && (
          <Card className="p-8 mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Your Registration
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Selected: <span className="font-medium text-[#800020]">{selectedTier.name}</span> - 
                ${parseFloat(selectedTier.price).toFixed(2)}/month
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Wine Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wine Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Wine Preferences
                    </label>
                    <textarea
                      name="wine_preferences"
                      value={formData.wine_preferences}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us about your wine preferences (e.g., red wines, specific regions, flavor profiles)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dietary Restrictions
                    </label>
                    <input
                      type="text"
                      name="dietary_restrictions"
                      value={formData.dietary_restrictions}
                      onChange={handleInputChange}
                      placeholder="Any allergies or dietary restrictions?"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Any special requests or notes for your wine selections?"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep('select-tier')}
                  className="flex-1"
                >
                  Back to Tier Selection
                </Button>
                <Button type="submit" className="flex-1" disabled={processingPayment}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerRegistration;