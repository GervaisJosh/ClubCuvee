import React, { useState } from 'react';
import { Truck, Package, CheckCircle, AlertCircle } from 'lucide-react';

const OrderFulfillment = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', items: 'Chateau Margaux 2015 (2)', status: 'Processing', deliveryDate: '2023-06-15' },
    { id: 2, customer: 'Jane Smith', items: 'Opus One 2018 (1), Dom Perignon 2010 (1)', status: 'Shipped', deliveryDate: '2023-06-12' },
    { id: 3, customer: 'Bob Johnson', items: 'Sassicaia 2017 (3)', status: 'Delivered', deliveryDate: '2023-06-10' },
    { id: 4, customer: 'Alice Brown', items: 'Krug Grande Cuvée (2)', status: 'Pending', deliveryDate: '2023-06-18' },
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Package className="h-5 w-5 text-yellow-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pending':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status.toLowerCase() === filter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Order Fulfillment & Logistics</h1>
      <div className="mb-6">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-400 mb-2">Filter by Status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delivery Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                <td className="px-6 py-4 text-sm">{order.items}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{order.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.deliveryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderFulfillment;