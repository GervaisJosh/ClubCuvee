import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home, Users, BarChart2, Settings, ShieldCheck, Link as LinkIcon, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Business Management', path: '/admin/businesses' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/revenue' },
    { icon: LinkIcon, label: 'Onboarding Links', path: '/admin/onboarding-tester' },
    { icon: FileText, label: 'Diagnostics', path: '/admin/diagnostics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <>
      <Sidebar 
        menuItems={menuItems} 
        title="Club Cuvée Admin" 
        subtitle="Super Administrator"
      />
      <Layout>
        {children}
      </Layout>
    </>
  );
};

export default AdminLayout;