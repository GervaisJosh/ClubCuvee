import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';
const OrderManagement = () => {
    const [orders, setOrders] = useState([
        { id: 1, customer: 'John Doe', items: 'Chateau Margaux 2015 (2)', status: 'Pending', total: 1199.98 },
        { id: 2, customer: 'Jane Smith', items: 'Opus One 2018 (1), Dom Perignon 2010 (1)', status: 'Shipped', total: 649.98 },
        { id: 3, customer: 'Bob Johnson', items: 'Dom Perignon 2010 (3)', status: 'Delivered', total: 749.97 },
    ]);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return _jsx(Package, { className: "h-5 w-5 text-yellow-500" });
            case 'Shipped':
                return _jsx(Truck, { className: "h-5 w-5 text-blue-500" });
            case 'Delivered':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Order Management" }), _jsx("div", { className: "bg-gray-800 shadow-md rounded-lg overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Order ID" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Items" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider", children: "Total" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-700", children: orders.map((order) => (_jsxs("tr", { children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: ["#", order.id] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: order.customer }), _jsx("td", { className: "px-6 py-4 text-sm", children: order.items }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsxs("div", { className: "flex items-center", children: [getStatusIcon(order.status), _jsx("span", { className: "ml-2", children: order.status })] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: ["$", order.total.toFixed(2)] })] }, order.id))) })] }) })] }));
};
export default OrderManagement;
