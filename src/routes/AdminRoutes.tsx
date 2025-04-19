import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import OnboardingTester from '../pages/admin/OnboardingTester';
import DiagnosticsTest from '../pages/admin/DiagnosticsTest';

const AdminRoutes: React.FC = () => {
  return (
    <ProtectedRoute requiredPortal="admin">
      <AdminLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="onboarding-tester" element={<OnboardingTester />} />
          <Route path="diagnostics" element={<DiagnosticsTest />} />
          {/* Add more admin routes here */}
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminRoutes;