import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, ArrowRight, Settings, Users, BarChart3, Copy, ExternalLink } from 'lucide-react';

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

  const nextSteps = [
    {
      icon: Settings,
      title: 'Configure Your Wine Inventory',
      description: 'Upload your wine catalog and set pricing for each membership tier',
      action: 'Set up inventory'
    },
    {
      icon: Users,
      title: 'Share Your Membership Page',
      description: 'Get your custom link to start accepting customer sign-ups',
      action: 'Get member link'
    },
    {
      icon: BarChart3,
      title: 'Monitor Your Analytics',
      description: 'Track memberships, revenue, and customer preferences',
      action: 'View dashboard'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] dark:bg-black px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading your business details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !businessData) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] dark:bg-black px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400 mb-4">Error: {error || 'Failed to load business data'}</p>
          <Button onClick={() => navigate('/business/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] dark:bg-black px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Welcome to Club Cuvée, {businessData.business.name}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Your business account has been successfully created
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You're ready to start building your wine club community
          </p>
        </div>

        {/* Your Membership Tiers */}
        <Card className="p-8 mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Your Membership Tiers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {businessData.membershipTiers.map((tier) => (
              <div key={tier.id} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
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
                <div className="flex items-center justify-center space-x-2 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Stripe Ready</span>
                </div>
              </div>
            ))}
          </div>

          {/* Customer Link Generation */}
          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Ready to Start Acquiring Customers?
            </h3>
            <div className="text-center">
              {!customerLinkGenerated ? (
                <Button 
                  onClick={generateCustomerLink}
                  className="mb-4"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Generate Customer Sign-Up Link
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-300 mb-2">Your customer sign-up link is ready!</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={customerLinkGenerated}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-sm dark:text-white"
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share this link with potential customers to start building your wine club community!
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Details */}
        <Card className="p-6 mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">✅ Business Name:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">{businessData.business.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">✅ Admin Email:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">{businessData.business.admin_email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">✅ Membership Tiers:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">{businessData.membershipTiers.length} Created</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">✅ Stripe Integration:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">Products & Prices Created</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">✅ Subscription Tier:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">{businessData.business.subscription_tier}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">✅ Status:</span>
              <span className="text-green-600 dark:text-green-400 ml-2">Ready for Customers</span>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/business/dashboard')}
            className="px-8 py-3"
          >
            Access Your Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can now log in with your admin credentials at any time
          </p>
        </div>

        {/* Support */}
        <div className="text-center mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Need Help Getting Started?
          </h3>
          <p className="text-blue-700 dark:text-blue-400 mb-4">
            Our team is here to help you make the most of Club Cuvée
          </p>
          <div className="space-y-2 text-sm">
            <p>
              📧 Email: <a href="mailto:support@clubcuvee.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@clubcuvee.com</a>
            </p>
            {businessData.business.website && (
              <p>
                🌐 Business: <a href={businessData.business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {businessData.business.name}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;