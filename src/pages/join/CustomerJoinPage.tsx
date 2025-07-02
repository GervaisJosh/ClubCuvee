import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { Wine, CheckCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  city?: string;
  state?: string;
}

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  monthly_price_cents: number;
  benefits?: string[];
  stripe_price_id: string;
  is_active: boolean;
}

const CustomerJoinPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBusinessData();
    } else {
      setError('Invalid wine club link');
      setLoading(false);
    }
  }, [slug]);

  const fetchBusinessData = async () => {
    if (!slug) {
      setError('Invalid wine club link');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch business by slug WITHOUT joining users table
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, slug, website, description, city, state')  // Only select business fields
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (businessError) {
        console.error('Error fetching business:', businessError);
        if (businessError.code === 'PGRST116') {
          setError('Wine club not found');
        } else {
          setError('Unable to load wine club information');
        }
        setLoading(false);
        return;
      }

      if (!businessData) {
        setError('Wine club not found');
        setLoading(false);
        return;
      }

      setBusiness(businessData);

      // Fetch membership tiers for this business
      const { data: tiersData, error: tiersError } = await supabase
        .from('membership_tiers')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('is_active', true)
        .order('monthly_price_cents', { ascending: true });

      if (tiersError) {
        console.error('Error fetching tiers:', tiersError);
        setError('Unable to load membership options');
      } else {
        setMembershipTiers(tiersData || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTier = async (tier: MembershipTier) => {
    if (!tier.stripe_price_id) {
      setError('This membership tier is not yet available for sign-up');
      return;
    }

    setSelectedTierId(tier.id);
    setProcessingCheckout(true);

    try {
      // Create checkout session
      const response = await fetch('/api/create-customer-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: business?.id,
          businessSlug: business?.slug,
          tierId: tier.id,
          priceId: tier.stripe_price_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Unable to start checkout process');
      setProcessingCheckout(false);
      setSelectedTierId(null);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-3 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm animate-pulse">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <Card className={`max-w-md p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <Wine className="h-16 w-16 text-[#800020] mx-auto mb-4" />
          <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {error || 'Wine Club Not Found'}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            The wine club you're looking for doesn't exist or is no longer available.
          </p>
          <Button onClick={() => navigate('/')} variant="secondary">
            Return Home
          </Button>
        </Card>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          {business.logo_url && (
            <img 
              src={business.logo_url} 
              alt={business.name}
              className="h-20 w-auto mx-auto mb-6"
            />
          )}
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
            {business.name} Wine Club
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {business.description || 'Join our exclusive wine club and discover exceptional wines curated just for you.'}
          </p>
          {(business.city || business.state) && (
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
              {[business.city, business.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        {/* Membership Tiers */}
        <div className="mb-12">
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center mb-8`}>
            Choose Your Membership
          </h2>
          
          {membershipTiers.length === 0 ? (
            <Card className={`p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Membership options are coming soon. Please check back later.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membershipTiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`p-6 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} 
                    ${selectedTierId === tier.id ? 'ring-2 ring-[#800020]' : ''} 
                    transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="text-center mb-6">
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {tier.name}
                    </h3>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                      ${(tier.monthly_price_cents / 100).toFixed(2)}
                      <span className={`text-base font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>
                    </p>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-3`}>
                      {tier.description}
                    </p>
                  </div>

                  {tier.benefits && tier.benefits.length > 0 && (
                    <div className="mb-6">
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSelectTier(tier)}
                    disabled={processingCheckout || !tier.stripe_price_id}
                    className={`w-full ${tier.stripe_price_id 
                      ? 'bg-[#800020] hover:bg-[#600018]' 
                      : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    {processingCheckout && selectedTierId === tier.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      tier.stripe_price_id ? 'Select This Plan' : 'Coming Soon'
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by Club Cuvée
          </p>
        </div>

        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default CustomerJoinPage;