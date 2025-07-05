import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ensureWineInventoryExists } from './utils/ensureWineInventory';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoutes from './routes/AdminRoutes';
import BusinessRoutes from './routes/BusinessRoutes';
import CustomerRoutes from './routes/CustomerRoutes';

// Public pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';
import GetStarted from './pages/GetStarted';
import HowItWorks from './pages/HowItWorks';
import Features from './pages/Features';
import About from './pages/About';
import Pricing from './pages/Pricing';
import CustomerSignup from './pages/CustomerSignup';

// Restaurant onboarding with lazy loading
const RestaurantOnboarding = React.lazy(() => import('./pages/onboarding/token'));
const OnboardToken = React.lazy(() => import('./pages/onboarding/OnboardToken'));
const BusinessSetup = React.lazy(() => import('./pages/onboarding/BusinessSetup'));
const OnboardingSuccess = React.lazy(() => import('./pages/onboarding/OnboardingSuccess'));
const CustomerJoinPage = React.lazy(() => import('./pages/join/CustomerJoinPage'));

// Private customer dashboard
const ScopedCustomerDashboard = React.lazy(() => import('./pages/customer/ScopedCustomerDashboard'));
const CustomerRegistration = React.lazy(() => import('./pages/customer/CustomerRegistration'));
const CustomerWelcome = React.lazy(() => import('./pages/customer/CustomerWelcome'));

const App = () => {
  // Initialize data check for development mode
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      // Log development environment info to help with debugging
      console.log(
        `%c🍷 Club Cuvee Dev Environment 🍷`,
        'font-size: 14px; font-weight: bold; color: #872657;'
      );
      console.log(
        `%c• API routes path: /api/*\n• Using standard Vercel-compatible API routes\n• For full API simulation: run 'vercel dev'\n• Checking database setup...`,
        'color: #666; font-size: 12px;'
      );
      ensureWineInventoryExists();
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Customer join page - business slug based */}
              <Route 
                path="/join/:slug" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
                      <div className="text-center">
                        <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg">Loading wine club...</p>
                      </div>
                    </div>
                  }>
                    <CustomerJoinPage />
                  </React.Suspense>
                }
              />
              
              {/* Business invitation redirect - keeping for backward compatibility */}
              <Route 
                path="/onboard/:token" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
                      <div className="text-center">
                        <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg">Redirecting to business onboarding...</p>
                      </div>
                    </div>
                  }>
                    <OnboardToken />
                  </React.Suspense>
                }
              />
              
              {/* Scoped customer dashboard */}
              <Route 
                path="/customer/dashboard" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
                      <div className="text-center">
                        <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg">Loading dashboard...</p>
                      </div>
                    </div>
                  }>
                    <ScopedCustomerDashboard />
                  </React.Suspense>
                }
              />
              
              {/* Customer registration flow */}
              <Route 
                path="/customer/join/:token" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
                      <div className="text-center">
                        <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg">Loading registration page...</p>
                      </div>
                    </div>
                  }>
                    <CustomerRegistration />
                  </React.Suspense>
                }
              />
              
              {/* Customer welcome after successful payment */}
              <Route 
                path="/customer/welcome" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
                      <div className="text-center">
                        <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg">Activating your membership...</p>
                      </div>
                    </div>
                  }>
                    <CustomerWelcome />
                  </React.Suspense>
                }
              />
              
              {/* Legacy customer signup - deprecated */}
              <Route path="/join/:restaurantId" element={<CustomerSignup />} />
              
              {/* Business onboarding flow */}
              <Route 
                path="/onboard/:token" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
                      <div className="text-center max-w-7xl w-full mx-auto">
                        <div className="h-12 w-12 animate-spin border-4 border-[#872657] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg" style={{ fontFamily: 'TayBasal' }}>Loading your business registration...</p>
                      </div>
                    </div>
                  }>
                    <OnboardToken />
                  </React.Suspense>
                }
              />
              <Route 
                path="/onboard/:token/setup" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
                      <div className="text-center max-w-7xl w-full mx-auto">
                        <div className="h-12 w-12 animate-spin border-4 border-[#872657] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg" style={{ fontFamily: 'TayBasal' }}>Setting up your business...</p>
                      </div>
                    </div>
                  }>
                    <BusinessSetup />
                  </React.Suspense>
                }
              />
              <Route 
                path="/onboard/:token/success" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
                      <div className="text-center max-w-7xl w-full mx-auto">
                        <div className="h-12 w-12 animate-spin border-4 border-[#872657] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg" style={{ fontFamily: 'TayBasal' }}>Loading success page...</p>
                      </div>
                    </div>
                  }>
                    <OnboardingSuccess />
                  </React.Suspense>
                }
              />

              {/* Legacy restaurant onboarding flow */}
              <Route 
                path="/onboarding/:restaurantRef" 
                element={
                  <React.Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 md:px-10 py-10 md:py-20 overflow-x-hidden">
                      <div className="text-center max-w-7xl w-full mx-auto">
                        <div className="h-12 w-12 animate-spin border-4 border-[#872657] border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg" style={{ fontFamily: 'TayBasal' }}>Loading your restaurant registration...</p>
                      </div>
                    </div>
                  }>
                    <RestaurantOnboarding />
                  </React.Suspense>
                }
              />

              {/* Portal routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/business/*" element={<BusinessRoutes />} />
              <Route path="/customer/*" element={<CustomerRoutes />} />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/landing" replace />} />
              
              {/* Catch all for authenticated users */}
              <Route path="*" element={
                <ProtectedRoute>
                  <Navigate to="/customer/dashboard" replace />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;