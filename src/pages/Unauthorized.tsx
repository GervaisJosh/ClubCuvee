import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, Home, LogIn } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();

  const handleGoBack = () => {
    // Navigate based on user type
    switch (userType) {
      case 'admin':
        navigate('/admin');
        break;
      case 'business':
        navigate('/business/dashboard');
        break;
      case 'customer':
        navigate('/customer/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <ShieldOff className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. 
            {user ? ' Please contact your administrator if you believe this is an error.' : ' Please log in to continue.'}
          </p>

          <div className="space-y-3">
            {user ? (
              <Button
                onClick={handleGoBack}
                variant="primary"
                icon={<Home className="h-4 w-4" />}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="primary"
                icon={<LogIn className="h-4 w-4" />}
                className="w-full"
              >
                Log In
              </Button>
            )}
            
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;