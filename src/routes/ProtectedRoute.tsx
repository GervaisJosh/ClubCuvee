import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type PortalType = 'admin' | 'business' | 'customer';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPortal?: PortalType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPortal 
}) => {
  const { user, userProfile, isAdmin } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Not authenticated at all
      if (!user) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Check portal-specific authorization
      if (requiredPortal) {
        switch (requiredPortal) {
          case 'admin':
            // Super admin access only
            setIsAuthorized(isAdmin === true);
            break;
            
          case 'business':
            // Business owners with restaurant_id in their profile
            const metadata = user.user_metadata || {};
            const hasRestaurantId = Boolean(metadata.restaurant_id || userProfile?.restaurant_id);
            const isBusinessRole = metadata.role === 'restaurant_admin' || metadata.role === 'business_owner';
            
            setIsAuthorized(hasRestaurantId || isBusinessRole);
            break;
            
          case 'customer':
            // Regular customers (default)
            const isCustomer = !isAdmin && (!user.user_metadata?.role || user.user_metadata?.role === 'customer');
            setIsAuthorized(isCustomer);
            break;
            
          default:
            // Any authenticated user is allowed
            setIsAuthorized(true);
        }
      } else {
        // No specific portal required, just need authentication
        setIsAuthorized(true);
      }
      
      setIsLoading(false);
    };

    checkAuthorization();
  }, [user, userProfile, isAdmin, requiredPortal]);

  if (isLoading) {
    // Show loading state while checking authorization
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAuthorized) {
    // Redirect to appropriate dashboard based on user role
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.user_metadata?.restaurant_id || userProfile?.restaurant_id) {
      return <Navigate to="/business/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  // User is authenticated and authorized for this portal
  return <>{children}</>;
};

export default ProtectedRoute;