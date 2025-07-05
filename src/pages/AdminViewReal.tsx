import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wine, Star, ShoppingCart, Calendar, Gift, Heart, TrendingUp, Percent, DollarSign, Package, Users, BarChart2, Upload, FileText, PieChart, Target, Zap, Settings, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
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

const AdminViewReal = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [uploadedData, setUploadedData] = useState<WineData[] | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('apiData');
    const storedUploadedData = localStorage.getItem('uploadedData');
    if (storedData) {
      setApiData(JSON.parse(storedData));
    }
    if (storedUploadedData) {
      setUploadedData(JSON.parse(storedUploadedData));
    }
  }, []);

  const calculateTotalRevenue = () => {
    if (apiData && apiData.toast && apiData.toast.sales) {
      return apiData.toast.sales.reduce((total, sale) => total + sale.revenue, 0);
    }
    return 0;
  };

  const calculateTotalInventory = () => {
    if (uploadedData) {
      return uploadedData.reduce((total, item) => total + item.onsite_qty + item.offsite_qty, 0);
    }
    return 0;
  };

  const calculateInventoryValue = () => {
    if (uploadedData) {
      return uploadedData.reduce((total, item) => total + (item.onsite_qty + item.offsite_qty) * item.cost, 0);
    }
    return 0;
  };

  const calculatePendingOrders = () => {
    if (apiData && apiData.opentable && apiData.opentable.reservations) {
      return apiData.opentable.reservations.length;
    }
    return 0;
  };

  const calculateLowStockCount = () => {
    if (uploadedData) {
      return uploadedData.filter(item => (item.onsite_qty + item.offsite_qty) <= 3).length;
    }
    return 0;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
  };

  const adminWidgets = [
    { title: 'Total Revenue', value: formatCurrency(calculateTotalRevenue()), icon: DollarSign, color: 'bg-green-500', size: 'col-span-1', path: '/revenue-insights' },
    { title: 'Wine Inventory', value: formatNumber(calculateTotalInventory()), icon: Wine, color: 'bg-red-500', size: 'col-span-1', path: '/wines' },
    { title: 'Inventory Value', value: formatCurrency(calculateInventoryValue()), icon: DollarSign, color: 'bg-yellow-500', size: 'col-span-1', path: '/wines' },
    { title: 'Pending Orders', value: calculatePendingOrders(), icon: Package, color: 'bg-blue-500', size: 'col-span-1', path: '/order-fulfillment' },
    { title: 'Active Customers', value: apiData?.customers?.length || 0, icon: Users, color: 'bg-purple-500', size: 'col-span-1', path: '/customer-segmentation' },
    { title: 'Upload Wine List', icon: Upload, color: 'bg-indigo-500', size: 'col-span-1', path: '/wine-inventory-upload' },
    { title: 'Monthly Revenue Trend', chart: 'lineChart', size: 'col-span-2 row-span-2', path: '/wine-inventory-analytics' },
    { title: 'Top Selling Wines', list: apiData && apiData.toast ? apiData.toast.sales.slice(0, 5).map(sale => sale.wine) : ['--', '--', '--'], icon: TrendingUp, size: 'col-span-1 row-span-2', path: '/wine-inventory-analytics' },
    { title: 'Revenue Breakdown', chart: 'barChart', size: 'col-span-2 row-span-2', path: '/revenue-insights' },
    { title: 'Avg Customer Rating', value: apiData?.ratings?.average || '--', icon: Star, color: 'bg-orange-500', size: 'col-span-1', path: '/customer-insights' },
    { title: 'Upcoming Events', value: apiData?.events?.length || 0, icon: Calendar, color: 'bg-indigo-500', size: 'col-span-1', path: '/admin-calendar' },
    { title: 'Low Stock Alert', value: calculateLowStockCount(), icon: AlertTriangle, color: 'bg-red-500', size: 'col-span-1', path: '/wine-inventory-upload' },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const revenueBreakdown = [
    { name: 'Wine Sales', value: 65 },
    { name: 'Events', value: 20 },
    { name: 'Memberships', value: 15 },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          Admin Dashboard (Real)
        </h1>
        <button
          onClick={() => navigate('/api-connection')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Connect to your data
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {adminWidgets.map((widget, index) => (
          <BentoBox
            key={index}
            title={widget.title}
            value={widget.value}
            icon={widget.icon}
            color={widget.color}
            size={widget.size}
            path={widget.path}
          >
            {widget.chart === 'lineChart' && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            {widget.chart === 'barChart' && (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {widget.list && (
              <ul className="list-disc list-inside text-white">
                {widget.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </BentoBox>
        ))}
      </div>
    </div>
  );
};

export default AdminViewReal;
