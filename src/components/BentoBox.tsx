import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface BentoBoxProps {
  title: string;
  value?: string | number;
  icon?: React.ElementType;
  iconColor?: string;
  titleColor?: string;
  backgroundColor?: string;
  size: string;
  path: string;
  children?: React.ReactNode;
  description?: string;
  className?: string;
}

const BentoBox: React.FC<BentoBoxProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-gray-700', // Default icon color
  titleColor = 'text-gray-900', // Default title color
  backgroundColor,
  size,
  path,
  children,
  description,
  className = '',
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  const handleClick = () => {
    navigate(path);
  };

  // Determine if this bento box contains images
  const hasImages = React.Children.toArray(children).some(child => {
    if (React.isValidElement(child)) {
      return child.type === 'img' || 
             (typeof child.type === 'string' && child.type.toLowerCase() === 'img') ||
             child.props?.src;
    }
    return false;
  });

  // Only apply glow effect to boxes without images
  const glowClass = !hasImages ? 'glow-burgundy-subtle' : '';

  return (
    <div
      ref={boxRef}
      className={`rounded-lg md:rounded-xl shadow-md p-4 sm:p-6 ${size} cursor-pointer transition-all duration-200 transform hover:scale-105 relative overflow-hidden ${className} ${glowClass} ${
        isDark ? 'bg-black' : backgroundColor || 'bg-white'
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}
      <h2 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${titleColor}`}>{title}</h2>
      {value && (
        <div className="flex items-center justify-between">
          <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {Icon && <Icon className={`h-8 w-8 md:h-10 md:w-10 ${iconColor}`} />}
        </div>
      )}
      {children}
      {description && (
        <div
          className={`absolute inset-0 ${
            isDark ? 'bg-gray-900' : backgroundColor || 'bg-white'
          } bg-opacity-90 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{description}</p>
        </div>
      )}
    </div>
  );
};

export default BentoBox;