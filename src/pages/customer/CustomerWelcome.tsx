import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { CheckCircle, AlertCircle, Wine, Calendar, Heart, ArrowRight, Loader2, Sparkles, Gift, Clock, Mail } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BusinessData {
  id: string;
  name: string;
  website?: string;
  city?: string;
  state?: string;
}

interface TierData {
  id: string;
  name: string;
  monthly_price_cents: number;
  description?: string;
  benefits?: string[] | string;
}

interface CustomerData {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  wine_preferences?: string;
  special_requests?: string;
  business_id: string;
  tier_id: string;
  membership_tier_id?: string;
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
  const [benefits, setBenefits] = useState<string[]>([]);

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

        // Fetch business data with more fields
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('id, name, website, city, state')
          .eq('id', customer.business_id)
          .single();

        if (businessError) {
          console.error('Error fetching business:', businessError);
          throw new Error('Failed to fetch business information');
        }
        setBusinessData(business);

        // Fetch tier data with all fields
        const { data: tier, error: tierError } = await supabase
          .from('membership_tiers')
          .select('id, name, monthly_price_cents, description, benefits')
          .eq('id', customer.tier_id)
          .single();

        if (tierError) {
          console.error('Error fetching tier:', tierError);
          throw new Error('Failed to fetch membership tier information');
        }
        setTierData(tier);

        // Parse benefits
        if (tier.benefits) {
          if (typeof tier.benefits === 'string') {
            try {
              const parsedBenefits = JSON.parse(tier.benefits);
              setBenefits(Array.isArray(parsedBenefits) ? parsedBenefits : [tier.benefits]);
            } catch {
              setBenefits([tier.benefits]);
            }
          } else if (Array.isArray(tier.benefits)) {
            setBenefits(tier.benefits);
          }
        }

      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process your membership');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndCreateCustomer();
  }, [sessionId]);

  // Loading state with luxury animation
  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-[#fdfaf7]'} px-6 py-10 flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="h-20 w-20 mx-auto mb-6">
              <Wine className="h-20 w-20 text-[#722f37] animate-pulse" />
            </div>
            <Sparkles className="h-6 w-6 text-[#722f37] absolute top-0 right-0 animate-ping" />
          </div>
          <p className={`text-lg font-light ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Preparing your exclusive membership...
          </p>
        </div>
      </div>
    );
  }

  // Error state with elegant design
  if (error || !customerData || !businessData || !tierData) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-[#fdfaf7]'} px-6 py-10 flex items-center justify-center`}>
        <Card className={`max-w-md mx-auto p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} shadow-xl`}>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            We encountered an issue
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {error || 'There was an issue processing your membership. Please contact support.'}
          </p>
          <Button onClick={() => navigate('/')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-[#fdfaf7]'} relative`}>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#722f37]/5 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with animation */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="mb-8">
              <CheckCircle className="h-24 w-24 text-emerald-500 mx-auto mb-6 animate-scale-in" />
              <h1 className={`text-4xl md:text-5xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Welcome to the {businessData.name} Wine Club
              </h1>
              <p className={`text-xl font-light ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Congratulations, {customerData.name}!
              </p>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Your journey into exceptional wines begins now
              </p>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => navigate('/login')}
              className="bg-[#722f37] hover:bg-[#5a252c] text-white px-8 py-4 text-lg font-medium shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Visit Your Dashboard
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </div>

          {/* Membership Details Card with elegant design */}
          <Card className={`p-8 mb-12 ${isDark ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-white border-gray-200'} shadow-xl backdrop-blur-sm animate-slide-up`}>
            <h2 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
              Your Membership Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`text-center p-6 ${isDark ? 'bg-[#722f37]/20' : 'bg-[#722f37]/5'} rounded-xl border ${isDark ? 'border-[#722f37]/30' : 'border-[#722f37]/20'} transform transition-all duration-200 hover:scale-105`}>
                <Wine className="h-12 w-12 text-[#722f37] mx-auto mb-4" />
                <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {tierData.name}
                </h3>
                <p className={`text-3xl font-light ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  ${(tierData.monthly_price_cents / 100).toFixed(2)}
                  <span className="text-base font-normal">/month</span>
                </p>
                {tierData.description && (
                  <p className={`text-sm mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tierData.description}
                  </p>
                )}
              </div>

              <div className={`text-center p-6 ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50'} rounded-xl border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'} transform transition-all duration-200 hover:scale-105`}>
                <CheckCircle className={`h-12 w-12 ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mx-auto mb-4`} />
                <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Membership Active
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your monthly subscription is now active
                </p>
                <div className={`mt-4 p-3 ${isDark ? 'bg-zinc-800/50' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Shipping to:</p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                    {customerData.address}, {customerData.city}, {customerData.state} {customerData.zip_code}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Benefits Section */}
          {benefits.length > 0 && (
            <Card className={`p-8 mb-12 ${isDark ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-white border-gray-200'} shadow-xl backdrop-blur-sm animate-slide-up-delay-1`}>
              <h2 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
                Your Exclusive Benefits
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className={`flex items-start p-4 ${isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'} rounded-lg transition-all duration-200`}
                  >
                    <Gift className="h-5 w-5 text-[#722f37] mr-3 flex-shrink-0 mt-0.5" />
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* What Happens Next - with business context */}
          <Card className={`p-8 mb-12 ${isDark ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-white border-gray-200'} shadow-xl backdrop-blur-sm animate-slide-up-delay-2`}>
            <h2 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
              What Happens Next
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="w-10 h-10 bg-[#722f37] text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 mt-1 group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    Welcome Email from {businessData.name}
                  </p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                    <Mail className="h-4 w-4 mr-2 mt-0.5 text-[#722f37]" />
                    Check your inbox at {customerData.email} for important information and login details
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="w-10 h-10 bg-[#722f37] text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 mt-1 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    Curated Selection
                  </p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                    <Wine className="h-4 w-4 mr-2 mt-0.5 text-[#722f37]" />
                    Our sommeliers at {businessData.name} are preparing your first personalized wine selection
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="w-10 h-10 bg-[#722f37] text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 mt-1 group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    First Shipment
                  </p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-start`}>
                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-[#722f37]" />
                    Your wines will be carefully packed and shipped within 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Member Perks Section */}
          <Card className={`p-8 mb-12 ${isDark ? 'bg-gradient-to-br from-[#722f37]/20 to-[#722f37]/10 border-[#722f37]/30' : 'bg-gradient-to-br from-[#722f37]/5 to-[#722f37]/10 border-[#722f37]/20'} border shadow-xl backdrop-blur-sm animate-slide-up-delay-3`}>
            <h2 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
              Exclusive Member Perks
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wine className="h-8 w-8 text-[#722f37]" />
                </div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Expert Curation
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Wines selected by {businessData.name}'s expert sommeliers
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8 text-[#722f37]" />
                </div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Flexible Delivery
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Skip, pause, or modify your shipments anytime
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-[#722f37]" />
                </div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  VIP Access
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Exclusive events and special member pricing
                </p>
              </div>
            </div>
          </Card>

          {/* Final CTA */}
          <div className="text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              A confirmation email has been sent to {customerData.email}
            </p>
            
            <Button
              onClick={() => navigate('/login')}
              variant="secondary"
              className="px-8 py-3 border-2 border-[#722f37] text-[#722f37] hover:bg-[#722f37] hover:text-white transition-all duration-200"
            >
              Access Your Member Dashboard
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </div>

          {/* Contact Support - Elegant Footer */}
          <div className={`text-center mt-16 p-8 ${isDark ? 'bg-zinc-900/30' : 'bg-white/50'} backdrop-blur rounded-2xl border ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Questions About Your Membership?
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Our concierge team is here to assist you
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[#722f37]">📧</span> Email: <a href="mailto:support@clubcuvee.com" className="text-[#722f37] hover:underline">support@clubcuvee.com</a>
              </p>
              {businessData.website && (
                <p>
                  <span className="text-[#722f37]">🌐</span> Visit: <a href={businessData.website} target="_blank" rel="noopener noreferrer" className="text-[#722f37] hover:underline">
                    {businessData.name}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ThemeToggle position="fixed" />
    </div>
  );
};

export default CustomerWelcome;