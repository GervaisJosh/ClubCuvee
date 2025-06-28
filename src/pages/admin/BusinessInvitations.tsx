import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Building2, Copy, Clock, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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
}

interface GeneratedInvitation {
  token: string;
  invitation_url: string;
  expires_at: string;
}

interface PricingTier {
  id: string;
  name: string;
  monthly_price_cents: number;
  stripe_product_id: string;
  stripe_price_id: string;
}

const BusinessInvitations: React.FC = () => {
  const { user, session } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [invites, setInvites] = useState<BusinessInvite[]>([]);
  const [formData, setFormData] = useState<InvitationFormData>({
    business_name: '',
    business_email: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedInvitation, setGeneratedInvitation] = useState<GeneratedInvitation | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    loadInvites();
  }, []);


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
        business_email: formData.business_email
      }, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.success) {
        setGeneratedInvitation(response.data);
        setFormData({ 
          business_name: '', 
          business_email: ''
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
    return 'Business chooses during setup';
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const isButtonDisabled = loading || !formData.business_name || !formData.business_email;

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Business Invitations</h1>
        <p className={isDark ? 'text-zinc-400' : 'text-gray-600'}>
          Generate private onboarding links for new business registrations. Businesses will choose their pricing tier during setup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Form */}
        <Card className={`p-6 ${isDark ? 'bg-zinc-900/50 backdrop-blur-sm border-zinc-800' : 'bg-white border-gray-200'} rounded-2xl`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <Plus className="w-5 h-5 mr-2" />
            Generate Business Invitation
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="business_name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Business Name *
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 ${
                  isDark 
                    ? 'bg-black border-zinc-700 text-white placeholder-zinc-500 focus:border-burgundy-500 focus:ring-burgundy-500/20' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-burgundy-600 focus:ring-burgundy-600/20'
                } rounded-lg transition-all duration-200`}
                placeholder="Enter business name"
              />
            </div>

            <div>
              <label htmlFor="business_email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Business Email *
              </label>
              <input
                type="email"
                id="business_email"
                name="business_email"
                value={formData.business_email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 ${
                  isDark 
                    ? 'bg-black border-zinc-700 text-white placeholder-zinc-500 focus:border-burgundy-500 focus:ring-burgundy-500/20' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-burgundy-600 focus:ring-burgundy-600/20'
                } rounded-lg transition-all duration-200`}
                placeholder="business@example.com"
              />
            </div>


            {error && (
              <div className={`p-3 ${
                isDark 
                  ? 'bg-red-900/20 border-red-800/30 text-red-400' 
                  : 'bg-red-50 border-red-200 text-red-600'
              } border rounded-md`}>
                <p className="text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full py-3 px-4 text-white rounded-lg font-semibold transition-all duration-300 transform hover:translateY(-1px) disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none`}
              style={{ 
                backgroundColor: isButtonDisabled ? 'rgba(220, 20, 60, 0.5)' : '#DC143C'
              }}
              onMouseEnter={(e) => !isButtonDisabled && (e.currentTarget.style.backgroundColor = '#B91C3C')}
              onMouseLeave={(e) => !isButtonDisabled && (e.currentTarget.style.backgroundColor = '#DC143C')}
            >
              {loading ? 'Generating...' : 'GENERATE BUSINESS INVITATION LINK'}
            </button>
          </form>
        </Card>

        {/* Generated Invitation */}
        <Card className={`p-6 ${isDark ? 'bg-zinc-900/50 backdrop-blur-sm border-zinc-800' : 'bg-white border-gray-200'} rounded-2xl`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Generated Invitation
          </h2>
          
          {generatedInvitation ? (
            <div className="space-y-4">
              <div className={`p-4 ${
                isDark 
                  ? 'bg-green-900/20 border-green-800/30 text-green-400' 
                  : 'bg-green-50 border-green-200 text-green-700'
              } border rounded-md`}>
                <p className="text-sm font-medium mb-2">
                  Business invitation generated successfully!
                </p>
                <div className="space-y-1 text-xs">
                  <p><strong>Token:</strong> {generatedInvitation.token}</p>
                  <p><strong>Expires:</strong> {formatDate(generatedInvitation.expires_at)}</p>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Private Business Onboarding Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={generatedInvitation.invitation_url}
                    readOnly
                    className={`flex-1 px-3 py-2 ${
                      isDark 
                        ? 'bg-black border-zinc-700 text-zinc-300' 
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    } border rounded-l-md text-sm`}
                  />
                  <button
                    onClick={() => copyToClipboard(generatedInvitation.invitation_url, generatedInvitation.token)}
                    style={{ backgroundColor: '#DC143C' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B91C3C')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#DC143C')}
                    className="px-3 py-2 rounded-r-md text-white transition-all duration-300 transform hover:translateY(-1px) flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copySuccess === generatedInvitation.token ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className={`p-3 ${
                isDark 
                  ? 'bg-blue-900/20 border-blue-800/30 text-blue-400' 
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              } border rounded-md`}>
                <p className="text-sm">
                  <Clock className="w-4 h-4 inline mr-1" />
                  <strong>Business Onboarding Process:</strong>
                </p>
                <ol className="text-xs mt-2 space-y-1 list-decimal list-inside">
                  <li>Send this link to the business owner</li>
                  <li>Business owner creates account and sets up business profile</li>
                  <li>Business connects Stripe account for payments</li>
                  <li>Business configures membership tiers and wine inventory</li>
                  <li>Business can start inviting customers</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className={`text-center ${isDark ? 'text-zinc-500' : 'text-gray-500'} py-8`}>
              <Building2 className={`w-12 h-12 ${isDark ? 'text-zinc-600' : 'text-gray-400'} mx-auto mb-4`} />
              <p className="text-sm">
                Generate a business invitation link to get started.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Invitations List */}
      <Card className={`p-6 ${isDark ? 'bg-zinc-900/50 backdrop-blur-sm border-zinc-800' : 'bg-white border-gray-200'} rounded-2xl`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
          <Calendar className="w-5 h-5 mr-2" />
          All Business Invitations
        </h2>
        
        {loadingInvites ? (
          <div className="text-center py-8">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-burgundy-500' : 'border-burgundy-600'} mx-auto`}></div>
            <p className={`${isDark ? 'text-zinc-500' : 'text-gray-500'} mt-2`}>Loading invitations...</p>
          </div>
        ) : invites.length === 0 ? (
          <div className={`text-center ${isDark ? 'text-zinc-500' : 'text-gray-500'} py-8`}>
            <Building2 className={`w-12 h-12 ${isDark ? 'text-zinc-600' : 'text-gray-400'} mx-auto mb-4`} />
            <p className="text-sm">No business invitations generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isDark ? 'divide-zinc-800' : 'divide-gray-200'}`}>
              <thead className={isDark ? 'bg-zinc-900/80' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Business Name
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Email
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Tier
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Token
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'divide-y divide-zinc-800 bg-zinc-900/30' : 'divide-y divide-gray-200 bg-white'}`}>
                {invites.map((invite) => (
                  <tr key={invite.token}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {invite.business_name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                      {invite.business_email}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                      {getTierLabel(invite.pricing_tier)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                      <button
                        onClick={() => copyToClipboard(getInviteUrl(invite.token), invite.token)}
                        className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} cursor-pointer`}
                        title="Click to copy link"
                      >
                        {invite.token.slice(0, 8)}...
                        {copySuccess === invite.token && (
                          <span className={`ml-2 text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>Copied!</span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invite.used ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDark 
                            ? 'bg-green-900/20 text-green-400 border-green-800/30' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        } border`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Used
                        </span>
                      ) : isExpired(invite.expires_at) ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDark 
                            ? 'bg-red-900/20 text-red-400 border-red-800/30' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        } border`}>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Expired
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDark 
                            ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800/30' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        } border`}>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
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
      <div className={`mt-8 p-6 rounded-2xl shadow-sm transition-all duration-200 ${
        isDark 
          ? 'bg-zinc-900/50 backdrop-blur-sm border border-zinc-800' 
          : 'bg-white border border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>How Business Invitations Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`w-12 h-12 ${
              isDark 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-red-100 text-red-600'
            } rounded-full flex items-center justify-center mx-auto mb-4 font-bold`}>
              1
            </div>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Generate Link</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create a secure invitation with optional pricing tier suggestion.</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 ${
              isDark 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-red-100 text-red-600'
            } rounded-full flex items-center justify-center mx-auto mb-4 font-bold`}>
              2
            </div>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Business Setup</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Business owner creates account and completes business profile.</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 ${
              isDark 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-red-100 text-red-600'
            } rounded-full flex items-center justify-center mx-auto mb-4 font-bold`}>
              3
            </div>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Stripe Integration</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Business connects Stripe account for payment processing.</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 ${
              isDark 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-red-100 text-red-600'
            } rounded-full flex items-center justify-center mx-auto mb-4 font-bold`}>
              4
            </div>
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Launch Club</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Business configures tiers, uploads inventory, and invites customers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInvitations;