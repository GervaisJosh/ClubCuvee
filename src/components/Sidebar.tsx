import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wine, Star, ShoppingCart, Calendar, Gift, Heart, Home, Bell, Settings, Upload, Icon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MenuItem {
  icon: Icon;
  label: string;
  path: string;
}

interface SidebarProps {
  userRole: string;
  setViewMode: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, setViewMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const adminMenuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Wine, label: 'Wine Inventory', path: '/dashboard/wines' },
    { icon: Upload, label: 'Upload Wine List', path: '/dashboard/wine-inventory-upload' },
    { icon: Star, label: 'Wine Reviews', path: '/dashboard/wine-reviews' },
    { icon: ShoppingCart, label: 'Orders', path: '/dashboard/order-fulfillment' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/admin-calendar' },
    { icon: Settings, label: 'Settings', path: '/dashboard/account-settings' }
  ];

  const customerMenuItems: MenuItem[] = [
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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const ToggleButton: React.FC<{ view: string; label: string }> = ({ view, label }) => (
    <button
      onClick={() => setViewMode(view)}
      className={`w-full py-2 px-4 mb-2 rounded font-TayBasal transition-all duration-200 ${
        userRole === view 
          ? 'bg-[#800020] text-white' 
          : `${isDark ? 'bg-gray-800 text-white hover:text-[#800020]' : 'bg-white text-[#800020] hover:bg-gray-100'}`
      }`}
    >
      {label}
    </button>
  );

  return (
    <div 
      className={`fixed inset-y-0 left-0 transition-all duration-300 ease-in-out z-50 flex flex-col ${
        isExpanded ? 'w-64' : 'w-20'
      } ${isDark ? 'bg-black' : 'bg-white'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Main navigation section with flex and auto spacing */}
      <div className="flex-grow flex flex-col justify-between py-8">
        <nav className="flex-grow flex flex-col">
          <div className="flex-grow flex flex-col justify-start space-y-6">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center px-6 py-2 transition-all duration-200 hover:bg-transparent`}
              >
                <div className="w-8 flex items-center justify-center">
                  <item.icon 
                    className={`h-6 w-6 transition-colors duration-200
                      ${location.pathname === item.path 
                        ? 'text-[#800020] font-bold' 
                        : isDark 
                          ? 'text-white' 
                          : 'text-gray-700'
                      }
                      ${isDark 
                        ? 'hover:text-white' 
                        : 'hover:text-[#800020]'}`} 
                  />
                </div>
                <span 
                  className={`ml-4 font-TayBasal transition-all duration-200 
                    ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                    ${location.pathname === item.path 
                      ? 'text-[#800020] font-bold' 
                      : isDark 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }
                    ${isDark 
                      ? 'hover:text-white' 
                      : 'hover:text-[#800020]'}`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* View toggle buttons section */}
      <div className={`p-4 ${isExpanded ? 'block' : 'hidden'}`}>
        <ToggleButton view="customer" label="Customer View" />
        <ToggleButton view="admin" label="Admin View" />
        <ToggleButton view="admin-real" label="Admin View Real" />
      </div>
    </div>
  );
};

export default Sidebar;