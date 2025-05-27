import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Building2, Users, Calendar, DollarSign, ExternalLink } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: string;
  createdAt: string;
  adminUserId: string;
  memberCount: number;
  monthlyRevenue: number;
}

const BusinessManagement: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      // This would be a real API call in production
      // For now, we'll simulate the data
      setTimeout(() => {
        const mockBusinesses: Business[] = [
          {
            id: '1',
            name: 'Sophia\'s Wine Bar',
            email: 'admin@sophiaswine.com',
            subscriptionStatus: 'active',
            createdAt: '2024-01-15T10:30:00Z',
            adminUserId: 'user_123',
            memberCount: 45,
            monthlyRevenue: 1299.50
          },
          {
            id: '2',
            name: 'Vintage Cellars',
            email: 'manager@vintagecellars.com',
            subscriptionStatus: 'active',
            createdAt: '2024-02-03T14:20:00Z',
            adminUserId: 'user_456',
            memberCount: 23,
            monthlyRevenue: 899.00
          },
          {
            id: '3',
            name: 'Cork & Barrel',
            email: 'info@corkbarrel.com',
            subscriptionStatus: 'past_due',
            createdAt: '2024-01-28T09:15:00Z',
            adminUserId: 'user_789',
            memberCount: 67,
            monthlyRevenue: 2156.75
          }
        ];
        setBusinesses(mockBusinesses);
        setLoading(false);
      }, 1000);

    } catch (err: any) {
      console.error('Error loading businesses:', err);
      setError(err.message || 'Failed to load businesses');
      setLoading(false);
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
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-8 px-4 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600">Loading businesses...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Management</h1>
          <p className="text-gray-600">
            Manage all Club Cuvée business partners and their subscriptions
          </p>
        </div>

        {error && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-[#800020] mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#800020] mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {businesses.reduce((sum, b) => sum + b.memberCount, 0)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-[#800020] mr-4" />
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(businesses.reduce((sum, b) => sum + b.monthlyRevenue, 0))}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-[#800020] mr-4" />
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {businesses.filter(b => b.subscriptionStatus === 'active').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Business List */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Businesses</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
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
                {businesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {business.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {business.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(business.subscriptionStatus)}`}>
                        {business.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {business.memberCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(business.monthlyRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(business.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(`/club/${business.id}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Club
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BusinessManagement;