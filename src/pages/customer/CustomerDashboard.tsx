import React, { useState, useEffect } from 'react';
import { Wine, Star, ShoppingCart, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import BentoBox from '../../components/BentoBox';
import RecommendationBentoBox from '../../components/RecommendationBentoBox';
import { supabase } from '../../supabase';

const winesTastedData = [
  { month: 'Jan', count: 5 },
  { month: 'Feb', count: 8 },
  { month: 'Mar', count: 12 },
  { month: 'Apr', count: 10 },
  { month: 'May', count: 15 },
  { month: 'Jun', count: 13 },
];

const CustomerDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = '#800020';
  const charcoalGray = '#1A1A1D';

  const [userId, setUserId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    winesTasted: 0,
    averageRating: 0,
    upcomingDeliveries: 0,
    nextEvent: 'N/A',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        if (user) {
          setUserId(user.id);
          
          // Fetch user stats
          const { data: statsData, error: statsError } = await supabase
            .from('user_stats')
            .select('wines_tasted, average_rating, upcoming_deliveries, next_event')
            .eq('user_id', user.id)
            .single();

          if (statsError) throw statsError;

          if (statsData) {
            setUserStats({
              winesTasted: statsData.wines_tasted || 0,
              averageRating: statsData.average_rating || 0,
              upcomingDeliveries: statsData.upcoming_deliveries || 0,
              nextEvent: statsData.next_event || 'N/A',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const widgets = [
    {
      title: 'Wines Tasted',
      value: userStats.winesTasted.toString(),
      icon: Wine,
      iconColor: isDark ? 'text-white' : 'text-gray-900',
      titleColor: isDark ? 'text-white' : burgundy,
      size: 'col-span-1',
      path: '/my-wines',
    },
    {
      title: 'Average Rating',
      value: userStats.averageRating.toString(),
      icon: Star,
      iconColor: isDark ? 'text-white' : 'text-gray-900',
      titleColor: isDark ? 'text-white' : burgundy,
      size: 'col-span-1',
      path: '/rate-wines',
    },
    {
      title: 'Upcoming Deliveries',
      value: userStats.upcomingDeliveries.toString(),
      icon: ShoppingCart,
      iconColor: isDark ? 'text-white' : 'text-gray-900',
      titleColor: isDark ? 'text-white' : burgundy,
      size: 'col-span-1',
      path: '/order-history',
    },
    {
      title: 'Next Event',
      value: userStats.nextEvent,
      icon: Calendar,
      iconColor: isDark ? 'text-white' : 'text-gray-900',
      titleColor: isDark ? 'text-white' : burgundy,
      size: 'col-span-1',
      path: '/customer-calendar',
    },
  ];

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Welcome to Your Wine Dashboard
      </h1>

      {/* Widgets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <BentoBox
            key={index}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            iconColor={widget.iconColor}
            titleColor={widget.titleColor}
            backgroundColor={isDark ? charcoalGray : 'white'}
            size={widget.size}
            path={widget.path}
          />
        ))}
      </div>

      {/* Recommendations Section */}
      <div className="mt-8">
        {userId ? (
          <RecommendationBentoBox
            userId={userId}
            title="Your Recommended Wines"
            size="col-span-3"
            titleColor={isDark ? 'text-white' : burgundy}
            backgroundColor={isDark ? charcoalGray : 'white'}
            isDark={isDark}
          />
        ) : (
          <div className="text-center py-8">
            <Wine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Please sign in to see your recommendations
            </p>
          </div>
        )}
      </div>

      {/* Wines Tasted Over Time Section */}
      <div className="mt-8">
        <BentoBox
          title="Wines Tasted Over Time"
          size="col-span-3"
          titleColor={isDark ? 'text-white' : burgundy}
          backgroundColor={isDark ? charcoalGray : 'white'}
          path="/my-wines"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winesTastedData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#ccc'} />
              <XAxis dataKey="month" stroke={isDark ? '#aaa' : '#666'} />
              <YAxis stroke={isDark ? '#aaa' : '#666'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? charcoalGray : 'white',
                  borderRadius: '8px',
                  color: isDark ? 'white' : 'black',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={burgundy}
                strokeWidth={2}
                dot={{ fill: burgundy, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </BentoBox>
      </div>
    </div>
  );
};

export default CustomerDashboard;