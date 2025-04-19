import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import BusinessLayout from '../layouts/BusinessLayout';
import BusinessDashboard from '../pages/business/Dashboard';

const BusinessRoutes: React.FC = () => {
  return (
    <ProtectedRoute requiredPortal="business">
      <BusinessLayout>
        <Routes>
          <Route index element={<BusinessDashboard />} />
          <Route path="dashboard" element={<BusinessDashboard />} />
          <Route path="wines" element={<div>Wine Inventory</div>} />
          <Route path="membership-tiers" element={<div>Membership Tiers</div>} />
          <Route path="customers" element={<div>Customers</div>} />
          <Route path="orders" element={<div>Orders</div>} />
          <Route path="analytics" element={<div>Analytics</div>} />
          <Route path="events" element={<div>Events</div>} />
          <Route path="settings" element={<div>Settings</div>} />
          {/* Add more business routes here */}
        </Routes>
      </BusinessLayout>
    </ProtectedRoute>
  );
};

export default BusinessRoutes;