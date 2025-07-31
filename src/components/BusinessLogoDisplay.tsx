import React from 'react';
import { Building2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface BusinessLogoDisplayProps {
  logoUrl?: string;
  businessName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const BusinessLogoDisplay: React.FC<BusinessLogoDisplayProps> = ({
  logoUrl,
  businessName,
  size = 'medium',
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Construct full URL if logoUrl is just a path
  const getLogoUrl = (url: string | undefined) => {
    if (!url) return undefined;
    
    // If it's already a full URL, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a path in the business-assets bucket, construct the full URL
    // Handle both cases: with or without leading slash
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    
    // If it looks like a Supabase storage path
    if (cleanPath.includes('businesses/') || cleanPath.includes('business-assets/')) {
      const pathWithoutBucket = cleanPath.replace('business-assets/', '');
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(pathWithoutBucket);
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

  if (fullLogoUrl) {
    return (
      <div className={`${containerSizeClasses[size]} ${className}`}>
        <img
          src={fullLogoUrl}
          alt={`${businessName} logo`}
          className={`w-full h-full object-cover rounded-xl ${isDark ? 'shadow-lg shadow-black/20' : 'shadow-md'}`}
          loading="lazy"
          onError={(e) => {
            console.error('Failed to load logo:', fullLogoUrl);
            // Hide the broken image and show fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
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

  return (
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
};

export default BusinessLogoDisplay;