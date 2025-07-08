import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserType } from '../../contexts/AuthContext';
import { Wine } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
}

interface ProtectedRouteProps extends RouteGuardProps {
  allowedTypes: UserType[];
  redirectTo?: string;
}

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="relative">
        <div className="h-16 w-16 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-8"></div>
        <Wine className="h-6 w-6 text-[#800020] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-gray-700 text-xl font-light">Checking authorization...</p>
    </div>
  </div>
);

// Generic protected route component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedTypes,
  redirectTo = '/login'
}) => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(userType)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Specific route guards using the generic ProtectedRoute
export const AdminRoute: React.FC<RouteGuardProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedTypes={['admin']} redirectTo="/unauthorized">
      {children}
    </ProtectedRoute>
  );
};

export const BusinessRoute: React.FC<RouteGuardProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedTypes={['business']} redirectTo="/unauthorized">
      {children}
    </ProtectedRoute>
  );
};

export const CustomerRoute: React.FC<RouteGuardProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedTypes={['customer']} redirectTo="/unauthorized">
      {children}
    </ProtectedRoute>
  );
};

// Route guard that allows multiple user types
export const AuthenticatedRoute: React.FC<RouteGuardProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedTypes={['admin', 'business', 'customer']} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
};