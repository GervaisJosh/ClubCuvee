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
  
  // Since the dashboard has its own navigation, we'll just wrap children
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
};

export default BusinessLayout;