import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import Button from '../../components/Button';
import Card from '../../components/Card';
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
  DollarSign
} from 'lucide-react';

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

  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      customerTiers: [...prev.customerTiers, { 
        name: '', 
        description: '', 
        monthlyPrice: 49,
        benefits: ['']
      }]
    }));
  };

  const removeTier = (index: number) => {
    if (formData.customerTiers.length > 1) {
      setFormData(prev => ({
        ...prev,
        customerTiers: prev.customerTiers.filter((_, i) => i !== index)
      }));
    }
  };

  const addTierBenefit = (tierIndex: number) => {
    setFormData(prev => ({
      ...prev,
      customerTiers: prev.customerTiers.map((tier, i) => 
        i === tierIndex ? { ...tier, benefits: [...tier.benefits, ''] } : tier
      )
    }));
  };

  const removeTierBenefit = (tierIndex: number, benefitIndex: number) => {
    setFormData(prev => ({
      ...prev,
      customerTiers: prev.customerTiers.map((tier, i) => 
        i === tierIndex 
          ? { ...tier, benefits: tier.benefits.filter((_, bi) => bi !== benefitIndex) }
          : tier
      )
    }));
  };

  const updateTierBenefit = (tierIndex: number, benefitIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      customerTiers: prev.customerTiers.map((tier, i) => 
        i === tierIndex 
          ? { 
              ...tier, 
              benefits: tier.benefits.map((benefit, bi) => 
                bi === benefitIndex ? value : benefit
              )
            }
          : tier
      )
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
    if (!formData.businessOwnerName.trim()) errors.businessOwnerName = 'Owner name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    
    // Validate field formats
    Object.keys(formData).forEach(key => {
      if (typeof formData[key as keyof BusinessFormData] === 'string') {
        const error = validateField(key, formData[key as keyof BusinessFormData] as string);
        if (error) errors[key] = error;
      }
    });
    
    // Validate customer tiers
    if (formData.customerTiers.length === 0) {
      errors.customerTiers = 'At least one customer membership tier is required';
    } else {
      for (const [index, tier] of formData.customerTiers.entries()) {
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
      }
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors above');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid token. Please try accessing this page again from your invitation link.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Submitting business form with token:', token);
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

      console.log('📝 Create business response:', response);

      if (response.success) {
        const successUrl = `/onboard/${token}/success`;
        console.log('✅ Business created successfully, navigating to:', successUrl);
        // Redirect to success page or business dashboard
        navigate(successUrl);
      } else {
        console.error('❌ Business creation failed - response.success is false');
        setError('Failed to create business. Please try again.');
      }
    } catch (err: any) {
      console.error('Error creating business:', err);
      setError(err.message || 'Failed to create business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifyingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin border-4 border-[#800020] border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7] px-6 py-10">
        <Card className="max-w-md mx-auto p-8 text-center bg-white shadow-2xl border border-red-200">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Setup Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/landing')} className="w-full bg-gray-600 hover:bg-gray-700">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  // Helper function to render form field with validation
  const renderFormField = (
    name: string,
    label: string,
    type: string = 'text',
    icon?: React.ReactNode,
    required: boolean = true,
    placeholder?: string
  ) => {
    const error = validationErrors[name];
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{icon}</div>
            </div>
          )}
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name as keyof BusinessFormData] as string}
            onChange={handleInputChange}
            required={required}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 rounded-lg transition-all duration-200 ${
              error 
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 bg-white focus:border-[#800020] focus:ring-[#800020]/20'
            } focus:outline-none focus:ring-4`}
          />
          {name === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          )}
          {name === 'confirmPassword' && (
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] to-[#f8f5f0] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6 drop-shadow-lg" />
            <div className="absolute inset-0 rounded-full bg-green-500/10 blur-xl"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#800020] to-[#a00030] bg-clip-text text-transparent mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to Club Cuvée! Let's complete your business setup and configure your wine club tiers.
          </p>
          
          {/* Payment Status Card */}
          {paymentData && (
            <Card className="mt-8 p-6 bg-green-50 border-green-200 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-green-800">Subscription Active</p>
                  <p className="text-sm text-green-600">
                    {paymentData.session.customer_email}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <Card className="p-8 bg-white shadow-2xl border-gray-200">
            <div className="flex items-center space-x-3 mb-8">
              <Building className="h-8 w-8 text-[#800020]" />
              <h2 className="text-3xl font-bold text-gray-900">Business Information</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderFormField('businessName', 'Business Name', 'text', <Building className="h-5 w-5" />, true, 'Enter your business name')}
              {renderFormField('businessOwnerName', 'Owner Name', 'text', <User className="h-5 w-5" />, true, 'Your full name')}
              {renderFormField('email', 'Email Address', 'email', <Mail className="h-5 w-5" />, true, 'business@example.com')}
              {renderFormField('phone', 'Phone Number', 'tel', <Mail className="h-5 w-5" />, false, '+1 (555) 123-4567')}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                {renderFormField('password', 'Password', showPassword ? 'text' : 'password', <Lock className="h-5 w-5" />, true, 'Create a secure password')}
              </div>
              <div>
                {renderFormField('confirmPassword', 'Confirm Password', showConfirmPassword ? 'text' : 'password', <Lock className="h-5 w-5" />, true, 'Confirm your password')}
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {renderFormField('businessAddress', 'Business Address', 'text', <MapPin className="h-5 w-5" />, false, '123 Main Street')}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderFormField('city', 'City', 'text', undefined, false, 'City')}
                {renderFormField('state', 'State', 'text', undefined, false, 'State')}
                {renderFormField('zipCode', 'ZIP Code', 'text', undefined, false, '12345')}
              </div>
              
              {renderFormField('website', 'Website', 'url', undefined, false, 'https://yourwebsite.com')}
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                  Business Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your business and wine philosophy..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:border-[#800020] focus:ring-[#800020]/20 focus:outline-none focus:ring-4 transition-all duration-200"
                />
              </div>
            </div>
          </Card>

          {/* Customer Wine Club Tiers */}
          <Card className="p-8 bg-white shadow-2xl border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Wine className="h-8 w-8 text-[#800020]" />
                <h2 className="text-3xl font-bold text-gray-900">Customer Wine Club Tiers</h2>
              </div>
              <Button 
                type="button" 
                onClick={addTier} 
                className="bg-[#800020] hover:bg-[#a00030] text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Tier</span>
              </Button>
            </div>
            
            <div className="space-y-8">
              {formData.customerTiers.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <Wine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Create Your Wine Club Tiers</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Design membership tiers that reflect your unique wine offerings and create value for your customers.
                  </p>
                  <Button 
                    type="button" 
                    onClick={addTier} 
                    className="bg-[#800020] hover:bg-[#a00030] text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Your First Tier</span>
                  </Button>
                </div>
              ) : (
                formData.customerTiers.map((tier, tierIndex) => {
                const tierError = validationErrors[`tier_${tierIndex}_name`] || 
                                validationErrors[`tier_${tierIndex}_description`] || 
                                validationErrors[`tier_${tierIndex}_price`] || 
                                validationErrors[`tier_${tierIndex}_benefits`];
                
                return (
                  <div key={tierIndex} className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                    tierError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#800020] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {tierIndex + 1}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Wine Club Tier {tierIndex + 1}</h3>
                      </div>
                      {formData.customerTiers.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTier(tierIndex)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Tier Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Wine className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleTierChange(tierIndex, 'name', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                              validationErrors[`tier_${tierIndex}_name`] 
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-gray-200 bg-white focus:border-[#800020] focus:ring-[#800020]/20'
                            } focus:outline-none focus:ring-4`}
                            placeholder="e.g., Bronze Club, Gold Reserve"
                          />
                        </div>
                        {validationErrors[`tier_${tierIndex}_name`] && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{validationErrors[`tier_${tierIndex}_name`]}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Monthly Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                          <input
                            type="number"
                            min="10"
                            max="999"
                            step="1"
                            value={tier.monthlyPrice}
                            onChange={(e) => handleTierChange(tierIndex, 'monthlyPrice', parseFloat(e.target.value) || 0)}
                            className={`w-full pl-8 pr-20 py-3 border-2 rounded-lg transition-all duration-200 ${
                              validationErrors[`tier_${tierIndex}_price`] 
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-gray-200 bg-white focus:border-[#800020] focus:ring-[#800020]/20'
                            } focus:outline-none focus:ring-4`}
                            placeholder="49"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">/month</span>
                        </div>
                        {validationErrors[`tier_${tierIndex}_price`] && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{validationErrors[`tier_${tierIndex}_price`]}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={tier.description}
                          onChange={(e) => handleTierChange(tierIndex, 'description', e.target.value)}
                          rows={3}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                            validationErrors[`tier_${tierIndex}_description`] 
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-200 bg-white focus:border-[#800020] focus:ring-[#800020]/20'
                          } focus:outline-none focus:ring-4`}
                          placeholder="Describe what makes this tier special..."
                        />
                        {validationErrors[`tier_${tierIndex}_description`] && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{validationErrors[`tier_${tierIndex}_description`]}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-gray-800">
                          Membership Benefits <span className="text-red-500">*</span>
                        </label>
                        <Button
                          type="button"
                          onClick={() => addTierBenefit(tierIndex)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 flex items-center space-x-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Benefit</span>
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => updateTierBenefit(tierIndex, benefitIndex, e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-[#800020] focus:ring-[#800020]/20 focus:outline-none focus:ring-4 transition-all duration-200"
                                placeholder="e.g., 2 premium bottles monthly, Free shipping"
                              />
                            </div>
                            {tier.benefits.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeTierBenefit(tierIndex, benefitIndex)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {validationErrors[`tier_${tierIndex}_benefits`] && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{validationErrors[`tier_${tierIndex}_benefits`]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
                })
              )}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Wine Club Tier Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Create 2-4 tiers to give customers choice without overwhelming them</li>
                    <li>• Price tiers should offer clear value progression (more bottles, better wines, extra perks)</li>
                    <li>• Benefits should be specific and appealing ("Sommelier consultations" vs "Expert advice")</li>
                    <li>• Consider your wine costs and target profit margins when setting prices</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="p-6 bg-red-50 border-2 border-red-200">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Setup Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="text-center pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#800020] to-[#a00030] hover:from-[#a00030] hover:to-[#c00040] text-white font-bold px-12 py-4 rounded-xl text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating Your Business...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6" />
                  <span>Complete Setup & Launch Your Wine Club</span>
                </div>
              )}
            </Button>
          </div>
        </form>
        
        {/* Footer Note */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            By completing setup, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Need help? Contact our support team at support@clubcuvee.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessSetup;