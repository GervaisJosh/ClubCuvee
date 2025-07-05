import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OnboardingFormData, MEMBERSHIP_TIERS, MembershipTierOption } from '../../types/onboarding';
import { APIError } from '../../lib/errors';

export default function OnboardingPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({
    restaurantName: '',
    email: '',
    membershipTier: 'basic',
  });

  useEffect(() => {
    const validateInvite = async () => {
      if (!token) {
        setError('Invalid invite token');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/restaurant-invite?token=${token}`);
        if (!response.ok) {
          const data = await response.json();
          throw new APIError(response.status, data.error.message, data.error.code);
        }
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          restaurantName: data.restaurantName,
          email: data.email,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to validate invite');
      } finally {
        setLoading(false);
      }
    };

    validateInvite();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid invite token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          membershipTier: formData.membershipTier,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new APIError(response.status, data.error.message, data.error.code);
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create checkout session');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Club Cuvee</h1>
          <p className="mt-2 text-gray-600">
            Complete your restaurant's onboarding to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                  Restaurant Name
                </label>
                <input
                  id="restaurantName"
                  type="text"
                  value={formData.restaurantName}
                  onChange={e => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Plan</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {MEMBERSHIP_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative rounded-lg border p-6 cursor-pointer ${
                    formData.membershipTier === tier.id
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, membershipTier: tier.id }))}
                >
                  <h3 className="text-lg font-medium text-gray-900">{tier.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
                  <p className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 