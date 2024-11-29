import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Wine, Star, ShoppingCart, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import BentoBox from '../../components/BentoBox';
import { supabase } from '../../supabase.ts';
const CustomerDashboard = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const burgundy = '#800020';
    const charcoalGray = '#1A1A1D';
    const [wines, setWines] = useState([]);
    const [loading, setLoading] = useState(true);
    const winesTastedData = [
        { month: 'Jan', count: 5 },
        { month: 'Feb', count: 8 },
        { month: 'Mar', count: 12 },
        { month: 'Apr', count: 10 },
        { month: 'May', count: 15 },
        { month: 'Jun', count: 13 },
    ];
    useEffect(() => {
        const fetchWines = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('wine_inventory')
                    .select(`id, name, country, varietal, region, sub_region, vintage, producer, image_path`)
                    .limit(5);
                if (error) {
                    console.error('Supabase error:', error.message);
                    return;
                }
                if (data) {
                    setWines(data);
                }
            }
            catch (error) {
                console.error('Unexpected error:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchWines();
    }, []);
    const widgets = [
        {
            title: 'Wines Tasted',
            value: '15',
            icon: Wine,
            iconColor: isDark ? 'text-white' : 'text-gray-900',
            titleColor: isDark ? 'text-white' : burgundy,
            size: 'col-span-1',
            path: '/my-wines',
        },
        {
            title: 'Average Rating',
            value: '94',
            icon: Star,
            iconColor: isDark ? 'text-white' : 'text-gray-900',
            titleColor: isDark ? 'text-white' : burgundy,
            size: 'col-span-1',
            path: '/rate-wines',
        },
        {
            title: 'Upcoming Deliveries',
            value: '2',
            icon: ShoppingCart,
            iconColor: isDark ? 'text-white' : 'text-gray-900',
            titleColor: isDark ? 'text-white' : burgundy,
            size: 'col-span-1',
            path: '/order-history',
        },
        {
            title: 'Next Event',
            value: 'Jun 15',
            icon: Calendar,
            iconColor: isDark ? 'text-white' : 'text-gray-900',
            titleColor: isDark ? 'text-white' : burgundy,
            size: 'col-span-1',
            path: '/customer-calendar',
        },
    ];
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: `text-3xl font-bold mb-8 font-HVFlorentino ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Welcome to Your Wine Dashboard" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: widgets.map((widget, index) => (_jsx(BentoBox, { title: widget.title, value: widget.value, icon: widget.icon, iconColor: widget.iconColor, titleColor: widget.titleColor, backgroundColor: isDark ? charcoalGray : 'white', size: widget.size, path: widget.path }, index))) }), _jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(BentoBox, { title: "Your Recommended Wines", size: "col-span-3", path: "/recommendations", titleColor: isDark ? 'text-white' : burgundy, backgroundColor: isDark ? charcoalGray : 'white', children: loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-4", children: [...Array(3)].map((_, index) => (_jsx("div", { className: `animate-pulse bg-gray-700 rounded-lg h-32 w-full` }, index))) })) : wines.length === 0 ? (_jsx("div", { className: "text-center text-gray-500", children: "No recommended wines available." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-4", children: wines.map((wine) => (_jsxs("div", { className: `p-4 rounded-lg border ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`, children: [_jsx("h2", { className: `font-bold ${isDark ? 'text-white' : 'text-gray-900'}`, children: wine.name }), _jsx("p", { className: `text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`, children: wine.producer }), _jsxs("p", { className: `text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`, children: [wine.region, ", ", wine.country] })] }, wine.id))) })) }), _jsx(BentoBox, { title: "Wines Tasted Over Time", size: "col-span-2 row-span-2", path: "/my-wines", titleColor: isDark ? 'text-white' : burgundy, backgroundColor: isDark ? charcoalGray : 'white', children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: winesTastedData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: isDark ? '#333' : '#ccc' }), _jsx(XAxis, { dataKey: "month", stroke: isDark ? '#aaa' : '#666' }), _jsx(YAxis, { stroke: isDark ? '#aaa' : '#666' }), _jsx(Tooltip, { contentStyle: {
                                            backgroundColor: isDark ? charcoalGray : 'white',
                                            borderRadius: '8px',
                                            color: isDark ? 'white' : 'black',
                                        } }), _jsx(Line, { type: "monotone", dataKey: "count", stroke: burgundy, strokeWidth: 2, dot: { fill: burgundy, r: 4 } })] }) }) }), _jsx(BentoBox, { title: "Top Rated Wines", size: "col-span-1 row-span-2", path: "/my-wines", titleColor: isDark ? 'text-white' : burgundy, backgroundColor: isDark ? charcoalGray : 'white', children: _jsxs("ul", { className: "list-disc pl-5 text-sm", children: [_jsx("li", { className: `${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Chateau Margaux 2015" }), _jsx("li", { className: `${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Opus One 2018" }), _jsx("li", { className: `${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Dom Perignon 2010" })] }) })] })] }));
};
export default CustomerDashboard;
