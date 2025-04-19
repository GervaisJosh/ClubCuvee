import React from 'react';
import { Wine } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const AuthFooter: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  return (
    <footer className={`border-t mt-auto ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wine className="h-6 w-6 mr-2" style={{ color: burgundy }} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: 'TayBasal' }}>
              Club Cuvée
            </span>
          </div>
          <div className="flex items-center">
            <p className={`text-xs mr-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              © Monopole AI, Inc.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;