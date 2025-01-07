import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Wine } from 'lucide-react';
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

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-3xl font-semibold mb-6">Revenue Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <BentoBox
          title="Total Revenue"
          value="$328,000"
          icon={DollarSign}
          color="bg-green-500"
          size="col-span-1"
          path="/revenue-insights"
        >
          <p className="text-sm text-gray-400 mt-2">Last 6 months</p>
        </BentoBox>
        
        <BentoBox
          title="Revenue Growth"
          value="+12.5%"
          icon={TrendingUp}
          color="bg-blue-500"
          size="col-span-1"
          path="/revenue-insights"
        >
          <p className="text-sm text-gray-400 mt-2">Compared to previous period</p>
        </BentoBox>
        
        <BentoBox
          title="Peak Revenue Day"
          value="June 15"
          icon={Calendar}
          color="bg-yellow-500"
          size="col-span-1"
          path="/revenue-insights"
        >
          <p className="text-sm text-gray-400 mt-2">$12,500 in sales</p>
        </BentoBox>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoBox
          title="Monthly Revenue Trend"
          size="col-span-1"
          path="/revenue-insights"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Total Revenue" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="wineRevenue" stroke="#3B82F6" name="Wine Revenue" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </BentoBox>
        
        <BentoBox
          title="Revenue Breakdown"
          size="col-span-1"
          path="/revenue-insights"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4">
            {revenueBreakdown.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center mx-2">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </BentoBox>
      </div>
    </div>
  );
};

export default RevenueInsights;
