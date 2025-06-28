import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BarChart2, Users, Wine, Settings, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const navigationItems = [
    { name: 'Business Invitations', path: '/admin/business-invitations', icon: Wine },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Admin header */}
      <header className={`${isDark ? 'bg-zinc-900/50 backdrop-blur-sm border-zinc-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button 
              className={`lg:hidden ${isDark ? 'text-white' : 'text-gray-700'} focus:outline-none`}
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'HV Florentino' }}>Club Cuvée</h1>
            <span className={`hidden sm:inline-block text-sm ${isDark ? 'bg-burgundy-900/30 text-burgundy-400 border-burgundy-800/30' : 'bg-burgundy-100 text-burgundy-700 border-burgundy-200'} px-3 py-1 rounded-full font-semibold border`}>
              Business Invitations
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userProfile && (
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-zinc-800 text-white' : 'bg-gray-200 text-gray-700'} flex items-center justify-center mr-2`}>
                  <User className="w-4 h-4" />
                </div>
                <span className={`hidden md:inline text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{userProfile.email}</span>
              </div>
            )}
            <Link 
              to="/" 
              className={`${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} px-3 py-1.5 rounded-md transition font-medium`}
            >
              Exit Admin
            </Link>
            {/* Theme toggle in header */}
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content area with sidebar */}
      <div className="flex-grow flex">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <div 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 ${
            isDark ? 'bg-zinc-900/50 backdrop-blur-sm border-zinc-800' : 'bg-white border-gray-200'
          } border-r transition-transform duration-300 ease-in-out transform lg:transform-none`}
        >
          <div className={`flex items-center justify-between p-4 ${isDark ? 'border-zinc-800' : 'border-gray-200'} border-b lg:hidden`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'HV Florentino' }}>Club Cuvée Admin</h2>
            <button 
              className={`${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-5 px-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? isDark 
                          ? 'bg-burgundy-900/20 text-burgundy-400 border-l-4 border-burgundy-800' 
                          : 'bg-burgundy-50 text-burgundy-700 border-l-4 border-burgundy-300'
                        : isDark
                          ? 'text-zinc-400 hover:bg-zinc-800'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      location.pathname === item.path 
                        ? isDark ? 'text-burgundy-400' : 'text-burgundy-600'
                        : isDark ? 'text-zinc-500' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Main content */}
        <div className={`flex-1 overflow-auto p-4 md:p-6 lg:p-8 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
      
      {/* Admin footer */}
      <footer className={`${isDark ? 'bg-zinc-900/50 backdrop-blur-sm border-zinc-800 text-zinc-400' : 'bg-white border-gray-200 text-gray-500'} border-t py-4 text-center text-sm`}>
        <p>© {new Date().getFullYear()} Club Cuvée Admin Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLayout;