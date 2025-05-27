import React, { useState } from 'react';
import { apiClient } from '../../lib/api-client';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/Button';
import Card from '../../components/Card';

interface GenerateLinkFormData {
  email: string;
  stripePriceId: string;
}

interface OnboardingTokenResponse {
  success: boolean;
  data: {
    token: string;
    email: string;
    stripePriceId: string;
    expiresAt: string;
    onboardingUrl: string;
  };
}

const STRIPE_PRICE_OPTIONS = [
  { id: 'price_basic', name: 'Basic Plan - $99/month', description: 'Up to 100 customers' },
  { id: 'price_premium', name: 'Premium Plan - $199/month', description: 'Up to 500 customers' },
  { id: 'price_enterprise', name: 'Enterprise Plan - $399/month', description: 'Unlimited customers' }
];

const GenerateLink: React.FC = () => {
  const [formData, setFormData] = useState<GenerateLinkFormData>({
    email: '',
    stripePriceId: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedLink(null);

    try {
      const response = await apiClient.post<OnboardingTokenResponse>(
        '/api/generate-onboarding-token',
        formData
      );

      if (response.success) {
        setGeneratedLink(response.data.onboardingUrl);
        setFormData({ email: '', stripePriceId: '' });
      } else {
        setError('Failed to generate onboarding link');
      }
    } catch (err: any) {
      console.error('Error generating onboarding link:', err);
      setError(err.message || 'Failed to generate onboarding link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="py-8 px-4 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Onboarding Link</h1>
          <p className="text-gray-600">
            Create a secure onboarding link for new business partners to sign up for Club Cuvée.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  placeholder="contact@restaurant.com"
                />
              </div>

              <div>
                <label htmlFor="stripePriceId" className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Tier *
                </label>
                <select
                  id="stripePriceId"
                  name="stripePriceId"
                  value={formData.stripePriceId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                >
                  <option value="">Select a subscription tier</option>
                  {STRIPE_PRICE_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !formData.email || !formData.stripePriceId}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Onboarding Link'}
              </Button>
            </form>
          </Card>

          {/* Generated Link */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Link</h2>
            
            {generatedLink ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600 font-medium mb-2">Link generated successfully!</p>
                  <div className="bg-white p-3 rounded border">
                    <code className="text-sm break-all">{generatedLink}</code>
                  </div>
                </div>
                
                <Button
                  onClick={copyToClipboard}
                  variant="secondary"
                  className="w-full"
                >
                  {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                </Button>

                <div className="text-xs text-gray-500">
                  <p className="mb-1">• Link expires in 24 hours</p>
                  <p className="mb-1">• Send this link to the business owner</p>
                  <p>• They will complete payment and setup through this link</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">
                  Fill out the form and click "Generate" to create a secure onboarding link.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Generate Link</h3>
              <p className="text-gray-600">Create a secure, time-limited onboarding link for the business.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Business Signup</h3>
              <p className="text-gray-600">Business owner follows the link, pays via Stripe, and sets up their account.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-[#800020] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Account Active</h3>
              <p className="text-gray-600">Business account is automatically created and ready to use.</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default GenerateLink;