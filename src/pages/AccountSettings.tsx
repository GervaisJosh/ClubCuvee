import React, { useState } from 'react';
import { User, Mail, Lock, CreditCard, Crown, Send, Bell, Globe, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AccountSettings = ({ userRole }) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    paymentMethod: '**** **** **** 1234',
    membershipTier: 'Premier Cru Membership',
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
  });

  const isDark = theme === 'dark';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Updated user settings:', user);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
              Save Changes
            </button>
          </form>
        );

      case 'security':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="current-password">Current Password</label>
              <input
                type="password"
                id="current-password"
                name="currentPassword"
                value={user.currentPassword}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                value={user.newPassword}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="confirm-password">Confirm New Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
              Update Password
            </button>
          </form>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Theme Settings</h3>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  theme === 'light' ? 'bg-green-500 text-white' : isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                <Sun className="h-5 w-5 mr-2" />
                Light Mode
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  theme === 'dark' ? 'bg-green-500 text-white' : isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                <Moon className="h-5 w-5 mr-2" />
                Dark Mode
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Email Notifications</span>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={user.emailNotifications}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Push Notifications</span>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={user.pushNotifications}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>SMS Notifications</span>
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={user.smsNotifications}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
              Save Notification Preferences
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account Settings</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-4`}>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded ${activeTab === 'profile' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="inline-block mr-2" size={18} /> Profile
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded ${activeTab === 'security' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="inline-block mr-2" size={18} /> Security
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded ${activeTab === 'appearance' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  {isDark ? <Moon className="inline-block mr-2" size={18} /> : <Sun className="inline-block mr-2" size={18} />} Appearance
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded ${activeTab === 'notifications' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="inline-block mr-2" size={18} /> Notifications
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/4 md:pl-6">
          <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6`}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
