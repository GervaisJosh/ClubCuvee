import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { 
  CheckCircle, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  User,
  Mail,
  Building,
  Lock,
  MapPin,
  Wine,
  DollarSign,
  Check,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BusinessFormData {
  businessName: string;
  businessOwnerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
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
    businessOwnerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
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
  const [showTierForm, setShowTierForm] = useState(false);

  useEffect(() => {
    if (!token || !sessionId) {
      setError('Missing required parameters');
      setVerifyingPayment(false);
      return;
    }

    verifyPaymentAndLoadData();
  }, [token, sessionId]);

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
      case 'businessOwnerName':
        return value.trim().length < 2 ? 'Owner name must be at least 2 characters' : '';
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

  const handleTierChange = (index: number, field: keyof CustomerTierFormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      customerTiers: prev.customerTiers.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const addCustomerTier = () => {
    setFormData(prev => ({
      ...prev,
      customerTiers: [...prev.customerTiers, {
        name: '',
        description: '',
        monthlyPrice: 99,
        benefits: ['', '', '']
      }]
    }));
    setShowTierForm(true);
  };

  const removeCustomerTier = (index: number) => {
    // Don't allow removing if it's the only tier
    if (formData.customerTiers.length > 1) {
      setFormData(prev => ({
        ...prev,
        customerTiers: prev.customerTiers.filter((_, i) => i !== index)
      }));
    }
  };

  const addBenefit = (tierIndex: number) => {
    const tier = formData.customerTiers[tierIndex];
    handleTierChange(tierIndex, 'benefits', [...tier.benefits, '']);
  };

  const removeBenefit = (tierIndex: number, benefitIndex: number) => {
    const tier = formData.customerTiers[tierIndex];
    const newBenefits = tier.benefits.filter((_, i) => i !== benefitIndex);
    handleTierChange(tierIndex, 'benefits', newBenefits);
  };

  const updateBenefit = (tierIndex: number, benefitIndex: number, value: string) => {
    const tier = formData.customerTiers[tierIndex];
    const newBenefits = tier.benefits.map((benefit, i) => 
      i === benefitIndex ? value : benefit
    );
    handleTierChange(tierIndex, 'benefits', newBenefits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData) {
      setError('Payment verification required');
      return;
    }

    // Validate required fields
    const requiredFields = ['businessName', 'businessOwnerName', 'email', 'password', 'confirmPassword'];
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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-8"></div>
            <Wine className="h-6 w-6 text-[#800020] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-xl font-light`}>Verifying your subscription...</p>
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>Just a moment while we set things up</p>
        </div>
        <ThemeToggle position="fixed" />
      </div>
    );
  }

  // Error state
  if (error && !paymentData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
        <Card className={`max-w-md mx-auto p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-2xl`}>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Setup Error</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
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
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10 relative`}>
      <div className="max-w-4xl mx-auto">
        {/* Luxury Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-radial from-[#800020]/10 via-transparent to-transparent blur-3xl"></div>
          <div className="relative z-10">
            <div className="mb-6">
              <Wine className="h-10 w-10 text-[#800020] mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#800020] mb-3">
                Welcome to Club Cuvée
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#800020]"></div>
                <Sparkles className="h-4 w-4 text-[#800020]" />
                <div className="w-12 h-px bg-gradient-to-r from-[#800020] to-transparent"></div>
              </div>
            </div>
            <p className={`text-xl font-light ${isDark ? 'text-gray-200' : 'text-gray-600'} mb-6`}>
              Set up your premium wine club in minutes
            </p>
            {paymentData && (
              <div className={`inline-flex items-center px-5 py-2.5 ${isDark ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200'} border rounded-full backdrop-blur-sm`}>
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} font-medium`}>
                  Payment Verified • {paymentData.pricing_tier}
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Single consolidated card */}
          <Card className={`p-8 md:p-12 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-3xl shadow-2xl`}>
            {/* Business Information Section */}
            <div className="pb-10">
              <div className="flex items-center mb-6">
                <Building className="h-6 w-6 text-[#800020] mr-3" />
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Business Details
                </h2>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Business Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-12 pr-4 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg`}
                    placeholder="Your business name"
                  />
                </div>
                {validationErrors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.businessName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Business Owner Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="businessOwnerName"
                    value={formData.businessOwnerName}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-12 pr-4 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg`}
                    placeholder="Full name"
                  />
                </div>
                {validationErrors.businessOwnerName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.businessOwnerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-12 pr-4 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg`}
                    placeholder="admin@yourbusiness.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-4 pr-4 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg`}
                  placeholder="https://yourbusiness.com"
                />
                {validationErrors.website && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.website}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Business Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg resize-none`}
                  placeholder="Tell us about your wine business, expertise, and what makes you unique..."
                />
              </div>
            </div>
            </div>

            {/* Divider */}
            <div className={`my-10 h-px ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`}></div>

            {/* Security Section */}
            <div className="pb-10">
              <div className="flex items-center mb-6">
                <Lock className="h-6 w-6 text-[#800020] mr-3" />
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Secure Your Account
                </h2>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Admin Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-12 pr-12 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-12 pr-12 py-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020] focus:ring-[#800020]/20' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020] focus:ring-[#800020]/20'} border rounded-xl transition-all duration-200 text-lg`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            </div>

            {/* Divider */}
            <div className={`my-10 h-px ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`}></div>

            {/* Customer Membership Tiers Section */}
            <div>
              <div className="flex items-center mb-6">
                <Wine className="h-6 w-6 text-[#800020] mr-3" />
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Membership Tiers
                </h2>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                Design your membership offering
              </p>

              {!showTierForm && formData.customerTiers.length === 0 ? (
                <div className={`relative text-center py-20 border-2 border-dashed ${isDark ? 'border-zinc-700/50' : 'border-gray-300/50'} rounded-3xl ${isDark ? 'bg-gradient-to-b from-zinc-800/20 to-transparent' : 'bg-gradient-to-b from-gray-50 to-transparent'}`}>
                  <div className="absolute inset-0 bg-gradient-radial from-[#800020]/5 via-transparent to-transparent blur-2xl"></div>
                  <div className="relative z-10">
                    <div className={`mx-auto h-16 w-16 mb-6 rounded-full ${isDark ? 'bg-zinc-800/50' : 'bg-gray-100'} flex items-center justify-center`}>
                      <Wine className="h-8 w-8 text-[#800020]" />
                    </div>
                    <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                      Create your first membership tier
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-lg mx-auto text-lg font-light`}>
                      Design exclusive wine experiences for your customers
                    </p>
                    <button 
                      type="button"
                      onClick={() => {
                        addCustomerTier();
                        setShowTierForm(true);
                      }} 
                      className="group bg-[#800020] hover:bg-[#600018] text-white px-10 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                      CREATE FIRST TIER
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {formData.customerTiers.map((tier, tierIndex) => (
                  <div key={tierIndex} className={`p-8 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} rounded-2xl relative`}>
                    {formData.customerTiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomerTier(tierIndex)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Tier Name
                        </label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleTierChange(tierIndex, 'name', e.target.value)}
                          className={`w-full px-4 py-3 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'} border rounded-xl transition-all duration-200`}
                          placeholder="e.g., Wine Enthusiast"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Monthly Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            min="10"
                            max="999"
                            value={tier.monthlyPrice}
                            onChange={(e) => handleTierChange(tierIndex, 'monthlyPrice', parseInt(e.target.value) || 0)}
                            className={`w-full pl-10 pr-4 py-3 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'} border rounded-xl transition-all duration-200`}
                            placeholder="99"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Description
                        </label>
                        <textarea
                          value={tier.description}
                          onChange={(e) => handleTierChange(tierIndex, 'description', e.target.value)}
                          rows={2}
                          className={`w-full px-4 py-3 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'} border rounded-xl transition-all duration-200 resize-none`}
                          placeholder="Describe what makes this tier special..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                          Included Benefits
                        </label>
                        <div className="space-y-3">
                          {tier.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center">
                              <Check className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => updateBenefit(tierIndex, benefitIndex, e.target.value)}
                                className={`flex-1 px-4 py-3 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'} border rounded-xl transition-all duration-200`}
                                placeholder="e.g., 2 premium bottles monthly"
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addBenefit(tierIndex)}
                          className={`text-sm ${isDark ? 'text-[#800020]' : 'text-[#800020]'} hover:underline mt-3`}
                        >
                          + Add another benefit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.customerTiers.length > 0 && (
                  <div className="text-center pt-4">
                    <Button
                      type="button"
                      onClick={addCustomerTier}
                      variant="outline"
                      className="inline-flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Tier
                    </Button>
                  </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className={`p-6 ${isDark ? 'bg-red-900/20 border-red-800/30' : 'bg-red-50 border-red-200'} border backdrop-blur-sm rounded-2xl`}>
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <p className={`${isDark ? 'text-red-400' : 'text-red-600'} font-medium`}>
                  {error}
                </p>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#800020] hover:bg-[#600018] text-white px-12 py-4 rounded-xl text-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Your Wine Club...</span>
                </div>
              ) : (
                <>
                  <Wine className="w-5 h-5 mr-2" />
                  Launch Your Wine Club
                </>
              )}
            </button>
          </div>
        </form>

        {/* Theme Toggle */}
        <ThemeToggle position="fixed" />
      </div>
    </div>
  );
};

export default BusinessSetup;