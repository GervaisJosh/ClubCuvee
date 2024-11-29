import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Wine, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
const MyWines = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [wines, setWines] = useState([
        { id: 1, name: 'Chateau Margaux 2015', type: 'Red', region: 'Bordeaux', rating: 95, notes: 'Exceptional balance and complexity' },
        { id: 2, name: 'Opus One 2018', type: 'Red', region: 'Napa Valley', rating: 92, notes: 'Rich and full-bodied' },
        { id: 3, name: 'Dom Perignon 2010', type: 'Champagne', region: 'Champagne', rating: 98, notes: 'Luxurious and refined' },
    ]);
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: `text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`, children: "My Wines" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: wines.map((wine) => (_jsxs("div", { className: `${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105`, children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Wine, { className: "h-8 w-8 text-red-500 mr-4" }), _jsxs("div", { children: [_jsx("h2", { className: `text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`, children: wine.name }), _jsxs("p", { className: `${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: [wine.type, " | ", wine.region] })] })] }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Star, { className: "h-5 w-5 text-yellow-500 mr-1" }), _jsx("span", { className: `font-bold ${isDark ? 'text-white' : 'text-gray-900'}`, children: wine.rating }), _jsx("span", { className: `ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: "/100" })] }), _jsx("p", { className: `text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`, children: wine.notes }), _jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out", children: "Update Rating" })] }, wine.id))) })] }));
};
export default MyWines;
