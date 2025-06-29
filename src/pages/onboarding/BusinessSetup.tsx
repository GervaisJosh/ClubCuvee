import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { 
  CheckCircle, 
  Plus, 
  X,
  Trash2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BusinessFormData {
  businessName: string;
  adminName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  description: string;
  customerTiers: CustomerTierFormData[];
}

interface CustomerTierFormData {
  name: string;
  description: string;
  monthlyPrice: number;
  benefits: string[];
}

interface PaymentVerificationData {
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: number;
    customerId: string;
    priceId: string;
  };
  pricing_tier: string;
  session: {
    id: string;
    payment_status: string;
    customer_email: string;
  };
}

const BusinessSetup: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const sessionId = searchParams.get('session_id');
  
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    description: '',
    customerTiers: []
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentVerificationData | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showTierModal, setShowTierModal] = useState(false);
  const [newTier, setNewTier] = useState<CustomerTierFormData>({
    name: '',
    description: '',
    monthlyPrice: 0,
    benefits: ['']
  });

  useEffect(() => {
    if (!token || !sessionId) {
      setError('Missing required parameters');
      setVerifyingPayment(false);
      return;
    }

    verifyPaymentAndLoadData();
  }, [token, sessionId]);

  // Elegant scroll reveal animation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add delay based on element order
          const delay = (entry.target as HTMLElement).dataset.delay || '0';
          setTimeout(() => {
            entry.target.classList.add('fade-in-up');
          }, parseInt(delay));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements with staggered delays
    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
      (el as HTMLElement).dataset.delay = (index * 100).toString();
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Calculate progress percentage based on filled required fields
  const calculateProgress = () => {
    const requiredFields = ['businessName', 'adminName', 'email', 'phone', 'password', 'confirmPassword', 'address', 'city', 'state', 'zip'];
    const filledFields = requiredFields.filter((field) => {
      const value = formData[field as keyof BusinessFormData] as string;
      return value && value.trim() !== '';
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const verifyPaymentAndLoadData = async () => {
    try {
      setVerifyingPayment(true);
      setError(null);
      
      // Verify the payment was successful
      const response = await apiClient.post<{
        success: boolean;
        data: PaymentVerificationData;
      }>('/api/verify-business-subscription', { token, sessionId });

      if (response.success && response.data.subscription.status === 'active') {
        setPaymentData(response.data);
        
        // Pre-fill form with verified payment email and business name from invitation
        const inviteResponse = await apiClient.post<{
          success: boolean;
          data: {
            business_name: string;
            business_email: string;
            pricing_tier: string | null;
          };
        }>('/api/validate-business-invitation', { token });

        if (inviteResponse.success) {
          setFormData(prev => ({
            ...prev,
            businessName: inviteResponse.data.business_name,
            email: response.data.session.customer_email || inviteResponse.data.business_email
          }));
        }
      } else {
        setError('Payment verification failed. Your subscription is not active. Please contact support.');
      }
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      setError('Payment verification failed. Please contact support.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  // Form validation helper
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'businessName':
        return value.trim().length < 2 ? 'Business name must be at least 2 characters' : '';
      case 'adminName':
        return value.trim().length < 2 ? 'Admin name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase, and number';
        }
        return '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return value && !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
      case 'website':
        if (value && !value.startsWith('http')) {
          return 'Website must start with http:// or https://';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    setError(null);
  };

  const removeCustomerTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customerTiers: prev.customerTiers.filter((_, i) => i !== index)
    }));
  };

  // Tier Modal Functions
  const addTierFromModal = () => {
    if (!newTier.name.trim() || !newTier.description.trim() || newTier.monthlyPrice <= 0) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      customerTiers: [...prev.customerTiers, { ...newTier }]
    }));
    
    setNewTier({
      name: '',
      description: '',
      monthlyPrice: 0,
      benefits: ['']
    });
    
    setShowTierModal(false);
  };

  const updateNewTierBenefit = (index: number, value: string) => {
    const newBenefits = newTier.benefits.map((benefit, i) => 
      i === index ? value : benefit
    );
    setNewTier(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addNewTierBenefit = () => {
    setNewTier(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const removeNewTierBenefit = (index: number) => {
    setNewTier(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData) {
      setError('Payment verification required');
      return;
    }

    // Validate required fields
    const requiredFields = ['businessName', 'adminName', 'email', 'password', 'confirmPassword'];
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof BusinessFormData] as string;
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    // Validate customer tiers
    if (formData.customerTiers.length === 0) {
      setError('Please add at least one customer membership tier');
      return;
    }

    formData.customerTiers.forEach((tier, index) => {
      if (!tier.name.trim()) {
        errors[`tier_${index}_name`] = 'Tier name is required';
      }
      if (!tier.description.trim()) {
        errors[`tier_${index}_description`] = 'Tier description is required';
      }
      if (tier.monthlyPrice < 10 || tier.monthlyPrice > 999) {
        errors[`tier_${index}_price`] = 'Price must be between $10 and $999';
      }
      if (tier.benefits.filter(b => b.trim()).length === 0) {
        errors[`tier_${index}_benefits`] = 'At least one benefit is required';
      }
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<{
        success: boolean;
        data: {
          businessId: string;
          adminUserId: string;
        };
      }>('/api/create-business', {
        token,
        sessionId,
        businessData: formData
      });

      if (response.success) {
        // Navigate to success page
        navigate(`/onboard/${token}/success`);
      } else {
        setError('Failed to create business account. Please try again.');
      }
    } catch (err: any) {
      console.error('Error creating business:', err);
      setError(err.message || 'Failed to create business account');
    } finally {
      setLoading(false);
    }
  };

  // Payment verification loading state
  if (verifyingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-6 py-10">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full mx-auto mb-8"></div>
          <p className="text-gray-700 dark:text-gray-300 text-xl font-light">Verifying your premium subscription...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Securing your business credentials</p>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  // Error state
  if (error && !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-2xl">
          <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Setup Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {error}
          </p>
          <Button onClick={() => navigate('/business/dashboard')} variant="secondary" className="w-full py-3">
            Contact Support
          </Button>
        </Card>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-6 py-10 relative">
      <div className="max-w-2xl mx-auto">
        {/* Dynamic Progress Indicator */}
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mb-8">
          <div 
            className="bg-gray-900 dark:bg-white h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        {/* Clean Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Welcome to Club Cuvée
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Complete your business profile to launch your wine club
          </p>
          {paymentData && (
            <div className="inline-flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-50/10 border border-emerald-200 dark:border-emerald-200/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
              <span className="text-sm text-emerald-700 dark:text-emerald-300">
                Payment Verified • {paymentData.pricing_tier}
              </span>
            </div>
          )}
        </div>

        {/* Single Seamless Form Card */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-16">
            
            {/* Business Information */}
            <div className="pb-16 border-b border-gray-100 dark:border-gray-800 animate-on-scroll">
              <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white">
                Business Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                    placeholder="Your business name"
                  />
                  {validationErrors.businessName && (
                    <p className="text-red-500 text-sm">{validationErrors.businessName}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Name *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                    placeholder="Your full name"
                  />
                  {validationErrors.adminName && (
                    <p className="text-red-500 text-sm">{validationErrors.adminName}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                    placeholder="admin@yourbusiness.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                      placeholder="State"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                    placeholder="https://yourbusiness.com"
                  />
                  {validationErrors.website && (
                    <p className="text-red-500 text-sm">{validationErrors.website}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors resize-none"
                    placeholder="Tell your story and how joining your club helps members support your business and its community"
                  />
                </div>
              </div>
            </div>

            {/* Security Credentials */}
            <div className="py-16 border-b border-gray-100 dark:border-gray-800 animate-on-scroll">
              <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white">
                Security Credentials
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 pr-12 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm">{validationErrors.password}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 pr-12 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-sm">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Membership Tiers */}
            <div className="pt-16 animate-on-scroll">
              <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white">
                Customer Membership Tiers
              </h2>

              {formData.customerTiers.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-light mb-4 text-gray-900 dark:text-white">
                    Create your membership tiers
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Design exclusive wine experiences for your customers
                  </p>
                  <button 
                    type="button"
                    onClick={() => setShowTierModal(true)}
                    className="px-8 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Create First Tier
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.customerTiers.map((tier, index) => (
                    <div key={index} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{tier.name}</h4>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">${tier.monthlyPrice}/month</p>
                          <p className="text-gray-600 dark:text-gray-300 mt-2">{tier.description}</p>
                          <div className="mt-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Benefits:</p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {tier.benefits.filter(b => b.trim()).map((benefit, i) => (
                                <li key={i}>• {benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeCustomerTier(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setShowTierModal(true)}
                    className="w-full py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mt-6"
                  >
                    + Add Another Tier
                  </button>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-16">
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-4 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-medium"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Your Business...</span>
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>

          </Card>
        </form>

        {/* Tier Creation Modal */}
        {showTierModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-gray-900 dark:text-white">Create Membership Tier</h3>
                <button
                  onClick={() => setShowTierModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tier Name *
                  </label>
                  <input
                    type="text"
                    value={newTier.name}
                    onChange={(e) => setNewTier(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    placeholder="e.g., Wine Enthusiast"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newTier.monthlyPrice || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setNewTier(prev => ({ ...prev, monthlyPrice: isNaN(value) ? 0 : value }));
                      }}
                      className="no-spinner w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      placeholder="49.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newTier.description}
                    onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg resize-none"
                    placeholder="Describe this tier..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Benefits *
                  </label>
                  <div className="space-y-3">
                    {newTier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateNewTierBenefit(index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                          placeholder="e.g., 2 premium bottles per month"
                        />
                        {newTier.benefits.length > 1 && (
                          <button
                            onClick={() => removeNewTierBenefit(index)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addNewTierBenefit}
                      className="w-full py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      + Add Benefit
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowTierModal(false)}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTierFromModal}
                    className="flex-1 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Create Tier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default BusinessSetup;