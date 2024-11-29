import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
                return _jsx(Package, { className: "h-5 w-5 text-yellow-500" });
            case 'Shipped':
                return _jsx(Truck, { className: "h-5 w-5 text-blue-500" });
            case 'Delivered':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
            case 'Pending':
                return _jsx(AlertCircle, { className: "h-5 w-5 text-red-500" });
            default:
                return null;
        }
    };
    const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status.toLowerCase() === filter);
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Order Fulfillment & Logistics" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "status-filter", className: "block text-sm font-medium text-gray-400 mb-2", children: "Filter by Status:" }), _jsxs("select", { id: "status-filter", value: filter, onChange: (e) => setFilter(e.target.value), className: "bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500", children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "processing", children: "Processing" }), _jsx("option", { value: "shipped", children: "Shipped" }), _jsx("option", { value: "delivered", children: "Delivered" })] })] }), _jsx("div", { className: "bg-gray-800 rounded-lg shadow-md overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Order ID" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Items" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Delivery Date" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-700", children: filteredOrders.map((order) => (_jsxs("tr", { children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: ["#", order.id] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: order.customer }), _jsx("td", { className: "px-6 py-4 text-sm", children: order.items }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsxs("div", { className: "flex items-center", children: [getStatusIcon(order.status), _jsx("span", { className: "ml-2", children: order.status })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: order.deliveryDate })] }, order.id))) })] }) })] }));
};
export default OrderFulfillment;
