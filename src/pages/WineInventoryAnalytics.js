import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Wine, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BentoBox from '../components/BentoBox';
const WineInventoryAnalytics = () => {
    const [inventoryStats, setInventoryStats] = useState(null);
    const [uploadedData, setUploadedData] = useState(null);
    useEffect(() => {
        const savedStats = localStorage.getItem('inventoryStats');
        const savedData = localStorage.getItem('uploadedData');
        if (savedStats) {
            setInventoryStats(JSON.parse(savedStats));
        }
        if (savedData) {
            setUploadedData(JSON.parse(savedData));
        }
    }, []);
    const calculateInventoryBreakdown = () => {
        if (!uploadedData)
            return [];
        const categoryCount = uploadedData.reduce((acc, wine) => {
            acc[wine.category] = (acc[wine.category] || 0) + wine.onsite_qty + wine.offsite_qty;
            return acc;
        }, {});
        const totalBottles = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);
        const breakdown = Object.entries(categoryCount)
            .map(([category, count]) => ({
            name: category,
            value: Number((count / totalBottles * 100).toFixed(2))
        }))
            .sort((a, b) => b.value - a.value);
        const largestCategory = breakdown[0];
        const updatedBreakdown = [
            { name: 'Other', value: largestCategory.value },
            ...breakdown.slice(1, 4)
        ];
        const remainingSum = breakdown.slice(4).reduce((sum, item) => sum + item.value, 0);
        if (remainingSum > 0) {
            updatedBreakdown[0].value += remainingSum;
        }
        return updatedBreakdown;
    };
    const inventoryData = calculateInventoryBreakdown();
    const COLORS = ['#8884D8', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (_jsx("div", { className: "bg-gray-800 p-2 rounded shadow", children: _jsx("p", { className: "text-white", children: `${payload[0].name}: ${payload[0].value.toFixed(2)}%` }) }));
        }
        return null;
    };
    const topSellingWines = uploadedData
        ? uploadedData
            .sort((a, b) => (b.onsite_qty + b.offsite_qty) - (a.onsite_qty + a.offsite_qty))
            .slice(0, 5)
            .map(wine => ({ name: wine.item, sales: wine.onsite_qty + wine.offsite_qty }))
        : [];
    return (_jsxs("div", { className: "p-6 bg-black", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6 text-white", children: "Wine Inventory Analytics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6", children: [_jsx(BentoBox, { title: "Total Inventory", value: inventoryStats ? inventoryStats.totalBottles.toLocaleString() : '0', icon: Wine, color: "bg-purple-500", size: "col-span-1", path: "/wines", children: _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "bottles" }) }), _jsx(BentoBox, { title: "Inventory Value", value: inventoryStats ? formatCurrency(inventoryStats.totalValue) : '$0.00', icon: DollarSign, color: "bg-yellow-500", size: "col-span-1", path: "/wines", children: _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "total value" }) }), _jsx(BentoBox, { title: "Low Stock Alert", value: inventoryStats ? inventoryStats.lowStockCount.toLocaleString() : '0', icon: AlertTriangle, color: "bg-red-500", size: "col-span-1", path: "/wines", children: _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "wines below threshold" }) }), _jsx(BentoBox, { title: "Unique Varietals", value: inventoryStats ? inventoryStats.uniqueVarietals.toLocaleString() : '0', icon: Wine, color: "bg-green-500", size: "col-span-1", path: "/wines", children: _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "different wine types" }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(BentoBox, { title: "Inventory Breakdown", size: "col-span-1 row-span-2", path: "/wines", children: [_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: inventoryData, cx: "50%", cy: "50%", outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: inventoryData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) })] }) }), _jsx("div", { className: "mt-4 grid grid-cols-2 gap-2", children: inventoryData.map((entry, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-4 h-4 mr-2", style: { backgroundColor: COLORS[index % COLORS.length] } }), _jsxs("span", { className: "text-white", children: [entry.name, " ", entry.value.toFixed(2), "%"] })] }, `legend-${index}`))) })] }), _jsx(BentoBox, { title: "Top Selling Wines", size: "col-span-1 row-span-2", path: "/wines", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-white", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-700", children: [_jsx("th", { className: "py-2", children: "Wine" }), _jsx("th", { className: "py-2", children: "Sales" }), _jsx("th", { className: "py-2", children: "Trend" })] }) }), _jsx("tbody", { children: topSellingWines.map((wine, index) => (_jsxs("tr", { className: "border-b border-gray-700", children: [_jsx("td", { className: "py-2", children: wine.name }), _jsx("td", { className: "py-2", children: wine.sales }), _jsxs("td", { className: "py-2", children: [_jsx(TrendingUp, { className: "h-5 w-5 text-green-500 inline-block mr-2" }), _jsx("span", { className: "text-green-500", children: "Trending" })] })] }, index))) })] }) }) }), _jsx(BentoBox, { title: "Inventory Value by Category", size: "col-span-2", path: "/wines", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: inventoryData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", stroke: "#fff" }), _jsx(YAxis, { stroke: "#fff" }), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8", name: "Percentage" })] }) }) })] })] }));
};
export default WineInventoryAnalytics;
