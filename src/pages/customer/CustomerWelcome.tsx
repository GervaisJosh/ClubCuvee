import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, AlertCircle, Wine, Calendar, Heart, ArrowRight } from 'lucide-react';

interface CustomerWelcomeData {
  customer: {
    id: string;
    name: string;
    email: string;
    tier_name: string;
    subscription_status: string;
  };
  business: {
    id: string;
    name: string;
    website?: string;
  };
  subscription: {
    id: string;
    status: string;
    current_period_end: string;
    amount: number;
  };
}

const CustomerWelcome: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [welcomeData, setWelcomeData] = useState<CustomerWelcomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyPaymentAndCreateCustomer = async () => {
      if (!sessionId || !token) {
        setError('Missing session or token information');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/verify-customer-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId, token }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        setWelcomeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process your membership');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndCreateCustomer();
  }, [sessionId, token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Activating your membership...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !welcomeData) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] px-6 py-10 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Processing Error</h1>
          <p className="text-gray-600 mb-6">
            {error || 'There was an issue processing your membership. Please contact support.'}
          </p>
          <Button onClick={() => navigate('/')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const currentPeriodEnd = new Date(welcomeData.subscription.current_period_end);
  const nextBillingDate = currentPeriodEnd.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Welcome to {welcomeData.business.name}'s Wine Club!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your membership has been successfully activated
          </p>
          <p className="text-lg text-gray-500">
            Get ready for an amazing wine journey, {welcomeData.customer.name}!
          </p>
        </div>

        {/* Membership Details */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Membership Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-[#800020]/5 rounded-lg border border-[#800020]/20">
              <Wine className="h-12 w-12 text-[#800020] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {welcomeData.customer.tier_name} Member
              </h3>
              <p className="text-sm text-gray-600">
                ${(welcomeData.subscription.amount / 100).toFixed(2)}/month
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Status: Active
              </h3>
              <p className="text-sm text-gray-600">
                Next billing: {nextBillingDate}
              </p>
            </div>
          </div>
        </Card>

        {/* What's Next */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What Happens Next?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Profile Curation</p>
                <p className="text-gray-600">
                  Our wine experts will review your preferences and curate personalized selections
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">First Shipment</p>
                <p className="text-gray-600">
                  Your first curated wine selection will be shipped within 3-5 business days
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Member Dashboard</p>
                <p className="text-gray-600">
                  Access your personal dashboard to track shipments, rate wines, and update preferences
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Member Benefits */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-[#800020]/5 to-[#800020]/10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Member Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Wine className="h-8 w-8 text-[#800020] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Curated Selections</h3>
              <p className="text-sm text-gray-600">
                Hand-picked wines based on your taste preferences
              </p>
            </div>
            
            <div className="text-center">
              <Calendar className="h-8 w-8 text-[#800020] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Delivery</h3>
              <p className="text-sm text-gray-600">
                Monthly deliveries with easy skip and pause options
              </p>
            </div>
            
            <div className="text-center">
              <Heart className="h-8 w-8 text-[#800020] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">
                Access to wine experts and tasting notes
              </p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => navigate('/customer/dashboard')}
            className="px-8 py-3"
          >
            Access Your Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to {welcomeData.customer.email}
          </p>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Questions About Your Membership?
          </h3>
          <p className="text-gray-600 mb-4">
            Our customer service team is here to help
          </p>
          <div className="space-y-2 text-sm">
            <p>
              📧 Email: <a href="mailto:support@clubcuvee.com" className="text-[#800020] hover:underline">support@clubcuvee.com</a>
            </p>
            {welcomeData.business.website && (
              <p>
                🌐 Business: <a href={welcomeData.business.website} target="_blank" rel="noopener noreferrer" className="text-[#800020] hover:underline">
                  {welcomeData.business.name}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWelcome;