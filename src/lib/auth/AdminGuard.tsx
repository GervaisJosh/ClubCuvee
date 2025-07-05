import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          navigate('/admin/login');
          return;
        }

        // Check if user is an admin using the users table
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('auth_id', session.user.id)
          .single();

        if (userError || !user?.is_admin) {
          navigate('/admin/login');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
} 