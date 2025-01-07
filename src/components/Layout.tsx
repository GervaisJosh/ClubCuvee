import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  userRole: string;
  setViewMode: (mode: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, setViewMode }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <Sidebar userRole={userRole} setViewMode={setViewMode} />
      <div className={`ml-20 p-6 transition-all duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
