import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Users, Wine, DollarSign, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const CustomerSegmentation = () => {
    const [segments, setSegments] = useState([
        { id: 1, name: 'First Growth Members', count: 500, avgSpend: 150, preferredWine: 'Red', lastPurchase: '2 days ago' },
        { id: 2, name: 'Premier Cru Members', count: 300, avgSpend: 300, preferredWine: 'White', lastPurchase: '1 week ago' },
        { id: 3, name: 'Grand Cru Members', count: 150, avgSpend: 750, preferredWine: 'Sparkling', lastPurchase: '3 days ago' },
        { id: 4, name: 'Monopole Members', count: 50, avgSpend: 1000, preferredWine: 'Mixed', lastPurchase: '1 day ago' },
    ]);
    const segmentData = segments.map(segment => ({
        name: segment.name,
        value: segment.count
    }));
    const spendingData = segments.map(segment => ({
        name: segment.name,
        'Average Spend': segment.avgSpend
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Customer Segmentation & Targeting" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6", children: segments.map(segment => (_jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: segment.name }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Users, { className: "h-5 w-5 mr-2 text-blue-500" }), _jsxs("span", { children: [segment.count, " members"] })] }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(DollarSign, { className: "h-5 w-5 mr-2 text-green-500" }), _jsxs("span", { children: ["$", segment.avgSpend, " avg. spend"] })] }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Wine, { className: "h-5 w-5 mr-2 text-red-500" }), _jsxs("span", { children: [segment.preferredWine, " wine preference"] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-5 w-5 mr-2 text-yellow-500" }), _jsxs("span", { children: ["Last purchase: ", segment.lastPurchase] })] })] }, segment.id))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Member Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: segmentData, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: segmentData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Average Spending by Segment" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: spendingData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "Average Spend", fill: "#8884d8" })] }) })] })] })] }));
};
export default CustomerSegmentation;
