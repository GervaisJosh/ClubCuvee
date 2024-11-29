import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wine, Plus, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
const AdminCalendar = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([
        { id: 1, date: new Date(2023, 5, 25), title: 'Wine Tasting Event', description: 'Bordeaux Classics', type: 'event' },
        { id: 2, date: new Date(2023, 5, 15), title: 'Wine Delivery', description: '2 bottle order', type: 'delivery' },
        { id: 3, date: new Date(2023, 5, 10), title: 'Winemaker Dinner', description: 'With Chateau Margaux', type: 'event' },
    ]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        description: '',
        type: 'event'
    });
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    const handleNewEvent = () => {
        setSelectedEvent(null);
        setNewEvent({
            title: '',
            date: '',
            time: '',
            description: '',
            type: 'event'
        });
        setShowEventModal(true);
    };
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setNewEvent({
            title: event.title,
            date: event.date.toISOString().split('T')[0],
            time: event.date.toTimeString().split(' ')[0].slice(0, 5),
            description: event.description,
            type: event.type
        });
        setShowEventModal(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`);
        if (selectedEvent) {
            const updatedEvents = events.map(event => event.id === selectedEvent.id
                ? { ...event, title: newEvent.title, date: eventDateTime, description: newEvent.description, type: newEvent.type }
                : event);
            setEvents(updatedEvents);
        }
        else {
            const newEventObject = {
                id: events.length + 1,
                title: newEvent.title,
                date: eventDateTime,
                description: newEvent.description,
                type: newEvent.type
            };
            setEvents([...events, newEventObject]);
        }
        setShowEventModal(false);
    };
    const handleDelete = () => {
        if (selectedEvent) {
            const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
            setEvents(updatedEvents);
            setShowEventModal(false);
        }
    };
    const renderCalendarDays = () => {
        const days = [];
        const monthEvents = events.filter(event => event.date.getMonth() === currentDate.getMonth() &&
            event.date.getFullYear() === currentDate.getFullYear());
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(_jsx("div", { className: `h-24 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} border ${isDark ? 'border-gray-700' : 'border-gray-300'}` }, `empty-${i}`));
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = monthEvents.filter(event => event.date.getDate() === day);
            days.push(_jsxs("div", { className: `h-24 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} border ${isDark ? 'border-gray-700' : 'border-gray-300'} p-1 overflow-hidden`, children: [_jsx("div", { className: "font-bold mb-1", children: day }), dayEvents.map(event => (_jsxs("div", { className: `text-xs ${event.type === 'event' ? (isDark ? 'bg-green-800' : 'bg-green-200') : (isDark ? 'bg-blue-800' : 'bg-blue-200')} rounded p-1 mb-1 truncate cursor-pointer`, onClick: () => handleEventClick(event), children: [event.type === 'event' ? _jsx(CalendarIcon, { className: "inline-block h-3 w-3 mr-1" }) : _jsx(Wine, { className: "inline-block h-3 w-3 mr-1" }), event.title] }, event.id)))] }, day));
        }
        return days;
    };
    return (_jsxs("div", { className: `p-6 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: `text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`, children: "Wine Events & Deliveries" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: prevMonth, className: `p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`, children: _jsx(ChevronLeft, { className: "h-6 w-6" }) }), _jsx("h2", { className: "text-xl font-semibold", children: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }), _jsx("button", { onClick: nextMonth, className: `p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`, children: _jsx(ChevronRight, { className: "h-6 w-6" }) })] })] }), _jsxs("button", { onClick: handleNewEvent, className: `mb-4 ${isDark ? 'bg-green-500' : 'bg-green-400'} text-white px-4 py-2 rounded-md hover:${isDark ? 'bg-green-600' : 'bg-green-500'} transition-colors duration-200 flex items-center`, children: [_jsx(Plus, { className: "h-5 w-5 mr-2" }), "Add New Event"] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (_jsx("div", { className: `text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`, children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: renderCalendarDays() }), showEventModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center", children: _jsxs("div", { className: `p-6 rounded-lg w-96 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: selectedEvent ? 'Edit Event' : 'New Event' }), _jsx("button", { onClick: () => setShowEventModal(false), className: "text-gray-400 hover:text-gray-700", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", htmlFor: "title", children: "Title" }), _jsx("input", { type: "text", id: "title", value: newEvent.title, onChange: (e) => setNewEvent({ ...newEvent, title: e.target.value }), className: `w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 focus:ring-green-500' : 'bg-gray-100 border-gray-300 focus:ring-green-400'}`, required: true })] }), _jsxs("div", { className: "flex justify-between", children: [selectedEvent && (_jsx("button", { type: "button", onClick: handleDelete, className: `px-4 py-2 rounded-md transition-colors duration-200 ${isDark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-400 hover:bg-red-500'} text-white`, children: "Delete" })), _jsx("button", { type: "submit", className: `px-4 py-2 rounded-md ml-auto transition-colors duration-200 ${isDark ? 'bg-green-500 hover:bg-green-600' : 'bg-green-400 hover:bg-green-500'} text-white`, children: selectedEvent ? 'Update' : 'Create' })] })] })] }) }))] }));
};
export default AdminCalendar;
