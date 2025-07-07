import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Wine } from 'lucide-react';

const ADMIN_EMAILS = ['joshua@monopole.ai'];

interface RouteGuardProps {
  children: ReactNode;
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

export const AdminRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user || !user.email) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(ADMIN_EMAILS.includes(user.email));
    };

    if (!loading) {
      checkAdmin();
    }
  }, [user, loading]);

  if (loading || isAdmin === null) {
    return <LoadingScreen />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const BusinessRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isBusiness, setIsBusiness] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBusiness = async () => {
      if (!user) {
        setIsBusiness(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        setIsBusiness(!!data && !error);
      } catch (error) {
        console.error('Error checking business status:', error);
        setIsBusiness(false);
      }
    };

    if (!loading) {
      checkBusiness();
    }
  }, [user, loading]);

  if (loading || isBusiness === null) {
    return <LoadingScreen />;
  }

  if (!user || !isBusiness) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const CustomerRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isCustomer, setIsCustomer] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCustomer = async () => {
      if (!user) {
        setIsCustomer(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        setIsCustomer(!!data && !error);
      } catch (error) {
        console.error('Error checking customer status:', error);
        setIsCustomer(false);
      }
    };

    if (!loading) {
      checkCustomer();
    }
  }, [user, loading]);

  if (loading || isCustomer === null) {
    return <LoadingScreen />;
  }

  if (!user || !isCustomer) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};