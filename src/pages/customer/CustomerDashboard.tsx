import React from 'react';
import { Wine, Star, ShoppingCart, Calendar, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import BentoBox from '../../components/BentoBox';

const CustomerDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const winesTastedData = [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 10 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 13 },
  ];

  const customerWidgets = [
    { title: 'Wines Tasted', value: '15', icon: Wine, color: 'bg-red-500', size: 'col-span-1', path: '/dashboard/my-wines' },
    { title: 'Average Rating', value: '94', icon: Star, color: 'bg-yellow-500', size: 'col-span-1', path: '/dashboard/rate-wines' },
    { title: 'Upcoming Deliveries', value: '2', icon: ShoppingCart, color: 'bg-blue-500', size: 'col-span-1', path: '/dashboard/order-history' },
    { title: 'Next Event', value: 'Jun 15', icon: Calendar, color: 'bg-green-500', size: 'col-span-1', path: '/dashboard/customer-calendar' },
  ];

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Welcome to Your Wine Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerWidgets.map((widget, index) => (
          <BentoBox
            key={index}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            color={widget.color}
            size={widget.size}
            path={widget.path}
          />
        ))}

        <BentoBox
          title="Wines Tasted Over Time"
          size="col-span-2 row-span-2"
          path="/dashboard/my-wines"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winesTastedData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="month" stroke={isDark ? '#9CA3AF' : '#4B5563'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#4B5563'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  border: 'none',
                  color: isDark ? '#FFFFFF' : '#000000'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </BentoBox>

        <BentoBox
          title="Your Top Rated Wines"
          size="col-span-2 row-span-2"
          path="/dashboard/my-wines"
        >
          <ul className={`list-disc list-inside ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>Chateau Margaux 2015</li>
            <li>Opus One 2018</li>
            <li>Dom Perignon 2010</li>
          </ul>
        </BentoBox>
      </div>
    </div>
  );
};

export default CustomerDashboard;