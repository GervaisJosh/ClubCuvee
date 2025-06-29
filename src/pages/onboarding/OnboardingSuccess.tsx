import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { CheckCircle, ArrowRight, Settings, Users, BarChart3, Copy, ExternalLink, Crown, Sparkles, Trophy, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BusinessData {
  business: {
    id: string;
    name: string;
    website?: string;
    admin_email: string;
    logo_url?: string;
    subscription_tier: string;
    created_at: string;
  };
  membershipTiers: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    stripe_product_id: string;
    stripe_price_id: string;
    created_at: string;
  }>;
  invitation: {
    id: string;
    status: string;
    created_at: string;
  };
}

const OnboardingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerLinkGenerated, setCustomerLinkGenerated] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/get-business-by-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch business data');
        }

        const data = await response.json();
        setBusinessData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [token]);

  // Generate customer invitation link
  const generateCustomerLink = async () => {
    if (!businessData) return;

    try {
      const response = await fetch('/api/generate-customer-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId: businessData.business.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate customer link');
      }

      const data = await response.json();
      setCustomerLinkGenerated(data.customerUrl);
    } catch (err) {
      console.error('Error generating customer link:', err);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-8"></div>
            <Crown className="h-6 w-6 text-[#800020] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-xl font-light`}>Preparing your business dashboard...</p>
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>Setting up your wine club empire</p>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  // Error state
  if (error || !businessData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'} mb-4`}>Error: {error || 'Failed to load business data'}</p>
          <Button onClick={() => navigate('/business/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10 relative`}>
      <div className="max-w-6xl mx-auto">
        {/* Luxury Success Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent blur-3xl"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <div className="relative inline-block">
                <Trophy className="h-20 w-20 text-emerald-500 mx-auto mb-6 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#800020] to-[#a00030] rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <h1 className={`text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 tracking-tight`}>
                🎉 Welcome to the Elite
              </h1>
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-emerald-500"></div>
                <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
                <div className="w-16 h-px bg-gradient-to-r from-emerald-500 to-transparent"></div>
              </div>
              <p className={`text-3xl font-light ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-4`}>
                <span className="font-semibold text-[#800020]">{businessData.business.name}</span> is now live!
              </p>
              <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} font-light`}>
                Your premium wine club platform is ready to transform your business
              </p>
            </div>
          </div>
        </div>

        {/* Membership Tiers Showcase */}
        <Card className={`p-10 mb-12 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-3xl shadow-2xl`}>
          <div className="text-center mb-10">
            <Crown className="h-10 w-10 text-[#800020] mx-auto mb-4" />
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
              Your Premium Membership Tiers
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-light`}>
              Beautifully crafted tiers ready to attract discerning wine enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {businessData.membershipTiers.map((tier, index) => (
              <div key={tier.id} className={`text-center p-8 ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} border rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                <div className="relative mb-6">
                  <div className="h-16 w-16 bg-gradient-to-r from-[#800020] to-[#a00030] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  {index === 1 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  {tier.name}
                </h3>
                <p className="text-3xl font-bold text-[#800020] mb-3">
                  ${parseFloat(tier.price).toFixed(2)}
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-normal`}>/month</span>
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 leading-relaxed`}>
                  {tier.description}
                </p>
                <div className="flex items-center justify-center space-x-2 text-emerald-500">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Stripe Ready</span>
                </div>
              </div>
            ))}
          </div>

          {/* Customer Link Generation */}
          <div className={`border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-8`}>
            <div className="text-center">
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                🚀 Ready to Acquire Your First Members?
              </h3>
              {!customerLinkGenerated ? (
                <div className="space-y-4">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg mb-6`}>
                    Generate your exclusive customer sign-up link and start building your wine community
                  </p>
                  <Button 
                    onClick={generateCustomerLink}
                    className="bg-gradient-to-r from-[#800020] to-[#a00030] hover:from-[#600018] hover:to-[#800028] px-8 py-4 text-lg font-semibold"
                  >
                    <ExternalLink className="w-5 h-5 mr-3" />
                    Generate Customer Sign-Up Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-6 ${isDark ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200'} border rounded-2xl`}>
                    <div className="flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-emerald-500 mr-2" />
                      <p className={`text-lg font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        Your customer portal is ready!
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={customerLinkGenerated}
                        readOnly
                        className={`flex-1 px-4 py-3 border rounded-xl text-sm font-mono ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                      />
                      <Button
                        onClick={() => copyToClipboard(customerLinkGenerated)}
                        variant="secondary"
                        className="px-6 py-3"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Share this link on your website, social media, or directly with potential customers
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Status Card */}
        <Card className={`p-8 mb-12 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-3xl`}>
          <div className="flex items-center mb-6">
            <Settings className="h-8 w-8 text-[#800020] mr-3" />
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Account Configuration Status
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Business Profile</span>
                <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.business.name}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Admin Email</span>
                <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.business.admin_email}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Membership Tiers</span>
                <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.membershipTiers.length} Created</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Stripe Integration</span>
                <span className={`ml-auto text-emerald-500 font-semibold`}>Active</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subscription Tier</span>
                <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.business.subscription_tier}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Platform Status</span>
                <span className="ml-auto text-emerald-500 font-semibold">Ready for Customers</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className={`p-10 mb-12 ${isDark ? 'bg-gradient-to-br from-zinc-900/70 via-zinc-900/50 to-zinc-900/70 border-zinc-800' : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200'} backdrop-blur-sm rounded-3xl`}>
          <div className="text-center mb-10">
            <Zap className="h-10 w-10 text-[#800020] mx-auto mb-4" />
            <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>What's Next?</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg font-light`}>Complete these steps to maximize your wine club's potential</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#800020] to-[#a00030] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Configure Inventory</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                Upload your wine catalog and set pricing for each membership tier
              </p>
              <Button 
                onClick={() => navigate('/business/dashboard')}
                variant="outline" 
                className="w-full"
              >
                Set up inventory
              </Button>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#800020] to-[#a00030] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Share Your Club</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                Promote your membership page and start accepting customer sign-ups
              </p>
              <Button 
                onClick={customerLinkGenerated ? () => copyToClipboard(customerLinkGenerated) : generateCustomerLink}
                variant="outline" 
                className="w-full"
              >
                {customerLinkGenerated ? 'Copy Link' : 'Get Link'}
              </Button>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#800020] to-[#a00030] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Monitor Analytics</h4>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-4`}>
                Track memberships, revenue, and customer preferences in real-time
              </p>
              <Button 
                onClick={() => navigate('/business/dashboard')}
                variant="outline" 
                className="w-full"
              >
                View dashboard
              </Button>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-8">
          <Card className={`p-8 ${isDark ? 'bg-gradient-to-r from-[#800020]/20 to-[#a00030]/20 border-[#800020]/30' : 'bg-gradient-to-r from-[#800020]/10 to-[#a00030]/10 border-[#800020]/20'} border backdrop-blur-sm rounded-3xl`}>
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-8 w-8 text-[#800020] mr-3" />
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ready to Rule Your Wine Empire?
              </h3>
            </div>
            <Button
              onClick={() => navigate('/business/dashboard')}
              className="bg-gradient-to-r from-[#800020] to-[#a00030] hover:from-[#600018] hover:to-[#800028] px-10 py-4 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowRight className="w-6 h-6 mr-3" />
              Enter Your Dashboard
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
          </Card>
          
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-light`}>
            You can now log in with your admin credentials at any time
          </p>
        </div>

        {/* Premium Support */}
        <div className="text-center mt-16">
          <Card className={`inline-block p-6 ${isDark ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200'} border backdrop-blur-sm rounded-2xl`}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-blue-300' : 'text-blue-900'} mb-2`}>
              🎯 Need Help Getting Started?
            </h3>
            <p className={`${isDark ? 'text-blue-400' : 'text-blue-700'} mb-4`}>
              Our premium support team is here to ensure your success
            </p>
            <div className="space-y-2 text-sm">
              <p>
                📧 <a href="mailto:support@clubcuvee.com" className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline font-semibold`}>support@clubcuvee.com</a>
              </p>
              {businessData.business.website && (
                <p>
                  🌐 <a href={businessData.business.website} target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline font-semibold`}>
                    {businessData.business.name}
                  </a>
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default OnboardingSuccess;