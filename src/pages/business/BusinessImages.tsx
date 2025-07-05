import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ImageUploadZone from '../../components/ImageUploadZone';
import BusinessLogoDisplay from '../../components/BusinessLogoDisplay';
import { Wine, Image, CheckCircle, AlertCircle, Loader2, Building } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Business {
  id: string;
  name: string;
  logo_url?: string;
}

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  monthly_price_cents: number;
  image_url?: string;
}

interface UploadResult {
  url: string;
  error?: string;
}

const BusinessImages: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingTierIds, setUploadingTierIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Inline upload functions - Vercel requires self-contained files
  const validateImageFile = (file: File, maxSizeMB: number): string | null => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return 'Please upload a PNG, JPG, JPEG, or WebP image';
    }

    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const uploadBusinessLogo = async (
    file: File,
    businessId: string
  ): Promise<UploadResult> => {
    try {
      // Validate file
      const validationError = validateImageFile(file, 2);
      if (validationError) {
        return { url: '', error: validationError };
      }

      // Get file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${businessId}/logo.${fileExt}`;

      console.log('Uploading business logo:', fileName);

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Replace existing logo
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { url: '', error: 'Failed to upload logo' };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      // Update business record with logo URL
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ logo_url: publicUrl })
        .eq('id', businessId);

      if (updateError) {
        console.error('Database update error:', updateError);
        return { url: '', error: 'Failed to save logo URL' };
      }

      return { url: publicUrl };
    } catch (error) {
      console.error('Logo upload error:', error);
      return { url: '', error: 'An unexpected error occurred' };
    }
  };

  const uploadTierImage = async (
    file: File,
    businessId: string,
    tierId: string
  ): Promise<UploadResult> => {
    try {
      // Validate file
      const validationError = validateImageFile(file, 3);
      if (validationError) {
        return { url: '', error: validationError };
      }

      // Get file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${businessId}/tier-${tierId}.${fileExt}`;

      console.log('Uploading tier image:', fileName);

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Replace existing image
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { url: '', error: 'Failed to upload image' };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      // Update membership tier record with image URL
      const { error: updateError } = await supabase
        .from('membership_tiers')
        .update({ image_url: publicUrl })
        .eq('id', tierId);

      if (updateError) {
        console.error('Database update error:', updateError);
        return { url: '', error: 'Failed to save image URL' };
      }

      return { url: publicUrl };
    } catch (error) {
      console.error('Tier image upload error:', error);
      return { url: '', error: 'An unexpected error occurred' };
    }
  };

  useEffect(() => {
    if (user) {
      fetchBusinessData();
    }
  }, [user]);

  const fetchBusinessData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch business data
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, logo_url')
        .eq('user_id', user.id)
        .single();

      if (businessError) {
        console.error('Error fetching business:', businessError);
        setError('Failed to load business information');
        return;
      }

      setBusiness(businessData);

      // Fetch membership tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from('membership_tiers')
        .select('id, name, description, monthly_price_cents, image_url')
        .eq('business_id', businessData.id)
        .eq('is_active', true)
        .order('monthly_price_cents', { ascending: true });

      if (tiersError) {
        console.error('Error fetching tiers:', tiersError);
        setError('Failed to load membership tiers');
        return;
      }

      setTiers(tiersData || []);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!business) return;

    setUploadingLogo(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await uploadBusinessLogo(file, business.id);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage('Logo uploaded successfully!');
        setBusiness({ ...business, logo_url: result.url });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      setError('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleTierImageUpload = async (tierId: string, file: File) => {
    if (!business) return;

    setUploadingTierIds(prev => new Set([...prev, tierId]));
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await uploadTierImage(file, business.id, tierId);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage('Tier image uploaded successfully!');
        setTiers(prev => prev.map(tier => 
          tier.id === tierId ? { ...tier, image_url: result.url } : tier
        ));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Tier image upload error:', err);
      setError('Failed to upload tier image');
    } finally {
      setUploadingTierIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tierId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10 flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#722f37] animate-spin mx-auto mb-4" />
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading business images...
          </p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10 flex items-center justify-center`}>
        <Card className={`max-w-md p-8 text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            No Business Found
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Please complete your business setup first.
          </p>
          <Button onClick={() => navigate('/business/dashboard')} variant="secondary">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'} px-6 py-10`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-light ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Business Images
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload your business logo and membership tier images
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
            <p className="text-emerald-800">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Business Logo Section */}
        <Card className={`p-8 mb-8 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center mb-6">
            <Building className="h-6 w-6 text-[#722f37] mr-3" />
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Business Logo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Your logo will be displayed on your wine club pages and customer communications.
              </p>
              
              <ImageUploadZone
                onUpload={handleLogoUpload}
                currentImageUrl={business.logo_url}
                maxSizeMB={2}
                recommendedAspect="Square (1:1)"
                label="Upload Logo"
                helpText="PNG, JPG, JPEG, or WebP"
                disabled={uploadingLogo}
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  Current Logo Preview
                </p>
                <BusinessLogoDisplay
                  logoUrl={business.logo_url}
                  businessName={business.name}
                  size="large"
                  className="mx-auto"
                />
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-3`}>
                  {business.logo_url ? 'This is how your logo appears to customers' : 'Default logo placeholder'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Membership Tier Images Section */}
        <Card className={`p-8 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center mb-6">
            <Wine className="h-6 w-6 text-[#722f37] mr-3" />
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Membership Tier Images
            </h2>
          </div>

          {tiers.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Wine className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No membership tiers found. Please create tiers first.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {tiers.map((tier) => (
                <div 
                  key={tier.id}
                  className={`p-6 ${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} rounded-xl`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {tier.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        ${(tier.monthly_price_cents / 100).toFixed(2)}/month
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                        {tier.description}
                      </p>
                      
                      <ImageUploadZone
                        onUpload={(file) => handleTierImageUpload(tier.id, file)}
                        currentImageUrl={tier.image_url}
                        maxSizeMB={3}
                        recommendedAspect="16:9 or 4:3"
                        label="Upload Tier Image"
                        helpText="This image represents this membership tier"
                        disabled={uploadingTierIds.has(tier.id)}
                        className="max-w-sm"
                      />
                    </div>

                    <div className="flex items-center justify-center">
                      {tier.image_url ? (
                        <div className="text-center">
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                            Current Image
                          </p>
                          <img
                            src={tier.image_url}
                            alt={tier.name}
                            className="w-full max-w-xs h-48 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      ) : (
                        <div className={`w-full max-w-xs h-48 ${isDark ? 'bg-zinc-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
                          <div className="text-center">
                            <Image className={`h-12 w-12 ${isDark ? 'text-zinc-500' : 'text-gray-400'} mx-auto mb-2`} />
                            <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                              No image uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => navigate('/business/dashboard')}
            variant="secondary"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate(`/join/${business.id}`)}
            className="bg-[#722f37] hover:bg-[#5a252c] text-white"
          >
            View Customer Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessImages;