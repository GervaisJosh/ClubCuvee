import React, { Suspense } from 'react';
import AdminGuard from './AdminGuard';

interface LazyAdminRouteProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  fallback?: React.ReactNode;
}

/**
 * Lazy-loads an admin component with Suspense and AdminGuard protection
 * @param component The lazy-loaded component to render
 * @param fallback Optional fallback UI to show while loading
 */
const LazyAdminRoute: React.FC<LazyAdminRouteProps> = ({ 
  component: Component,
  fallback = <div className="p-8 text-center">Loading...</div>
}) => {
  return (
    <AdminGuard>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </AdminGuard>
  );
};

export default LazyAdminRoute;