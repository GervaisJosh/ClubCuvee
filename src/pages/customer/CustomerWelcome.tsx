import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, AlertCircle, Wine, Calendar, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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

interface CustomerData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  wine_preferences?: string;
  special_requests?: string;
  business_id: string;
  membership_tier_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
}

const CustomerWelcome: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [tierData, setTierData] = useState<TierData | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPaymentAndCreateCustomer = async () => {
      if (!sessionId) {
        setError('Missing payment session information');
        setLoading(false);
        return;
      }

      try {
        // Create customer record using service role API
        const createResponse = await fetch('/api/create-customer-record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(errorData.error || 'Failed to create customer record');
        }

        const { customer, isNew } = await createResponse.json();
        setCustomerData(customer);

        console.log(`Customer ${isNew ? 'created' : 'retrieved'} successfully:`, customer.id);

        // Extract metadata from customer record for fetching related data
        const metadata = {
          businessId: customer.business_id,
          tierId: customer.membership_tier_id
        };

        // Fetch business data
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('id, name, website')
          .eq('id', customer.business_id)
          .single();

        if (businessError) {
          console.error('Error fetching business:', businessError);
          throw new Error('Failed to fetch business information');
        }
        setBusinessData(business);

        // Fetch tier data
        const { data: tier, error: tierError } = await supabase
          .from('membership_tiers')
          .select('id, name, monthly_price_cents')
          .eq('id', customer.membership_tier_id)
          .single();

        if (tierError) {
          console.error('Error fetching tier:', tierError);
          throw new Error('Failed to fetch membership tier information');
        }
        setTierData(tier);

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
            Get ready for an amazing wine journey, {customerData.full_name}!
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

          {/* Shipping Information */}
          <div className={`mt-6 p-4 ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
            <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Shipping Address
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {customerData.address}<br />
              {customerData.city}, {customerData.state} {customerData.zip_code}
            </p>
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
                  Check your email at {customerData.email} for your welcome message and important information
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
                  Your first curated wine selection will be prepared and shipped within 3-5 business days
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                3
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Ongoing Enjoyment
                </p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Receive monthly shipments, access exclusive events, and enjoy member benefits
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
                Exclusive Access
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Member-only events, tastings, and special offers
              </p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            A confirmation email has been sent to {customerData.email}
          </p>
        </div>

        {/* Contact Support */}
        <div className={`text-center mt-12 p-6 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Questions About Your Membership?
          </h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            We're here to help! Contact us anytime.
          </p>
          <div className="space-y-2 text-sm">
            <p>
              📧 Email: <a href="mailto:support@clubcuvee.com" className="text-[#800020] hover:underline">support@clubcuvee.com</a>
            </p>
            {businessData.website && (
              <p>
                🌐 Visit: <a href={businessData.website} target="_blank" rel="noopener noreferrer" className="text-[#800020] hover:underline">
                  {businessData.name} Website
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