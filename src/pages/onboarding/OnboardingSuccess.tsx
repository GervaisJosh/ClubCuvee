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
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Clean Success Header */}
        <div className="text-center mb-16">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
          <h1 className={`text-4xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            {businessData.business.name} is Ready
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Your wine club platform has been successfully configured
          </p>
        </div>

        {/* Membership Tiers */}
        <Card className={`p-10 mb-12 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl`}>
          <div className="text-center mb-10">
            <h2 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Your Membership Tiers
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Ready to accept customer subscriptions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {businessData.membershipTiers.map((tier) => (
              <div key={tier.id} className={`text-center p-6 ${isDark ? 'bg-zinc-800/30 border-zinc-700' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {tier.name}
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  ${parseFloat(tier.price).toFixed(2)}
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-normal`}>/month</span>
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {tier.description}
                </p>
                <div className="flex items-center justify-center space-x-2 text-emerald-500 text-sm">
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
                  <Button 
                    onClick={generateCustomerLink}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Generate Link
                  </Button>
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
                      <Button
                        onClick={() => copyToClipboard(customerLinkGenerated)}
                        variant="secondary"
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Status */}
        <Card className={`p-8 mb-12 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl`}>
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

        {/* Next Steps */}
        <Card className={`p-8 mb-12 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl`}>
          <div className="text-center mb-8">
            <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Next Steps</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Complete your setup to start accepting members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Configure Inventory</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
                Upload your wine catalog and set pricing
              </p>
              <Button 
                onClick={() => navigate('/business/dashboard')}
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Set up inventory
              </Button>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Share Your Club</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
                Promote your membership page to customers
              </p>
              <Button 
                onClick={customerLinkGenerated ? () => copyToClipboard(customerLinkGenerated) : generateCustomerLink}
                variant="outline" 
                size="sm"
                className="w-full"
              >
                {customerLinkGenerated ? 'Copy Link' : 'Get Link'}
              </Button>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Monitor Analytics</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
                Track memberships and revenue
              </p>
              <Button 
                onClick={() => navigate('/business/dashboard')}
                variant="outline" 
                size="sm"
                className="w-full"
              >
                View dashboard
              </Button>
            </div>
          </div>
        </Card>

        {/* Main CTA */}
        <div className="text-center space-y-6">
          <Card className={`p-8 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-xl`}>
            <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Ready to Get Started?
            </h3>
            <Button
              onClick={() => navigate('/business/dashboard')}
              className="bg-[#800020] hover:bg-[#600018] px-8 py-3 text-white font-medium"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Card>
          
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            You can log in with your admin credentials at any time
          </p>
        </div>

        {/* Support */}
        <div className="text-center mt-12">
          <Card className={`inline-block p-6 ${isDark ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
            <h3 className={`text-lg font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'} mb-2`}>
              Need Help?
            </h3>
            <p className={`${isDark ? 'text-blue-400' : 'text-blue-700'} mb-4`}>
              Our support team is here to help
            </p>
            <p className="text-sm">
              <a href="mailto:support@clubcuvee.com" className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                support@clubcuvee.com
              </a>
            </p>
          </Card>
        </div>

        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default OnboardingSuccess;