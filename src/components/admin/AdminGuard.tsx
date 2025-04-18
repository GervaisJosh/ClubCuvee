import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in but is not an admin, redirect to home page
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-[#872657] mb-4">Unauthorized Access</h1>
          <p className="text-gray-700 mb-6">
            You do not have permission to access this section.
            This area is restricted to administrators only.
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="px-4 py-2 bg-[#872657] text-white rounded hover:bg-[#6d1f46] transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // If user is admin, render children
  return <>{children}</>;
};

export default AdminGuard;