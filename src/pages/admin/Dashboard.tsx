import React, { useState, useEffect } from 'react';
import { BarChart2, Users, Wine, Calendar, Database, Link as LinkIcon, FileText, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import DefaultText from '../../components/DefaultText';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { AdminGuard } from '../../lib/auth/AdminGuard';
import { MembershipTier } from '../../types/onboarding';

interface RestaurantInvite {
  id: string;
  token: string;
  email: string;
  restaurant_name: string;
  invited_by: string;
  website?: string;
  tier: MembershipTier;
  status: 'pending' | 'in_progress' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
}

interface NewInviteForm {
  restaurantName: string;
  email: string;
  invitedBy: string;
  website?: string;
  tier: MembershipTier;
}

interface StatItem {
  label: string;
  value: string;
  icon: React.ComponentType;
  color: string;
}

interface QuickAction {
  name: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  path: string;
}

interface RecentActivity {
  action: string;
  name: string;
  time: string;
}

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";
  const [invites, setInvites] = useState<RestaurantInvite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewInviteForm>({
    restaurantName: '',
    email: '',
    invitedBy: '',
    website: '',
    tier: 'basic',
  });

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invites');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('restaurant_invites')
        .insert([{
          ...formData,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        }])
        .select()
        .single();

      if (error) throw error;

      setInvites([data, ...invites]);
      setFormData({
        restaurantName: '',
        email: '',
        invitedBy: '',
        website: '',
        tier: 'basic',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (invite: RestaurantInvite) => {
    setLoading(true);
    setError(null);

    try {
      // Here you would typically call your email service
      // For now, we'll just update the expiry date
      const { error } = await supabase
        .from('restaurant_invites')
        .update({
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', invite.id);

      if (error) throw error;

      // Refresh the list
      fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend invite');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/onboarding/${token}`;
    navigator.clipboard.writeText(link);
  };

  const stats = [
    { label: 'Active Businesses', value: '12', icon: Building2, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: '$12,450', icon: BarChart2, color: 'bg-green-500' },
    { label: 'Total Wine Selections', value: '347', icon: Wine, color: `bg-[${burgundy}]` },
    { label: 'Upcoming Events', value: '8', icon: Calendar, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { 
      name: "Onboarding Tester", 
      description: "Test restaurant onboarding flow", 
      icon: Database,
      color: burgundy,
      path: "/admin/onboarding-tester"
    },
    { 
      name: "System Diagnostics", 
      description: "Test auth, stats & recommendations", 
      icon: FileText,
      color: "#3B82F6", // Blue
      path: "/admin/diagnostics"
    },
    { 
      name: "Manage Businesses", 
      description: "View and edit restaurant details", 
      icon: Building2,
      color: burgundy,
      path: "/admin/businesses"
    },
    { 
      name: "Revenue & Reports", 
      description: "View platform analytics", 
      icon: BarChart2,
      color: burgundy,
      path: "/admin/revenue"
    }
  ];

  const recentActivities = [
    { action: 'New business registered', name: 'Urban Cellar', time: '2 hours ago' },
    { action: 'Payment received', name: 'Wine & Dine NYC', time: '5 hours ago' },
    { action: 'New customer signup', name: 'via Vineyard Bistro', time: '1 day ago' },
    { action: 'Business subscription upgraded', name: 'The Wine Room', time: '2 days ago' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Invite</h2>
            <form onSubmit={handleCreateInvite} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Invited By
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invitedBy}
                    onChange={(e) => setFormData({ ...formData, invitedBy: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tier
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as MembershipTier })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Invite'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Restaurant Invites</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invite.restaurant_name}
                        </div>
                        {invite.website && (
                          <div className="text-sm text-gray-500">
                            <a
                              href={invite.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary"
                            >
                              {invite.website}
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invite.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {invite.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invite.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : invite.status === 'expired'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invite.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invite.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => copyInviteLink(invite.token)}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          Copy Link
                        </button>
                        {invite.status === 'pending' && (
                          <button
                            onClick={() => handleResendInvite(invite)}
                            className="text-primary hover:text-primary-dark"
                          >
                            Resend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;