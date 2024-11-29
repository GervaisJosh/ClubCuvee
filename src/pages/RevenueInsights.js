import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import BentoBox from '../components/BentoBox';
const RevenueInsights = () => {
    const monthlyRevenue = [
        { month: 'Jan', revenue: 45000, wineRevenue: 30000 },
        { month: 'Feb', revenue: 52000, wineRevenue: 35000 },
        { month: 'Mar', revenue: 48000, wineRevenue: 32000 },
        { month: 'Apr', revenue: 61000, wineRevenue: 40000 },
        { month: 'May', revenue: 55000, wineRevenue: 37000 },
        { month: 'Jun', revenue: 67000, wineRevenue: 45000 },
    ];
    const revenueBreakdown = [
        { name: 'Wine Sales', value: 65 },
        { name: 'Events', value: 20 },
        { name: 'Memberships', value: 15 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
    return (_jsxs("div", { className: "p-6 bg-black text-white", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Revenue Insights" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [_jsx(BentoBox, { title: "Total Revenue", value: "$328,000", icon: DollarSign, color: "bg-green-500", size: "col-span-1", path: "/revenue-insights", children: _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Last 6 months" }) }), _jsx(BentoBox, { title: "Revenue Growth", value: "+12.5%", icon: TrendingUp, color: "bg-blue-500", size: "col-span-1", path: "/revenue-insights", children: _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Compared to previous period" }) }), _jsx(BentoBox, { title: "Peak Revenue Day", value: "June 15", icon: Calendar, color: "bg-yellow-500", size: "col-span-1", path: "/revenue-insights", children: _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "$12,500 in sales" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(BentoBox, { title: "Monthly Revenue Trend", size: "col-span-1", path: "/revenue-insights", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: monthlyRevenue, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }), _jsx(XAxis, { dataKey: "month", stroke: "#9CA3AF" }), _jsx(YAxis, { stroke: "#9CA3AF" }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1F2937', border: 'none', color: '#fff' } }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#10B981", name: "Total Revenue", strokeWidth: 2, dot: { fill: '#10B981', strokeWidth: 2 } }), _jsx(Line, { type: "monotone", dataKey: "wineRevenue", stroke: "#3B82F6", name: "Wine Revenue", strokeWidth: 2, dot: { fill: '#3B82F6', strokeWidth: 2 } })] }) }) }), _jsxs(BentoBox, { title: "Revenue Breakdown", size: "col-span-1", path: "/revenue-insights", children: [_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: revenueBreakdown, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: revenueBreakdown.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1F2937', border: 'none', color: '#fff' } })] }) }), _jsx("div", { className: "flex justify-center mt-4", children: revenueBreakdown.map((entry, index) => (_jsxs("div", { className: "flex items-center mx-2", children: [_jsx("div", { className: "w-3 h-3 mr-1", style: { backgroundColor: COLORS[index % COLORS.length] } }), _jsx("span", { className: "text-sm", children: entry.name })] }, `legend-${index}`))) })] })] })] }));
};
export default RevenueInsights;
