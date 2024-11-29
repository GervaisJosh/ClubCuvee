import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
const AuthFooter = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (_jsx("footer", { className: `fixed bottom-0 w-full ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-sm border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`, children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-4", children: _jsxs("div", { className: "flex flex-col items-center justify-center text-center relative", children: [_jsxs("p", { className: `text-xs max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: ["By continuing, you agree to Cuvee Club's", ' ', _jsx(Link, { to: "/terms", className: `${isDark ? 'text-green-500 hover:text-green-400' : 'text-green-600 hover:text-green-500'}`, children: "Terms of Service" }), ' ', "and", ' ', _jsx(Link, { to: "/privacy", className: `${isDark ? 'text-green-500 hover:text-green-400' : 'text-green-600 hover:text-green-500'}`, children: "Privacy Policy" }), _jsx("br", {}), "and to receive periodic emails with updates."] }), _jsx("div", { className: "absolute right-0 top-1/2 -translate-y-1/2", children: _jsx(ThemeToggle, {}) })] }) }) }));
};
export default AuthFooter;
