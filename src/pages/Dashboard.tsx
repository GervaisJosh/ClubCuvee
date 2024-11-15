import React from 'react';
import { Wine, Star, ShoppingCart, Calendar, Gift, Heart, TrendingUp, Percent, DollarSign, Package, Users, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import BentoBox from '../components/BentoBox';
import { useTheme } from "../contexts/ThemeContext";


const Dashboard = ({ userRole }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, wineRevenue: 30000 },
    { month: 'Feb', revenue: 52000, wineRevenue: 35000 },
    { month: 'Mar', revenue: 48000, wineRevenue: 32000 },
    { month: 'Apr', revenue: 61000, wineRevenue: 40000 },
    { month: 'May', revenue: 55000, wineRevenue: 37000 },
    { month: 'Jun', revenue: 67000, wineRevenue: 45000 },
  ];

  const revenueBreakdown = [
    { name: 'Wine Sales', value: 65 },
    { name: 'Events', value: 20 },
    { name: 'Memberships', value: 15 },
  ];

  const adminWidgets = [
    { title: 'Total Revenue', value: '$328,000', icon: DollarSign, color: 'bg-green-500', size: 'col-span-1', path: '/revenue-insights' },
    { title: 'Wine Inventory', value: '1,234 bottles', icon: Wine, color: 'bg-red-500', size: 'col-span-1', path: '/wines' },
    { title: 'Pending Orders', value: '23', icon: Package, color: 'bg-yellow-500', size: 'col-span-1', path: '/order-fulfillment' },
    { title: 'Active Customers', value: '567', icon: Users, color: 'bg-blue-500', size: 'col-span-1', path: '/customer-segmentation' },
    { title: 'Monthly Revenue Trend', chart: 'lineChart', size: 'col-span-2 row-span-2', path: '/wine-inventory-analytics' },
    { title: 'Top Selling Wines', list: ['Chateau Margaux 2015', 'Opus One 2018', 'Dom Perignon 2010'], icon: TrendingUp, size: 'col-span-1 row-span-2', path: '/wine-inventory-analytics' },
    { title: 'Revenue Breakdown', chart: 'barChart', size: 'col-span-2 row-span-2', path: '/revenue-insights' },
    { title: 'Avg Customer Rating', value: '96', icon: Star, color: 'bg-purple-500', size: 'col-span-1', path: '/customer-insights' },
    { title: 'Upcoming Events', value: '3', icon: Calendar, color: 'bg-indigo-500', size: 'col-span-1', path: '/admin-calendar' },
  ];

  const widgets = userRole === 'admin' ? adminWidgets : customerWidgets;

  return (
    <div className={`space-y-6 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {userRole === 'admin' ? 'Admin Dashboard' : 'Welcome to Your Wine Dashboard'}
      </h1>
      
      <div className="grid grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <BentoBox
            key={index}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            color={widget.color}
            size={widget.size}
            path={widget.path}
            isDark={isDark} // Pass isDark to customize BentoBox styles
          >
            {widget.list && (
              <ul className={`list-disc list-inside ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {widget.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {widget.chart === 'lineChart' && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={userRole === 'admin' ? monthlyRevenue : salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
                  <XAxis dataKey={userRole === 'admin' ? 'month' : 'name'} stroke={isDark ? '#bbb' : '#333'} />
                  <YAxis stroke={isDark ? '#bbb' : '#333'} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }} />
                  {userRole === 'admin' ? (
                    <>
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Total Revenue" />
                      <Line type="monotone" dataKey="wineRevenue" stroke="#3B82F6" name="Wine Revenue" />
                    </>
                  ) : (
                    <Line type="monotone" dataKey="sales" stroke="#10B981" name="Wines Tasted" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
            {widget.chart === 'barChart' && (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
                  <XAxis dataKey="name" stroke={isDark ? '#bbb' : '#333'} />
                  <YAxis stroke={isDark ? '#bbb' : '#333'} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }} />
                  <Bar dataKey="value" fill={isDark ? '#8884d8' : '#5555ff'} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </BentoBox>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
