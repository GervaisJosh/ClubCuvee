import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { User, Bell, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
const AccountSettings = ({ userRole }) => {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        paymentMethod: '**** **** **** 1234',
        membershipTier: 'Premier Cru Membership',
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: true,
    });
    const isDark = theme === 'dark';
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Updated user settings:', user);
    };
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, htmlFor: "name", children: "Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: user.name, onChange: handleInputChange, className: `mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent` })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, htmlFor: "email", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: user.email, onChange: handleInputChange, className: `mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent` })] }), _jsx("button", { type: "submit", className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600", children: "Save Changes" })] }));
            case 'security':
                return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, htmlFor: "current-password", children: "Current Password" }), _jsx("input", { type: "password", id: "current-password", name: "currentPassword", value: user.currentPassword, onChange: handleInputChange, className: `mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent` })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, htmlFor: "new-password", children: "New Password" }), _jsx("input", { type: "password", id: "new-password", name: "newPassword", value: user.newPassword, onChange: handleInputChange, className: `mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent` })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`, htmlFor: "confirm-password", children: "Confirm New Password" }), _jsx("input", { type: "password", id: "confirm-password", name: "confirmPassword", value: user.confirmPassword, onChange: handleInputChange, className: `mt-1 block w-full px-3 py-2 rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent` })] }), _jsx("button", { type: "submit", className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600", children: "Update Password" })] }));
            case 'appearance':
                return (_jsxs("div", { className: "space-y-6", children: [_jsx("h3", { className: `text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Theme Settings" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("button", { onClick: () => handleThemeChange('light'), className: `flex items-center px-4 py-2 rounded-md ${theme === 'light' ? 'bg-green-500 text-white' : isDark ? 'bg-gray-800' : 'bg-gray-200'}`, children: [_jsx(Sun, { className: "h-5 w-5 mr-2" }), "Light Mode"] }), _jsxs("button", { onClick: () => handleThemeChange('dark'), className: `flex items-center px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-green-500 text-white' : isDark ? 'bg-gray-800' : 'bg-gray-200'}`, children: [_jsx(Moon, { className: "h-5 w-5 mr-2" }), "Dark Mode"] })] })] }));
            case 'notifications':
                return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("h3", { className: `text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Notification Preferences" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: isDark ? 'text-white' : 'text-gray-900', children: "Email Notifications" }), _jsx("input", { type: "checkbox", name: "emailNotifications", checked: user.emailNotifications, onChange: handleInputChange, className: "form-checkbox h-5 w-5 text-green-500" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: isDark ? 'text-white' : 'text-gray-900', children: "Push Notifications" }), _jsx("input", { type: "checkbox", name: "pushNotifications", checked: user.pushNotifications, onChange: handleInputChange, className: "form-checkbox h-5 w-5 text-green-500" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: isDark ? 'text-white' : 'text-gray-900', children: "SMS Notifications" }), _jsx("input", { type: "checkbox", name: "smsNotifications", checked: user.smsNotifications, onChange: handleInputChange, className: "form-checkbox h-5 w-5 text-green-500" })] })] }), _jsx("button", { type: "submit", className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600", children: "Save Notification Preferences" })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: `p-6 ${isDark ? 'bg-black' : 'bg-white'}`, children: [_jsx("h1", { className: `text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Account Settings" }), _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx("div", { className: "w-full md:w-1/4 mb-6 md:mb-0", children: _jsx("div", { className: `${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-4`, children: _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'profile' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`, onClick: () => setActiveTab('profile'), children: [_jsx(User, { className: "inline-block mr-2", size: 18 }), " Profile"] }) }), _jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'security' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`, onClick: () => setActiveTab('security'), children: [_jsx(Shield, { className: "inline-block mr-2", size: 18 }), " Security"] }) }), _jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'appearance' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`, onClick: () => setActiveTab('appearance'), children: [isDark ? _jsx(Moon, { className: "inline-block mr-2", size: 18 }) : _jsx(Sun, { className: "inline-block mr-2", size: 18 }), " Appearance"] }) }), _jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'notifications' ? 'bg-green-500 text-white' : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`, onClick: () => setActiveTab('notifications'), children: [_jsx(Bell, { className: "inline-block mr-2", size: 18 }), " Notifications"] }) })] }) }) }), _jsx("div", { className: "w-full md:w-3/4 md:pl-6", children: _jsx("div", { className: `${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6`, children: renderTabContent() }) })] })] }));
};
export default AccountSettings;
