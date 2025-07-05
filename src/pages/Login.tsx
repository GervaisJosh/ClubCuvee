import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Wine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signIn, resendConfirmationEmail } from '../api/supabaseQueries';
import { useTheme } from '../contexts/ThemeContext';
import AuthLayout from '../components/AuthLayout';
import { redirectBasedOnRole, getHomePathFromProfile } from '../utils/authRedirects';
import { getUserProfileByAuthId } from '../services/userService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";
  
  // Get redirect path from location state (if it exists)
  const from = location.state?.from || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResendConfirmation(false);

    try {
      const { user, error } = await signIn(email, password);
      if (error) throw error;
      
      if (user) {
        setUser(user);
        
        // Fetch the user profile to determine their role
        const profile = await getUserProfileByAuthId(user.id);
        
        // If we have a specific page the user was trying to access, try to redirect there
        if (from) {
          await redirectBasedOnRole(user.id, navigate, '/customer/dashboard', from);
        } else {
          // Otherwise, redirect to the appropriate dashboard based on role
          const homePath = getHomePathFromProfile(profile);
          navigate(homePath);
        }
      } else {
        throw new Error('No user returned from signIn');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred');
      if (err.status === 400) {
        setShowResendConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await resendConfirmationEmail(email);
      setError('Confirmation email resent. Please check your inbox.');
      setShowResendConfirmation(false);
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email');
    }
  };

  return (
    <AuthLayout>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl rounded-lg px-8 py-10 border ${isDark ? 'border-gray-700' : 'border-gray-200'} w-full max-w-lg mx-auto`}>
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/icons/wine-bottle.svg" 
            alt="Wine Bottle" 
            className="h-16 w-16 mb-4" 
            style={{ filter: isDark ? 'invert(1)' : 'none' }}
          />
          <h3 
            className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`} 
            style={{ fontFamily: 'HV Florentino' }}
          >
            Club Cuvee
          </h3>
          <h4 
            className={`text-2xl font-semibold text-center ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-4`}
            style={{ fontFamily: 'HV Florentino' }}
          >
            Welcome Back
          </h4>
          <p 
            className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}
            style={{ fontFamily: 'Libre Baskerville' }}
          >
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} 
              htmlFor="email"
              style={{ fontFamily: 'Libre Baskerville' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-4 py-3 rounded-md ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#800020]' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-[#800020]'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label 
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                style={{ fontFamily: 'Libre Baskerville' }}
              >
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#800020] hover:text-black focus:text-black"
                style={{ fontFamily: 'Libre Baskerville' }}
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-4 py-3 rounded-md ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#800020]' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-[#800020]'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#800020] hover:bg-[#a00028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020] transition duration-150 ease-in-out"
            style={{ fontFamily: 'HV Florentino' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p 
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            style={{ fontFamily: 'Libre Baskerville' }}
          >
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#800020] hover:text-black focus:text-black">
              Sign Up Now
            </Link>
          </p>
        </div>

        {error && <p className="mt-4 text-sm text-red-500 text-center" style={{ fontFamily: 'Libre Baskerville' }}>{error}</p>}
        
        {showResendConfirmation && (
          <button
            onClick={handleResendConfirmation}
            className="mt-4 w-full px-6 py-3 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
            style={{ fontFamily: 'HV Florentino' }}
          >
            Resend Confirmation Email
          </button>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;