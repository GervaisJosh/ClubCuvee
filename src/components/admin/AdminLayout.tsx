import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BarChart2, Users, Wine, Settings, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigationItems = [
    { name: 'Business Invitations', path: '/admin/business-invitations', icon: Wine },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin header */}
      <header className="bg-gradient-to-r from-[#800020] to-[#872657] text-white shadow-lg border-b border-[#800020] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'HV Florentino' }}>Club Cuvée</h1>
            <span className="hidden sm:inline-block text-sm bg-white text-[#872657] px-3 py-1 rounded-full font-semibold shadow-sm">
              Business Invitations
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userProfile && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white text-[#872657] flex items-center justify-center mr-2 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden md:inline text-sm font-medium">{userProfile.email}</span>
              </div>
            )}
            <Link 
              to="/" 
              className="bg-white text-[#872657] px-3 py-1.5 rounded-md hover:bg-gray-100 transition shadow-sm font-medium"
            >
              Exit Admin
            </Link>
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
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out transform lg:transform-none`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-xl font-bold text-[#872657]" style={{ fontFamily: 'HV Florentino' }}>Club Cuvée Admin</h2>
            <button 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
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
                        ? 'bg-[#872657] bg-opacity-10 text-[#872657] border-l-4 border-[#872657]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      location.pathname === item.path ? 'text-[#872657]' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Support Resources
                </h3>
                <div className="mt-3 space-y-2">
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-[#872657]">
                    Documentation
                  </a>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-[#872657]">
                    API Reference
                  </a>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-[#872657]">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
      
      {/* Admin footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Club Cuvée Admin Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLayout;