import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { Wine, CheckCircle, Loader2, X, MapPin, Users } from 'lucide-react';
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

interface CustomerFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  winePreferences: string;
  specialRequests: string;
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
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    winePreferences: '',
    specialRequests: ''
  });

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

  const handleSelectTier = (tier: MembershipTier) => {
    if (!tier.stripe_price_id) {
      setError('This membership tier is not yet available for sign-up');
      return;
    }

    setSelectedTierId(tier.id);
    setSelectedTier(tier);
    setShowCustomerForm(true);
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingCheckout(true);

    try {
      // Store customer data in localStorage
      localStorage.setItem('pendingCustomerData', JSON.stringify({
        ...customerData,
        businessId: business?.id,
        businessSlug: business?.slug,
        tierId: selectedTier?.id,
        tierName: selectedTier?.name,
        timestamp: new Date().toISOString()
      }));

      // Create checkout session with customer email
      const response = await fetch('/api/create-customer-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: business?.id,
          businessSlug: business?.slug,
          tierId: selectedTier?.id,
          priceId: selectedTier?.stripe_price_id,
          customerEmail: customerData.email,
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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
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
      <div className="max-w-7xl mx-auto px-6 py-12">
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
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tiers Section - centered */}
          <div className="lg:col-span-2 order-2 lg:order-1">
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
              <div className={`grid ${
                membershipTiers.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                membershipTiers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
              } gap-6`}>
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
                      disabled={!tier.stripe_price_id}
                      className={`w-full ${tier.stripe_price_id 
                        ? 'bg-[#800020] hover:bg-[#600018]' 
                        : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      {tier.stripe_price_id ? 'Select This Plan' : 'Coming Soon'}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Business Info Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className={`p-6 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} sticky top-6`}>
              <div className="mb-6">
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                  About {business.name}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  {business.description || 'Join our exclusive wine club and discover exceptional wines curated just for you.'}
                </p>
                {(business.city || business.state) && (
                  <div className="flex items-center text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {[business.city, business.state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className={`border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-6`}>
                <h4 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Why Join?
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Join an exclusive partnership that supports local business and brings you exceptional wines carefully selected by our experts.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Wine className="h-5 w-5 text-[#800020] mr-3 flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Expertly curated wine selections
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-[#800020] mr-3 flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Exclusive member events & tastings
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#800020] mr-3 flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Support your local wine community
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Customer Information Modal */}
        {showCustomerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'} rounded-xl shadow-xl max-h-[90vh] overflow-y-auto`}>
              <div className={`sticky top-0 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Complete Your Membership
                </h2>
                <button
                  onClick={() => {
                    setShowCustomerForm(false);
                    setSelectedTierId(null);
                    setSelectedTier(null);
                  }}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  You're one click away from joining {business.name}'s exclusive wine club! 
                  Selected plan: <span className="font-semibold">{selectedTier?.name}</span> - ${((selectedTier?.monthly_price_cents || 0) / 100).toFixed(2)}/month
                </p>
                
                <form onSubmit={handleCustomerSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={customerData.fullName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                        } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                        } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                      } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerData.address}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                      } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={customerData.city}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                        } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                        placeholder="San Francisco"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={customerData.state}
                        onChange={handleInputChange}
                        required
                        maxLength={2}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                        } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                        placeholder="CA"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={customerData.zipCode}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 border rounded-lg ${
                          isDark 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                        } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                        placeholder="94102"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Wine Preferences (optional)
                    </label>
                    <textarea
                      name="winePreferences"
                      value={customerData.winePreferences}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                      } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                      placeholder="Tell us about your wine preferences (e.g., prefer reds, enjoy bold flavors, etc.)"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Special Requests (optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={customerData.specialRequests}
                      onChange={handleInputChange}
                      rows={2}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                      } focus:outline-none focus:ring-1 focus:ring-[#800020]`}
                      placeholder="Any special delivery instructions or requests?"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={processingCheckout}
                      className="flex-1 bg-[#800020] hover:bg-[#600018]"
                    >
                      {processingCheckout ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Continue to Payment'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowCustomerForm(false);
                        setSelectedTierId(null);
                        setSelectedTier(null);
                      }}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
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