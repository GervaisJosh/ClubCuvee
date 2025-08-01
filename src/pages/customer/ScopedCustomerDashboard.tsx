import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Wine, Calendar, Star, Gift, CreditCard, User, Building2 } from 'lucide-react';

interface CustomerProfile {
  id: string;
  businessId: string;
  businessName: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

interface CustomerMembership {
  id: string;
  tierId: string;
  tierName: string;
  tierDescription: string;
  status: string;
  stripeSubscriptionId: string;
  createdAt: string;
}

interface BusinessInfo {
  id: string;
  name: string;
  email: string;
}

const ScopedCustomerDashboard: React.FC = () => {
  const { user, signOut, userType } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [membership, setMembership] = useState<CustomerMembership | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is a business user and redirect
    if (userType === 'business') {
      console.log('Business user detected on customer dashboard, redirecting to business dashboard');
      navigate('/business/dashboard');
      return;
    }
    
    if (user) {
      loadCustomerData();
    }
  }, [user, userType, navigate]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load customer profile using auth user
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_id', user!.id)
        .single();

      if (customerError) {
        throw new Error('Could not load customer data: ' + customerError.message);
      }

      if (!customerData) {
        throw new Error('Customer record not found. You may not have access to any business.');
      }

      // Load business data separately
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, email')
        .eq('id', customerData.business_id)
        .single();

      if (businessError) {
        throw new Error('Could not load business data: ' + businessError.message);
      }

      // Load membership tier data separately
      let tierData = null;
      if (customerData.tier_id) {
        const { data: tier, error: tierError } = await supabase
          .from('membership_tiers')
          .select('id, name, description')
          .eq('id', customerData.tier_id)
          .single();
        
        if (!tierError && tier) {
          tierData = tier;
        }
      }

      // Combine the data
      const membershipData = {
        ...customerData,
        businesses: businessData,
        membership_tiers: tierData
      };

      if (!businessData) {
        throw new Error('Business not found.');
      }

      // Create profile from user auth info and membership data
      const customerProfile: CustomerProfile = {
        id: user!.id,
        businessId: membershipData.business_id,
        businessName: membershipData.businesses.name,
        email: user!.email || '',
        firstName: user?.user_metadata?.first_name || null,
        lastName: user?.user_metadata?.last_name || null,
        phone: user?.user_metadata?.phone || null
      };

      setProfile(customerProfile);
      setBusinessInfo({
        id: membershipData.businesses.id,
        name: membershipData.businesses.name,
        email: membershipData.businesses.email
      });

      // Set membership data
      const customerMembership: CustomerMembership = {
        id: membershipData.id,
        tierId: membershipData.tier_id || '',
        tierName: membershipData.membership_tiers?.name || 'Unknown Tier',
        tierDescription: membershipData.membership_tiers?.description || '',
        status: membershipData.subscription_status || 'inactive',
        stripeSubscriptionId: membershipData.stripe_subscription_id || '',
        createdAt: membershipData.created_at
      };

      setMembership(customerMembership);

    } catch (err: any) {
      console.error('Error loading customer data:', err);
      setError(err.message || 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err: any) {
      console.error('Error signing out:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'canceled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading your membership...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center">
          <Wine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Error</h1>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to access your membership. You may not have permission to view this content.'}
          </p>
          <div className="space-y-2">
            <Button onClick={handleSignOut} variant="secondary" className="w-full">
              Sign Out
            </Button>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#800020] to-[#600018] text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile.firstName || 'Member'}!
              </h1>
              <p className="text-white/90 flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                {profile.businessName} Wine Club
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="secondary"
              size="sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Membership Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Membership</h2>
                <Wine className="h-6 w-6 text-[#800020]" />
              </div>
              
              {membership ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {membership.tierName}
                    </h3>
                    <p className="text-gray-600">{membership.tierDescription}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(membership.status)}`}>
                      {membership.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Member since:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(membership.createdAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Active Membership
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have an active membership yet.
                  </p>
                  <Button size="sm">
                    Contact {profile.businessName}
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                <User className="h-6 w-6 text-[#800020]" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p className="text-gray-900">
                    {profile.firstName && profile.lastName 
                      ? `${profile.firstName} ${profile.lastName}`
                      : 'Not provided'
                    }
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Phone:</span>
                  <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Wine Club:</span>
                  <p className="text-gray-900">{profile.businessName}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="secondary" size="sm" className="w-full">
                  Update Profile
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="secondary" className="flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                View Upcoming Deliveries
              </Button>
              
              <Button variant="secondary" className="flex items-center justify-center">
                <Star className="w-4 h-4 mr-2" />
                Rate Recent Wines
              </Button>
              
              <Button variant="secondary" className="flex items-center justify-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </Card>

          {/* Contact Information */}
          {businessInfo && (
            <Card className="mt-8 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                Have questions about your membership or wine selections? Contact {businessInfo.name} directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = `mailto:${businessInfo.email}`}
                >
                  Email {businessInfo.name}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScopedCustomerDashboard;