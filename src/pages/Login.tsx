import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Wine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signIn, signInWithGoogle, resendConfirmationEmail } from '../api/supabaseQueries';
import { useTheme } from '../contexts/ThemeContext';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        navigate('/dashboard');
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signInWithGoogle();
      if (error) throw error;
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Failed to sign in with Google');
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
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl rounded-lg px-8 py-10 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex flex-col items-center mb-8">
          <Wine className="h-16 w-16 text-green-500 mb-4" />
          <h3 className={`text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Cuvee Club</h3>
          <h4 className={`text-2xl font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'} mt-4`}>Welcome Back</h4>
          <p className={`text-${isDark ? 'gray-400' : 'gray-600'} mt-2`}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-4 py-3 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
              required
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-green-500 hover:text-green-400">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-4 py-3 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium ${
              isDark
                ? 'border-gray-700 text-white hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out`}
          >
            <LogIn className="mr-2" size={18} />
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-500 hover:text-green-400">
              Sign Up Now
            </Link>
          </p>
        </div>

        {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
        
        {showResendConfirmation && (
          <button
            onClick={handleResendConfirmation}
            className="mt-4 w-full px-6 py-3 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
          >
            Resend Confirmation Email
          </button>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;