import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AuthHeader = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className={`fixed top-0 w-full ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm z-50 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Wine className="h-8 w-8 text-green-500 mr-2" />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cuvee Club</span>
            </Link>
            
            <nav className="hidden md:flex items-center ml-10 space-x-8">
              <div className="relative group">
                <button className={`flex items-center ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Product
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link to="/features" className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Features</Link>
                    <Link to="/integrations" className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Integrations</Link>
                  </div>
                </div>
              </div>
              <Link to="/pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Pricing</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;