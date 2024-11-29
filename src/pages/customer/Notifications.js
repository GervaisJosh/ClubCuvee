import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Truck, Star, Gift } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
const Notifications = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const notifications = [
        { id: 1, type: 'shipment', message: 'Your order of Chateau Margaux 2016 has been shipped!', date: '2023-06-10', icon: Truck },
        { id: 2, type: 'rating', message: 'Don\'t forget to rate the Opus One 2018 you recently enjoyed!', date: '2023-06-08', icon: Star },
        { id: 3, type: 'recommendation', message: 'New wines matching your taste profile are now available!', date: '2023-06-05', icon: Gift },
    ];
    const getIconColor = (type) => {
        switch (type) {
            case 'shipment':
                return 'text-blue-500';
            case 'rating':
                return 'text-yellow-500';
            case 'recommendation':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: `text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Notifications" }), _jsx("div", { className: "space-y-4", children: notifications.map((notification) => (_jsxs("div", { className: `${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 flex items-start`, children: [_jsx("div", { className: `${getIconColor(notification.type)} mr-4 mt-1`, children: _jsx(notification.icon, { className: "h-6 w-6" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: isDark ? 'text-white' : 'text-gray-900', children: notification.message }), _jsx("p", { className: `text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`, children: notification.date })] })] }, notification.id))) })] }));
};
export default Notifications;
