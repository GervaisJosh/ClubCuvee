import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  icon,
  fullWidth = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = '#800020';
  
  // Base button styles
  let baseStyles = 'flex items-center justify-center rounded-md transition-all duration-200 font-medium';
  
  if (fullWidth) {
    baseStyles += ' w-full';
  }
  
  // Size styles
  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'py-2 px-3 text-sm';
      break;
    case 'lg':
      sizeStyles = 'py-4 px-6 text-lg';
      break;
    case 'md':
    default:
      sizeStyles = 'py-3 px-4 text-base';
      break;
  }
  
  // Variant styles
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = `bg-[${burgundy}] text-white hover:bg-opacity-90`;
      break;
    case 'secondary':
      variantStyles = isDark 
        ? 'bg-gray-800 text-white hover:bg-gray-700' 
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      break;
    case 'outline':
      variantStyles = isDark 
        ? `border border-[${burgundy}] text-[${burgundy}] hover:bg-[${burgundy}] hover:bg-opacity-10` 
        : `border border-[${burgundy}] text-[${burgundy}] hover:bg-[${burgundy}] hover:bg-opacity-5`;
      break;
    case 'ghost':
      variantStyles = isDark 
        ? 'text-gray-300 hover:bg-gray-800' 
        : 'text-gray-700 hover:bg-gray-100';
      break;
  }
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${disabledStyles} ${className}`}
      style={{ fontFamily: 'TayBasal' }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;