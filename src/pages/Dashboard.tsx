import React from 'react';
import { Wine, Star, ShoppingCart, Calendar, Gift, Heart, TrendingUp, Percent, DollarSign, Package, Users, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import BentoBox from '../components/BentoBox';
import { useTheme } from "../contexts/ThemeContext";
import DefaultText from '../components/DefaultText';
import Card from '../components/Card';
import Section from '../components/Section';
import Button from '../components/Button';

const Dashboard = ({ userRole }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = '#800020';

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

  const stats = [
    { label: 'Total Revenue', value: '$328,000', icon: DollarSign, color: 'bg-green-500', path: '/revenue-insights' },
    { label: 'Wine Inventory', value: '1,234 bottles', icon: Wine, color: `bg-[${burgundy}]`, path: '/wines' },
    { label: 'Pending Orders', value: '23', icon: Package, color: 'bg-yellow-500', path: '/order-fulfillment' },
    { label: 'Active Customers', value: '567', icon: Users, color: 'bg-blue-500', path: '/customer-segmentation' },
  ];

  const quickActions = [
    { 
      name: "Wine Inventory", 
      description: "Manage your wine collection", 
      icon: Wine,
      color: burgundy,
      path: "/wine-inventory"
    },
    { 
      name: "Customer Management", 
      description: "View and edit member details", 
      icon: Users,
      color: "#3B82F6", // Blue
      path: "/customer-insights"
    },
    { 
      name: "Order Fulfillment", 
      description: "Process pending wine orders", 
      icon: Package,
      color: burgundy,
      path: "/order-fulfillment"
    },
    { 
      name: "Event Calendar", 
      description: "Schedule and manage events", 
      icon: Calendar,
      color: burgundy,
      path: "/calendar"
    }
  ];

  const bestSellingWines = [
    { name: 'Chateau Margaux 2015', sales: 45, trend: 'up' },
    { name: 'Opus One 2018', sales: 38, trend: 'up' },
    { name: 'Dom Perignon 2010', sales: 32, trend: 'down' },
    { name: 'Silver Oak Cabernet 2017', sales: 28, trend: 'up' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <Section className="pb-2">
        <DefaultText variant="heading2" className="mb-2">
          Welcome to Your Business Dashboard
        </DefaultText>
        <DefaultText variant="body" color="muted">
          Track your wine club performance, manage inventory, and engage with your members all in one place.
        </DefaultText>
      </Section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center" hover onClick={() => window.location.href = stat.path}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <DefaultText variant="heading3" className="mb-4">Monthly Revenue</DefaultText>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
              <XAxis dataKey="month" stroke={isDark ? '#bbb' : '#333'} />
              <YAxis stroke={isDark ? '#bbb' : '#333'} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Total Revenue" />
              <Line type="monotone" dataKey="wineRevenue" stroke={burgundy} name="Wine Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Selling Wines */}
        <Card>
          <DefaultText variant="heading3" className="mb-4">Top Selling Wines</DefaultText>
          <div className="space-y-4">
            {bestSellingWines.map((wine, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800"
              >
                <div>
                  <DefaultText className="font-medium">{wine.name}</DefaultText>
                  <DefaultText variant="caption" color="muted">{wine.sales} bottles this month</DefaultText>
                </div>
                <TrendingUp className={`h-5 w-5 ${wine.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Section title="Quick Actions" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="flex items-start" 
              hover 
              onClick={() => window.location.href = action.path}
              padding="md"
            >
              <div 
                className="mr-4 p-2 rounded-md flex-shrink-0" 
                style={{ backgroundColor: `${action.color}20` }}
              >
                <action.icon style={{ color: action.color }} className="h-6 w-6" />
              </div>
              <div>
                <DefaultText className="font-medium mb-1">{action.name}</DefaultText>
                <DefaultText variant="caption" color="muted">{action.description}</DefaultText>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Revenue Breakdown */}
      <Card>
        <DefaultText variant="heading3" className="mb-4">Revenue Breakdown</DefaultText>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ddd'} />
            <XAxis dataKey="name" stroke={isDark ? '#bbb' : '#333'} />
            <YAxis stroke={isDark ? '#bbb' : '#333'} />
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }} />
            <Bar dataKey="value" fill={burgundy} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/revenue-insights'}
          icon={<BarChart2 className="h-5 w-5" />}
        >
          View Detailed Analytics
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;