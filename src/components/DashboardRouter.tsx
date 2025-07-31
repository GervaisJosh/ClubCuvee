import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wine } from 'lucide-react';

const DashboardRouter: React.FC = () => {
  const navigate = useNavigate();
  const { user, userType, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Route based on user type from AuthContext
    switch (userType) {
      case 'admin':
        console.log('DashboardRouter: User is admin, redirecting to admin dashboard');
        navigate('/admin/dashboard');
        break;
      case 'business':
        console.log('DashboardRouter: User is business owner, redirecting to business dashboard');
        navigate('/business/dashboard');
        break;
      case 'customer':
        console.log('DashboardRouter: User is customer, redirecting to customer dashboard');
        navigate('/customer/dashboard');
        break;
      case 'none':
        console.log('DashboardRouter: User has no profile, redirecting to profile setup');
        navigate('/profile-setup');
        break;
      default:
        console.log('DashboardRouter: Unknown user type, redirecting to login');
        navigate('/login');
    }
  }, [user, userType, loading, navigate]);

  // Show loading state while auth is being determined
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-8"></div>
          <Wine className="h-6 w-6 text-[#800020] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-700 text-xl font-light">Routing to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRouter;