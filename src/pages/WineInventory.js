import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Wine, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
const WineInventory = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [wines, setWines] = useState([
        { id: 1, name: 'Chateau Margaux 2015', type: 'Red', region: 'Bordeaux', stock: 24, price: 599.99 },
        { id: 2, name: 'Opus One 2018', type: 'Red', region: 'Napa Valley', stock: 18, price: 399.99 },
        { id: 3, name: 'Dom Perignon 2010', type: 'Champagne', region: 'Champagne', stock: 36, price: 249.99 },
    ]);
    const handleEdit = (id) => {
        // Placeholder for edit functionality
        console.log('Edit wine with id:', id);
    };
    const handleDelete = (id) => {
        // Placeholder for delete functionality
        setWines(wines.filter(wine => wine.id !== id));
    };
    return (_jsxs("div", { className: `p-6 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`, children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Wine Inventory Management" }), _jsx("div", { className: `${isDark ? 'bg-gray-800' : 'bg-gray-100'} shadow-md rounded-lg overflow-hidden`, children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: `${isDark ? 'bg-gray-700' : 'bg-gray-200'}`, children: _jsxs("tr", { children: [_jsx("th", { className: `px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`, children: "Name" }), _jsx("th", { className: `px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`, children: "Type" }), _jsx("th", { className: `px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`, children: "Region" }), _jsx("th", { className: `px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`, children: "Stock" }), _jsx("th", { className: `px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`, children: "Price" }), _jsx("th", { className: `px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`, children: "Actions" })] }) }), _jsx("tbody", { className: `${isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-300'}`, children: wines.map((wine) => (_jsxs("tr", { className: isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50', children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Wine, { className: `h-6 w-6 ${isDark ? 'text-red-500' : 'text-red-700'} mr-2` }), _jsx("div", { className: "text-sm font-medium", children: wine.name })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: wine.type }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: wine.region }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: wine.stock }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: ["$", wine.price.toFixed(2)] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: [_jsx("button", { onClick: () => handleEdit(wine.id), className: `mr-2 ${isDark ? 'text-blue-400 hover:text-blue-500' : 'text-blue-600 hover:text-blue-700'}`, children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(wine.id), className: `${isDark ? 'text-red-400 hover:text-red-500' : 'text-red-600 hover:text-red-700'}`, children: _jsx(Trash2, { size: 18 }) })] })] }, wine.id))) })] }) })] }));
};
export default WineInventory;
