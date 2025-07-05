import React from 'react';

const OrderManagementView = ({ userRole, setUserRole }) => {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="absolute top-4 right-4 z-50">
        <select
          value={userRole || 'customer'}
          onChange={(e) => setUserRole(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="customer">Customer View</option>
          <option value="admin">Admin View</option>
        </select>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">
            Order Management
          </h1>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementView;
