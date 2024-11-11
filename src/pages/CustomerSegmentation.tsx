import React, { useState } from 'react';
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Customer Segmentation & Targeting</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {segments.map(segment => (
          <div key={segment.id} className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{segment.name}</h2>
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <span>{segment.count} members</span>
            </div>
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              <span>${segment.avgSpend} avg. spend</span>
            </div>
            <div className="flex items-center mb-2">
              <Wine className="h-5 w-5 mr-2 text-red-500" />
              <span>{segment.preferredWine} wine preference</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Last purchase: {segment.lastPurchase}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Member Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Average Spending by Segment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Average Spend" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CustomerSegmentation;