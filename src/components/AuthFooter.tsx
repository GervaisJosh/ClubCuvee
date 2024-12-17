// AuthFooter.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const AuthFooter: React.FC = () => {
  const { theme } = useTheme();
  const isDark: boolean = theme === 'dark';
  const burgundy: string = "#800020";

  return (
    <footer className={`fixed bottom-0 w-full ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col items-center justify-center text-center relative">
          <p className={`text-xs max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            By continuing, you agree to Cuvee Club's{' '}
            <Link to="/terms" className={`${isDark ? `text-[${burgundy}] hover:text-[#b3002d]` : `text-[${burgundy}] hover:text-[#b3002d]`}`}>
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className={`${isDark ? `text-[${burgundy}] hover:text-[#b3002d]` : `text-[${burgundy}] hover:text-[#b3002d]`}`}>
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
