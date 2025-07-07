import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { createClient } from '@supabase/supabase-js';
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
  Wine,
  Sparkles,
  X,
  Image
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Inline Supabase client creation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

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
  imageFile?: File;
  imagePreview?: string;
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [authenticatedClient, setAuthenticatedClient] = useState<ReturnType<typeof createClient> | null>(null);

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
        benefits: ['']
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

  // Handle logo file selection - NO UPLOAD until form submission
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo file is too large. Maximum size is 2MB.');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG, or WebP image.');
      return;
    }

    // Just store file in state - DO NOT upload yet
    setLogoFile(file);
    setError(null);

    // Create preview for display
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle tier image selection - NO UPLOAD until form submission
  const handleTierImageSelect = (tierIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (3MB max for tier images)
    if (file.size > 3 * 1024 * 1024) {
      setError('Tier image is too large. Maximum size is 3MB.');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG, or WebP image.');
      return;
    }

    // Just store file and preview in state - DO NOT upload yet
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        customerTiers: prev.customerTiers.map((tier, index) =>
          index === tierIndex 
            ? { ...tier, imageFile: file, imagePreview: preview }
            : tier
        )
      }));
    };
    reader.readAsDataURL(file);
    setError(null);
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

      // No authentication required - the API will create the auth account
      console.log('=== CREATING BUSINESS ACCOUNT ===');
      console.log('Business email:', formData.email);
      console.log('Token:', token);
      console.log('Session ID:', sessionId);
      
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
        businessData: formData
      });

      if (response.success) {
        const { businessId, businessAuthUserId, businessEmail } = response.data;
        
        console.log('=== BUSINESS CREATED ===');
        console.log('Business ID:', businessId);
        console.log('Business Auth User ID:', businessAuthUserId);
        console.log('Business Email:', businessEmail);
        
        // Now sign in as the business user to upload images
        console.log('=== SIGNING IN AS BUSINESS USER ===');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (signInError) {
          console.error('Failed to sign in as business user:', signInError);
          throw new Error('Failed to authenticate business account');
        }
        
        console.log('Successfully signed in as business user');
        
        // Get the session immediately after sign-in
        const { data: { session: newSession } } = await supabase.auth.getSession();
        
        if (!newSession || !newSession.access_token) {
          console.error('No session after sign-in, attempting to get user...');
          // Try to get the user which might refresh the session
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            console.error('Failed to get authenticated user:', userError);
            throw new Error('Failed to establish authenticated session');
          }
          
          // Get session again
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (!retrySession || !retrySession.access_token) {
            throw new Error('Failed to establish authenticated session');
          }
        }
        
        // Create a new Supabase client with explicit auth headers
        const finalSession = newSession || (await supabase.auth.getSession()).data.session;
        if (!finalSession) {
          throw new Error('No session available for authenticated client');
        }
        
        const newAuthenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${finalSession.access_token}`
            }
          },
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        });
        
        // Store the authenticated client in state
        setAuthenticatedClient(newAuthenticatedClient);
        
        // Verify we're now authenticated as the business owner
        const { data: { user: currentUser } } = await newAuthenticatedClient.auth.getUser();
        const { data: { session: currentSession } } = await newAuthenticatedClient.auth.getSession();
        
        console.log('Current authenticated user:', {
          userId: currentUser?.id,
          email: currentUser?.email,
          matchesBusinessAuth: currentUser?.id === businessAuthUserId,
          hasSession: !!currentSession,
          sessionUserId: currentSession?.user?.id,
          accessToken: currentSession?.access_token ? 'Present' : 'Missing'
        });
        
        if (!currentSession || !currentSession.access_token) {
          console.error('CRITICAL: No valid session in authenticated client!');
          throw new Error('Failed to establish authenticated session');
        }
        
        // Check upload state before attempting uploads
        console.log('=== UPLOAD STATE CHECK ===');
        console.log('Logo upload state:', {
          hasLogoFile: !!logoFile,
          logoFileName: logoFile?.name,
          logoFileSize: logoFile?.size,
          logoFileType: logoFile?.type,
          businessIdAvailable: !!businessId
        });
        
        // Check tier images state
        const tierImagesInfo = formData.customerTiers.map((tier, index) => ({
          tierIndex: index,
          tierName: tier.name,
          hasImageFile: !!tier.imageFile,
          imageFileName: tier.imageFile?.name,
          imageFileSize: tier.imageFile?.size
        }));
        console.log('Tier images state:', tierImagesInfo);
        
        // Upload logo if selected (inline function)
        if (logoFile && businessId) {
          console.log('=== PROCEEDING WITH LOGO UPLOAD ===');
          try {
            console.log('=== LOGO UPLOAD START ===');
            console.log('Logo file details:', {
              name: logoFile.name,
              size: logoFile.size,
              sizeInMB: (logoFile.size / 1024 / 1024).toFixed(2) + 'MB',
              type: logoFile.type,
              lastModified: new Date(logoFile.lastModified).toISOString()
            });
            
            // Verify business ID exists
            if (!businessId) {
              console.error('ERROR: No business ID available for upload!');
              throw new Error('Business ID is required for upload');
            }
            
            const fileExt = logoFile.name.split('.').pop()?.toLowerCase() || 'png';
            const fileName = `${businessId}/logo.${fileExt}`;
            console.log('Upload configuration:', {
              bucket: 'business-assets',
              path: fileName,
              fileExtension: fileExt,
              cacheControl: '3600',
              upsert: true
            });

            // Check auth status right before upload
            const { data: { session } } = await newAuthenticatedClient.auth.getSession();
            console.log('Auth session before upload:', {
              hasSession: !!session,
              sessionUserId: session?.user?.id,
              sessionEmail: session?.user?.email,
              accessToken: session?.access_token ? 'Present' : 'Missing',
              businessIdForUpload: businessId
            });
            
            // Verify business ownership for RLS
            const { data: businessOwnerCheck, error: ownerCheckError } = await newAuthenticatedClient
              .from('businesses')
              .select('owner_id')
              .eq('id', businessId)
              .single();
              
            console.log('Business ownership check before upload:', {
              businessId,
              businessOwnerId: businessOwnerCheck?.owner_id,
              currentUserId: session?.user?.id,
              ownershipMatch: businessOwnerCheck?.owner_id === session?.user?.id,
              error: ownerCheckError
            });
            
            if (businessOwnerCheck?.owner_id !== session?.user?.id) {
              console.error('CRITICAL: User does not own the business! RLS will block upload.');
            }
            
            // Double-check we have a valid session before upload
            if (!session || !session.access_token) {
              console.error('CRITICAL: No valid session for upload!');
              throw new Error('Authentication session missing');
            }
            
            // Log the auth header that will be used
            console.log('Upload will use auth token:', session.access_token.substring(0, 20) + '...');

            const { data: uploadData, error: uploadError } = await newAuthenticatedClient.storage
              .from('business-assets')
              .upload(fileName, logoFile, {
                cacheControl: '3600',
                upsert: true
              });

            if (uploadError) {
              console.error('=== LOGO UPLOAD FAILED ===');
              console.error('Full error:', uploadError);
              
              // Log available error properties
              const errorInfo: Record<string, any> = {
                message: uploadError.message || 'No message',
                name: uploadError.name || 'Unknown error'
              };
              
              // Add optional properties if they exist
              if ('statusCode' in uploadError) errorInfo.statusCode = uploadError.statusCode;
              if ('error' in uploadError) errorInfo.error = uploadError.error;
              if ('details' in uploadError) errorInfo.details = uploadError.details;
              if ('hint' in uploadError) errorInfo.hint = uploadError.hint;
              if ('code' in uploadError) errorInfo.code = uploadError.code;
              
              console.error('Error details:', errorInfo);
              
              // Check specific error types
              const errorMessage = uploadError.message || '';
              if (errorMessage.includes('not found')) {
                console.error('BUCKET ERROR: Storage bucket "business-assets" not found');
              } else if (errorMessage.includes('policy')) {
                console.error('POLICY ERROR: RLS policy violation');
              } else if (errorMessage.includes('unauthorized')) {
                console.error('AUTH ERROR: User not authorized');
              }
              
              throw uploadError;
            } else {
              console.log('=== LOGO UPLOAD SUCCESS ===');
              console.log('Upload response:', uploadData);
              
              // Get public URL
              const { data: { publicUrl } } = newAuthenticatedClient.storage
                .from('business-assets')
                .getPublicUrl(fileName);
              
              console.log('Public URL:', publicUrl);

              // Update business record with logo URL
              const { error: updateError } = await newAuthenticatedClient
                .from('businesses')
                .update({ logo_url: publicUrl })
                .eq('id', businessId);
                
              if (updateError) {
                console.error('Failed to update business with logo URL:', updateError);
              } else {
                console.log('Business logo URL updated successfully');
              }
            }
          } catch (err) {
            console.error('Logo upload error:', err);
            // Don't fail the whole process for image upload errors
          }
        }

        // Upload tier images if selected (inline function)
        console.log('=== CHECKING TIER IMAGES FOR UPLOAD ===');
        console.log(`Total tiers to check: ${formData.customerTiers.length}`);
        
        for (let i = 0; i < formData.customerTiers.length; i++) {
          const tier = formData.customerTiers[i];
          console.log(`Checking tier ${i}:`, {
            tierName: tier.name,
            hasImageFile: !!tier.imageFile,
            imageFileName: tier.imageFile?.name,
            willUpload: !!(tier.imageFile && businessId)
          });
          
          if (tier.imageFile && businessId) {
            console.log(`=== PROCEEDING WITH TIER ${i} IMAGE UPLOAD ===`);
            try {
              console.log(`Starting tier image upload for tier ${i}:`, tier.name);
              console.log('Tier image file:', tier.imageFile.name, tier.imageFile.size, tier.imageFile.type);
              
              // First, we need to get the tier ID from the created tiers
              const { data: tiers, error: tierError } = await newAuthenticatedClient
                .from('membership_tiers')
                .select('id, name')
                .eq('business_id', businessId)
                .eq('name', tier.name)
                .single();

              if (tierError) {
                console.error('Failed to find tier:', tierError);
                continue;
              }

              if (tiers && tiers.id) {
                const fileExt = tier.imageFile.name.split('.').pop()?.toLowerCase() || 'png';
                const fileName = `${businessId}/tier-${tiers.id}.${fileExt}`;
                console.log('Tier upload path:', fileName);

                const { data: uploadData, error: uploadError } = await newAuthenticatedClient.storage
                  .from('business-assets')
                  .upload(fileName, tier.imageFile, {
                    cacheControl: '3600',
                    upsert: true
                  });

                if (uploadError) {
                  console.error('=== TIER IMAGE UPLOAD FAILED ===');
                  console.error('Full error:', uploadError);
                  
                  // Log available error properties
                  const errorInfo: Record<string, any> = {
                    message: uploadError.message || 'No message',
                    name: uploadError.name || 'Unknown error',
                    tierName: tier.name,
                    tierId: tiers.id
                  };
                  
                  // Add optional properties if they exist
                  if ('statusCode' in uploadError) errorInfo.statusCode = uploadError.statusCode;
                  if ('error' in uploadError) errorInfo.error = uploadError.error;
                  if ('details' in uploadError) errorInfo.details = uploadError.details;
                  
                  console.error('Tier upload error details:', errorInfo);
                  
                  // Check specific error types
                  const errorMessage = uploadError.message || '';
                  if (errorMessage.includes('not found')) {
                    console.error('BUCKET ERROR: Storage bucket "business-assets" not found');
                  } else if (errorMessage.includes('policy')) {
                    console.error('POLICY ERROR: RLS policy violation for tier image');
                  }
                } else {
                  console.log('Tier image uploaded successfully:', uploadData);
                  
                  // Get public URL
                  const { data: { publicUrl } } = newAuthenticatedClient.storage
                    .from('business-assets')
                    .getPublicUrl(fileName);
                  
                  console.log('Tier public URL:', publicUrl);

                  // Update tier record with image URL
                  const { error: updateError } = await newAuthenticatedClient
                    .from('membership_tiers')
                    .update({ image_url: publicUrl })
                    .eq('id', tiers.id);
                    
                  if (updateError) {
                    console.error('Failed to update tier with image URL:', updateError);
                  } else {
                    console.log('Tier image URL updated successfully');
                  }
                }
              }
            } catch (err) {
              console.error('Tier image upload error:', err);
              // Don't fail the whole process for image upload errors
            }
          }
        }
        
        // Log upload summary
        console.log('=== UPLOAD PROCESS COMPLETE ===');
        console.log('Business setup completed. Navigating to success page...');
        
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
                
                {/* File Input */}
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleLogoUpload}
                    className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                      isDark 
                        ? 'file:bg-[#800020] file:text-white hover:file:bg-[#600018]' 
                        : 'file:bg-[#800020] file:text-white hover:file:bg-[#600018]'
                    } file:cursor-pointer cursor-pointer ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  />
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Max size: 2MB • PNG, JPG, JPEG, WebP
                  </p>
                  
                  {/* Logo Preview */}
                  {logoPreview && (
                    <div className="mt-4">
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Logo Preview:
                      </p>
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-w-[200px] h-auto rounded-lg shadow-md border border-gray-200"
                      />
                    </div>
                  )}
                </div>
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
                        
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={(e) => handleTierImageSelect(tierIndex, e)}
                          className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                            isDark 
                              ? 'file:bg-[#800020] file:text-white hover:file:bg-[#600018]' 
                              : 'file:bg-[#800020] file:text-white hover:file:bg-[#600018]'
                          } file:cursor-pointer cursor-pointer ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          } text-sm`}
                        />
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                          Max size: 3MB • PNG, JPG, JPEG, WebP • Recommended: 16:9 or 4:3 aspect ratio
                        </p>
                        
                        {/* Tier Image Preview */}
                        {tier.imagePreview && (
                          <div className="mt-3">
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                              Image Preview:
                            </p>
                            <img
                              src={tier.imagePreview}
                              alt={`${tier.name} preview`}
                              className="max-w-[300px] h-auto rounded-lg shadow-md border border-gray-200"
                            />
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