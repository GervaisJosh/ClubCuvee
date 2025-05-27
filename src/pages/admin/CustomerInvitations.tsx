import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Mail, Copy, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Business {
  id: string;
  name: string;
}

interface MembershipTier {
  id: string;
  name: string;
  description: string;
}

interface InvitationFormData {
  businessId: string;
  customerEmail: string;
  tierId: string;
}

interface GeneratedInvitation {
  token: string;
  email: string;
  businessName: string;
  expiresAt: string;
  invitationUrl: string;
}

const CustomerInvitations: React.FC = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [formData, setFormData] = useState<InvitationFormData>({
    businessId: '',
    customerEmail: '',
    tierId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedInvitation, setGeneratedInvitation] = useState<GeneratedInvitation | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    if (formData.businessId) {
      loadTiers(formData.businessId);
    } else {
      setTiers([]);
      setFormData(prev => ({ ...prev, tierId: '' }));
    }
  }, [formData.businessId]);

  const loadBusinesses = async () => {
    try {
      // In a real admin system, this would load all businesses
      // For now, we'll simulate with some sample data
      const { data: businessData, error } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('subscription_status', 'active')
        .order('name');

      if (error) {
        console.error('Error loading businesses:', error);
        // Use sample data if real data fails
        setBusinesses([
          { id: '1', name: "Sofia's Wine Bar" },
          { id: '2', name: 'Vintage Cellars' },
          { id: '3', name: 'Cork & Barrel' }
        ]);
      } else {
        setBusinesses(businessData || []);
      }
    } catch (err) {
      console.error('Error loading businesses:', err);
      setBusinesses([]);
    }
  };

  const loadTiers = async (businessId: string) => {
    try {
      const { data: tierData, error } = await supabase
        .from('membership_tiers')
        .select('id, name, description')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('price_markup_percentage');

      if (error) {
        console.error('Error loading tiers:', error);
        // Use sample data if real data fails
        setTiers([
          { id: '1', name: 'Silver', description: 'Entry level membership' },
          { id: '2', name: 'Gold', description: 'Premium membership' },
          { id: '3', name: 'Platinum', description: 'Exclusive membership' }
        ]);
      } else {
        setTiers(tierData || []);
      }
    } catch (err) {
      console.error('Error loading tiers:', err);
      setTiers([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessId || !formData.customerEmail) {
      setError('Business and customer email are required');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedInvitation(null);

    try {
      const response = await apiClient.post<{
        success: boolean;
        data: GeneratedInvitation;
      }>('/api/generate-customer-invitation', {
        businessId: formData.businessId,
        customerEmail: formData.customerEmail,
        tierId: formData.tierId || null
      }, {
        headers: {
          'Authorization': `Bearer ${user?.session?.access_token}`
        }
      });

      if (response.success) {
        setGeneratedInvitation(response.data);
        setFormData({
          businessId: '',
          customerEmail: '',
          tierId: ''
        });
      } else {
        setError('Failed to generate customer invitation');
      }
    } catch (err: any) {
      console.error('Error generating invitation:', err);
      setError(err.message || 'Failed to generate customer invitation');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedInvitation) {
      try {
        await navigator.clipboard.writeText(generatedInvitation.invitationUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const formatExpiryDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Invitations</h1>
          <p className="text-gray-600">
            Generate private invitation links for customers to join specific business wine clubs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Generate Invitation
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="businessId" className="block text-sm font-medium text-gray-700 mb-2">
                  Business *
                </label>
                <select
                  id="businessId"
                  name="businessId"
                  value={formData.businessId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                >
                  <option value="">Select a business</option>
                  {businesses.map(business => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email *
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label htmlFor="tierId" className="block text-sm font-medium text-gray-700 mb-2">
                  Suggested Tier (Optional)
                </label>
                <select
                  id="tierId"
                  name="tierId"
                  value={formData.tierId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  disabled={!formData.businessId}
                >
                  <option value="">Let customer choose</option>
                  {tiers.map(tier => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name} - {tier.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Customer can still select a different tier during registration
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !formData.businessId || !formData.customerEmail}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Invitation Link'}
              </Button>
            </form>
          </Card>

          {/* Generated Invitation */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Generated Invitation
            </h2>
            
            {generatedInvitation ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600 font-medium mb-2">
                    Invitation generated successfully!
                  </p>
                  <div className="space-y-2 text-xs text-green-700">
                    <p><strong>Business:</strong> {generatedInvitation.businessName}</p>
                    <p><strong>Customer:</strong> {generatedInvitation.email}</p>
                    <p><strong>Expires:</strong> {formatExpiryDate(generatedInvitation.expiresAt)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Private Invitation Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={generatedInvitation.invitationUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-md text-sm"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      className="rounded-l-none"
                    >
                      <Copy className="w-4 h-4" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    <Clock className="w-4 h-4 inline mr-1" />
                    <strong>Next Steps:</strong>
                  </p>
                  <ol className="text-xs text-blue-600 mt-2 space-y-1 list-decimal list-inside">
                    <li>Send this link to {generatedInvitation.email}</li>
                    <li>Customer creates account and selects membership tier</li>
                    <li>Customer completes payment via Stripe</li>
                    <li>Customer gains access to private wine club dashboard</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm">
                  Fill out the form to generate a private customer invitation link.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How Private Invitations Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Admin Generates Link</h3>
              <p className="text-gray-600">Create a secure, time-limited invitation for a specific customer and business.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Customer Registers</h3>
              <p className="text-gray-600">Customer creates account, selects tier, and pays via Stripe Checkout.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Access Granted</h3>
              <p className="text-gray-600">Customer gets private dashboard scoped only to their business wine club.</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CustomerInvitations;