import { jsx as _jsx } from "react/jsx-runtime";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const toggleTheme = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTheme(isDark ? 'light' : 'dark');
    };
    return (_jsx("button", { onClick: toggleTheme, className: `p-2 rounded-full transition-colors duration-200 ${isDark
            ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`, "aria-label": `Switch to ${isDark ? 'light' : 'dark'} mode`, children: isDark ? (_jsx(Sun, { className: "h-5 w-5" })) : (_jsx(Moon, { className: "h-5 w-5" })) }));
};
export default ThemeToggle;
