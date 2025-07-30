import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import { 
  Wine, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Star,
  Activity,
  Zap,
  AlertCircle,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  LogOut,
  Sun,
  Moon,
  CircleDollarSign,
  UserPlus
} from 'lucide-react';

interface BentoBoxProps {
  size?: 'small' | 'medium' | 'large' | 'tall';
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const BentoBox: React.FC<BentoBoxProps> = ({ 
  size = 'medium',
  icon: Icon, 
  title, 
  children,
  className = ''
}) => {
  const { theme } = useTheme();
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-2',
    large: 'col-span-3',
    tall: 'col-span-2 row-span-2'
  };

  return (
    <div className={`
      ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/90'} 
      backdrop-blur-sm border 
      ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} 
      rounded-xl p-6 
      ${theme === 'dark' ? 'hover:border-gray-700' : 'hover:border-gray-300'} 
      transition-all duration-300
      ${sizeClasses[size]}
      ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-lg">
            <Icon className="w-6 h-6 text-amber-400" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

interface WineItem {
  id: string;
  name: string;
  type: string;
  vintage: string;
  rating: number;
  stock: number;
  image?: string;
}

interface ActivityItem {
  id: string;
  type: 'new_member' | 'new_order' | 'wine_rating' | 'low_stock';
  title: string;
  description: string;
  timestamp: string;
}

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, user, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [wines, setWines] = useState<WineItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  const businessName = userProfile?.name || user?.user_metadata?.restaurant_name || userProfile?.restaurant_name || 'Your Business';

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/business/login');
      return;
    }
  };

  const loadDashboardData = async () => {
    // Simulate data loading with mock data
    setTimeout(() => {
      setWines([
        { id: '1', name: '2019 Château Margaux', type: 'Bordeaux Blend', vintage: '2019', rating: 4.8, stock: 12, image: '/images/wine-1.jpg' },
        { id: '2', name: '2018 Opus One', type: 'Cabernet Sauvignon', vintage: '2018', rating: 4.9, stock: 3, image: '/images/wine-2.jpg' },
        { id: '3', name: '2020 Cloudy Bay', type: 'Sauvignon Blanc', vintage: '2020', rating: 4.5, stock: 24, image: '/images/wine-3.jpg' },
        { id: '4', name: '2017 Domaine Romanée-Conti', type: 'Pinot Noir', vintage: '2017', rating: 5.0, stock: 2, image: '/images/wine-4.jpg' },
      ]);

      setActivities([
        { id: '1', type: 'new_member', title: 'New Member Joined', description: 'Sarah Mitchell subscribed to Gold tier', timestamp: '2 hours ago' },
        { id: '2', type: 'new_order', title: 'New Order Placed', description: 'Order #1247 - 6 bottles', timestamp: '4 hours ago' },
        { id: '3', type: 'wine_rating', title: 'Wine Rated', description: '2019 Château Margaux received 5 stars', timestamp: '6 hours ago' },
        { id: '4', type: 'low_stock', title: 'Low Stock Alert', description: '2018 Opus One - Only 3 bottles left', timestamp: '1 day ago' },
        { id: '5', type: 'new_member', title: 'New Member Joined', description: 'Michael Chen subscribed to Platinum tier', timestamp: '2 days ago' },
      ]);

      setLoading(false);
    }, 1500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/business/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading || authLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Navigation Header */}
      <nav className={`border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/90'} backdrop-blur-sm sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'} tracking-wider`}>
                {businessName} • Club Cuvée
              </h1>
              <div className="hidden md:flex space-x-6">
                <a href="/business/dashboard" className="text-amber-400 border-b-2 border-amber-400 pb-1">
                  Dashboard
                </a>
                <a href="/business/inventory" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Inventory
                </a>
                <a href="/business/members" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Members
                </a>
                <a href="/business/analytics" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Analytics
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} px-4 py-2 rounded-lg transition-colors`}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Wine Inventory Overview - Large Box */}
          <BentoBox size="large" title="Wine Inventory" icon={Wine}>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className={`text-3xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>127</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total wines in portfolio</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    4 low stock
                  </p>
                </div>
              </div>
              
              {/* Mini Wine List */}
              <div className="space-y-3 mt-4">
                {wines.slice(0, 3).map((wine) => (
                  <div key={wine.id} className={`flex items-center space-x-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg flex items-center justify-center">
                      <Wine className="h-6 w-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{wine.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-amber-400 fill-current" />
                          <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{wine.rating}</span>
                        </div>
                        <span className={`text-xs ${wine.stock <= 5 ? 'text-red-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {wine.stock} bottles
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Add New Wine</span>
              </button>
            </div>
          </BentoBox>

          {/* Quick Actions - Small Box */}
          <BentoBox size="small" title="Quick Actions" icon={Zap}>
            <div className="space-y-3">
              <button className={`w-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                <Wine className="h-4 w-4 text-amber-400" />
                <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Wine</span>
              </button>
              <button className={`w-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                <Package className="h-4 w-4 text-amber-400" />
                <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Process Orders</span>
              </button>
              <button className={`w-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                <BarChart2 className="h-4 w-4 text-amber-400" />
                <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>View Reports</span>
              </button>
              <button className={`w-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                <Users className="h-4 w-4 text-amber-400" />
                <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manage Tiers</span>
              </button>
            </div>
          </BentoBox>

          {/* Sales Metrics - Medium Box */}
          <BentoBox size="medium" title="Sales Metrics" icon={TrendingUp}>
            <div className="space-y-4">
              <div>
                <p className={`text-3xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(48500)}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Monthly recurring revenue</p>
                <p className="text-sm text-green-400 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12% from last month
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(3250)}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>This month</p>
                </div>
                <div>
                  <p className={`text-xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(142)}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg order value</p>
                </div>
              </div>
              
              {/* Mini Revenue Chart Placeholder */}
              <div className={`h-24 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-lg flex items-end justify-between px-4 pb-2`}>
                {[40, 65, 45, 80, 55, 70, 85].map((height, i) => (
                  <div
                    key={i}
                    className="w-4 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </BentoBox>

          {/* Wine Club Members - Medium Box */}
          <BentoBox size="medium" title="Wine Club Members" icon={Users}>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className={`text-3xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>342</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total active members</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400 flex items-center">
                    <UserPlus className="h-4 w-4 mr-1" />
                    +23 this month
                  </p>
                </div>
              </div>
              
              {/* Member Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Gold Tier</span>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>156 members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Platinum Tier</span>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>124 members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Diamond Tier</span>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>62 members</span>
                </div>
              </div>
              
              {/* Recent Members */}
              <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg`}>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Recent members</p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-gray-900" />
                  ))}
                  <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full border-2 ${theme === 'dark' ? 'border-gray-900' : 'border-white'} flex items-center justify-center`}>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>+18</span>
                  </div>
                </div>
              </div>
            </div>
          </BentoBox>

          {/* Recent Activity - Tall Box */}
          <BentoBox size="tall" title="Recent Activity" icon={Activity}>
            <div className="space-y-3 overflow-y-auto max-h-[400px]">
              {activities.map((activity) => (
                <div key={activity.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} transition-all hover:scale-[1.02]`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'new_member' && (
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <UserPlus className="h-4 w-4 text-green-400" />
                        </div>
                      )}
                      {activity.type === 'new_order' && (
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Package className="h-4 w-4 text-blue-400" />
                        </div>
                      )}
                      {activity.type === 'wine_rating' && (
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Star className="h-4 w-4 text-amber-400" />
                        </div>
                      )}
                      {activity.type === 'low_stock' && (
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{activity.title}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{activity.description}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BentoBox>

          {/* Performance Metrics - Small Boxes */}
          <div className="col-span-1">
            <div className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/90'} backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-xl p-6 ${theme === 'dark' ? 'hover:border-gray-700' : 'hover:border-gray-300'} transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <Star className="h-5 w-5 text-amber-400" />
                <span className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4.7</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Wine Rating</p>
            </div>
          </div>

          <div className="col-span-1">
            <div className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/90'} backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-xl p-6 ${theme === 'dark' ? 'hover:border-gray-700' : 'hover:border-gray-300'} transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-green-400" />
                <span className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>92%</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Member Retention</p>
            </div>
          </div>

          <div className="col-span-1">
            <div className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/90'} backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-xl p-6 ${theme === 'dark' ? 'hover:border-gray-700' : 'hover:border-gray-300'} transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <Package className="h-5 w-5 text-blue-400" />
                <span className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>98%</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Fulfillment Rate</p>
            </div>
          </div>

          <div className="col-span-1">
            <div className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/90'} backdrop-blur-sm border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} rounded-xl p-6 ${theme === 'dark' ? 'hover:border-gray-700' : 'hover:border-gray-300'} transition-all duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4.9</span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Satisfaction Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;