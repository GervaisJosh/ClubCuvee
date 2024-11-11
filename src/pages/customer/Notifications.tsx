import React from 'react';
import { Truck, Star, Gift } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Notifications = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

const notifications = [
  { id: 1, type: 'shipment', message: 'Your order of Chateau Margaux 2016 has been shipped!', date: '2023-06-10', icon: Truck },
  { id: 2, type: 'rating', message: 'Don\'t forget to rate the Opus One 2018 you recently enjoyed!', date: '2023-06-08', icon: Star },
  { id: 3, type: 'recommendation', message: 'New wines matching your taste profile are now available!', date: '2023-06-05', icon: Gift },
];


  const getIconColor = (type) => {
    switch (type) {
      case 'shipment':
        return 'text-blue-500';
      case 'rating':
        return 'text-yellow-500';
      case 'recommendation':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Notifications
      </h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 flex items-start`}
          >
            <div className={`${getIconColor(notification.type)} mr-4 mt-1`}>
              <notification.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                {notification.message}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {notification.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;