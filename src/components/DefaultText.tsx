import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption';
  color?: 'default' | 'burgundy' | 'light' | 'muted';
}

const DefaultText: React.FC<TextProps> = ({
  children,
  className = '',
  variant = 'body',
  color = 'default'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = '#800020';

  // Font family based on variant
  const fontFamily = (variant.startsWith('heading')) 
    ? 'HV Florentino' 
    : 'TayBasal';

  // Font size and weight based on variant
  let fontSize = 'text-base';
  let fontWeight = 'font-normal';
  
  switch (variant) {
    case 'heading1':
      fontSize = 'text-3xl md:text-4xl lg:text-5xl';
      fontWeight = 'font-bold';
      break;
    case 'heading2':
      fontSize = 'text-2xl md:text-3xl';
      fontWeight = 'font-bold';
      break;
    case 'heading3':
      fontSize = 'text-xl md:text-2xl';
      fontWeight = 'font-semibold';
      break;
    case 'body':
      fontSize = 'text-base';
      break;
    case 'caption':
      fontSize = 'text-sm';
      break;
  }

  // Text color based on color prop and dark mode
  let textColor = '';
  
  switch (color) {
    case 'burgundy':
      textColor = `text-[${burgundy}]`;
      break;
    case 'light':
      textColor = 'text-white';
      break;
    case 'muted':
      textColor = isDark ? 'text-gray-400' : 'text-gray-500';
      break;
    case 'default':
    default:
      textColor = isDark ? 'text-white' : 'text-gray-900';
      break;
  }

  return (
    <div 
      className={`${fontSize} ${fontWeight} ${textColor} ${className}`}
      style={{ fontFamily }}
    >
      {children}
    </div>
  );
};

export default DefaultText;