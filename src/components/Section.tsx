import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DefaultText from './DefaultText';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  bordered?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  divider?: boolean;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  className = '',
  bordered = false,
  maxWidth = 'full',
  centered = false,
  divider = false,
  spacing = 'md',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Max width styles
  let maxWidthStyles = '';
  switch (maxWidth) {
    case 'sm':
      maxWidthStyles = 'max-w-3xl';
      break;
    case 'md':
      maxWidthStyles = 'max-w-5xl';
      break;
    case 'lg':
      maxWidthStyles = 'max-w-7xl';
      break;
    case 'xl':
      maxWidthStyles = 'max-w-[1920px]';
      break;
    case 'full':
    default:
      maxWidthStyles = 'w-full';
      break;
  }
  
  // Border styles
  const borderStyles = bordered 
    ? isDark 
      ? 'border border-gray-800 rounded-lg' 
      : 'border border-gray-200 rounded-lg'
    : '';
  
  // Spacing styles
  let spacingStyles = '';
  switch (spacing) {
    case 'none':
      spacingStyles = '';
      break;
    case 'sm':
      spacingStyles = 'py-4 space-y-4';
      break;
    case 'lg':
      spacingStyles = 'py-12 space-y-10';
      break;
    case 'md':
    default:
      spacingStyles = 'py-8 space-y-6';
      break;
  }
  
  // Divider styles
  const dividerStyles = divider 
    ? isDark 
      ? 'border-t border-b border-gray-800' 
      : 'border-t border-b border-gray-200'
    : '';
    
  // Centered styles
  const centeredStyles = centered ? 'mx-auto text-center' : '';
  
  // Combine all styles
  const combinedStyles = `${maxWidthStyles} ${borderStyles} ${spacingStyles} ${dividerStyles} ${centeredStyles} ${className}`;
  
  return (
    <div className={combinedStyles}>
      {title && (
        <div className={centered ? 'text-center' : ''}>
          <DefaultText variant="heading2" className="mb-2">
            {title}
          </DefaultText>
          {subtitle && (
            <DefaultText variant="body" color="muted" className="mt-2">
              {subtitle}
            </DefaultText>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Section;