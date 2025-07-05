import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in but is not an admin, redirect to home page
  if (!isAdmin) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} p-4`}>
        <div className={`${isDark ? 'bg-zinc-900/50 backdrop-blur-sm border-zinc-800' : 'bg-white border-gray-200'} rounded-lg shadow-lg p-8 max-w-md w-full border`}>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-burgundy-400' : 'text-burgundy-600'} mb-4`}>Unauthorized Access</h1>
          <p className={`${isDark ? 'text-zinc-300' : 'text-gray-700'} mb-6`}>
            You do not have permission to access this section.
            This area is restricted to administrators only.
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className={`px-4 py-2 ${isDark ? 'bg-burgundy-700 hover:bg-burgundy-600' : 'bg-burgundy-600 hover:bg-burgundy-500'} text-white rounded transition-colors`}
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // If user is admin, render children
  return <>{children}</>;
};

export default AdminGuard;