import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
            case 'Shipped':
                return _jsx(Truck, { className: "h-5 w-5 text-blue-500" });
            case 'Processing':
                return _jsx(Clock, { className: "h-5 w-5 text-yellow-500" });
            default:
                return _jsx(Package, { className: "h-5 w-5 text-gray-500" });
        }
    };
    const handleDownloadInvoice = (orderId) => {
        console.log(`Downloading invoice for order ${orderId}`);
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: `text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Order History" }), _jsx("div", { className: "space-y-6", children: orders.map((order) => (_jsxs("div", { className: `${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105`, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex items-center", children: [getStatusIcon(order.status), _jsx("span", { className: `ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`, children: order.status })] }), _jsxs("span", { className: `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: ["Order #", order.id] })] }), _jsx("p", { className: `text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`, children: order.items }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("p", { className: `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: ["Order Date: ", order.date] }), _jsxs("button", { onClick: () => handleDownloadInvoice(order.id), className: "flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out", children: [_jsx(Download, { className: "h-5 w-5 mr-2" }), "Invoice"] })] })] }, order.id))) })] }));
};
export default OrderHistory;
