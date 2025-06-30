import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { CheckCircle, ArrowRight, Settings, Users, BarChart3, Copy, ExternalLink } from 'lucide-react';
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
          <div className="h-12 w-12 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-6"></div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg`}>Loading...</p>
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
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} relative`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#800020]/5 to-transparent pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className={`text-4xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
            Congratulations, {businessData.business.name}!
          </h1>
          <p className={`text-lg font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your wine club platform has been successfully configured
          </p>
        </div>

        {/* Membership Tiers Section */}
        <div className="mb-16">
          <Card className={`p-8 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl shadow-sm`}>
            <div className="text-center mb-10">
              <h2 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                Your Membership Tiers
              </h2>
              <p className={`font-light ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Ready to accept customer subscriptions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {businessData.membershipTiers.map((tier) => (
                <div key={tier.id} className={`text-center p-6 ${isDark ? 'bg-zinc-800/30 border-zinc-700' : 'bg-gray-50 border-gray-200'} border rounded-lg hover:scale-105 transition-transform duration-200`}>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {tier.name}
                  </h3>
                  <p className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    ${parseFloat(tier.price).toFixed(2)}
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-normal`}>/month</span>
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {tier.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-500 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Ready</span>
                  </div>
                </div>
              ))}
            </div>

          {/* Customer Link Generation */}
          <div className={`border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-8`}>
            <div className="text-center">
              <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Customer Sign-Up Link
              </h3>
              {!customerLinkGenerated ? (
                <div className="space-y-4">
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                    Generate a link for customers to join your wine club
                  </p>
                  <button
                    onClick={generateCustomerLink}
                    className={`px-6 py-3 border ${isDark ? 'border-zinc-600 text-gray-300 hover:border-[#B03040] hover:text-[#B03040]' : 'border-gray-300 text-gray-700 hover:border-[#800020] hover:text-[#800020]'} rounded-lg transition-all duration-200 font-medium inline-flex items-center`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Generate Link
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 ${isDark ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200'} border rounded-lg`}>
                    <div className="flex items-center justify-center mb-3">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      <p className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        Link generated successfully
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={customerLinkGenerated}
                        readOnly
                        className={`flex-1 px-3 py-2 border rounded-lg text-xs font-mono ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                      />
                      <button
                        onClick={() => copyToClipboard(customerLinkGenerated)}
                        className={`px-4 py-2 ${isDark ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-all duration-200 inline-flex items-center text-sm font-medium`}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </Card>
        </div>

        {/* Account Status Section */}
        <div className="mb-20">
          <Card className={`p-8 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl shadow-sm`}>
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-gray-600 mr-3" />
            <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Account Status
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Business Profile</span>
                <span className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.business.name}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Admin Email</span>
                <span className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.business.admin_email}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Membership Tiers</span>
                <span className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.membershipTiers.length} Created</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Stripe Integration</span>
                <span className="ml-auto text-sm text-emerald-500">Active</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subscription Tier</span>
                <span className={`ml-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{businessData.business.subscription_tier}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Platform Status</span>
                <span className="ml-auto text-sm text-emerald-500">Ready</span>
              </div>
            </div>
          </div>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="mb-16">
          <Card className={`p-8 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl shadow-sm`}>
          <div className="text-center mb-8">
            <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Next Steps</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Complete your setup to start accepting members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`text-center p-6 rounded-lg transition-transform hover:scale-105 duration-200 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'}`}>
              <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Configure Inventory</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-5`}>
                Upload your wine catalog and set pricing
              </p>
              <button
                onClick={() => navigate('/business/dashboard')}
                className={`w-full py-2.5 px-4 border ${isDark ? 'border-zinc-600 text-gray-300 hover:border-[#B03040] hover:text-[#B03040]' : 'border-gray-300 text-gray-700 hover:border-[#800020] hover:text-[#800020]'} rounded-lg transition-all duration-200 font-medium`}
              >
                Set up inventory
              </button>
            </div>

            <div className={`text-center p-6 rounded-lg transition-transform hover:scale-105 duration-200 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'}`}>
              <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Share Your Club</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-5`}>
                Promote your membership page to customers
              </p>
              <button
                onClick={customerLinkGenerated ? () => copyToClipboard(customerLinkGenerated) : generateCustomerLink}
                className={`w-full py-2.5 px-4 border ${isDark ? 'border-zinc-600 text-gray-300 hover:border-[#B03040] hover:text-[#B03040]' : 'border-gray-300 text-gray-700 hover:border-[#800020] hover:text-[#800020]'} rounded-lg transition-all duration-200 font-medium`}
              >
                {customerLinkGenerated ? 'Copy Link' : 'Get Link'}
              </button>
            </div>

            <div className={`text-center p-6 rounded-lg transition-transform hover:scale-105 duration-200 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'}`}>
              <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Monitor Analytics</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-5`}>
                Track memberships and revenue
              </p>
              <button
                onClick={() => navigate('/business/dashboard')}
                className={`w-full py-2.5 px-4 border ${isDark ? 'border-zinc-600 text-gray-300 hover:border-[#B03040] hover:text-[#B03040]' : 'border-gray-300 text-gray-700 hover:border-[#800020] hover:text-[#800020]'} rounded-lg transition-all duration-200 font-medium`}
              >
                View dashboard
              </button>
            </div>
          </div>
          </Card>
        </div>

        {/* Ready to Get Started Section */}
        <div className="mb-16">
          <div className="text-center">
            <Card className={`p-8 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl shadow-sm`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Ready to Get Started?
              </h3>
              <button
                onClick={() => navigate('/business/dashboard')}
                className={`${isDark ? 'bg-[#B03040] hover:bg-[#903035]' : 'bg-[#800020] hover:bg-[#600018]'} text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 transform hover:scale-105 inline-flex items-center shadow-lg`}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Go to Dashboard
              </button>
            </Card>
            
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-6`}>
              You can log in with your admin credentials at any time
            </p>
          </div>
        </div>

        {/* Support Section - No box, just text */}
        <div className="text-center py-8">
          <h3 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Need Help?
          </h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Our support team is here to help
          </p>
          <a href="mailto:support@clubcuvee.com" className={`${isDark ? 'text-[#B03040]' : 'text-[#800020]'} hover:underline`}>
            support@clubcuvee.com
          </a>
        </div>

        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default OnboardingSuccess;