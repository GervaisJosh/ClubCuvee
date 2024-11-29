import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return (_jsx(Layout, { userRole: viewMode, setViewMode: setViewMode, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: viewMode === 'admin-real' ? _jsx(AdminViewReal, {}) :
                        viewMode === 'admin' ? _jsx(Dashboard, { userRole: "admin" }) :
                            _jsx(CustomerDashboard, {}) }), _jsx(Route, { path: "/admin-real", element: _jsx(AdminViewReal, {}) }), _jsx(Route, { path: "/revenue-insights", element: _jsx(RevenueInsights, {}) }), _jsx(Route, { path: "/wines", element: _jsx(Wines, {}) }), _jsx(Route, { path: "/wine-inventory-analytics", element: _jsx(WineInventoryAnalytics, {}) }), _jsx(Route, { path: "/wine-inventory-upload", element: _jsx(WineInventoryUpload, {}) }), _jsx(Route, { path: "/order-fulfillment", element: _jsx(OrderFulfillment, {}) }), _jsx(Route, { path: "/customer-insights", element: _jsx(CustomerInsights, {}) }), _jsx(Route, { path: "/customer-segmentation", element: _jsx(CustomerSegmentation, {}) }), _jsx(Route, { path: "/promotions", element: _jsx(Promotions, {}) }), _jsx(Route, { path: "/admin-calendar", element: _jsx(AdminCalendar, {}) }), _jsx(Route, { path: "/wine-reviews", element: _jsx(WineReviews, {}) }), _jsx(Route, { path: "/events", element: _jsx(Events, {}) }), _jsx(Route, { path: "/api-connection", element: _jsx(APIConnection, {}) }), _jsx(Route, { path: "/account-settings", element: _jsx(AccountSettings, { userRole: viewMode }) }), _jsx(Route, { path: "/my-wines", element: _jsx(MyWines, {}) }), _jsx(Route, { path: "/rate-wines", element: _jsx(RateWines, {}) }), _jsx(Route, { path: "/order-history", element: _jsx(OrderHistory, {}) }), _jsx(Route, { path: "/recommendations", element: _jsx(Recommendations, {}) }), _jsx(Route, { path: "/wishlist", element: _jsx(Wishlist, {}) }), _jsx(Route, { path: "/customer-calendar", element: _jsx(CustomerCalendar, {}) }), _jsx(Route, { path: "/notifications", element: _jsx(Notifications, {}) })] }) }));
};
const App = () => {
    return (_jsx(ErrorBoundary, { children: _jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(CalendarProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUp, {}) }), _jsx(Route, { path: "/landing", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/dashboard/*", element: _jsx(AuthenticatedApp, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/landing", replace: true }) })] }) }) }) }) }) }));
};
export default App;
