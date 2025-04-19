import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import AuthFooter from './AuthFooter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <main className="flex-grow ml-0 lg:ml-20 p-4 sm:p-6 transition-all duration-200">
        {children}
      </main>
      <div className="ml-0 lg:ml-20">
        <AuthFooter />
      </div>
    </div>
  );
};

export default Layout;