import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Onboarding Tester', path: '/admin/onboarding-tester' },
    { name: 'Restaurants', path: '/admin/restaurants' },
    { name: 'Customers', path: '/admin/customers' },
    { name: 'Analytics', path: '/admin/analytics' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Admin header */}
      <header className="bg-[#872657] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Club Cuvee Admin</h1>
            <span className="text-sm bg-white text-[#872657] px-2 py-0.5 rounded">
              Admin Portal
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {userProfile && (
              <span className="text-sm">{userProfile.email}</span>
            )}
            <Link 
              to="/" 
              className="bg-white text-[#872657] px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Exit Admin
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content area with sidebar */}
      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <nav className="mt-5 px-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? 'bg-[#872657] text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;