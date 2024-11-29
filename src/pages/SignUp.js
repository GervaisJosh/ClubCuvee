import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import { useTheme } from '../contexts/ThemeContext';
import AuthLayout from '../components/AuthLayout';
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [accountType, setAccountType] = useState('customer');
    const [restaurantName, setRestaurantName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });
            if (authError)
                throw authError;
            if (!authData.user)
                throw new Error('No user data returned from sign up');
            let restaurantId = null;
            if (accountType === 'restaurant') {
                const { data: restaurantData, error: restaurantError } = await supabase
                    .from('restaurants')
                    .insert({ name: restaurantName })
                    .select('id')
                    .single();
                if (restaurantError)
                    throw restaurantError;
                restaurantId = restaurantData.id;
            }
            const { error: userError } = await supabase
                .from('users')
                .insert({
                id: authData.user.id,
                username,
                email,
                restaurant_id: restaurantId,
                account_type: accountType,
            });
            if (userError)
                throw userError;
            setUser(authData.user);
            navigate('/dashboard');
        }
        catch (err) {
            console.error('Sign-up error:', err);
            setError(err.message || 'An unexpected error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(AuthLayout, { children: _jsxs("div", { className: `${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl rounded-lg px-8 py-10 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`, children: [_jsxs("div", { className: "flex flex-col items-center mb-8", children: [_jsx(Wine, { className: "h-16 w-16 text-green-500 mb-4" }), _jsx("h3", { className: `text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Cuvee Club" }), _jsx("h4", { className: `text-2xl font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'} mt-4`, children: "Create an account" })] }), _jsxs("form", { onSubmit: handleSignUp, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Username" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: `mt-1 block w-full px-4 py-3 rounded-md ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:border-transparent`, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: `mt-1 block w-full px-4 py-3 rounded-md ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:border-transparent`, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: `mt-1 block w-full px-4 py-3 rounded-md ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:border-transparent`, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Confirm Password" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: `mt-1 block w-full px-4 py-3 rounded-md ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:border-transparent`, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Account Type" }), _jsxs("select", { value: accountType, onChange: (e) => setAccountType(e.target.value), className: `mt-1 block w-full px-4 py-3 rounded-md ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:border-transparent`, required: true, children: [_jsx("option", { value: "customer", children: "Customer" }), _jsx("option", { value: "restaurant", children: "Restaurant" })] })] }), accountType === 'restaurant' && (_jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, children: "Restaurant Name" }), _jsx("input", { type: "text", value: restaurantName, onChange: (e) => setRestaurantName(e.target.value), className: `mt-1 block w-full px-4 py-3 rounded-md ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-green-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:border-transparent`, required: accountType === 'restaurant' })] })), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out", children: loading ? 'Signing Up...' : 'Sign Up' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-green-500 hover:text-green-400", children: "Log In" })] }) }), error && _jsx("p", { className: "mt-4 text-sm text-red-500 text-center", children: error })] }) }));
};
export default SignUp;
