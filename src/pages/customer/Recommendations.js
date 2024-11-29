import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Wine, Star, Droplet, Thermometer, Grape } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
const Recommendations = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const recommendedWines = [
        {
            id: 1,
            name: 'Chateau Margaux 2016',
            type: 'Red',
            region: 'Bordeaux',
            rating: 98,
            attributes: ['full-bodied', 'tannic', 'oak'],
            varietal: 'Cabernet Sauvignon'
        },
        {
            id: 2,
            name: 'Krug Grande Cuvée',
            type: 'Champagne',
            region: 'Champagne',
            rating: 96,
            attributes: ['bubbly', 'crisp', 'yeasty'],
            varietal: 'Chardonnay Blend'
        },
        {
            id: 3,
            name: 'Sassicaia 2018',
            type: 'Red',
            region: 'Tuscany',
            rating: 97,
            attributes: ['bold', 'structured', 'complex'],
            varietal: 'Cabernet Blend'
        },
        {
            id: 4,
            name: 'Cloudy Bay Sauvignon Blanc 2022',
            type: 'White',
            region: 'Marlborough',
            rating: 93,
            attributes: ['crisp', 'zesty', 'herbaceous'],
            varietal: 'Sauvignon Blanc'
        },
    ];
    const getWineIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'red':
                return _jsx(Wine, { className: "h-8 w-8 text-red-500" });
            case 'white':
                return _jsx(Wine, { className: "h-8 w-8 text-yellow-300" });
            case 'champagne':
                return _jsx(Wine, { className: "h-8 w-8 text-yellow-100" });
            default:
                return _jsx(Wine, { className: "h-8 w-8 text-purple-500" });
        }
    };
    const getAttributeIcon = (attribute) => {
        switch (attribute) {
            case 'full-bodied':
            case 'bold':
                return _jsx(Thermometer, { className: "h-5 w-5 text-red-400" });
            case 'crisp':
            case 'zesty':
                return _jsx(Droplet, { className: "h-5 w-5 text-blue-400" });
            case 'tannic':
            case 'structured':
                return _jsx(Grape, { className: "h-5 w-5 text-purple-400" });
            default:
                return _jsx(Star, { className: "h-5 w-5 text-yellow-400" });
        }
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: `text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Recommended Wines" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: recommendedWines.map((wine) => (_jsx("div", { className: `${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105`, children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [getWineIcon(wine.type), _jsx("span", { className: `text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: wine.type })] }), _jsx("h2", { className: `text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`, children: wine.name }), _jsx("p", { className: `${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`, children: wine.region }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Star, { className: "h-5 w-5 text-yellow-500 mr-1" }), _jsx("span", { className: `font-bold mr-1 ${isDark ? 'text-white' : 'text-gray-900'}`, children: wine.rating }), _jsx("span", { className: `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: "/ 100" })] }), _jsx("p", { className: `text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`, children: wine.varietal }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: wine.attributes.map((attr, index) => (_jsxs("div", { className: `flex items-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-full px-3 py-1`, children: [getAttributeIcon(attr), _jsx("span", { className: `ml-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: attr })] }, index))) }), _jsx("button", { className: "w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out", children: "View Details" })] }) }, wine.id))) })] }));
};
export default Recommendations;
