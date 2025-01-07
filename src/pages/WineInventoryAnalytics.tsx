import React, { useState, useEffect } from 'react';
import { Wine, TrendingUp, TrendingDown, DollarSign, BarChart2, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BentoBox from '../components/BentoBox';

interface WineData {
  barcode: string;
  vendor: string;
  item: string;
  onsite_qty: number;
  offsite_qty: number;
  cost: number;
  list_price: number;
  bin1: string;
  bin2: string;
  bin3: string;
  bin4: string;
  country: string;
  appellation: string;
  sub_appellation: string;
  category: string;
  varietal: string;
  format: string;
  vintage: string;
  item_par: number;
}

interface InventoryStats {
  uniqueWines: number;
  totalBottles: number;
  totalValue: number;
  uniqueVarietals: number;
  mostCommonVarietal: string;
  uniqueCountries: number;
  mostPopularCountry: string;
  uniqueAppellations: number;
  uniqueSubAppellations: number;
  lowStockCount: number;
}

const WineInventoryAnalytics = () => {
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [uploadedData, setUploadedData] = useState<WineData[] | null>(null);

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
    if (!uploadedData) return [];

    const categoryCount = uploadedData.reduce((acc, wine) => {
      acc[wine.category] = (acc[wine.category] || 0) + wine.onsite_qty + wine.offsite_qty;
      return acc;
    }, {});

    const totalBottles = Object.values(categoryCount).reduce((sum: number, count: number) => sum + count, 0);

    const breakdown = Object.entries(categoryCount)
      .map(([category, count]) => ({
        name: category,
        value: Number(((count as number) / totalBottles * 100).toFixed(2))
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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded shadow">
          <p className="text-white">{`${payload[0].name}: ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const topSellingWines = uploadedData
    ? uploadedData
        .sort((a, b) => (b.onsite_qty + b.offsite_qty) - (a.onsite_qty + a.offsite_qty))
        .slice(0, 5)
        .map(wine => ({ name: wine.item, sales: wine.onsite_qty + wine.offsite_qty }))
    : [];

  return (
    <div className="p-6 bg-black">
      <h1 className="text-3xl font-semibold mb-6 text-white">Wine Inventory Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <BentoBox
          title="Total Inventory"
          value={inventoryStats ? inventoryStats.totalBottles.toLocaleString() : '0'}
          icon={Wine}
          color="bg-purple-500"
          size="col-span-1"
          path="/wines"
        >
          <p className="text-sm text-gray-400 mt-2">bottles</p>
        </BentoBox>
        
        <BentoBox
          title="Inventory Value"
          value={inventoryStats ? formatCurrency(inventoryStats.totalValue) : '$0.00'}
          icon={DollarSign}
          color="bg-yellow-500"
          size="col-span-1"
          path="/wines"
        >
          <p className="text-sm text-gray-400 mt-2">total value</p>
        </BentoBox>
        
        <BentoBox
          title="Low Stock Alert"
          value={inventoryStats ? inventoryStats.lowStockCount.toLocaleString() : '0'}
          icon={AlertTriangle}
          color="bg-red-500"
          size="col-span-1"
          path="/wines"
        >
          <p className="text-sm text-gray-400 mt-2">wines below threshold</p>
        </BentoBox>
        
        <BentoBox
          title="Unique Varietals"
          value={inventoryStats ? inventoryStats.uniqueVarietals.toLocaleString() : '0'}
          icon={Wine}
          color="bg-green-500"
          size="col-span-1"
          path="/wines"
        >
          <p className="text-sm text-gray-400 mt-2">different wine types</p>
        </BentoBox>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BentoBox
          title="Inventory Breakdown"
          size="col-span-1 row-span-2"
          path="/wines"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {inventoryData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-white">{entry.name} {entry.value.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </BentoBox>
        
        <BentoBox
          title="Top Selling Wines"
          size="col-span-1 row-span-2"
          path="/wines"
        ><div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2">Wine</th>
                  <th className="py-2">Sales</th>
                  <th className="py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topSellingWines.map((wine, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2">{wine.name}</td>
                    <td className="py-2">{wine.sales}</td>
                    <td className="py-2">
                      <TrendingUp className="h-5 w-5 text-green-500 inline-block mr-2" />
                      <span className="text-green-500">Trending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoBox>
        
        <BentoBox
          title="Inventory Value by Category"
          size="col-span-2"
          path="/wines"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Percentage" />
            </BarChart>
          </ResponsiveContainer>
        </BentoBox>
      </div>
    </div>
  );
};

export default WineInventoryAnalytics;
