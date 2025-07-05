import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, CreditCard, Crown, Send, Bell, Globe, Shield } from 'lucide-react';

const AccountSettings = ({ userRole }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    paymentMethod: '**** **** **** 1234',
    membershipTier: 'Premier Cru Membership',
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
  });

  const [activeTab, setActiveTab] = useState('profile');

  const membershipTiers = [
    { name: 'First Growth Membership', price: 150 },
    { name: 'Premier Cru Membership', price: 300 },
    { name: 'Grand Cru Membership', price: 750 },
    { name: 'Monopole Membership', price: 1000 },
  ];

  useEffect(() => {
    // Simulating fetching user data (you can replace this with your API or Supabase logic)
    setUser({
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value || '', // Ensure input doesn't become undefined
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User details updated:', user);
    // Placeholder for Supabase logic or any API call for updating user details
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
              Save Changes
            </button>
          </form>
        );
      case 'security':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="current-password">Current Password</label>
              <input
                type="password"
                id="current-password"
                name="currentPassword"
                value={user.currentPassword || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                value={user.newPassword || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="confirm-password">Confirm New Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={user.confirmPassword || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
              Update Password
            </button>
          </form>
        );
      case 'membership':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Current Membership: {user.membershipTier}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-4 border rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                    user.membershipTier === tier.name ? 'border-green-500 bg-green-500 bg-opacity-20' : 'border-gray-700 hover:border-green-500'
                  }`}
                  onClick={() => setUser({ ...user, membershipTier: tier.name })}
                >
                  <h3 className="font-semibold text-white">{tier.name}</h3>
                  <p className="text-sm text-gray-400">${tier.price}/month</p>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
              Update Membership
            </button>
          </div>
        );
      case 'notifications':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Email Notifications</span>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={user.emailNotifications}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Push Notifications</span>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={user.pushNotifications}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">SMS Notifications</span>
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={user.smsNotifications}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
              Save Notification Preferences
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <div className="bg-black rounded-lg p-4">
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded ${activeTab === 'profile' ? 'bg-green-500 text-white' : 'hover:bg-black'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="inline-block mr-2" size={18} /> Profile
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded ${activeTab === 'security' ? 'bg-green-500 text-white' : 'hover:bg-black'}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="inline-block mr-2" size={18} /> Security
                </button>
              </li>
              {userRole === 'customer' && (
                <li>
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${activeTab === 'membership' ? 'bg-green-500 text-white' : 'hover:bg-black'}`}
                    onClick={() => setActiveTab('membership')}
                  >
                    <Crown className="inline-block mr-2" size={18} /> Membership
                  </button>
                </li>
              )}
              <li>
                <button
                  className={`w-full text-left py-2 px-4 rounded ${activeTab === 'notifications' ? 'bg-green-500 text-white' : 'hover:bg-black'}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="inline-block mr-2" size={18} /> Notifications
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/4 md:pl-6">
          <div className="bg-black rounded-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
