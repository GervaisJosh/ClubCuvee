import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

// Import custom icons as URL strings for now
const LockIcon = '/icons/lock-icon.svg';
const ThunderboltIcon = '/icons/thunderbolt-icon.svg';
const UndoIcon = '/icons/undo-icon.svg';
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

  // Get tier details based on tier name
  const getTierDetails = (tierName: string) => {
    const details = {
      'Neighborhood Cellar': [
        'Support for up to 50 wine-club members',
        'Manage wine lists up to 100 bottles',
        'Introductory & members-only tasting assistance'
      ],
      'Sommelier\'s Select': [
        'Support for up to 100 wine-club members',
        'Manage wine lists up to 250 bottles',
        'Personalized quarterly tasting events'
      ],
      'World-Class Wine Club': [
        'Unlimited wine-club members',
        'Manage unlimited wine lists',
        'Full support for intro & quarterly tasting events'
      ]
    };
    return details[tierName as keyof typeof details] || [];
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-6"></div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg`}>Validating invitation...</p>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (processingPayment) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-6"></div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg`}>Processing payment...</p>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (canceled) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <Card className={`max-w-md mx-auto p-8 text-center ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl`}>
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
          <h1 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Payment Canceled</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            Your invitation is still valid. Continue when ready.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full bg-[#800020] hover:bg-[#600018] py-3">
            Continue
          </Button>
        </Card>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <Card className={`max-w-md mx-auto p-8 text-center ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl`}>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Access Restricted</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            {error || 'This invitation has expired or is no longer valid.'}
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
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
      <div className="max-w-3xl mx-auto">
        
        {/* Clean Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Club Cuvée
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Invitation for {inviteData.business_name}
          </p>
          <div className={`inline-flex items-center px-4 py-2 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} border rounded-lg`}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{inviteData.business_email}</span>
          </div>
        </div>

        {/* Expiry Warning */}
        {hoursUntilExpiry < 24 && hoursUntilExpiry > 0 && (
          <Card className={`p-4 mb-8 ${isDark ? 'bg-amber-900/20 border-amber-800/30' : 'bg-amber-50 border-amber-200'} rounded-lg`}>
            <div className="flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500 mr-2" />
              <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                Invitation expires in {hoursUntilExpiry} hours
              </p>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <Card className={`p-10 mb-12 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl`}>
          <div className="text-center mb-10">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Choose Your Plan
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-lg mx-auto`}>
              Select the subscription plan that fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {pricingTiers.map((tier, index) => {
              const tierDetails = getTierDetails(tier.name);
              return (
                <div
                  key={tier.id}
                  className={`relative rounded-lg border-2 cursor-pointer min-h-[18rem] py-8 px-6 glow-burgundy-subtle ${
                    selectedTierId === tier.id
                      ? 'border-[#800020] bg-[#800020]/5 dark:bg-[#800020]/10'
                      : `${isDark ? 'border-zinc-700 hover:border-zinc-600' : 'border-gray-200 hover:border-gray-300'}`
                  } transition-all duration-300`}
                  onClick={() => setSelectedTierId(tier.id)}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={tier.id}
                    checked={selectedTierId === tier.id}
                    onChange={() => setSelectedTierId(tier.id)}
                    className="sr-only"
                  />
                  
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-[#800020] text-white px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center h-full flex flex-col">
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {tier.name}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-900'} text-sm mb-4`}>
                      {tier.description}
                    </p>
                    
                    {/* Tier Details */}
                    <div className="mb-6 flex-grow">
                      <ul className="space-y-2 text-left">
                        {tierDetails.map((detail, idx) => (
                          <li key={idx} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'} flex items-start`}>
                            <span className="text-[#800020] mr-2 font-bold">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <div className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                        {formatPrice(tier.monthly_price_cents)}
                      </div>
                      <div className={`${isDark ? 'text-gray-400' : 'text-gray-900'} text-sm`}>per month</div>
                    </div>
                    
                    {selectedTierId === tier.id ? (
                      <div className="flex items-center justify-center space-x-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Selected</span>
                      </div>
                    ) : (
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-900'}`}>
                        Select Plan
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className={`p-4 ${isDark ? 'bg-red-900/20 border-red-800/30' : 'bg-red-50 border-red-200'} border rounded-lg mb-8`}>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="text-center">
            {selectedTierId ? (
              <div className="space-y-6">
                <div className={`p-6 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Selected Plan: {pricingTiers.find(t => t.id === selectedTierId)?.name}
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(pricingTiers.find(t => t.id === selectedTierId)?.monthly_price_cents || 0)} / month
                  </p>
                </div>
                
                <Button
                  onClick={handleTierSelection}
                  disabled={processingPayment}
                  className="w-full bg-[#800020] hover:bg-[#600018] py-3 text-white font-medium"
                >
                  {processingPayment ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
                
                <div className={`flex items-center justify-center space-x-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  <span className="flex items-center">
                    <img 
                      src={LockIcon} 
                      alt="Lock" 
                      className={`w-4 h-4 inline-block mr-1 ${isDark ? 'filter brightness-75' : ''}`}
                      style={{ filter: isDark ? 'invert(0.75)' : 'invert(0.5)' }}
                    />
                    Secure
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <img 
                      src={ThunderboltIcon} 
                      alt="Thunderbolt" 
                      className={`w-4 h-4 inline-block mr-1 ${isDark ? 'filter brightness-75' : ''}`}
                      style={{ filter: isDark ? 'invert(0.75)' : 'invert(0.5)' }}
                    />
                    Instant
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <img 
                      src={UndoIcon} 
                      alt="Undo" 
                      className={`w-4 h-4 inline-block mr-1 ${isDark ? 'filter brightness-75' : ''}`}
                      style={{ filter: isDark ? 'invert(0.75)' : 'invert(0.5)' }}
                    />
                    Cancel Anytime
                  </span>
                </div>
              </div>
            ) : (
              <div className={`p-8 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} rounded-lg`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select a plan to continue
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Support */}
        <div className="text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Need help? Contact{' '}
            <a href="mailto:support@clubcuvee.com" className="text-[#800020] hover:text-[#600018]">
              support@clubcuvee.com
            </a>
          </p>
        </div>
        
        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default OnboardToken;