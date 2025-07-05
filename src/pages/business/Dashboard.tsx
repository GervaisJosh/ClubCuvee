import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart2, Users, Wine, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';

const BusinessDashboard: React.FC = () => {
  const { userProfile, user } = useAuth();
  
  // Extract restaurant name from user metadata or profile
  const restaurantName = user?.user_metadata?.restaurant_name || userProfile?.restaurant_name || 'Your Restaurant';

  const stats = [
    { label: 'Club Members', value: '38', icon: Users, color: 'bg-blue-500' },
    { label: 'Monthly Revenue', value: '$2,450', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Wine Inventory', value: '124', icon: Wine, color: 'bg-[#800020]' },
    { label: 'Pending Orders', value: '5', icon: Package, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'HV Florentino' }}>Welcome to {restaurantName}'s Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your wine club, track membership, and grow your recurring revenue with Club Cuvée.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className={`${stat.color} rounded-full p-3 mr-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'HV Florentino' }}>Revenue Trends</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Revenue chart will appear here</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'HV Florentino' }}>Membership Growth</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Membership growth chart will appear here</p>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'HV Florentino' }}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="/business/wines"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="mr-4 p-2 bg-[#872657] bg-opacity-10 rounded-md">
              <Wine className="h-5 w-5 text-[#872657]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Manage Inventory</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update your wine list</p>
            </div>
          </a>
          
          <a 
            href="/business/customers"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="mr-4 p-2 bg-blue-500 bg-opacity-10 rounded-md">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">View Members</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage club members</p>
            </div>
          </a>
          
          <a 
            href="/business/orders"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="mr-4 p-2 bg-orange-500 bg-opacity-10 rounded-md">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Process Orders</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Handle pending orders</p>
            </div>
          </a>
          
          <a 
            href="/business/analytics"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <div className="mr-4 p-2 bg-green-500 bg-opacity-10 rounded-md">
              <BarChart2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View detailed metrics</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'HV Florentino' }}>Recent Activities</h3>
        <div className="space-y-4">
          {[
            { action: 'New member joined', name: 'Emma Thompson', time: '2 hours ago' },
            { action: 'Monthly subscription payment', name: 'James Wilson', time: '5 hours ago' },
            { action: 'Wine pickup', name: 'Sarah Johnson', time: '1 day ago' },
            { action: 'Tasting event registration', name: 'Michael Brown', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.name}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;