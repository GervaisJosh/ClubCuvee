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
  UserPlus,
  CheckCircle
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
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-2',
    large: 'col-span-1 md:col-span-2 lg:col-span-3',
    tall: 'col-span-1 md:col-span-2 row-span-2'
  };

  return (
    <div className={`
      bg-[#1a1a1a] 
      border border-gray-800 
      rounded-2xl p-8 
      hover:border-gray-700 
      transition-all duration-300
      shadow-lg hover:shadow-xl
      ${sizeClasses[size]}
      ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-light text-white">
          {title}
        </h3>
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-[#722F37]/10 to-[#8B2635]/10 rounded-lg">
            <Icon className="w-6 h-6 text-[#A0303D]" />
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
  const [businessData, setBusinessData] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');
  const [realStats, setRealStats] = useState({
    totalWines: 0,
    totalMembers: 0,
    monthlyRevenue: 0,
    avgRating: 0,
    activeSubscriptions: 0,
    pendingOrders: 0
  });
  
  const businessName = userProfile?.name || user?.user_metadata?.restaurant_name || userProfile?.restaurant_name || 'Your Business';

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
  };

  const loadDashboardData = async () => {
    try {
      const businessId = userProfile?.business_id;
      
      if (!businessId) {
        console.error('No business ID found');
        setLoading(false);
        return;
      }

      // Get business data
      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();
      
      setBusinessData(business);

      // Fetch real wine count
      const { count: wineCount } = await supabase
        .from('wines')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId);

      // Fetch real members count
      const { count: memberCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId);

      // Fetch membership tiers with prices
      const { data: membershipTiers } = await supabase
        .from('membership_tiers')
        .select('monthly_price_cents')
        .eq('business_id', businessId);

      // Calculate average monthly revenue (simplified - assumes all members pay the average tier price)
      const avgTierPrice = membershipTiers?.length > 0 
        ? membershipTiers.reduce((sum, tier) => sum + (tier.monthly_price_cents / 100), 0) / membershipTiers.length
        : 0;
      const monthlyRevenue = (memberCount || 0) * avgTierPrice;

      // Fetch wines for ratings
      const { data: winesData } = await supabase
        .from('wines')
        .select('rating')
        .eq('business_id', businessId)
        .not('rating', 'is', null);

      const avgRating = winesData?.length > 0
        ? Math.round(winesData.reduce((sum, wine) => sum + (wine.rating || 0), 0) / winesData.length)
        : 0;

      // Set real stats
      setRealStats({
        totalWines: wineCount || 0,
        totalMembers: memberCount || 0,
        monthlyRevenue: Math.round(monthlyRevenue),
        avgRating: avgRating,
        activeSubscriptions: memberCount || 0, // Simplified - assuming all members are active
        pendingOrders: 0 // Would need orders table
      });

      // For display, still use some mock data for now
      setWines([
        { id: '1', name: '2019 Château Margaux', type: 'Bordeaux Blend', vintage: '2019', rating: 96, stock: 12, image: '/images/wine-1.jpg' },
        { id: '2', name: '2018 Opus One', type: 'Cabernet Sauvignon', vintage: '2018', rating: 98, stock: 3, image: '/images/wine-2.jpg' },
        { id: '3', name: '2020 Cloudy Bay', type: 'Sauvignon Blanc', vintage: '2020', rating: 90, stock: 24, image: '/images/wine-3.jpg' },
        { id: '4', name: '2017 Domaine Romanée-Conti', type: 'Pinot Noir', vintage: '2017', rating: 100, stock: 2, image: '/images/wine-4.jpg' },
      ]);

      setActivities([
        { id: '1', type: 'new_member', title: 'New Member Joined', description: 'Sarah Mitchell subscribed to Gold tier', timestamp: '2 hours ago' },
        { id: '2', type: 'new_order', title: 'New Order Placed', description: 'Order #1247 - 6 bottles', timestamp: '4 hours ago' },
        { id: '3', type: 'wine_rating', title: 'Wine Rated', description: '2019 Château Margaux received 5 stars', timestamp: '6 hours ago' },
        { id: '4', type: 'low_stock', title: 'Low Stock Alert', description: '2018 Opus One - Only 3 bottles left', timestamp: '1 day ago' },
        { id: '5', type: 'new_member', title: 'New Member Joined', description: 'Michael Chen subscribed to Platinum tier', timestamp: '2 days ago' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const generateCustomerSignUpLink = () => {
    if (!businessData?.slug) {
      console.error('No business slug available');
      return;
    }
    
    const link = `${window.location.origin}/join/${businessData.slug}`;
    setInvitationLink(link);
    setShowInvitation(true);
  };
  
  const copyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A0303D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation Header */}
      <nav className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            {/* Business Name */}
            <h1 className="text-xl font-semibold text-white">
              {businessData?.name || businessName}
            </h1>
            
            {/* Navigation Items */}
            <div className="hidden md:flex space-x-8">
              <a href="/business/dashboard" className="text-[#A0303D] border-b-2 border-[#A0303D] pb-1 transition-colors">
                Dashboard
              </a>
              <a href="/business/inventory" className="text-gray-400 hover:text-white transition-colors">
                Inventory
              </a>
              <a href="/business/members" className="text-gray-400 hover:text-white transition-colors">
                Members
              </a>
              <a href="/business/orders" className="text-gray-400 hover:text-white transition-colors">
                Orders
              </a>
              <a href="/business/analytics" className="text-gray-400 hover:text-white transition-colors">
                Analytics
              </a>
              <a href="/business/settings" className="text-gray-400 hover:text-white transition-colors">
                Settings
              </a>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-gray-400 hover:text-white transition-colors p-2"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              {/* Sign Out Icon */}
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white transition-colors p-2"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full px-6 py-8">
        {/* Customer Invitation Display */}
        {showInvitation && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Customer Invitation Link Generated Successfully!
              </h3>
            </div>
            
            <div className="bg-[#0a0a0a] p-4 rounded-lg mb-4">
              <p className="text-gray-300 text-sm mb-2">Share this link with customers to join your wine club:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={invitationLink}
                  readOnly
                  className="flex-1 bg-[#222222] text-white px-3 py-2 rounded border border-gray-700 font-mono text-sm"
                />
                <button
                  onClick={copyInvitationLink}
                  className="bg-[#722F37] hover:bg-[#8B2635] text-white px-4 py-2 rounded transition-colors font-medium"
                >
                  {copySuccess ? '✓ COPIED' : '📋 COPY'}
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowInvitation(false)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Close
            </button>
          </div>
        )}
        
        {/* Bento Box Grid - Larger boxes with better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Wine Inventory Overview - Large Box */}
          <BentoBox size="large" title="Wine Inventory" icon={Wine}>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="text-3xl font-light text-white">{realStats.totalWines || 0}</p>
                  <p className="text-sm text-gray-400">Total wines in portfolio</p>
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
                {realStats.totalWines > 0 ? (
                  wines.slice(0, 3).map((wine) => (
                    <div key={wine.id} className="flex items-center space-x-3 p-3 rounded-lg bg-[#0a0a0a]">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#722F37]/20 to-[#8B2635]/20 rounded-lg flex items-center justify-center">
                        <Wine className="h-6 w-6 text-[#A0303D]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{wine.name}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-[#A0303D] fill-current" />
                            <span className="text-xs ml-1 text-gray-400">{wine.rating}/100</span>
                          </div>
                          <span className={`text-xs ${wine.stock <= 5 ? 'text-red-400' : 'text-gray-400'}`}>
                            {wine.stock} bottles
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-[#0a0a0a] rounded-lg">
                    <Wine className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No wines in inventory</p>
                    <p className="text-xs text-gray-500 mt-1">Click below to add your first wine</p>
                  </div>
                )}
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-[#722F37] to-[#8B2635] text-white px-4 py-2 rounded-lg hover:from-[#8B2635] hover:to-[#A0303D] transition-all duration-300 flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Add New Wine</span>
              </button>
            </div>
          </BentoBox>

          {/* Quick Actions - Small Box */}
          <BentoBox size="small" title="Quick Actions" icon={Zap}>
            <div className="space-y-3">
              <button 
                onClick={generateCustomerSignUpLink}
                className="w-full bg-gradient-to-r from-[#722F37] to-[#8B2635] hover:from-[#8B2635] hover:to-[#A0303D] text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span className="text-sm">Generate Customer Sign-Up Link</span>
              </button>
              <button className="w-full bg-[#0a0a0a] hover:bg-[#222222] px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Wine className="h-4 w-4 text-[#A0303D]" />
                <span className="text-sm text-white">Add Wine</span>
              </button>
              <button className="w-full bg-[#0a0a0a] hover:bg-[#222222] px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Package className="h-4 w-4 text-[#A0303D]" />
                <span className="text-sm text-white">Process Orders</span>
              </button>
              <button className="w-full bg-[#0a0a0a] hover:bg-[#222222] px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <BarChart2 className="h-4 w-4 text-[#A0303D]" />
                <span className="text-sm text-white">View Reports</span>
              </button>
            </div>
          </BentoBox>

          {/* Sales Metrics - Medium Box */}
          <BentoBox size="medium" title="Sales Metrics" icon={TrendingUp}>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-light text-white">{formatCurrency(realStats.monthlyRevenue)}</p>
                <p className="text-sm text-gray-400">Monthly recurring revenue</p>
                {realStats.monthlyRevenue > 0 && (
                  <p className="text-sm text-green-400 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    Growing month over month
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-light text-white">{formatCurrency(realStats.monthlyRevenue / 12)}</p>
                  <p className="text-xs text-gray-400">This month</p>
                </div>
                <div>
                  <p className="text-xl font-light text-white">{formatCurrency(realStats.monthlyRevenue / Math.max(realStats.totalMembers, 1))}</p>
                  <p className="text-xs text-gray-400">Avg member value</p>
                </div>
              </div>
              
              {/* Mini Revenue Chart Placeholder */}
              <div className="h-24 bg-[#0a0a0a] rounded-lg flex items-end justify-between px-4 pb-2">
                {[40, 65, 45, 80, 55, 70, 85].map((height, i) => (
                  <div
                    key={i}
                    className="w-4 bg-gradient-to-t from-[#722F37] to-[#8B2635] rounded-t"
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
                  <p className="text-3xl font-light text-white">{realStats.totalMembers}</p>
                  <p className="text-sm text-gray-400">Total active members</p>
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
                {realStats.totalMembers > 0 ? (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Active Members</span>
                    <span className="text-sm font-medium text-white">{realStats.totalMembers} total</span>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No members yet</p>
                    <p className="text-xs text-gray-600 mt-1">Share your sign-up link to get started!</p>
                  </div>
                )}
              </div>
              
              {/* Recent Members */}
              {realStats.totalMembers > 0 && (
                <div className="p-3 bg-[#0a0a0a] rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">Recent members</p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-[#722F37] to-[#8B2635] rounded-full border-2 border-gray-900" />
                    ))}
                    {realStats.totalMembers > 5 && (
                      <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center">
                        <span className="text-xs text-gray-400">+{realStats.totalMembers - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </BentoBox>

          {/* Recent Activity - Tall Box */}
          <BentoBox size="tall" title="Recent Activity" icon={Activity}>
            <div className="space-y-3 overflow-y-auto max-h-[400px]">
              {realStats.totalMembers > 0 || realStats.totalWines > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="p-3 rounded-lg bg-[#0a0a0a] transition-all hover:scale-[1.02]">
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
                          <div className="p-2 bg-[#722F37]/10 rounded-lg">
                            <Star className="h-4 w-4 text-[#A0303D]" />
                          </div>
                        )}
                        {activity.type === 'low_stock' && (
                          <div className="p-2 bg-red-500/10 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-gray-400">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No activity yet</p>
                  <p className="text-sm text-gray-500">
                    Start by adding wines to your inventory and inviting your first customer!
                  </p>
                </div>
              )}
            </div>
          </BentoBox>

          {/* Performance Metrics - Small Boxes */}
          <div className="col-span-1">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-5 w-5 text-[#A0303D]" />
                <span className="text-2xl font-light text-white">{realStats.avgRating || 0}</span>
              </div>
              <p className="text-sm text-gray-400">Avg Wine Rating</p>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-2xl font-light text-white">92%</span>
              </div>
              <p className="text-sm text-gray-400">Member Retention</p>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Package className="h-5 w-5 text-blue-400" />
                <span className="text-2xl font-light text-white">98%</span>
              </div>
              <p className="text-sm text-gray-400">Fulfillment Rate</p>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="h-5 w-5 text-[#A0303D]" />
                <span className="text-2xl font-light text-white">4.9</span>
              </div>
              <p className="text-sm text-gray-400">Satisfaction Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;