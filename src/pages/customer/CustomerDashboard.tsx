import React, { useState, useEffect } from 'react';
import { Wine, Star, ShoppingCart, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import BentoBox from '../../components/BentoBox';
import { supabase } from '../../supabase';
import { fetchRecommendations, type WineData, type RecommendationResponse } from '../../utils/recommendationClient';

interface UserStats {
  winesTasted: number;
  averageRating: number;
  upcomingDeliveries: number;
  nextEvent: string;
}

const CustomerDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Color constants
  const burgundy = '#800020';
  const charcoalGray = '#1A1A1D';
  
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    winesTasted: 0,
    averageRating: 0,
    upcomingDeliveries: 0,
    nextEvent: ''
  });

  const winesTastedData = [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 10 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 13 },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const [recommendationData, { data: statsData }] = await Promise.all([
          fetchRecommendations(user.id),
          supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single()
        ]);

        setRecommendations(recommendationData);

        if (statsData) {
          setUserStats({
            winesTasted: statsData.wines_tasted || 0,
            averageRating: statsData.average_rating || 0,
            upcomingDeliveries: statsData.upcoming_deliveries || 0,
            nextEvent: statsData.next_event || 'No upcoming events'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
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
      value: userStats.averageRating.toFixed(1),
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

  const WineCard: React.FC<{ wine: WineData }> = ({ wine }) => (
    <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-transform duration-200 hover:scale-105">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-t-lg">
        <img
          src={wine.image_path}
          alt={wine.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-wine.png';
          }}
        />
      </div>
      <div 
        className="p-4 flex-1"
        style={{ backgroundColor: isDark ? charcoalGray : 'white' }}
      >
        <h3 className={`font-HVFlorentino font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {wine.name}
        </h3>
        <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
          {wine.producer} {wine.vintage}
        </p>
        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>{wine.region}, {wine.country}</p>
          <p className="mt-1">{wine.varietal}</p>
          {recommendations?.scores[wine.id] && (
            <p className="mt-2 text-sm font-semibold" style={{ color: burgundy }}>
              Match Score: {Math.round(recommendations.scores[wine.id])}%
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-bold mb-8 font-HVFlorentino ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Welcome to Your Wine Dashboard
      </h1>

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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BentoBox
          title="Your Recommended Wines"
          size="col-span-3"
          path="/recommendations"
          titleColor={isDark ? 'text-white' : burgundy}
          backgroundColor={isDark ? charcoalGray : 'white'}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : !recommendations?.wines?.length ? (
            <div className="text-center text-gray-500 py-8">No recommended wines available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
              {recommendations.wines.slice(0, 5).map((wine) => (
                <WineCard key={wine.id} wine={wine} />
              ))}
            </div>
          )}
        </BentoBox>

        <BentoBox
          title="Wines Tasted Over Time"
          size="col-span-2 row-span-2"
          path="/my-wines"
          titleColor={isDark ? 'text-white' : burgundy}
          backgroundColor={isDark ? charcoalGray : 'white'}
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

        <BentoBox
          title="Top Rated Wines"
          size="col-span-1 row-span-2"
          path="/my-wines"
          titleColor={isDark ? 'text-white' : burgundy}
          backgroundColor={isDark ? charcoalGray : 'white'}
        >
          <ul className="space-y-4 mt-4">
            {['Chateau Margaux 2015', 'Opus One 2018', 'Dom Perignon 2010'].map((wine, index) => (
              <li 
                key={wine}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">{wine}</p>
                <p className="text-sm text-gray-500">Rating: {98 - index}</p>
              </li>
            ))}
          </ul>
        </BentoBox>
      </div>
    </div>
  );
};

export default CustomerDashboard;