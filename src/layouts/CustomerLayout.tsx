import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home, Wine, Star, ShoppingCart, Gift, Heart, Calendar, Bell, Settings } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/customer/dashboard' },
    { icon: Wine, label: 'My Wines', path: '/customer/my-wines' },
    { icon: Star, label: 'Rate Wines', path: '/customer/rate-wines' },
    { icon: ShoppingCart, label: 'Order History', path: '/customer/order-history' },
    { icon: Gift, label: 'Recommendations', path: '/customer/recommendations' },
    { icon: Heart, label: 'Wishlist', path: '/customer/wishlist' },
    { icon: Calendar, label: 'Calendar', path: '/customer/calendar' },
    { icon: Bell, label: 'Notifications', path: '/customer/notifications' },
    { icon: Settings, label: 'Settings', path: '/customer/account-settings' }
  ];

  return (
    <>
      <Sidebar 
        menuItems={menuItems} 
        title="Club Cuvée" 
        subtitle="Wine Membership"
      />
      <Layout>
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-r from-[#800020] to-[#872657] rounded-b-lg z-0"></div>
          <div className="relative z-10 px-6 pb-12 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'HV Florentino' }}>
              Welcome, {userProfile?.first_name || 'Wine Lover'}
            </h1>
            <p className="text-white/80 text-lg" style={{ fontFamily: 'TayBasal' }}>
              Discover your next favorite wine
            </p>
          </div>
          <div className="relative mt-4">
            {children}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CustomerLayout;