import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
const BentoBox = ({ title, value, icon: Icon, iconColor = 'text-gray-700', // Default icon color
titleColor = 'text-gray-900', // Default title color
backgroundColor, size, path, children, description, className = '', }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const boxRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    useEffect(() => {
        const handleMouseMove = (event) => {
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
    return (_jsxs("div", { ref: boxRef, className: `rounded-lg shadow-md p-6 ${size} cursor-pointer transition-all duration-200 transform hover:scale-105 relative overflow-hidden ${className} ${isDark ? 'bg-gray-900' : backgroundColor || 'bg-white'}`, onClick: handleClick, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [isHovered && (_jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`,
                    mixBlendMode: 'overlay',
                } })), _jsx("h2", { className: `text-xl font-semibold mb-4 ${titleColor}`, children: title }), value && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: `text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`, children: value }), Icon && _jsx(Icon, { className: `h-10 w-10 ${iconColor}` })] })), children, description && (_jsx("div", { className: `absolute inset-0 ${isDark ? 'bg-gray-900' : backgroundColor || 'bg-white'} bg-opacity-90 flex items-center justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`, children: _jsx("p", { className: `text-sm ${isDark ? 'text-white' : 'text-gray-900'}`, children: description }) }))] }));
};
export default BentoBox;
