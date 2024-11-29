import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
const Layout = ({ children, userRole, setViewMode }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (_jsxs("div", { className: `min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`, children: [_jsx(Sidebar, { userRole: userRole, setViewMode: setViewMode }), _jsx("div", { className: `ml-20 p-6 transition-all duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`, children: children })] }));
};
export default Layout;
