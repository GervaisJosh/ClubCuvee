import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, AlertCircle, Clock, CreditCard, Star, DollarSign, Phone } from 'lucide-react';

interface BusinessInviteData {
  is_valid: boolean;
  business_name: string;
  business_email: string;
  pricing_tier: string | null;
  expires_at: string;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  stripe_price_id: string;
}

interface CheckoutResponse {
  success: boolean;
  data: {
    sessionId: string;
    checkoutUrl: string;
  };
}

const OnboardToken: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [inviteData, setInviteData] = useState<BusinessInviteData | null>(null);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const sessionId = searchParams.get('session_id');
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided');
      setLoading(false);
      return;
    }

    validateTokenAndLoadData();
  }, [token]);

  useEffect(() => {
    if (sessionId && success) {
      handlePaymentSuccess();
    }
  }, [sessionId, success]);

  const validateTokenAndLoadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate business invitation token
      const tokenResponse = await apiClient.post<{
        success: boolean;
        data: BusinessInviteData;
      }>('/api/validate-business-invitation', {
        token: token
      });

      if (!tokenResponse.success || !tokenResponse.data.is_valid) {
        setError('Invalid or expired business invitation token');
        return;
      }

      setInviteData(tokenResponse.data);

      // Load pricing tiers from business_pricing_tiers table
      const { data: tiersData, error: tiersError } = await supabase
        .from('business_pricing_tiers')
        .select('id, name, description, monthly_price_cents, stripe_price_id')
        .eq('is_active', true)
        .eq('is_custom', false)
        .order('monthly_price_cents', { ascending: true });
      
      if (tiersError) {
        console.error('Error loading pricing tiers:', tiersError);
        setError('Failed to load pricing options');
        return;
      }

      // Transform data to match component interface
      const formattedTiers = tiersData?.map(tier => ({
        id: tier.id,
        name: tier.name,
        description: tier.description,
        price_cents: tier.monthly_price_cents,
        stripe_price_id: tier.stripe_price_id
      })) || [];

      setPricingTiers(formattedTiers);

      // NO pre-selection - let business choose their own tier

    } catch (err: any) {
      console.error('Error validating token and loading data:', err);
      setError(err.message || 'Failed to validate invitation');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setProcessingPayment(true);
      
      // Verify the payment with our business subscription endpoint
      const response = await apiClient.post<{
        success: boolean;
        data: {
          subscription: {
            id: string;
            status: string;
            currentPeriodEnd: number;
          };
          pricing_tier: string;
        };
      }>('/api/verify-business-subscription', { token, sessionId });
      
      const subscription = response.data.subscription;
      
      if (subscription.status === 'active') {
        // Redirect to business setup form
        navigate(`/onboard/${token}/setup?session_id=${sessionId}`);
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      setError('Payment verification failed. Please contact support.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleTierSelection = async () => {
    if (!selectedTierId) {
      setError('Please select a pricing tier');
      return;
    }

    const selectedTier = pricingTiers.find(tier => tier.id === selectedTierId);
    if (!selectedTier) {
      setError('Selected tier not found');
      return;
    }

    if (!selectedTier.stripe_price_id) {
      setError('This tier is not available for online signup');
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);

      const response = await apiClient.post<CheckoutResponse>(
        '/api/create-business-checkout',
        { 
          token,
          tier_id: selectedTierId
        }
      );

      if (response.success && response.data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to start checkout process');
      setProcessingPayment(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(0)}`;
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

  if (processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (canceled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Canceled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was canceled. You can try again when you're ready.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This invitation link is invalid or has expired. Please request a new one.'}
          </p>
          <Button onClick={() => navigate('/landing')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const selectedTier = pricingTiers.find(tier => tier.id === selectedTierId);
  const expiresAt = new Date(inviteData.expires_at);
  const timeUntilExpiry = expiresAt.getTime() - Date.now();
  const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#800020] to-[#a00030] bg-clip-text text-transparent mb-4">
              Welcome to Club Cuvée
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#800020] to-[#a00030] mx-auto rounded-full"></div>
          </div>
          <p className="text-2xl text-gray-700 mb-3">
            Start your luxury wine club journey with <strong className="text-[#800020]">{inviteData.business_name}</strong>
          </p>
          <p className="text-gray-600 bg-gray-50 inline-block px-4 py-2 rounded-full">
            {inviteData.business_email}
          </p>
        </div>

        {/* Expiry Warning */}
        {hoursUntilExpiry < 24 && hoursUntilExpiry > 0 && (
          <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-sm text-yellow-700">
                This invitation expires in {hoursUntilExpiry} hours. Complete your registration soon!
              </p>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Select Your Club Cuvée Subscription
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the perfect plan to grow your wine business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`group relative bg-white border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedTierId === tier.id
                    ? 'border-[#800020] shadow-2xl shadow-[#800020]/20 bg-gradient-to-br from-[#800020]/5 to-white'
                    : 'border-gray-200 hover:border-[#800020]/30 hover:shadow-xl'
                }`}
                onClick={() => setSelectedTierId(tier.id)}
              >
                <div className="text-center">
                  <input
                    type="radio"
                    name="tier"
                    value={tier.id}
                    checked={selectedTierId === tier.id}
                    onChange={() => setSelectedTierId(tier.id)}
                    className="sr-only"
                  />
                  
                  {/* Popular badge for middle tier */}
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#800020] to-[#a00030] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{tier.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{tier.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-[#800020] mb-2">
                      {formatPrice(tier.price_cents)}
                    </div>
                    <div className="text-gray-500 font-medium">per month</div>
                  </div>
                  
                  {selectedTierId === tier.id ? (
                    <div className="flex items-center justify-center space-x-2 text-[#800020]">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Selected</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-[#800020] transition-colors">
                      <div className="w-6 h-6 border-2 border-current rounded-full"></div>
                      <span className="font-medium">Select Plan</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>


          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-5 h-5 mr-3" />
                {error}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            {selectedTierId ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#800020]/5 border border-[#800020]/20 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Selected Plan:</strong> {pricingTiers.find(t => t.id === selectedTierId)?.name}
                  </p>
                  <p className="text-2xl font-bold text-[#800020]">
                    {formatPrice(pricingTiers.find(t => t.id === selectedTierId)?.price_cents || 0)} / month
                  </p>
                </div>
                
                <button
                  onClick={handleTierSelection}
                  disabled={processingPayment}
                  className="w-full bg-gradient-to-r from-[#800020] to-[#a00030] text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {processingPayment ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Starting Secure Checkout...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Secure Payment</span>
                    </div>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 flex items-center justify-center space-x-2">
                  <span>🔒 Secure payment processing by Stripe</span>
                  <span>•</span>
                  <span>Cancel anytime</span>
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-center">
                  Please select a subscription plan to continue
                </p>
              </div>
            )}
        </Card>

        {/* What's Next */}
        <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Onboarding Journey</h3>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Secure Payment Processing</p>
                <p className="text-gray-600">Complete your subscription payment through our secure Stripe integration</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Business Profile Setup</p>
                <p className="text-gray-600">Create your account, set business details, and configure your wine club tiers</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Wine Inventory & AI Setup</p>
                <p className="text-gray-600">Upload your wine inventory and let our AI create personalized recommendations</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Launch Your Wine Club</p>
                <p className="text-gray-600">Start accepting customer memberships and grow your recurring revenue</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@clubcuvee.com" className="text-[#800020] hover:underline">
              support@clubcuvee.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardToken;