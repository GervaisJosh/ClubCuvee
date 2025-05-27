import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';

interface BusinessFormData {
  businessName: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
  tiers: TierFormData[];
}

interface TierFormData {
  name: string;
  description: string;
  priceMarkupPercentage: number;
}

const BusinessSetup: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sessionId = searchParams.get('session_id');
  
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    tiers: [
      { name: 'Silver', description: 'Entry level wine club membership', priceMarkupPercentage: 15 },
      { name: 'Gold', description: 'Premium wine club membership', priceMarkupPercentage: 25 },
      { name: 'Platinum', description: 'Exclusive wine club membership', priceMarkupPercentage: 35 }
    ]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(true);

  useEffect(() => {
    if (!token || !sessionId) {
      setError('Missing required parameters');
      setVerifyingPayment(false);
      return;
    }

    verifyPaymentAndLoadData();
  }, [token, sessionId]);

  const verifyPaymentAndLoadData = async () => {
    try {
      setVerifyingPayment(true);
      
      // Verify the payment was successful
      const response = await apiClient.post<{
        success: boolean;
        data: {
          subscription: {
            id: string;
            status: string;
            currentPeriodEnd: number;
          };
          tokenData: {
            email: string;
          };
        };
      }>('/api/verify-onboarding-subscription', { token, sessionId });

      if (response.success && response.data.subscription.status === 'active') {
        // Pre-fill the admin email from token data
        setFormData(prev => ({
          ...prev,
          adminEmail: response.data.tokenData.email
        }));
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      setError('Payment verification failed. Please contact support.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleTierChange = (index: number, field: keyof TierFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, { name: '', description: '', priceMarkupPercentage: 20 }]
    }));
  };

  const removeTier = (index: number) => {
    if (formData.tiers.length > 1) {
      setFormData(prev => ({
        ...prev,
        tiers: prev.tiers.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.adminName.trim()) {
      setError('Admin name is required');
      return false;
    }
    if (!formData.adminEmail.trim()) {
      setError('Admin email is required');
      return false;
    }
    if (!formData.adminPassword) {
      setError('Admin password is required');
      return false;
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.adminPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.tiers.length === 0) {
      setError('At least one membership tier is required');
      return false;
    }
    for (const tier of formData.tiers) {
      if (!tier.name.trim()) {
        setError('All tiers must have a name');
        return false;
      }
      if (!tier.description.trim()) {
        setError('All tiers must have a description');
        return false;
      }
      if (tier.priceMarkupPercentage < 0 || tier.priceMarkupPercentage > 100) {
        setError('Price markup percentage must be between 0 and 100');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        success: boolean;
        data: {
          businessId: string;
          adminUserId: string;
        };
      }>('/api/create-business', {
        token,
        sessionId,
        businessData: formData
      });

      if (response.success) {
        // Redirect to success page or business dashboard
        navigate(`/onboard/${token}/success`);
      } else {
        setError('Failed to create business. Please try again.');
      }
    } catch (err: any) {
      console.error('Error creating business:', err);
      setError(err.message || 'Failed to create business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifyingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.adminEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center">
          <div className="text-red-500 mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Setup Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/landing')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Now let's set up your business and wine club tiers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  placeholder="Your Restaurant or Wine Shop"
                />
              </div>
              
              <div>
                <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-2">
                  Administrator Name *
                </label>
                <input
                  type="text"
                  id="adminName"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Administrator Email *
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">This email was used for your subscription</p>
              </div>
              
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Administrator Password *
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  placeholder="Minimum 8 characters"
                />
              </div>
              
              <div className="md:col-span-2">
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
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </Card>

          {/* Wine Club Tiers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Wine Club Membership Tiers</h2>
              <Button type="button" onClick={addTier} variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Tier
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.tiers.map((tier, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Tier {index + 1}</h3>
                    {formData.tiers.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTier(index)}
                        variant="secondary"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tier Name *
                      </label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                        placeholder="e.g., Silver, Gold, Platinum"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Markup (%) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={tier.priceMarkupPercentage}
                        onChange={(e) => handleTierChange(index, 'priceMarkupPercentage', parseFloat(e.target.value) || 0)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                        placeholder="20"
                      />
                    </div>
                    
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={tier.description}
                        onChange={(e) => handleTierChange(index, 'description', e.target.value)}
                        required
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                        placeholder="Describe this membership tier"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Price Markup:</strong> This percentage will be added to your wine inventory base prices for this tier. 
                For example, a wine with a base price of $20 and 25% markup will be offered to customers at $25.
              </p>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={loading}
              className="px-8 py-3"
            >
              {loading ? 'Creating Your Business...' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessSetup;