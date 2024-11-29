import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Set Up Dashboard" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: ['openTable', 'toast', 'binWise'].map((service) => (_jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 capitalize", children: service.replace(/([A-Z])/g, ' $1').trim() }), _jsxs("div", { className: "flex items-center mb-4", children: [_jsx("input", { type: "text", value: apiKeys[service], onChange: (e) => handleApiKeyChange(service, e.target.value), placeholder: "Enter API Key", className: "flex-grow px-3 py-2 bg-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500" }), _jsx("button", { onClick: () => handleConnect(service), className: "bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 transition-colors duration-200", children: "Connect" })] }), _jsxs("div", { className: "flex items-center text-blue-400 hover:text-blue-300", children: [_jsx(Link, { className: "h-4 w-4 mr-2" }), _jsx("a", { href: "#", className: "text-sm", children: "Learn how to get your API key" })] })] }, service))) })] }));
};
export default SetupDashboard;
