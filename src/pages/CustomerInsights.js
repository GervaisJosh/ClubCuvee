import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { User, Star, DollarSign, Wine, Crown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import BentoBox from '../components/BentoBox';
const CustomerInsights = () => {
    const [customers, setCustomers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', totalSpent: 2499.95, avgRating: 4.5, favoriteWine: 'Chateau Margaux', membershipTier: 'Premier Growth Membership' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', totalSpent: 1899.97, avgRating: 4.8, favoriteWine: 'Opus One', membershipTier: 'Grand Cru Membership' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', totalSpent: 3299.93, avgRating: 4.2, favoriteWine: 'Dom Perignon', membershipTier: 'Monopole Membership' },
    ]);
    const membershipData = [
        { name: 'Premier Growth', value: 50 },
        { name: 'Grand Cru', value: 30 },
        { name: 'Monopole', value: 20 },
    ];
    const spendingData = [
        { name: 'John Doe', spent: 2499.95 },
        { name: 'Jane Smith', spent: 1899.97 },
        { name: 'Bob Johnson', spent: 3299.93 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (_jsxs("div", { className: "p-6 bg-black text-white", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Customer Insights" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: customers.map((customer) => (_jsxs(BentoBox, { title: customer.name, icon: User, color: "bg-blue-500", size: "col-span-1", path: `/customer/${customer.id}`, children: [_jsx("p", { className: "text-gray-400 mb-2", children: customer.email }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(DollarSign, { className: "h-5 w-5 text-yellow-500 mr-2" }), _jsxs("span", { children: ["Total Spent: $", customer.totalSpent.toFixed(2)] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Star, { className: "h-5 w-5 text-yellow-500 mr-2" }), _jsxs("span", { children: ["Avg. Rating: ", customer.avgRating.toFixed(1)] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Wine, { className: "h-5 w-5 text-red-500 mr-2" }), _jsxs("span", { children: ["Favorite Wine: ", customer.favoriteWine] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Crown, { className: "h-5 w-5 text-purple-500 mr-2" }), _jsxs("span", { children: ["Membership: ", customer.membershipTier] })] })] })] }, customer.id))) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(BentoBox, { title: "Membership Distribution", size: "col-span-1", path: "/customer-insights", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: membershipData, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: membershipData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1F2937', border: 'none', color: '#fff' } })] }) }) }), _jsx(BentoBox, { title: "Customer Spending", size: "col-span-1", path: "/customer-insights", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: spendingData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }), _jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }), _jsx(YAxis, { stroke: "#9CA3AF" }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1F2937', border: 'none', color: '#fff' } }), _jsx(Bar, { dataKey: "spent", fill: "#8884d8" })] }) }) })] })] }));
};
export default CustomerInsights;
