import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import BusinessLogoDisplay from '../../components/BusinessLogoDisplay';
import TierImageCard from '../../components/TierImageCard';
import { Wine, CheckCircle, Loader2, MapPin, ChevronRight } from 'lucide-react';
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
  image_url?: string;
}

interface CustomerFormData {
  name: string;
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
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: '',
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
        .select('id, name, slug, website, description, city, state, logo_url')
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

  const handleTierSelect = (tierId: string) => {
    setSelectedTierId(tierId);
    // Smooth scroll to form section
    setTimeout(() => {
      document.getElementById('customer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTierId) {
      setError('Please select a membership tier');
      return;
    }

    const selectedTier = membershipTiers.find(t => t.id === selectedTierId);
    if (!selectedTier || !selectedTier.stripe_price_id) {
      setError('Invalid membership tier selected');
      return;
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !customerData[field as keyof CustomerFormData]?.trim());
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setProcessingCheckout(true);
    setError(null);

    try {
      // Create checkout session with customer data
      const response = await fetch('/api/create-customer-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: business?.id,
          businessSlug: business?.slug,
          tierId: selectedTier.id,
          priceId: selectedTier.stripe_price_id,
          customerData: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address,
            city: customerData.city,
            state: customerData.state,
            zipCode: customerData.zipCode,
            winePreferences: customerData.winePreferences,
            specialRequests: customerData.specialRequests,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create checkout session' }));
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      if (!data.checkoutUrl) {
        throw new Error('No checkout URL received from server');
      }
      
      const { checkoutUrl } = data;
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Unable to start checkout process. Please try again.');
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading wine club...</p>
          </div>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <Card className={`max-w-md p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <Wine className="h-16 w-16 text-[#800020] mx-auto mb-4" />
          <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Wine Club Not Found
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            {error}
          </p>
          <Button onClick={() => navigate('/')} variant="secondary">
            Return Home
          </Button>
        </Card>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  const selectedTier = membershipTiers.find(t => t.id === selectedTierId);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <BusinessLogoDisplay 
            logoUrl={business?.logo_url}
            businessName={business?.name || ''}
            size="large"
            className="mx-auto mb-6"
          />
          <h1 className={`text-4xl md:text-5xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Join {business?.name}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {business?.description || 'Select your membership and complete your profile to start your wine journey'}
          </p>
          {(business?.city || business?.state) && (
            <div className="flex items-center justify-center text-sm mt-4">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {[business.city, business.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Main Card */}
        <Card className={`p-8 md:p-12 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-gray-200'} rounded-2xl shadow-sm`}>
          <form onSubmit={handleSubmit}>
            {/* Membership Tiers Section */}
            <div className="mb-16">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>
                Select Your Membership
              </h2>
              
              {membershipTiers.length === 0 ? (
                <div className={`text-center p-8 ${isDark ? 'bg-zinc-800/30 border-zinc-700' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Membership options are coming soon. Please check back later.
                  </p>
                </div>
              ) : (
                <div className={`grid ${
                  membershipTiers.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                  membershipTiers.length === 2 ? 'grid-cols-1 md:grid-cols-2 gap-6' :
                  'grid-cols-1 md:grid-cols-3 gap-6'
                }`}>
                  {membershipTiers.map((tier) => (
                    <TierImageCard
                      key={tier.id}
                      tier={tier}
                      onClick={() => handleTierSelect(tier.id)}
                      selected={selectedTierId === tier.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Selected Tier Display */}
            {selectedTier && (
              <div className={`mb-8 p-4 ${isDark ? 'bg-[#800020]/10 border-[#800020]/30' : 'bg-[#800020]/5 border-[#800020]/20'} border rounded-lg`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Selected membership: <span className="font-semibold">{selectedTier.name}</span> - ${(selectedTier.monthly_price_cents / 100).toFixed(2)}/month
                </p>
              </div>
            )}

            {/* Customer Information Section */}
            <div id="customer-form" className="mb-12">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>
                Your Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                    } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                    placeholder=""
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                    } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                    placeholder=""
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                    } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                    placeholder=""
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={customerData.address}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                    } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                    placeholder=""
                  />
                </div>
                
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
                    className={`w-full px-4 py-3 border rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                    } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                    placeholder=""
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                      className={`w-full px-4 py-3 border rounded-xl ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                      } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                      placeholder=""
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
                      className={`w-full px-4 py-3 border rounded-xl ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                      } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Wine Preferences (optional)
                  </label>
                  <textarea
                    name="winePreferences"
                    value={customerData.winePreferences}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                    } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                    placeholder=""
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
                    className={`w-full px-4 py-3 border rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'
                    } focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all duration-200`}
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`mb-6 p-4 ${isDark ? 'bg-red-900/20 border-red-800/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border rounded-lg text-sm`}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!selectedTierId || processingCheckout}
                className={`${
                  (!selectedTierId || processingCheckout)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#800020] hover:bg-[#600018]'
                } text-white px-12 py-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none inline-flex items-center`}
              >
                {processingCheckout ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>

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