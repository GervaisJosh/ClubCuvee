import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminGuard from './AdminGuard';
import AdminDashboard from '../../pages/admin/Dashboard';
import AdminOnboardingTester from '../../pages/admin/OnboardingTester';

/**
 * Component that contains all admin routes with AdminGuard protection
 * This component handles all routes under the /admin/* path
 */
const AdminRoutes: React.FC = () => {
  return (
    <AdminGuard>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="onboarding-tester" element={<AdminOnboardingTester />} />
        {/* Additional admin routes can be added here */}
      </Routes>
    </AdminGuard>
  );
};

export default AdminRoutes;