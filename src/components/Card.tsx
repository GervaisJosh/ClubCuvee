import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  bordered = true,
  hover = false,
  onClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Base card styles
  let baseStyles = 'rounded-lg shadow-sm transition-all duration-200';
  
  // Background and border styles based on theme
  const bgStyles = isDark ? 'bg-black' : 'bg-white';
  const borderStyles = bordered 
    ? isDark 
      ? 'border border-gray-800' 
      : 'border border-gray-200'
    : '';
  
  // Padding styles
  let paddingStyles = '';
  switch (padding) {
    case 'none':
      paddingStyles = '';
      break;
    case 'sm':
      paddingStyles = 'p-3';
      break;
    case 'lg':
      paddingStyles = 'p-8';
      break;
    case 'md':
    default:
      paddingStyles = 'p-6';
      break;
  }
  
  // Hover styles
  const hoverStyles = hover 
    ? isDark 
      ? 'hover:border-gray-700 hover:shadow-md cursor-pointer' 
      : 'hover:shadow-md hover:border-gray-300 cursor-pointer'
    : '';
    
  // Combine all styles
  const combinedStyles = `${baseStyles} ${bgStyles} ${borderStyles} ${paddingStyles} ${hoverStyles} ${className}`;
  
  return (
    <div 
      className={combinedStyles}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;