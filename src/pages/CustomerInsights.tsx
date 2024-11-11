import React, { useState } from 'react';
import { User, Star, DollarSign, Wine, MessageSquare, Crown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-3xl font-semibold mb-6">Customer Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {customers.map((customer) => (
          <BentoBox
            key={customer.id}
            title={customer.name}
            icon={User}
            color="bg-blue-500"
            size="col-span-1"
            path={`/customer/${customer.id}`}
          >
            <p className="text-gray-400 mb-2">{customer.email}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                <span>Total Spent: ${customer.totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span>Avg. Rating: {customer.avgRating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Wine className="h-5 w-5 text-red-500 mr-2" />
                <span>Favorite Wine: {customer.favoriteWine}</span>
              </div>
              <div className="flex items-center">
                <Crown className="h-5 w-5 text-purple-500 mr-2" />
                <span>Membership: {customer.membershipTier}</span>
              </div>
            </div>
          </BentoBox>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoBox
          title="Membership Distribution"
          size="col-span-1"
          path="/customer-insights"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </BentoBox>

        <BentoBox
          title="Customer Spending"
          size="col-span-1"
          path="/customer-insights"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
              <Bar dataKey="spent" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </BentoBox>
      </div>
    </div>
  );
};

export default CustomerInsights;