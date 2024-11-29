import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '../contexts/ThemeContext';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';
const AuthLayout = ({ children }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (_jsxs("div", { className: `min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`, children: [_jsx(AuthHeader, {}), _jsx("div", { className: "flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20", children: _jsx("div", { className: "w-full max-w-md", children: children }) }), _jsx(AuthFooter, {})] }));
};
export default AuthLayout;
