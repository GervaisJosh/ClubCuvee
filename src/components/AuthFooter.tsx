import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const AuthFooter = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`fixed bottom-0 w-full ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col items-center justify-center text-center relative">
          <p className={`text-xs max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            By continuing, you agree to Cuvee Club's{' '}
            <Link to="/terms" className={`${isDark ? 'text-green-500 hover:text-green-400' : 'text-green-600 hover:text-green-500'}`}>
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className={`${isDark ? 'text-green-500 hover:text-green-400' : 'text-green-600 hover:text-green-500'}`}>
              Privacy Policy
            </Link>
            <br />
            and to receive periodic emails with updates.
          </p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;