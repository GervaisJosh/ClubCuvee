import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Wine } from 'lucide-react';

const ADMIN_EMAILS = ['joshuaheathgervais@gmail.com'];

const AuthRouter: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const determineUserTypeAndRoute = async () => {
      if (!user || !user.email) {
        navigate('/login');
        return;
      }

      try {
        // Check if user is admin
        if (ADMIN_EMAILS.includes(user.email)) {
          console.log('User is admin, redirecting to admin dashboard');
          navigate('/admin');
          return;
        }

        // Check if user is a business owner
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (business && !businessError) {
          console.log('User is business owner, redirecting to business dashboard');
          navigate('/business/dashboard');
          return;
        }

        // Check if user is a customer
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (customer && !customerError) {
          console.log('User is customer, redirecting to customer dashboard');
          navigate('/customer/dashboard');
          return;
        }

        // If user doesn't have a profile yet, redirect to profile setup
        console.log('User has no profile, redirecting to profile setup');
        navigate('/profile-setup');

      } catch (error) {
        console.error('Error determining user type:', error);
        navigate('/login');
      } finally {
        setChecking(false);
      }
    };

    determineUserTypeAndRoute();
  }, [user, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-8"></div>
            <Wine className="h-6 w-6 text-[#800020] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-700 text-xl font-light">Determining your access...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthRouter;