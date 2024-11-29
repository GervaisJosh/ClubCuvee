import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { User, Crown, Bell, Shield } from 'lucide-react';
const AccountSettings = ({ userRole }) => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        paymentMethod: '**** **** **** 1234',
        membershipTier: 'Premier Cru Membership',
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: true,
    });
    const [activeTab, setActiveTab] = useState('profile');
    const membershipTiers = [
        { name: 'First Growth Membership', price: 150 },
        { name: 'Premier Cru Membership', price: 300 },
        { name: 'Grand Cru Membership', price: 750 },
        { name: 'Monopole Membership', price: 1000 },
    ];
    useEffect(() => {
        // Simulating fetching user data (you can replace this with your API or Supabase logic)
        setUser({
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
    }, []);
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: type === 'checkbox' ? checked : value || '', // Ensure input doesn't become undefined
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('User details updated:', user);
        // Placeholder for Supabase logic or any API call for updating user details
    };
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300", htmlFor: "name", children: "Name" }), _jsx("input", { type: "text", id: "name", name: "name", value: user.name || '', onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300", htmlFor: "email", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: user.email || '', onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" })] }), _jsx("button", { type: "submit", className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out", children: "Save Changes" })] }));
            case 'security':
                return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300", htmlFor: "current-password", children: "Current Password" }), _jsx("input", { type: "password", id: "current-password", name: "currentPassword", value: user.currentPassword || '', onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300", htmlFor: "new-password", children: "New Password" }), _jsx("input", { type: "password", id: "new-password", name: "newPassword", value: user.newPassword || '', onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300", htmlFor: "confirm-password", children: "Confirm New Password" }), _jsx("input", { type: "password", id: "confirm-password", name: "confirmPassword", value: user.confirmPassword || '', onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500" })] }), _jsx("button", { type: "submit", className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out", children: "Update Password" })] }));
            case 'membership':
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-xl font-semibold text-white", children: ["Current Membership: ", user.membershipTier] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: membershipTiers.map((tier) => (_jsxs("div", { className: `p-4 border rounded-lg cursor-pointer transition duration-300 ease-in-out ${user.membershipTier === tier.name ? 'border-green-500 bg-green-500 bg-opacity-20' : 'border-gray-700 hover:border-green-500'}`, onClick: () => setUser({ ...user, membershipTier: tier.name }), children: [_jsx("h3", { className: "font-semibold text-white", children: tier.name }), _jsxs("p", { className: "text-sm text-gray-400", children: ["$", tier.price, "/month"] })] }, tier.name))) }), _jsx("button", { onClick: handleSubmit, className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out", children: "Update Membership" })] }));
            case 'notifications':
                return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: "Notification Preferences" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-white", children: "Email Notifications" }), _jsx("input", { type: "checkbox", name: "emailNotifications", checked: user.emailNotifications, onChange: handleInputChange, className: "form-checkbox h-5 w-5 text-green-500" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-white", children: "Push Notifications" }), _jsx("input", { type: "checkbox", name: "pushNotifications", checked: user.pushNotifications, onChange: handleInputChange, className: "form-checkbox h-5 w-5 text-green-500" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-white", children: "SMS Notifications" }), _jsx("input", { type: "checkbox", name: "smsNotifications", checked: user.smsNotifications, onChange: handleInputChange, className: "form-checkbox h-5 w-5 text-green-500" })] })] }), _jsx("button", { type: "submit", className: "w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out", children: "Save Notification Preferences" })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "p-6 bg-black text-white", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Account Settings" }), _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx("div", { className: "w-full md:w-1/4 mb-6 md:mb-0", children: _jsx("div", { className: "bg-black rounded-lg p-4", children: _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'profile' ? 'bg-green-500 text-white' : 'hover:bg-black'}`, onClick: () => setActiveTab('profile'), children: [_jsx(User, { className: "inline-block mr-2", size: 18 }), " Profile"] }) }), _jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'security' ? 'bg-green-500 text-white' : 'hover:bg-black'}`, onClick: () => setActiveTab('security'), children: [_jsx(Shield, { className: "inline-block mr-2", size: 18 }), " Security"] }) }), userRole === 'customer' && (_jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'membership' ? 'bg-green-500 text-white' : 'hover:bg-black'}`, onClick: () => setActiveTab('membership'), children: [_jsx(Crown, { className: "inline-block mr-2", size: 18 }), " Membership"] }) })), _jsx("li", { children: _jsxs("button", { className: `w-full text-left py-2 px-4 rounded ${activeTab === 'notifications' ? 'bg-green-500 text-white' : 'hover:bg-black'}`, onClick: () => setActiveTab('notifications'), children: [_jsx(Bell, { className: "inline-block mr-2", size: 18 }), " Notifications"] }) })] }) }) }), _jsx("div", { className: "w-full md:w-3/4 md:pl-6", children: _jsx("div", { className: "bg-black rounded-lg p-6", children: renderTabContent() }) })] })] }));
};
export default AccountSettings;
