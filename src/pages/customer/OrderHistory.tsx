import React, { useState } from 'react';
import { Package, Download, CheckCircle, Truck, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const OrderHistory = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [orders, setOrders] = useState([
    { id: 1, date: '2023-05-15', items: 'Premier Cru Membership Order: 3 bottles', status: 'Delivered' },
    { id: 2, date: '2023-04-22', items: 'Premier Cru Membership Order: 1 Bottle', status: 'Shipped' },
    { id: 3, date: '2023-03-10', items: 'Premier Cru Membership Order: 3 bottles', status: 'Processing' },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownloadInvoice = (orderId) => {
    console.log(`Downloading invoice for order ${orderId}`);
  };

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                {getStatusIcon(order.status)}
                <span className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.status}</span>
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Order #{order.id}</span>
            </div>
            <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.items}</p>
            <div className="flex justify-between items-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Order Date: {order.date}</p>
              <button
                onClick={() => handleDownloadInvoice(order.id)}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
              >
                <Download className="h-5 w-5 mr-2" />
                Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;