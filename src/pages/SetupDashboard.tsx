import React, { useState } from 'react';
import { Link } from 'lucide-react';

const SetupDashboard = () => {
  const [apiKeys, setApiKeys] = useState({
    openTable: '',
    toast: '',
    binWise: '',
  });

  const handleApiKeyChange = (service, value) => {
    setApiKeys({ ...apiKeys, [service]: value });
  };

  const handleConnect = (service) => {
    // Here you would typically send the API key to your backend for validation and storage
    console.log(`Connecting to ${service} with API key: ${apiKeys[service]}`);
    // For now, we'll just show an alert
    alert(`Connected to ${service}!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Set Up Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['openTable', 'toast', 'binWise'].map((service) => (
          <div key={service} className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">{service.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={apiKeys[service]}
                onChange={(e) => handleApiKeyChange(service, e.target.value)}
                placeholder="Enter API Key"
                className="flex-grow px-3 py-2 bg-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={() => handleConnect(service)}
                className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 transition-colors duration-200"
              >
                Connect
              </button>
            </div>
            <div className="flex items-center text-blue-400 hover:text-blue-300">
              <Link className="h-4 w-4 mr-2" />
              <a href="#" className="text-sm">Learn how to get your API key</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupDashboard;