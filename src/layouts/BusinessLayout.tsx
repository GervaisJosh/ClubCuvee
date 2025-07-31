import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home, Wine, Users, DollarSign, Calendar, Settings, BarChart2, GlassWater, Package, Store } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';

interface BusinessLayoutProps {
  children: React.ReactNode;
}

const BusinessLayout: React.FC<BusinessLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { signOut, userProfile, user } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  // Extract restaurant name from user metadata or profile
  const restaurantName = user?.user_metadata?.restaurant_name || userProfile?.restaurant_name || 'Your Restaurant';

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/business/dashboard' },
    { icon: Wine, label: 'Wine Inventory', path: '/business/wines' },
    { icon: GlassWater, label: 'Membership Tiers', path: '/business/membership-tiers' },
    { icon: Users, label: 'Members', path: '/business/customers' },
    { icon: Package, label: 'Orders', path: '/business/orders' },
    { icon: BarChart2, label: 'Analytics', path: '/business/analytics' },
    { icon: Settings, label: 'Settings', path: '/business/settings' },
  ];

  return (
    <>
      <Sidebar 
        menuItems={menuItems} 
        title={restaurantName || 'Club Cuvée'} 
        subtitle="Business Portal"
      />
      <Layout>
        {children}
      </Layout>
    </>
  );
};

export default BusinessLayout;