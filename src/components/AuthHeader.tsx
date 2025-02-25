// AuthHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Wine } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AuthHeader = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  return (
    <header className={`fixed top-0 w-full ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm z-50 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Wine className="h-8 w-8" style={{ color: burgundy }} />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                 Club Cuvee
              </span>
            </Link>
            
            <nav className="flex items-center ml-10 space-x-16"> {/* Increased spacing */}
              <Link to="/features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Features
              </Link>
              <Link to="/integrations" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                About
              </Link>
              <Link to="/pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
