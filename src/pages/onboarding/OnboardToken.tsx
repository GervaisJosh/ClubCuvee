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
  price_cents: number;
  stripe_product_id: string;
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

      // Load pricing tiers using the correct RPC function
      const { data: tiersData, error: tiersError } = await supabase.rpc('get_active_business_pricing_tiers');
      
      if (tiersError) {
        console.error('Error loading pricing tiers:', tiersError);
        setError('Failed to load pricing options');
        return;
      }

      setPricingTiers(tiersData || []);

      // Pre-select suggested tier if provided (pricing_tier is now a UUID)
      if (tokenResponse.data.pricing_tier && tiersData) {
        const suggestedTier = tiersData.find((tier: PricingTier) => 
          tier.id === tokenResponse.data.pricing_tier
        );
        if (suggestedTier) {
          setSelectedTierId(suggestedTier.id);
        }
      }

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Club Cuvée
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Complete your business registration for <strong>{inviteData.business_name}</strong>
          </p>
          <p className="text-gray-500">
            Invitation sent to: {inviteData.business_email}
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
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Club Cuvée Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`border rounded-lg p-6 cursor-pointer transition-all relative ${
                  selectedTierId === tier.id
                    ? 'border-[#800020] bg-[#800020]/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
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
                  
                  {/* Suggested badge */}
                  {inviteData.pricing_tier && tier.id === inviteData.pricing_tier && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#800020] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Suggested
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-[#800020]">
                      {formatPrice(tier.price_cents)}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                  
                  {selectedTierId === tier.id && (
                    <CheckCircle className="w-6 h-6 text-[#800020] mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>


          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-6">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            <Button
              onClick={handleTierSelection}
              disabled={!selectedTierId || processingPayment}
              className="px-8 py-3"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {processingPayment ? 'Starting Checkout...' : 'Proceed to Payment'}
            </Button>
          </div>

          {selectedTier && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment processing by Stripe • Cancel anytime
            </p>
          )}
        </Card>

        {/* What's Next */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                1
              </div>
              <p>Complete your subscription payment via Stripe</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                2
              </div>
              <p>Set up your business profile and wine club tiers</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                3
              </div>
              <p>Upload your wine inventory and configure recommendations</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                4
              </div>
              <p>Start accepting customer memberships immediately</p>
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