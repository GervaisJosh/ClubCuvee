import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div onClick={toggleTheme} className="cursor-pointer">
      {isDark ? (
        <Sun className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-200" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors duration-200" />
      )}
    </div>
  );
};

export default ThemeToggle;