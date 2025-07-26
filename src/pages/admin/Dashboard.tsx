import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Wine, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Star,
  LogOut,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalWines: number;
  totalMembers: number;
  monthlyRevenue: number;
  avgRating: number;
  activeBusinesses: number;
  pendingShipments: number;
}

interface ActivityItem {
  id: string;
  type: 'new_member' | 'new_wine' | 'new_order';
  title: string;
  description: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    setUserEmail(user.email || '');
  };

  const loadDashboardData = async () => {
    // Simulate data loading with mock data
    setTimeout(() => {
      setStats({
        totalWines: 127,
        totalMembers: 342,
        monthlyRevenue: 48500,
        avgRating: 4.7,
        activeBusinesses: 12,
        pendingShipments: 23
      });

      setRecentActivity([
        {
          id: '1',
          type: 'new_member',
          title: 'New Member Joined',
          description: 'The French Laundry joined the wine club',
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          type: 'new_wine',
          title: 'New Wine Added',
          description: '2019 Château Margaux added to portfolio',
          timestamp: '5 hours ago'
        },
        {
          id: '3',
          type: 'new_order',
          title: 'New Order Placed',
          description: 'Chez Panisse ordered 12 bottles',
          timestamp: '1 day ago'
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wine className="h-8 w-8 text-amber-400 mr-3" />
              <h1 className="text-xl font-bold text-gray-100">Club Cuvée Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-100">Dashboard</h2>
          <p className="text-gray-400 mt-1">Welcome back to your Club Cuvée admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Wines */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Wines</p>
                <p className="text-2xl font-semibold text-gray-100 mt-1">
                  {stats?.totalWines}
                </p>
              </div>
              <Wine className="h-8 w-8 text-amber-400" />
            </div>
          </div>

          {/* Total Members */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Wine Club Members</p>
                <p className="text-2xl font-semibold text-gray-100 mt-1">
                  {stats?.totalMembers}
                </p>
              </div>
              <Users className="h-8 w-8 text-amber-400" />
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-100 mt-1">
                  {formatCurrency(stats?.monthlyRevenue || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Wine Rating</p>
                <p className="text-2xl font-semibold text-gray-100 mt-1">
                  {stats?.avgRating}
                  <span className="text-lg text-gray-400 ml-1">/ 5</span>
                </p>
              </div>
              <Star className="h-8 w-8 text-amber-400" />
            </div>
          </div>

          {/* Active Businesses */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Businesses</p>
                <p className="text-2xl font-semibold text-gray-100 mt-1">
                  {stats?.activeBusinesses}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          {/* Pending Shipments */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Shipments</p>
                <p className="text-2xl font-semibold text-gray-100 mt-1">
                  {stats?.pendingShipments}
                </p>
              </div>
              <Package className="h-8 w-8 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-amber-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-100">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'new_member' && (
                    <Users className="h-5 w-5 text-green-400" />
                  )}
                  {activity.type === 'new_wine' && (
                    <Wine className="h-5 w-5 text-amber-400" />
                  )}
                  {activity.type === 'new_order' && (
                    <Package className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-100 text-sm font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm">{activity.description}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;