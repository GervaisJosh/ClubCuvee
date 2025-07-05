import React, { useState, useEffect } from 'react';
import { Wine, Star, ShoppingCart, Calendar, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import DefaultText from '../../components/DefaultText';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';
import RecommendationBentoBox from '../../components/RecommendationBentoBox';

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
  const navigate = useNavigate();

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
          
          // First get the local_id that corresponds to this auth user.id
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('local_id')
            .eq('auth_id', user.id)
            .single();
            
          if (userError) {
            console.error('Error finding user local_id:', userError);
            throw new Error('Unable to find user profile');
          }
          
          const localId = userData?.local_id;
          if (!localId) {
            throw new Error('User profile not found');
          }
          
          // Fetch user stats using local_id
          const { data: statsData, error: statsError } = await supabase
            .from('user_stats')
            .select('wines_tasted, average_rating, upcoming_deliveries, next_event')
            .eq('user_id', localId)
            .single();

          if (statsError) {
            console.error('Error fetching user stats:', statsError);
            console.info('The user_stats table may not exist or has no data for this user');
            // Don't throw, just continue with default values
          }

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

  const stats = [
    { 
      label: 'Wines Tasted', 
      value: userStats.winesTasted.toString(), 
      icon: Wine, 
      color: `bg-[${burgundy}]`,
      path: '/customer/my-wines' 
    },
    { 
      label: 'Average Rating', 
      value: userStats.averageRating.toString(), 
      icon: Star, 
      color: 'bg-amber-500',
      path: '/customer/rate-wines' 
    },
    { 
      label: 'Upcoming Deliveries', 
      value: userStats.upcomingDeliveries.toString(), 
      icon: ShoppingCart, 
      color: 'bg-blue-500',
      path: '/customer/order-history' 
    },
    { 
      label: 'Next Event', 
      value: userStats.nextEvent, 
      icon: Calendar, 
      color: 'bg-purple-500',
      path: '/customer/calendar' 
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <Section className="pb-2">
        <DefaultText variant="heading2" className="mb-2">
          Welcome to Your Wine Club
        </DefaultText>
        <DefaultText variant="body" color="muted">
          Discover your personalized wine journey, track your favorites, and explore upcoming events.
        </DefaultText>
      </Section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center" hover onClick={() => navigate(stat.path)}>
            <div className={`${stat.color} rounded-full p-3 mr-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <DefaultText variant="caption" color="muted">
                {stat.label}
              </DefaultText>
              <DefaultText variant="heading3" className="font-bold">
                {stat.value}
              </DefaultText>
            </div>
          </Card>
        ))}
      </div>

      {/* Recommendations Section */}
      <Section title="Your Recommended Wines" className="pt-6">
        {userId ? (
          <Card padding="lg">
            <RecommendationBentoBox
              userId={userId}
              title=""
              size="col-span-3"
              titleColor={isDark ? 'text-white' : burgundy}
              backgroundColor={isDark ? 'black' : 'white'}
              isDark={isDark}
            />
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => navigate('/customer/recommendations')}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                View All Recommendations
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="text-center py-10">
            <Wine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <DefaultText color="muted">
              Please sign in to see your recommendations
            </DefaultText>
          </Card>
        )}
      </Section>

      {/* Wines Tasted Over Time Section */}
      <Section title="Your Wine Journey" className="pt-6">
        <Card padding="lg">
          <DefaultText variant="heading3" className="mb-4">
            Wines Tasted Over Time
          </DefaultText>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winesTastedData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
              <XAxis dataKey="month" stroke={isDark ? '#aaa' : '#666'} />
              <YAxis stroke={isDark ? '#aaa' : '#666'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'black' : 'white',
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
          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline"
              onClick={() => navigate('/customer/my-wines')}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Explore Your Collection
            </Button>
          </div>
        </Card>
      </Section>
    </div>
  );
};

export default CustomerDashboard;