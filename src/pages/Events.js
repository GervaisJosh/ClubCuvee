import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCalendar } from '../contexts/CalendarContext';
import { Calendar, Package } from 'lucide-react';
const Events = () => {
    const { events } = useCalendar();
    const sortedEvents = [...events].sort((a, b) => a.date - b.date);
    const eventsList = sortedEvents.filter(event => event.type === 'event');
    const ordersList = sortedEvents.filter(event => event.type === 'order');
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-3xl font-semibold mb-6", children: "Events and Orders" }), sortedEvents.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No events or orders have been added yet. Add some from the Calendar page." })) : (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Events" }), _jsx("div", { className: "space-y-6 mb-8", children: eventsList.map((event) => (_jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: event.title }), _jsx(Calendar, { className: "h-6 w-6 text-green-500" })] }), _jsxs("p", { className: "text-gray-400 mb-2", children: [event.date.toLocaleDateString(), " | ", event.timeRange] }), _jsx("p", { className: "text-gray-300", children: event.description })] }, event.id))) }), _jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Orders" }), _jsx("div", { className: "space-y-6", children: ordersList.map((order) => (_jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: order.title }), _jsx(Package, { className: "h-6 w-6 text-blue-500" })] }), _jsxs("p", { className: "text-gray-400 mb-2", children: [order.date.toLocaleDateString(), " | ", order.timeRange] }), _jsx("p", { className: "text-gray-300", children: order.description })] }, order.id))) })] }))] }));
};
export default Events;
