import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Wine, Instagram, Twitter, Youtube, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
const Footer = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const sections = {
        product: {
            title: 'Product',
            links: [
                { name: 'Features', href: '/features' },
                { name: 'Integrations', href: '/integrations' },
                { name: 'Pricing', href: '/pricing' }
            ]
        },
        resources: {
            title: 'Resources',
            links: [
                { name: 'Support', href: '/support' },
                { name: 'Documentation', href: '/docs' },
                { name: 'Brand Assets', href: '/brand' }
            ]
        },
        company: {
            title: 'Company',
            links: [
                { name: 'About', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Careers', href: '/careers' }
            ]
        }
    };
    return (_jsx("footer", { className: `border-t ${isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`, children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-12", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Wine, { className: "h-8 w-8 text-green-500 mr-2" }), _jsx("span", { className: `text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Cuvee Club" })] }), _jsx("div", { className: "flex space-x-4", children: [
                                        { icon: Instagram, href: '#' },
                                        { icon: Twitter, href: '#' },
                                        { icon: Youtube, href: '#' },
                                        { icon: MessageSquare, href: '#' }
                                    ].map((social, index) => (_jsx("a", { href: social.href, className: `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`, children: _jsx(social.icon, { className: "h-5 w-5" }) }, index))) })] }), Object.entries(sections).map(([key, section]) => (_jsxs("div", { children: [_jsx("h3", { className: `text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-900'} mb-4`, children: section.title }), _jsx("ul", { className: "space-y-2", children: section.links.map((link, index) => (_jsx("li", { children: _jsx(Link, { to: link.href, className: `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`, children: link.name }) }, index))) })] }, key)))] }), _jsxs("div", { className: "mt-8 pt-8 border-t border-gray-800 flex items-center justify-between", children: [_jsx("p", { className: `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: "\u00A9 Monopole AI, Inc." }), _jsx(ThemeToggle, {})] })] }) }));
};
export default Footer;
