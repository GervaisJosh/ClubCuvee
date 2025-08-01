import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface BusinessLogoDisplayProps {
  logoUrl?: string;
  businessName: string;
  businessId?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const BusinessLogoDisplay: React.FC<BusinessLogoDisplayProps> = ({
  logoUrl,
  businessName,
  businessId,
  size = 'medium',
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [imageError, setImageError] = useState(false);

  // Construct full URL if logoUrl is just a path
  const getLogoUrl = (url: string | undefined) => {
    if (!url) return undefined;
    
    // If it's already a full URL, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's just a filename like "logo.jpg" and we have a businessId, construct the path
    if (businessId && (url === 'logo.jpg' || url === 'logo.png' || url.match(/^logo\.[a-zA-Z]+$/))) {
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(`${businessId}/${url}`);
      console.log('Constructed logo URL from filename:', {
        original: url,
        businessId,
        constructed: publicUrl
      });
      return publicUrl;
    }
    
    // Handle paths that already include the businessId
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    
    // If it looks like it already has a business ID in the path
    if (cleanPath.match(/^[a-f0-9-]{36}\//)) {
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(cleanPath);
      return publicUrl;
    }
    
    // If we have a businessId but the path doesn't include it, prepend it
    if (businessId) {
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(`${businessId}/${cleanPath}`);
      return publicUrl;
    }
    
    // Default: assume it's a path in the business-assets bucket
    const { data: { publicUrl } } = supabase.storage
      .from('business-assets')
      .getPublicUrl(cleanPath);
    return publicUrl;
  };

  const fullLogoUrl = getLogoUrl(logoUrl);
  
  // Debug logging
  console.log('BusinessLogoDisplay:', {
    originalUrl: logoUrl,
    fullUrl: fullLogoUrl,
    businessName,
    businessId,
    hasLogo: !!fullLogoUrl
  });

  const sizeClasses = {
    small: 'h-12 w-12 text-base',
    medium: 'h-16 w-16 text-xl',
    large: 'h-24 w-24 text-3xl'
  };

  const containerSizeClasses = {
    small: 'h-12 w-12',
    medium: 'h-16 w-16',
    large: 'h-24 w-24'
  };

  if (fullLogoUrl && !imageError) {
    return (
      <>
        <div className={`${containerSizeClasses[size]} ${className} ${imageError ? 'hidden' : ''}`}>
          <img
            src={fullLogoUrl}
            alt={`${businessName} logo`}
            className={`w-full h-full object-cover rounded-xl ${isDark ? 'shadow-lg shadow-black/20' : 'shadow-md'}`}
            loading="lazy"
            onError={(e) => {
              console.error('Failed to load logo:', fullLogoUrl);
              console.error('Logo error details:', {
                originalUrl: logoUrl,
                businessId,
                constructedUrl: fullLogoUrl
              });
              setImageError(true);
            }}
          />
        </div>
        {imageError && <FallbackLogo />}
      </>
    );
  }

  // Fallback when no logo exists
  const initials = businessName
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Fallback component
  const FallbackLogo = () => (
    <div 
      className={`
        ${containerSizeClasses[size]} 
        ${className}
        flex items-center justify-center rounded-xl
        ${isDark 
          ? 'bg-gradient-to-br from-[#722f37] to-[#5a252c] text-white' 
          : 'bg-gradient-to-br from-[#722f37] to-[#8b3a42] text-white'
        }
        ${isDark ? 'shadow-lg shadow-black/20' : 'shadow-md'}
        font-semibold
        ${sizeClasses[size]}
      `}
    >
      {initials || <Building2 className="w-1/2 h-1/2" />}
    </div>
  );

  return <FallbackLogo />;
};

export default BusinessLogoDisplay;