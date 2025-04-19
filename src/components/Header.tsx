import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Wine } from 'lucide-react';
import NavLink from './NavLink';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  return (
    <header className={`fixed top-0 w-full z-50 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <Wine className="h-8 w-8" style={{ color: burgundy }} />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Club Cuvee
              </span>
            </NavLink>
            <nav className="hidden md:flex items-center ml-10 space-x-8">
              <NavLink to="/how-it-works" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                How It Works
              </NavLink>
              <NavLink to="/features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Features
              </NavLink>
              <NavLink to="/pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                Pricing
              </NavLink>
              <NavLink to="/about" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                About
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink 
              to="/login" 
              className={`${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-900'}`} 
              style={{ fontFamily: 'TayBasal' }}
            >
              Sign in
            </NavLink>
            <NavLink 
              to="/get-started"
              className="text-white px-4 py-2 rounded-md transition-colors duration-200"
              style={{ backgroundColor: burgundy, fontFamily: 'TayBasal' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Get Started
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;