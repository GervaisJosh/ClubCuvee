import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Building2, Copy, Clock, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react';

interface BusinessInvite {
  token: string;
  business_name: string;
  business_email: string;
  pricing_tier: string | null;
  used: boolean;
  created_at: string;
  expires_at: string;
  business_id: string | null;
}

interface InvitationFormData {
  business_name: string;
  business_email: string;
  pricing_tier: string;
}

interface GeneratedInvitation {
  token: string;
  invitation_url: string;
  expires_at: string;
}

interface PricingTier {
  id: string;
  name: string;
  price_cents: number;
  stripe_product_id: string;
  stripe_price_id: string;
}

const BusinessInvitations: React.FC = () => {
  const { user, session } = useAuth();
  const [invites, setInvites] = useState<BusinessInvite[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [formData, setFormData] = useState<InvitationFormData>({
    business_name: '',
    business_email: '',
    pricing_tier: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedInvitation, setGeneratedInvitation] = useState<GeneratedInvitation | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    loadInvites();
    loadPricingTiers();
  }, []);

  const loadPricingTiers = async () => {
    try {
      setLoadingTiers(true);
      const { data: tiersData, error } = await supabase.rpc('get_active_business_pricing_tiers');
      
      if (error) {
        console.error('Error loading pricing tiers:', error);
        setError('Failed to load pricing tiers');
      } else {
        setPricingTiers(tiersData || []);
      }
    } catch (err) {
      console.error('Error loading pricing tiers:', err);
      setError('Failed to load pricing tiers');
    } finally {
      setLoadingTiers(false);
    }
  };

  const loadInvites = async () => {
    try {
      setLoadingInvites(true);
      const { data: inviteData, error } = await supabase
        .from('business_invites')
        .select('token, business_name, business_email, pricing_tier, used, created_at, expires_at, business_id')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading business invites:', error);
        setError('Failed to load business invitations');
      } else {
        setInvites(inviteData || []);
      }
    } catch (err) {
      console.error('Error loading business invites:', err);
      setError('Failed to load business invitations');
    } finally {
      setLoadingInvites(false);
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
    
    setLoading(true);
    setError(null);
    setGeneratedInvitation(null);

    try {
      if (!session?.access_token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await apiClient.post<{
        success: boolean;
        data: GeneratedInvitation;
      }>('/api/generate-business-invitation', {
        business_name: formData.business_name,
        business_email: formData.business_email,
        pricing_tier: formData.pricing_tier || null
      }, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.success) {
        setGeneratedInvitation(response.data);
        setFormData({ 
          business_name: '', 
          business_email: '', 
          pricing_tier: '' 
        });
        // Reload invites to show the new one
        await loadInvites();
      } else {
        setError('Failed to generate business invitation');
      }
    } catch (err: any) {
      console.error('Error generating invitation:', err);
      setError(err.message || 'Failed to generate business invitation');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (url: string, token: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(token);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInviteUrl = (token: string) => {
    return `${window.location.origin}/join/${token}`;
  };

  const getTierLabel = (tier: string | null) => {
    if (!tier) return 'Any Tier';
    const tierOption = pricingTiers.find(t => t.id === tier);
    return tierOption ? tierOption.name : tier;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Invitations</h1>
        <p className="text-gray-600">
          Generate private onboarding links for new business registrations with optional pricing tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Generate Business Invitation
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                placeholder="Enter business name"
              />
            </div>

            <div>
              <label htmlFor="business_email" className="block text-sm font-medium text-gray-700 mb-2">
                Business Email *
              </label>
              <input
                type="email"
                id="business_email"
                name="business_email"
                value={formData.business_email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                placeholder="business@example.com"
              />
            </div>

            <div>
              <label htmlFor="pricing_tier" className="block text-sm font-medium text-gray-700 mb-2">
                Suggested Pricing Tier (Optional)
              </label>
              <select
                id="pricing_tier"
                name="pricing_tier"
                value={formData.pricing_tier}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              >
                <option value="">Let business choose during setup</option>
                {pricingTiers.map(tier => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name} - ${(tier.price_cents / 100).toFixed(0)}/month
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Business can still select a different tier during onboarding
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
              disabled={loading || !formData.business_name || !formData.business_email}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Generate Business Invitation Link'}
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
                  Business invitation generated successfully!
                </p>
                <div className="space-y-1 text-xs text-green-700">
                  <p><strong>Token:</strong> {generatedInvitation.token}</p>
                  <p><strong>Expires:</strong> {formatDate(generatedInvitation.expires_at)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Private Business Onboarding Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={generatedInvitation.invitation_url}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-md text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(generatedInvitation.invitation_url, generatedInvitation.token)}
                    size="sm"
                    className="rounded-l-none"
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess === generatedInvitation.token ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  <strong>Business Onboarding Process:</strong>
                </p>
                <ol className="text-xs text-blue-600 mt-2 space-y-1 list-decimal list-inside">
                  <li>Send this link to the business owner</li>
                  <li>Business owner creates account and sets up business profile</li>
                  <li>Business connects Stripe account for payments</li>
                  <li>Business configures membership tiers and wine inventory</li>
                  <li>Business can start inviting customers</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm">
                Generate a business invitation link to get started.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Invitations List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          All Business Invitations
        </h2>
        
        {loadingInvites ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020] mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading invitations...</p>
          </div>
        ) : invites.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm">No business invitations generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invites.map((invite) => (
                  <tr key={invite.token}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invite.business_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invite.business_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTierLabel(invite.pricing_tier)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      <button
                        onClick={() => copyToClipboard(getInviteUrl(invite.token), invite.token)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Click to copy link"
                      >
                        {invite.token.slice(0, 8)}...
                        {copySuccess === invite.token && (
                          <span className="ml-2 text-xs text-green-600">Copied!</span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invite.used ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Used
                        </span>
                      ) : isExpired(invite.expires_at) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invite.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How Business Invitations Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Generate Link</h3>
            <p className="text-gray-600">Create a secure invitation with optional pricing tier suggestion.</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Business Setup</h3>
            <p className="text-gray-600">Business owner creates account and completes business profile.</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Stripe Integration</h3>
            <p className="text-gray-600">Business connects Stripe account for payment processing.</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
              4
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Launch Club</h3>
            <p className="text-gray-600">Business configures tiers, uploads inventory, and invites customers.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BusinessInvitations;