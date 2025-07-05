// AuthLayout.tsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <AuthHeader />
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};

export default AuthLayout;
