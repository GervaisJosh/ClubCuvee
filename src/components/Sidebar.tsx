import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wine, Star, ShoppingCart, Calendar, Gift, Heart, Home, Bell, Settings, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ userRole, setViewMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Wine, label: 'Wine Inventory', path: '/dashboard/wines' },
    { icon: Upload, label: 'Upload Wine List', path: '/dashboard/wine-inventory-upload' },
    { icon: Star, label: 'Wine Reviews', path: '/dashboard/wine-reviews' },
    { icon: ShoppingCart, label: 'Orders', path: '/dashboard/order-fulfillment' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/admin-calendar' },
    { icon: Settings, label: 'Settings', path: '/dashboard/account-settings' }
  ];

  const customerMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Wine, label: 'My Wines', path: '/dashboard/my-wines' },
    { icon: Star, label: 'Rate Wines', path: '/dashboard/rate-wines' },
    { icon: ShoppingCart, label: 'Orders', path: '/dashboard/order-history' },
    { icon: Gift, label: 'Recommendations', path: '/dashboard/recommendations' },
    { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/customer-calendar' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: Settings, label: 'Settings', path: '/dashboard/account-settings' }
  ];

  const menuItems = userRole === 'admin' || userRole === 'admin-real' ? adminMenuItems : customerMenuItems;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const ToggleButton = ({ view, label }) => (
    <button
      onClick={() => setViewMode(view)}
      className={`w-full py-2 px-4 mb-2 rounded ${
        userRole === view 
          ? 'bg-green-500 text-white' 
          : isDark 
            ? 'bg-gray-900 text-gray-300 hover:bg-gray-800' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } transition-colors duration-200`}
    >
      {label}
    </button>
  );

  return (
    <div 
      className={`${isDark ? 'bg-black' : 'bg-white'} fixed inset-y-0 left-0 transition-all duration-300 ease-in-out z-50 flex flex-col ${
        isExpanded ? 'w-64' : 'w-20'
      } border-r ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="py-6 flex-grow">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center py-4 px-6 transition duration-200 ${
                isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
              } ${
                location.pathname === item.path 
                  ? isDark 
                    ? 'bg-gray-900 text-green-500' 
                    : 'bg-gray-100 text-green-500'
                  : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                <item.icon className={`h-6 w-6 ${
                  location.pathname === item.path ? 'text-green-500' : isDark ? 'text-gray-300' : 'text-gray-700'
                }`} />
              </div>
              <span className={`ml-4 transition-all duration-200 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className={`p-4 ${isExpanded ? 'block' : 'hidden'}`}>
        <ToggleButton view="customer" label="Customer View" />
        <ToggleButton view="admin" label="Admin View" />
        <ToggleButton view="admin-real" label="Admin View Real" />
      </div>
    </div>
  );
};

export default Sidebar;