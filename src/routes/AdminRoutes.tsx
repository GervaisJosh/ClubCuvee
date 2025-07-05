import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminGuard from '../components/admin/AdminGuard';
import AdminLayout from '../components/admin/AdminLayout';
import BusinessInvitations from '../pages/admin/BusinessInvitations';

const AdminRoutes: React.FC = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route index element={<BusinessInvitations />} />
          <Route path="business-invitations" element={<BusinessInvitations />} />
          {/* Add more admin routes here */}
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminRoutes;