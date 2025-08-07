import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import ImageUploadField from '../../components/ImageUploadField';
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
  Wine,
  Sparkles,
  X,
  Image,
  Upload
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

// Inline Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

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
  id?: string; // Add ID for tracking
  name: string;
  description: string;
  monthlyPrice: number;
  benefits: string[];
  imageFile?: File;
  imageUrl?: string; // Add image URL for uploaded images
  imagePath?: string; // Add image path for storage location
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
  
  // Create service role client for onboarding uploads
  const supabaseService = React.useMemo(() => {
    console.log('=== SERVICE CLIENT INIT ===');
    console.log('Has URL:', !!supabaseUrl);
    console.log('Has Service Key:', !!supabaseServiceRoleKey);
    console.log('Service Key length:', supabaseServiceRoleKey?.length || 0);
    
    if (!supabaseServiceRoleKey) {
      console.error('CRITICAL: Service role key not available for onboarding uploads');
      console.error('Check VITE_SUPABASE_SERVICE_ROLE_KEY in .env');
      console.error('Will use authenticated upload approach instead');
      return null;
    }
    
    const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('Service client created:', !!client);
    return client;
  }, []);
  
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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [authenticatedClient, setAuthenticatedClient] = useState<ReturnType<typeof createClient> | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [tierImageUrls, setTierImageUrls] = useState<Record<number, string>>({});
  const [tierImagePaths, setTierImagePaths] = useState<Record<number, string>>({});

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
            business_id: string;
            pricing_tier: string | null;
          };
        }>('/api/validate-business-invitation', { token });

        if (inviteResponse.success) {
          setFormData(prev => ({
            ...prev,
            businessName: inviteResponse.data.business_name,
            email: response.data.session.customer_email || inviteResponse.data.business_email
          }));
          setBusinessId(inviteResponse.data.business_id);
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

  const handleTierChange = (index: number, field: keyof CustomerTierFormData, value: string | number | string[] | File) => {
    setFormData(prev => ({
      ...prev,
      customerTiers: prev.customerTiers.map((tier, i) => 
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const addCustomerTier = () => {
    // Generate a unique ID for the tier (will be used for image upload path)
    const tierId = `tier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setFormData(prev => ({
      ...prev,
      customerTiers: [...prev.customerTiers, {
        id: tierId,
        name: '',
        description: '',
        monthlyPrice: 99,
        benefits: [''],
        imageUrl: '',
        imagePath: ''
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


  // Comprehensive form validation
  // Inline upload function using service role client
  const uploadImageWithServiceRole = async (file: File, businessId: string, path: string): Promise<string | null> => {
    if (!supabaseService) {
      console.error('Service role client not available for upload');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${businessId}/${path}.${fileExt}`;

      console.log('=== UPLOAD ATTEMPT ===');
      console.log('Bucket:', 'business-assets');
      console.log('Full path:', fileName);
      console.log('File details:', {
        name: file.name,
        size: file.size,
        sizeInKB: (file.size / 1024).toFixed(2) + 'KB',
        type: file.type
      });
      console.log('Service client exists:', !!supabaseService);

      // Upload using service role client
      const { data, error } = await supabaseService.storage
        .from('business-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      console.log('Upload response:', { data, error });

      if (error) {
        console.error('=== UPLOAD ERROR DETAILS ===');
        console.error('Error object:', JSON.stringify(error, null, 2));
        throw error;
      }

      // Verify the file was actually uploaded
      console.log('Verifying upload...');
      const { data: listData, error: listError } = await supabaseService.storage
        .from('business-assets')
        .list(businessId, {
          limit: 100,
          offset: 0
        });
      
      console.log('Files in businessId folder after upload:', listData);
      if (listError) {
        console.error('Error listing files:', listError);
      }

      // Get public URL using regular client
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('=== UPLOAD EXCEPTION ===');
      console.error('Full error:', error);
      return null;
    }
  };

  // Alternative upload function using authenticated client
  const uploadImageWithAuth = async (file: File, businessId: string, path: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${businessId}/${path}.${fileExt}`;

      console.log('=== AUTH UPLOAD ATTEMPT ===');
      console.log('Using authenticated client');
      console.log('Full path:', fileName);

      const { data, error } = await supabase.storage
        .from('business-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Auth upload error:', error);
        throw error;
      }

      console.log('Auth upload success:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Auth upload failed:', error);
      return null;
    }
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Business Info validation
    if (!formData.businessName.trim()) {
      errors.push('Business name is required');
    } else if (formData.businessName.trim().length < 2) {
      errors.push('Business name must be at least 2 characters');
    }
    
    if (!formData.businessOwnerName.trim()) {
      errors.push('Admin name is required');
    } else if (formData.businessOwnerName.trim().length < 2) {
      errors.push('Admin name must be at least 2 characters');
    }
    
    if (!formData.email.trim()) {
      errors.push('Business email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.push('Password must contain uppercase, lowercase, and number');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    // Optional field validation
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.push('Please enter a valid phone number');
    }
    
    if (formData.website && !formData.website.startsWith('http')) {
      errors.push('Website must start with http:// or https://');
    }
    
    // Membership Tiers validation
    if (formData.customerTiers.length === 0) {
      errors.push('At least one membership tier is required');
    }
    
    formData.customerTiers.forEach((tier, index) => {
      const tierNum = index + 1;
      
      if (!tier.name.trim()) {
        errors.push(`Tier ${tierNum}: Name is required`);
      }
      
      if (!tier.description.trim()) {
        errors.push(`Tier ${tierNum}: Description is required`);
      }
      
      if (tier.monthlyPrice < 10) {
        errors.push(`Tier ${tierNum}: Price must be at least $10`);
      } else if (tier.monthlyPrice > 999) {
        errors.push(`Tier ${tierNum}: Price cannot exceed $999`);
      }
      
      const validBenefits = tier.benefits.filter(b => b.trim());
      if (validBenefits.length === 0) {
        errors.push(`Tier ${tierNum}: At least one benefit is required`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData) {
      setError('Payment verification required');
      return;
    }

    // Use comprehensive validation
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Set form errors for display
      setFormErrors(validation.errors);
      
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Set a general error message
      setError('Please fix the errors below before submitting');
      return;
    }
    
    // Clear any previous errors
    setFormErrors([]);
    setError(null);

    try {
      setLoading(true);
      setError(null);

      // First, create the business account to get the business ID
      console.log('=== CREATING BUSINESS ACCOUNT ===');
      console.log('Business email:', formData.email);
      console.log('Token:', token);
      console.log('Session ID:', sessionId);
      
      // Initially create without images
      const businessDataWithoutImages = {
        ...formData,
        logoUrl: null,
        customerTiers: formData.customerTiers.map((tier) => ({
          name: tier.name,
          description: tier.description,
          monthlyPrice: tier.monthlyPrice,
          benefits: tier.benefits,
          imageUrl: tier.imageUrl || null,  // Include the uploaded image URL
          imagePath: tier.imagePath || null  // Include the storage path
        }))
      };

      const response = await apiClient.post<{
        success: boolean;
        data: {
          businessId: string;
          businessAuthUserId: string;
          businessEmail: string;
        };
      }>('/api/create-business', {
        token,
        sessionId,
        businessData: businessDataWithoutImages
      });

      if (response.success) {
        const { businessId, businessAuthUserId, businessEmail } = response.data;
        
        console.log('=== BUSINESS CREATED ===');
        console.log('Business ID:', businessId);
        console.log('Business Auth User ID:', businessAuthUserId);
        console.log('Business Email:', businessEmail);
        
        // Now sign in as the business user
        console.log('=== SIGNING IN AS BUSINESS USER ===');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (signInError) {
          console.error('Failed to sign in as business user:', signInError);
          // Don't throw - business is created, just can't auto-login
          navigate(`/onboard/${token}/success`);
          return;
        }
        
        console.log('Successfully signed in as business user');
        
        // Upload images after sign-in
        console.log('=== UPLOADING IMAGES ===');
        const useServiceRole = !!supabaseService;
        console.log('Using service role:', useServiceRole);
        
        // Update business with logo if already uploaded
        if (logoUrl || logoPath) {
          try {
            console.log('=== UPDATING BUSINESS WITH LOGO ===');
            console.log('Business ID:', businessId);
            console.log('Logo URL:', logoUrl);
            console.log('Logo Path:', logoPath);
            
            // CRITICAL: Must use service role client for business updates
              if (!supabaseService) {
                console.error('Service role client not available, using API endpoint for logo update');
                
                // Fallback to API endpoint
                try {
                  const updateResponse = await fetch('/api/update-business-logo', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      businessId: businessId,
                      logoUrl: logoUrl
                    }),
                  });
                  
                  if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    console.error('API failed to update business logo:', errorData);
                  } else {
                    const { business } = await updateResponse.json();
                    console.log('Business logo updated successfully via API:', business);
                  }
                } catch (apiError) {
                  console.error('Failed to update logo via API:', apiError);
                }
              } else {
                const { data: updateData, error: updateError } = await supabaseService
                  .from('businesses')
                  .update({ logo_url: logoUrl })
                  .eq('id', businessId)
                  .select();
                
                if (updateError) {
                  console.error('Failed to update business logo:', updateError);
                } else {
                  console.log('Business logo updated successfully:', updateData);
                }
              }
          } catch (error) {
            console.error('Logo upload error:', error);
            // Don't fail the whole process for image errors
          }
        }
        
        // Wait a moment to ensure the business creation is fully committed
        console.log('Waiting for database to settle...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // First, get all created tiers for this business
        console.log('=== FETCHING ALL CREATED TIERS ===');
        console.log('Using service client:', !!supabaseService);
        const queryClient = supabaseService || supabase;
        const { data: allCreatedTiers, error: fetchError } = await queryClient
          .from('membership_tiers')
          .select('id, name, image_url')
          .eq('business_id', businessId)
          .order('created_at', { ascending: true });
        
        if (fetchError || !allCreatedTiers) {
          console.error('Failed to fetch created tiers:', fetchError);
          console.log('Continuing without tier images...');
        } else {
          console.log('Found created tiers:', allCreatedTiers);
          
          // Note: Tier images will be handled in a separate step after tier creation
        }
        
        console.log('=== IMAGE UPLOADS COMPLETE ===');
        
        // Small delay to ensure database updates are complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
              <h1 className="text-4xl md:text-5xl font-light text-[#800020] mb-3">
                Welcome to Club Cuvée, {formData.businessName || 'Partner'}
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

        {/* Form Errors Display */}
        {formErrors.length > 0 && (
          <div className={`mb-8 p-6 ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl`}>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className={`${isDark ? 'text-red-200' : 'text-red-800'} font-semibold mb-2`}>
                  Please fix the following errors:
                </h3>
                <ul className={`list-disc list-inside ${isDark ? 'text-red-300' : 'text-red-700'} space-y-1`}>
                  {formErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

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
                  Admin User Name *
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

              {/* Logo Upload Section */}
              <div className="space-y-2 mt-8">
                <div className="flex items-center mb-4">
                  <Image className="h-5 w-5 text-[#800020] mr-2" />
                  <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Business Logo (Optional)
                  </label>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Upload your business logo to personalize your wine club
                </p>
                
                {businessId ? (
                  <ImageUploadField
                    label=""
                    businessId={businessId}
                    uploadPath="logo"
                    onUploadComplete={(url) => setLogoUrl(url)}
                    onPathChange={(path) => setLogoPath(path)}
                    existingImageUrl={logoUrl}
                    disabled={loading}
                    maxSizeMB={2}
                  />
                ) : (
                  <div className={`text-center py-8 border-2 border-dashed ${isDark ? 'border-zinc-700' : 'border-gray-300'} rounded-lg`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Business ID will be generated after initial setup
                    </p>
                  </div>
                )}
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
                <div className={`text-center py-12 border-2 border-dashed ${isDark ? 'border-zinc-700' : 'border-gray-300'} rounded-lg`}>
                  <Wine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Create your first membership tier
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                    Design exclusive wine experiences for your customers
                  </p>
                  <button 
                    type="button"
                    onClick={() => {
                      addCustomerTier();
                      setShowTierForm(true);
                    }} 
                    className="bg-[#800020] hover:bg-[#600018] text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="inline h-4 w-4 mr-2" />
                    CREATE FIRST TIER
                  </button>
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
                            <div key={benefitIndex} className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => updateBenefit(tierIndex, benefitIndex, e.target.value)}
                                className={`flex-1 px-4 py-3 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#800020]' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#800020]'} border rounded-xl transition-all duration-200`}
                                placeholder="e.g., 2 premium bottles monthly"
                              />
                              <button
                                type="button"
                                onClick={() => removeBenefit(tierIndex, benefitIndex)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
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

                      {/* Tier Image Upload */}
                      <div className="space-y-2 mt-6">
                        <div className="flex items-center mb-2">
                          <Image className="h-4 w-4 text-[#800020] mr-2" />
                          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tier Image (Optional)
                          </label>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                          Add an image to represent this membership tier
                        </p>
                        
                        {/* Use ImageUploadField for tier images */}
                        {businessId && tier.id ? (
                          <ImageUploadField
                            label=""
                            businessId={businessId}
                            uploadPath={`tiers/${tier.id}`}
                            onUploadComplete={(url) => {
                              const updatedTiers = [...formData.customerTiers];
                              updatedTiers[tierIndex].imageUrl = url;
                              setFormData(prev => ({ ...prev, customerTiers: updatedTiers }));
                            }}
                            onPathChange={(path) => {
                              const updatedTiers = [...formData.customerTiers];
                              updatedTiers[tierIndex].imagePath = path;
                              setFormData(prev => ({ ...prev, customerTiers: updatedTiers }));
                            }}
                            existingImageUrl={tier.imageUrl}
                            disabled={loading}
                            maxSizeMB={2}
                          />
                        ) : (
                          <div className={`text-center py-6 border-2 border-dashed ${isDark ? 'border-zinc-700' : 'border-gray-300'} rounded-lg`}>
                            <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Business must be created before uploading tier images
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.customerTiers.length > 0 && (
                  <div className="text-center pt-6">
                    <button
                      type="button"
                      onClick={addCustomerTier}
                      className={`w-full max-w-md mx-auto py-3 border-2 border-dashed ${isDark ? 'border-zinc-600 text-gray-300 hover:border-[#800020] hover:text-[#800020]' : 'border-gray-300 text-gray-700 hover:border-[#800020] hover:text-[#800020]'} rounded-xl transition-all duration-200 font-medium`}
                    >
                      <Plus className="inline h-4 w-4 mr-2" />
                      ADD ANOTHER TIER
                    </button>
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