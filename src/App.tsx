import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';
import GetStarted from './pages/GetStarted';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import AdminViewReal from './pages/AdminViewReal';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import RevenueInsights from './pages/RevenueInsights';
import Wines from './pages/Wines';
import WineInventoryAnalytics from './pages/WineInventoryAnalytics';
import OrderFulfillment from './pages/OrderFulfillment';
import CustomerInsights from './pages/CustomerInsights';
import CustomerSegmentation from './pages/CustomerSegmentation';
import Promotions from './pages/Promotions';
import AdminCalendar from './pages/AdminCalendar';
import WineReviews from './pages/WineReviews';
import Events from './pages/Events';
import WineInventoryUpload from './pages/WineInventoryUpload';
import APIConnection from './pages/APIConnection';
import AccountSettings from './pages/AccountSettings';

// Customer pages
import MyWines from './pages/customer/MyWines';
import RateWines from './pages/customer/RateWines';
import OrderHistory from './pages/customer/OrderHistory';
import Recommendations from './pages/customer/Recommendations';
import Wishlist from './pages/customer/Wishlist';
import CustomerCalendar from './pages/customer/CustomerCalendar';
import Notifications from './pages/customer/Notifications';

const AuthenticatedApp = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = React.useState('customer');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout userRole={viewMode} setViewMode={setViewMode}>
      <Routes>
        <Route path="/" element={
          viewMode === 'admin-real' ? <AdminViewReal /> :
          viewMode === 'admin' ? <Dashboard userRole="admin" /> :
          <CustomerDashboard />
        } />
        <Route path="/admin-real" element={<AdminViewReal />} />
        <Route path="/revenue-insights" element={<RevenueInsights />} />
        <Route path="/wines" element={<Wines />} />
        <Route path="/wine-inventory-analytics" element={<WineInventoryAnalytics />} />
        <Route path="/wine-inventory-upload" element={<WineInventoryUpload />} />
        <Route path="/order-fulfillment" element={<OrderFulfillment />} />
        <Route path="/customer-insights" element={<CustomerInsights />} />
        <Route path="/customer-segmentation" element={<CustomerSegmentation />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/admin-calendar" element={<AdminCalendar />} />
        <Route path="/wine-reviews" element={<WineReviews />} />
        <Route path="/events" element={<Events />} />
        <Route path="/api-connection" element={<APIConnection />} />
        <Route path="/account-settings" element={<AccountSettings userRole={viewMode} />} />

        {/* Customer routes */}
        <Route path="/my-wines" element={<MyWines />} />
        <Route path="/rate-wines" element={<RateWines />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/customer-calendar" element={<CustomerCalendar />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/dashboard/*" element={<AuthenticatedApp />} />
                <Route path="/" element={<Navigate to="/landing" replace />} />
              </Routes>
            </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;