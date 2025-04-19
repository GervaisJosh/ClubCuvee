import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings, LogOut, Menu, X, Wine } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  title: string;
  subtitle?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  menuItems, 
  title, 
  subtitle = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, userProfile, signOut } = useAuth();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  const handleNavigation = (path: string) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Get first letter of name for avatar
  const getInitial = () => {
    if (userProfile?.first_name) {
      return userProfile.first_name[0];
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  // For smaller screens
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMenu}
          className={`p-2 rounded-md ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} shadow-md`}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for larger screens with hover expand */}
      <div 
        className={`fixed inset-y-0 left-0 transition-all duration-300 ease-in-out z-40 hidden lg:flex flex-col
          ${isExpanded ? 'w-64' : 'w-20'} 
          ${isDark ? 'bg-black' : 'bg-white'} 
          ${isDark ? 'border-r border-gray-800' : 'border-r border-gray-200'}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header */}
        <div className={`p-4 ${isDark ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
          <div className="flex items-center">
            <Wine className="h-7 w-7" style={{ color: burgundy }} />
            <h1 
              className={`ml-3 font-bold text-lg transition-opacity duration-200 
                ${isExpanded ? 'opacity-100' : 'opacity-0'} 
                ${isDark ? 'text-white' : 'text-gray-900'}`} 
              style={{ fontFamily: 'HV Florentino' }}
            >
              {title}
            </h1>
          </div>
          {subtitle && isExpanded && (
            <p className={`text-xs mt-1 pl-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: 'TayBasal' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-grow py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center px-5 py-3 transition-all duration-200 
                      ${isActive 
                        ? isDark 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-[#800020]' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                  >
                    <item.icon 
                      className={`h-5 w-5 
                        ${isActive 
                          ? 'text-[#800020]' 
                          : isDark 
                            ? 'text-gray-400' 
                            : 'text-gray-500'}`} 
                    />
                    <span 
                      className={`ml-4 transition-all duration-200 text-sm 
                        ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'} 
                        ${isActive 
                          ? 'font-medium' 
                          : 'font-normal'} 
                        ${isActive 
                          ? isDark 
                            ? 'text-white' 
                            : 'text-gray-900' 
                          : isDark 
                            ? 'text-gray-400' 
                            : 'text-gray-700'}`}
                        style={{ fontFamily: 'TayBasal' }}  
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile and logout */}
        <div className={`p-4 ${isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
          <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#800020] flex items-center justify-center text-white flex-shrink-0">
                {getInitial()}
              </div>
              {isExpanded && (
                <div className="ml-3 flex-shrink min-w-0 overflow-hidden">
                  <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                    {userProfile?.first_name} {userProfile?.last_name}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            {isExpanded && (
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
          {!isExpanded && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex justify-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden
          ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      <div 
        className={`fixed inset-y-0 left-0 w-64 z-50 transition-transform duration-300 lg:hidden
          ${isMenuOpen ? 'transform-none' : '-translate-x-full'} 
          ${isDark ? 'bg-black' : 'bg-white'}`}
      >
        {/* Mobile header */}
        <div className={`p-4 ${isDark ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wine className="h-7 w-7" style={{ color: burgundy }} />
              <h1 
                className={`ml-3 font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'HV Florentino' }}
              >
                {title}
              </h1>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className={`p-1 rounded-md ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <X size={20} />
            </button>
          </div>
          {subtitle && (
            <p className={`text-xs mt-1 pl-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: 'TayBasal' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Mobile nav items */}
        <nav className="flex-grow py-6 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 
                      ${isActive 
                        ? isDark 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-[#800020]' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                  >
                    <item.icon 
                      className={`h-5 w-5 
                        ${isActive 
                          ? 'text-[#800020]' 
                          : isDark 
                            ? 'text-gray-400' 
                            : 'text-gray-500'}`} 
                    />
                    <span 
                      className={`ml-4 text-sm 
                        ${isActive 
                          ? 'font-medium' 
                          : 'font-normal'} 
                        ${isActive 
                          ? isDark 
                            ? 'text-white' 
                            : 'text-gray-900' 
                          : isDark 
                            ? 'text-gray-400' 
                            : 'text-gray-700'}`}
                        style={{ fontFamily: 'TayBasal' }}  
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile user profile and logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#800020] flex items-center justify-center text-white flex-shrink-0">
                {getInitial()}
              </div>
              <div className="ml-3 flex-shrink min-w-0 overflow-hidden">
                <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'TayBasal' }}>
                  {userProfile?.first_name} {userProfile?.last_name}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
        {/* Mobile Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};

export default Sidebar;