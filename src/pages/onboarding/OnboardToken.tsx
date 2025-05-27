import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { stripeService } from '../../services/stripeService';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { CheckCircle, AlertCircle, Clock, CreditCard } from 'lucide-react';

interface TokenData {
  email: string;
  expiresAt: string;
  status: string;
}

interface CheckoutResponse {
  success: boolean;
  data: {
    sessionId: string;
    checkoutUrl: string;
    tokenData: TokenData;
  };
}

const OnboardToken: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const sessionId = searchParams.get('session_id');
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (!token) {
      setError('No onboarding token provided');
      setLoading(false);
      return;
    }

    validateToken();
  }, [token]);

  useEffect(() => {
    if (sessionId && success) {
      handlePaymentSuccess();
    }
  }, [sessionId, success]);

  const validateToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<{
        success: boolean;
        data: TokenData;
      }>(`/api/validate-onboarding-token?token=${token}`);

      if (response.success) {
        setTokenData(response.data);
      } else {
        setError('Invalid or expired onboarding token');
      }
    } catch (err: any) {
      console.error('Error validating token:', err);
      setError(err.message || 'Failed to validate onboarding token');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setProcessingPayment(true);
      
      // Verify the payment with Stripe
      // Verify the payment with our custom endpoint
      const response = await apiClient.post<{
        success: boolean;
        data: {
          subscription: {
            id: string;
            status: string;
            currentPeriodEnd: number;
          };
        };
      }>('/api/verify-onboarding-subscription', { token, sessionId });
      
      const subscription = response.data.subscription;
      
      if (subscription.status === 'active') {
        // Redirect to business setup form
        navigate(`/onboard/${token}/setup?session_id=${sessionId}`);
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      setError('Payment verification failed. Please contact support.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const startCheckout = async () => {
    try {
      setProcessingPayment(true);
      setError(null);

      const response = await apiClient.post<CheckoutResponse>(
        '/api/create-onboarding-checkout',
        { token }
      );

      if (response.success && response.data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to start checkout process');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Validating your onboarding link...</p>
        </div>
      </div>
    );
  }

  if (processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (canceled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Canceled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was canceled. You can try again when you're ready.
          </p>
          <Button onClick={startCheckout} className="w-full">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This onboarding link is invalid or has expired. Please request a new one.'}
          </p>
          <Button onClick={() => navigate('/landing')} variant="secondary" className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const expiresAt = new Date(tokenData.expiresAt);
  const timeUntilExpiry = expiresAt.getTime() - Date.now();
  const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Club Cuvée
          </h1>
          <p className="text-xl text-gray-600">
            Complete your business registration to get started
          </p>
        </div>

        {/* Main Content */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Valid Invitation
            </h2>
            <p className="text-gray-600">
              This invitation is for: <strong>{tokenData.email}</strong>
            </p>
          </div>

          {/* Expiry Warning */}
          {hoursUntilExpiry < 24 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-sm text-yellow-700">
                  This invitation expires in {hoursUntilExpiry} hours. Complete your registration soon!
                </p>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                  1
                </div>
                <p>Complete your subscription payment via Stripe</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                  2
                </div>
                <p>Set up your business profile and wine club tiers</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                  3
                </div>
                <p>Start accepting customer memberships immediately</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <Button
            onClick={startCheckout}
            className="w-full"
            disabled={processingPayment}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {processingPayment ? 'Starting Checkout...' : 'Proceed to Payment'}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment processing by Stripe • Cancel anytime
          </p>
        </Card>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@clubcuvee.com" className="text-[#800020] hover:underline">
              support@clubcuvee.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardToken;