import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, AlertCircle, Wine, Calendar, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PendingCustomerData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  winePreferences: string;
  specialRequests: string;
  businessId: string;
  businessSlug: string;
  tierId: string;
  tierName: string;
  timestamp: string;
}

interface BusinessData {
  id: string;
  name: string;
  website?: string;
}

interface TierData {
  id: string;
  name: string;
  monthly_price_cents: number;
}

const CustomerWelcome: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<PendingCustomerData | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [tierData, setTierData] = useState<TierData | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPaymentAndCreateCustomer = async () => {
      if (!sessionId) {
        setError('Missing payment session information');
        setLoading(false);
        return;
      }

      try {
        // Get stored customer data from localStorage
        const storedData = localStorage.getItem('pendingCustomerData');
        if (!storedData) {
          setError('Customer information not found. Please start the signup process again.');
          setLoading(false);
          return;
        }

        const pendingData: PendingCustomerData = JSON.parse(storedData);
        setCustomerData(pendingData);

        // Verify payment with Stripe
        const verifyResponse = await fetch('/api/verify-stripe-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!verifyResponse.ok) {
          throw new Error('Payment verification failed');
        }

        const { stripeCustomerId, subscriptionId } = await verifyResponse.json();

        // Fetch business data
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('id, name, website')
          .eq('id', pendingData.businessId)
          .single();

        if (businessError) {
          throw new Error('Failed to fetch business information');
        }
        setBusinessData(business);

        // Fetch tier data
        const { data: tier, error: tierError } = await supabase
          .from('membership_tiers')
          .select('id, name, monthly_price_cents')
          .eq('id', pendingData.tierId)
          .single();

        if (tierError) {
          throw new Error('Failed to fetch membership tier information');
        }
        setTierData(tier);

        // Create customer record in Supabase
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .insert({
            business_id: pendingData.businessId,
            membership_tier_id: pendingData.tierId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: subscriptionId,
            email: pendingData.email,
            full_name: pendingData.fullName,
            phone: pendingData.phone,
            address: pendingData.address,
            city: pendingData.city,
            state: pendingData.state,
            zip_code: pendingData.zipCode,
            wine_preferences: pendingData.winePreferences,
            special_requests: pendingData.specialRequests,
            status: 'active',
          })
          .select()
          .single();

        if (customerError) {
          console.error('Error creating customer:', customerError);
          throw new Error('Failed to create customer record');
        }

        setCustomerId(customer.id);

        // Clear localStorage
        localStorage.removeItem('pendingCustomerData');

        // Create user account if needed
        // This would be handled by your auth system

      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process your membership');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndCreateCustomer();
  }, [sessionId]);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10 flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#800020] mx-auto mb-4" />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Activating your membership...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !customerData || !businessData || !tierData) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10 flex items-center justify-center`}>
        <Card className={`max-w-md mx-auto p-8 text-center ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Payment Processing Error
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {error || 'There was an issue processing your membership. Please contact support.'}
          </p>
          <Button onClick={() => navigate('/')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Welcome to {businessData.name}'s Wine Club!
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            Your membership has been successfully activated
          </p>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Get ready for an amazing wine journey, {customerData.fullName}!
          </p>
        </div>

        {/* Membership Details */}
        <Card className={`p-8 mb-8 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>
            Your Membership Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`text-center p-6 ${isDark ? 'bg-[#800020]/20' : 'bg-[#800020]/5'} rounded-lg border ${isDark ? 'border-[#800020]/30' : 'border-[#800020]/20'}`}>
              <Wine className="h-12 w-12 text-[#800020] mx-auto mb-4" />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                {tierData.name} Member
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                ${(tierData.monthly_price_cents / 100).toFixed(2)}/month
              </p>
            </div>

            <div className={`text-center p-6 ${isDark ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg border ${isDark ? 'border-green-800/30' : 'border-green-200'}`}>
              <CheckCircle className={`h-12 w-12 ${isDark ? 'text-green-400' : 'text-green-600'} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Status: Active
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Monthly subscription active
              </p>
            </div>
          </div>
        </Card>

        {/* What's Next */}
        <Card className={`p-8 mb-8 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>
            What Happens Next?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                1
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Welcome Email
                </p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Check your email at {customerData.email} for your welcome message and login details
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                2
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  First Shipment
                </p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your first curated wine selection will be shipped within 3-5 business days
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                3
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Member Dashboard
                </p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Access your personal dashboard to track shipments, rate wines, and update preferences
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Member Benefits */}
        <Card className={`p-8 mb-8 ${isDark ? 'bg-gradient-to-br from-[#800020]/20 to-[#800020]/30' : 'bg-gradient-to-br from-[#800020]/5 to-[#800020]/10'}`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>
            Your Member Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Wine className="h-8 w-8 text-[#800020] mx-auto mb-3" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Curated Selections
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Hand-picked wines based on your taste preferences
              </p>
            </div>
            
            <div className="text-center">
              <Calendar className="h-8 w-8 text-[#800020] mx-auto mb-3" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Flexible Delivery
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Monthly deliveries with easy skip and pause options
              </p>
            </div>
            
            <div className="text-center">
              <Heart className="h-8 w-8 text-[#800020] mx-auto mb-3" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Expert Support
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Access to wine experts and tasting notes
              </p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            A confirmation email has been sent to {customerData.email}
          </p>
          
          <Button
            onClick={() => navigate(`/join/${customerData.businessSlug}`)}
            variant="secondary"
            className="px-8 py-3"
          >
            Return to {businessData.name}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Contact Support */}
        <div className={`text-center mt-12 p-6 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Questions About Your Membership?
          </h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Our customer service team is here to help
          </p>
          <div className="space-y-2 text-sm">
            <p>
              📧 Email: <a href="mailto:support@clubcuvee.com" className="text-[#800020] hover:underline">support@clubcuvee.com</a>
            </p>
            {businessData.website && (
              <p>
                🌐 Business: <a href={businessData.website} target="_blank" rel="noopener noreferrer" className="text-[#800020] hover:underline">
                  {businessData.name}
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