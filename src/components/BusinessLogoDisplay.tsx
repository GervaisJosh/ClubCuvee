import React from 'react';
import { Building2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
  
  // Debug logging
  console.log('BusinessLogoDisplay props:', {
    logoUrl,
    businessName,
    hasLogo: !!logoUrl,
    size
  });
  const isDark = theme === 'dark';

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

  if (logoUrl) {
    return (
      <div className={`${containerSizeClasses[size]} ${className}`}>
        <img
          src={logoUrl}
          alt={`${businessName} logo`}
          className={`w-full h-full object-cover rounded-xl ${isDark ? 'shadow-lg shadow-black/20' : 'shadow-md'}`}
          loading="lazy"
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