import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { CheckCircle, AlertCircle, Clock, CreditCard, Star, DollarSign, Phone, Sparkles, Crown, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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
  monthly_price_cents: number;
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
        description: tier.description || `${tier.name} subscription plan`,
        monthly_price_cents: tier.monthly_price_cents,
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

      // DEBUG: Log the data being sent to API
      console.log('🔍 DEBUG - Frontend sending checkout data:', {
        token,
        tier_id: selectedTierId,
        selectedTier: selectedTier
      });

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6 py-10">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-8"></div>
            <Sparkles className="h-6 w-6 text-[#800020] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-300 text-xl font-light">Validating your exclusive invitation...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing your luxury wine experience</p>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6 py-10">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-8"></div>
            <CreditCard className="h-6 w-6 text-[#800020] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-200 text-xl font-light">Securing your premium subscription...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to secure payment gateway</p>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (canceled) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <Card className={`max-w-md mx-auto p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-2xl`}>
          <AlertCircle className="h-20 w-20 text-amber-500 mx-auto mb-6" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Payment Paused</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 leading-relaxed`}>
            No worries – your exclusive invitation is still valid. Continue when you're ready to join the luxury experience.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-[#800020] to-[#a00030] hover:from-[#600018] hover:to-[#800028] py-3">
            Continue Your Journey
          </Button>
        </Card>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <Card className={`max-w-md mx-auto p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-2xl`}>
          <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Access Restricted</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 leading-relaxed`}>
            {error || 'This exclusive invitation has expired or is no longer valid. Please contact us for a new invitation.'}
          </p>
          <Button onClick={() => navigate('/landing')} variant="secondary" className="w-full py-3">
            Return to Club Cuvée
          </Button>
        </Card>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  const selectedTier = pricingTiers.find(tier => tier.id === selectedTierId);
  const expiresAt = new Date(inviteData.expires_at);
  const timeUntilExpiry = expiresAt.getTime() - Date.now();
  const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10 relative`}>
      <div className="max-w-5xl mx-auto">
        {/* Luxury Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-radial from-[#800020]/10 via-transparent to-transparent blur-3xl"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <Crown className="h-12 w-12 text-[#800020] mx-auto mb-4 animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#800020] via-[#a00030] to-[#800020] bg-clip-text text-transparent mb-6 tracking-tight">
                Club Cuvée
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#800020]"></div>
                <Sparkles className="h-4 w-4 text-[#800020]" />
                <div className="w-12 h-px bg-gradient-to-r from-[#800020] to-transparent"></div>
              </div>
            </div>
            <p className={`text-3xl font-light ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-4`}>
              Exclusive Invitation for <span className="font-semibold text-[#800020]">{inviteData.business_name}</span>
            </p>
            <div className={`inline-flex items-center px-6 py-3 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} border rounded-full backdrop-blur-sm`}>
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium`}>{inviteData.business_email}</span>
            </div>
          </div>
        </div>

        {/* Expiry Warning */}
        {hoursUntilExpiry < 24 && hoursUntilExpiry > 0 && (
          <Card className={`p-6 mb-8 ${isDark ? 'bg-amber-900/20 border-amber-800/30' : 'bg-amber-50 border-amber-200'} backdrop-blur-sm rounded-2xl`}>
            <div className="flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-500 mr-3 animate-pulse" />
              <p className={`text-lg font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                ⏰ Exclusive access expires in {hoursUntilExpiry} hours
              </p>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <Card className={`p-10 mb-12 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-3xl shadow-2xl`}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-[#800020] mr-3" />
              <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Choose Your Premium Tier
              </h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-xl font-light leading-relaxed max-w-2xl mx-auto`}>
              Select the perfect subscription to unlock the full potential of your luxury wine business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                  selectedTierId === tier.id
                    ? `${isDark ? 'bg-gradient-to-br from-[#800020]/20 via-zinc-900 to-zinc-900 border-2 border-[#800020] shadow-2xl shadow-[#800020]/30' : 'bg-gradient-to-br from-[#800020]/10 via-white to-white border-2 border-[#800020] shadow-2xl shadow-[#800020]/20'}`
                    : `${isDark ? 'bg-zinc-900/70 border border-zinc-800 hover:border-[#800020]/50 hover:shadow-xl' : 'bg-white border border-gray-200 hover:border-[#800020]/30 hover:shadow-xl'}`
                }`}
                onClick={() => setSelectedTierId(tier.id)}
              >
                {/* Luxury background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#800020]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-8 text-center">
                  <input
                    type="radio"
                    name="tier"
                    value={tier.id}
                    checked={selectedTierId === tier.id}
                    onChange={() => setSelectedTierId(tier.id)}
                    className="sr-only"
                  />
                  
                  {/* Most Popular badge */}
                  {index === 1 && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-[#800020] to-[#a00030] text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border border-[#600018] backdrop-blur-sm">
                        <Star className="h-4 w-4 inline mr-1" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>{tier.name}</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-base leading-relaxed`}>{tier.description}</p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="text-5xl font-bold text-[#800020] mb-3 tracking-tight">
                      {formatPrice(tier.monthly_price_cents)}
                    </div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium text-lg`}>per month</div>
                  </div>
                  
                  {selectedTierId === tier.id ? (
                    <div className="flex items-center justify-center space-x-3 text-[#800020] bg-[#800020]/10 py-3 px-6 rounded-xl">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-bold text-lg">SELECTED</span>
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center space-x-3 ${isDark ? 'text-gray-400 group-hover:text-[#800020]' : 'text-gray-500 group-hover:text-[#800020]'} transition-all duration-300 py-3 px-6 rounded-xl border border-current group-hover:border-[#800020]`}>
                      <div className="w-6 h-6 border-2 border-current rounded-full group-hover:bg-[#800020]/10 transition-all duration-300"></div>
                      <span className="font-semibold">SELECT TIER</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className={`p-6 ${isDark ? 'bg-red-900/20 border-red-800/30' : 'bg-red-50 border-red-200'} border rounded-2xl mb-8`}>
              <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'} flex items-center justify-center font-medium`}>
                <AlertCircle className="w-6 h-6 mr-3" />
                {error}
              </p>
            </div>
          )}

          {/* Action Section */}
          <div className="text-center">
            {selectedTierId ? (
              <div className="space-y-8">
                <div className={`p-8 ${isDark ? 'bg-[#800020]/10 border-[#800020]/30' : 'bg-[#800020]/5 border-[#800020]/20'} border rounded-2xl backdrop-blur-sm`}>
                  <p className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-3 font-medium`}>
                    ✨ <strong>Your Selected Plan:</strong> {pricingTiers.find(t => t.id === selectedTierId)?.name}
                  </p>
                  <p className="text-4xl font-bold text-[#800020] tracking-tight">
                    {formatPrice(pricingTiers.find(t => t.id === selectedTierId)?.monthly_price_cents || 0)} / month
                  </p>
                </div>
                
                <button
                  onClick={handleTierSelection}
                  disabled={processingPayment}
                  className="w-full bg-gradient-to-r from-[#800020] to-[#a00030] hover:from-[#600018] hover:to-[#800028] text-white font-bold py-6 px-10 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none text-xl"
                >
                  {processingPayment ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Securing Your Premium Access...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                      <CreditCard className="w-6 h-6" />
                      <span>BEGIN LUXURY EXPERIENCE</span>
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                </button>
                
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    🔒 Stripe Secured
                  </span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    ⚡ Instant Activation
                  </span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    🔄 Cancel Anytime
                  </span>
                </div>
              </div>
            ) : (
              <div className={`p-8 ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} border rounded-2xl`}>
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-xl font-light`}>
                  Select your exclusive tier to continue
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Luxury Journey Preview */}
        <Card className={`p-12 ${isDark ? 'bg-gradient-to-br from-zinc-900/70 via-zinc-900/50 to-zinc-900/70 border-zinc-800' : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200'} backdrop-blur-sm rounded-3xl`}>
          <div className="text-center mb-10">
            <Sparkles className="h-10 w-10 text-[#800020] mx-auto mb-4" />
            <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Your Premium Journey Awaits</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-light`}>Experience the Club Cuvée advantage in four elegant steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg">
                1
              </div>
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 text-lg`}>🔐 Secure Payment</p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Enterprise-grade security through our Stripe integration ensures your payment is protected</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg">
                2
              </div>
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 text-lg`}>🏢 Profile Creation</p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Build your business profile and configure premium membership tiers for your customers</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg">
                3
              </div>
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 text-lg`}>🤖 AI-Powered Setup</p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Upload your wine collection and let our AI create personalized recommendations</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#800020] to-[#a00030] text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg">
                4
              </div>
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 text-lg`}>🚀 Go Live</p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Launch your exclusive wine club and start building your member community</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Luxury Support */}
        <div className="text-center mt-12">
          <div className={`inline-flex items-center px-8 py-4 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} border rounded-2xl backdrop-blur-sm`}>
            <Phone className="h-5 w-5 text-[#800020] mr-3" />
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mr-2`}>Premium Support:</span>
            <a href="mailto:support@clubcuvee.com" className="text-[#800020] hover:text-[#600018] font-semibold transition-colors duration-200">
              support@clubcuvee.com
            </a>
          </div>
        </div>
        
        {/* Theme Toggle */}
        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default OnboardToken;