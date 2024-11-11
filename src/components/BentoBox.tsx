import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface BentoBoxProps {
  title: string;
  value?: string | number;
  icon?: React.ElementType;
  color?: string;
  size: string;
  path: string;
  children?: React.ReactNode;
  description?: string;
}

const BentoBox: React.FC<BentoBoxProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  size, 
  path, 
  children, 
  description 
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

  return (
    <div
      ref={boxRef}
      className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6 ${size} cursor-pointer transition-all duration-200 transform hover:scale-105 relative overflow-hidden`}
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
      <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      {value && (
        <div className="flex items-center justify-between">
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {Icon && <Icon className={`h-10 w-10 ${color} rounded-full p-2`} />}
        </div>
      )}
      {children}
      {description && (
        <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-white'} bg-opacity-90 flex items-center justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{description}</p>
        </div>
      )}
    </div>
  );
};

export default BentoBox;