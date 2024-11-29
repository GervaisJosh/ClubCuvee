import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const OrderManagementView = ({ userRole, setUserRole }) => {
    return (_jsxs("div", { className: "relative min-h-screen bg-black text-white", children: [_jsx("div", { className: "absolute top-4 right-4 z-50", children: _jsxs("select", { value: userRole || 'customer', onChange: (e) => setUserRole(e.target.value), className: "bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500", children: [_jsx("option", { value: "customer", children: "Customer View" }), _jsx("option", { value: "admin", children: "Admin View" })] }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "flex justify-between items-center mb-6", children: _jsx("h1", { className: "text-3xl font-semibold", children: "Order Management" }) }) })] }));
};
export default OrderManagementView;
