import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  position?: 'fixed' | 'inline';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  position = 'inline', 
  className = '' 
}) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(isDark ? 'light' : 'dark');
  };

  const baseClasses = `
    group cursor-pointer p-3 rounded-xl transition-all duration-300 
    ${isDark 
      ? 'bg-zinc-900/50 hover:bg-zinc-800/70 border border-zinc-800/50 hover:border-zinc-700/70' 
      : 'bg-white/70 hover:bg-white border border-gray-200/50 hover:border-gray-300/70'
    }
    backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105
    ${className}
  `;

  const fixedClasses = position === 'fixed' 
    ? 'fixed bottom-6 right-6 z-50' 
    : '';

  return (
    <div 
      onClick={toggleTheme} 
      className={`${baseClasses} ${fixedClasses}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-all duration-300 group-hover:rotate-180" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 group-hover:text-slate-800 transition-all duration-300 group-hover:rotate-12" />
      )}
    </div>
  );
};

export default ThemeToggle;