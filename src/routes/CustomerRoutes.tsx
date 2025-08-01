import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import CustomerLayout from '../layouts/CustomerLayout';
import ScopedCustomerDashboard from '../pages/customer/ScopedCustomerDashboard';
import MyWines from '../pages/customer/MyWines';
import RateWines from '../pages/customer/RateWines';
import OrderHistory from '../pages/customer/OrderHistory';
import Recommendations from '../pages/customer/Recommendations';
import Wishlist from '../pages/customer/Wishlist';
import CustomerCalendar from '../pages/customer/CustomerCalendar';
import Notifications from '../pages/customer/Notifications';
import AccountSettings from '../pages/customer/AccountSettings';

const CustomerRoutes: React.FC = () => {
  return (
    <ProtectedRoute requiredPortal="customer">
      <CustomerLayout>
        <Routes>
          <Route index element={<ScopedCustomerDashboard />} />
          <Route path="dashboard" element={<ScopedCustomerDashboard />} />
          <Route path="my-wines" element={<MyWines />} />
          <Route path="rate-wines" element={<RateWines />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="calendar" element={<CustomerCalendar />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="account-settings" element={<AccountSettings />} />
          {/* Add more customer routes here */}
        </Routes>
      </CustomerLayout>
    </ProtectedRoute>
  );
};

export default CustomerRoutes;