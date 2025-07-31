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
  const { user, userProfile, isAdmin, userType } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      console.log('ProtectedRoute check:', {
        requiredPortal,
        userType,
        user: !!user,
        isAdmin,
        path: location.pathname
      });
      
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
            // Business owners identified by userType from AuthContext
            const isBusiness = userType === 'business';
            console.log('Business auth check:', { userType, isBusiness });
            setIsAuthorized(isBusiness);
            break;
            
          case 'customer':
            // Customers identified by userType from AuthContext
            setIsAuthorized(userType === 'customer');
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
  }, [user, userProfile, isAdmin, userType, requiredPortal]);

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
    // Redirect to appropriate dashboard based on userType from AuthContext
    if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userType === 'business') {
      return <Navigate to="/business/dashboard" replace />;
    } else if (userType === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    } else {
      // No profile yet
      return <Navigate to="/profile-setup" replace />;
    }
  }

  // User is authenticated and authorized for this portal
  return <>{children}</>;
};

export default ProtectedRoute;