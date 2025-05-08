import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminGuard from '../../components/admin/AdminGuard';
import { useAuth } from '../../contexts/AuthContext';
import OnboardRestaurantCard from '../../components/admin/OnboardRestaurantCard';
import SystemHealthCard from '../../components/admin/SystemHealthCard';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow text-center">
          <h1 className="text-2xl font-bold text-[#800020] mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8 px-2 sm:px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <OnboardRestaurantCard />
          <SystemHealthCard />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;