import React from 'react';
import { Wine, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  monthly_price_cents: number;
  benefits?: string[];
  image_url?: string;
}

interface TierImageCardProps {
  tier: MembershipTier;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const TierImageCard: React.FC<TierImageCardProps> = ({
  tier,
  onClick,
  selected = false,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const benefits = typeof tier.benefits === 'string' 
    ? JSON.parse(tier.benefits) 
    : tier.benefits || [];

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden
        ${selected
          ? `${isDark ? 'bg-[#722f37]/10 border-[#722f37]' : 'bg-[#722f37]/5 border-[#722f37]'} shadow-lg`
          : `${isDark ? 'bg-zinc-800/30 border-zinc-700 hover:border-zinc-600' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`
        }
        ${className}
      `}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {tier.image_url ? (
          <img
            src={tier.image_url}
            alt={tier.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className={`
            w-full h-full flex items-center justify-center
            ${isDark 
              ? 'bg-gradient-to-br from-[#722f37]/20 to-[#5a252c]/20' 
              : 'bg-gradient-to-br from-[#722f37]/10 to-[#8b3a42]/10'
            }
          `}>
            <Wine className={`h-16 w-16 ${isDark ? 'text-[#722f37]/50' : 'text-[#722f37]/30'}`} />
          </div>
        )}
        
        {/* Selected Overlay */}
        {selected && (
          <div className="absolute inset-0 bg-[#722f37]/20 flex items-center justify-center">
            <div className="bg-[#722f37] text-white rounded-full p-3">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {tier.name}
          </h3>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ${(tier.monthly_price_cents / 100).toFixed(2)}
            <span className={`text-base font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>
          </p>
        </div>
        
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          {tier.description}
        </p>
        
        {benefits.length > 0 && (
          <ul className="space-y-2">
            {benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 mt-0.5 ${
                  selected ? 'text-[#722f37]' : 'text-green-500'
                }`} />
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {benefit}
                </span>
              </li>
            ))}
            {benefits.length > 3 && (
              <li className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} italic`}>
                +{benefits.length - 3} more benefits
              </li>
            )}
          </ul>
        )}
        
        {selected && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center text-sm font-medium text-[#722f37]">
              Selected
              <CheckCircle className="h-4 w-4 ml-1" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TierImageCard;