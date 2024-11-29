import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wine, Plus, X } from 'lucide-react';
import { useCalendar } from '../contexts/CalendarContext';
const AdminCalendar = () => {
    const { events, addEvent, updateEvent, deleteEvent } = useCalendar();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
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
            startTime: '',
            endTime: '',
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
            startTime: event.timeRange.split(' - ')[0],
            endTime: event.timeRange.split(' - ')[1],
            description: event.description,
            type: event.type
        });
        setShowEventModal(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const eventDate = new Date(newEvent.date);
        const eventData = {
            title: newEvent.title,
            date: eventDate,
            timeRange: `${newEvent.startTime} - ${newEvent.endTime}`,
            description: newEvent.description,
            type: newEvent.type
        };
        if (selectedEvent) {
            updateEvent({ ...eventData, id: selectedEvent.id });
        }
        else {
            addEvent(eventData);
        }
        setShowEventModal(false);
    };
    const handleDelete = () => {
        if (selectedEvent) {
            deleteEvent(selectedEvent.id);
            setShowEventModal(false);
        }
    };
    const generateTimeOptions = () => {
        const options = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += 15) {
                const hour = i % 12 || 12;
                const minute = j.toString().padStart(2, '0');
                const ampm = i < 12 ? 'AM' : 'PM';
                options.push(`${hour}:${minute} ${ampm}`);
            }
        }
        return options;
    };
    const timeOptions = generateTimeOptions();
    const renderCalendarDays = () => {
        const days = [];
        const monthEvents = events.filter(event => event.date.getMonth() === currentDate.getMonth() &&
            event.date.getFullYear() === currentDate.getFullYear());
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(_jsx("div", { className: "h-24 bg-gray-800 border border-gray-700" }, `empty-${i}`));
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = monthEvents.filter(event => event.date.getDate() === day);
            days.push(_jsxs("div", { className: "h-24 bg-gray-800 border border-gray-700 p-1 overflow-hidden", children: [_jsx("div", { className: "font-bold mb-1", children: day }), dayEvents.map(event => (_jsxs("div", { className: `text-xs ${event.type === 'event' ? 'bg-green-800' : 'bg-blue-800'} rounded p-1 mb-1 truncate cursor-pointer`, onClick: () => handleEventClick(event), children: [event.type === 'event' ? _jsx(CalendarIcon, { className: "inline-block h-3 w-3 mr-1" }) : _jsx(Wine, { className: "inline-block h-3 w-3 mr-1" }), event.title] }, event.id)))] }, day));
        }
        return days;
    };
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-semibold", children: "Wine Events & Deliveries" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: prevMonth, className: "p-2 bg-gray-700 rounded-full hover:bg-gray-600", children: _jsx(ChevronLeft, { className: "h-6 w-6" }) }), _jsx("h2", { className: "text-xl font-semibold", children: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) }), _jsx("button", { onClick: nextMonth, className: "p-2 bg-gray-700 rounded-full hover:bg-gray-600", children: _jsx(ChevronRight, { className: "h-6 w-6" }) })] })] }), _jsxs("button", { onClick: handleNewEvent, className: "mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center", children: [_jsx(Plus, { className: "h-5 w-5 mr-2" }), "Add New Event"] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (_jsx("div", { className: "text-center font-bold", children: day }, day))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: renderCalendarDays() }), showEventModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center", children: _jsxs("div", { className: "bg-gray-800 p-6 rounded-lg w-96", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: selectedEvent ? 'Edit Event' : 'New Event' }), _jsx("button", { onClick: () => setShowEventModal(false), className: "text-gray-400 hover:text-white", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", htmlFor: "title", children: "Title" }), _jsx("input", { type: "text", id: "title", value: newEvent.title, onChange: (e) => setNewEvent({ ...newEvent, title: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", htmlFor: "date", children: "Date" }), _jsx("input", { type: "date", id: "date", value: newEvent.date, onChange: (e) => setNewEvent({ ...newEvent, date: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", required: true })] }), _jsxs("div", { className: "mb-4 flex space-x-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium mb-1", htmlFor: "startTime", children: "Start Time" }), _jsx("select", { id: "startTime", value: newEvent.startTime, onChange: (e) => setNewEvent({ ...newEvent, startTime: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", required: true, children: timeOptions.map(time => (_jsx("option", { value: time, children: time }, time))) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium mb-1", htmlFor: "endTime", children: "End Time" }), _jsx("select", { id: "endTime", value: newEvent.endTime, onChange: (e) => setNewEvent({ ...newEvent, endTime: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", required: true, children: timeOptions.map(time => (_jsx("option", { value: time, children: time }, time))) })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", htmlFor: "description", children: "Description" }), _jsx("textarea", { id: "description", value: newEvent.description, onChange: (e) => setNewEvent({ ...newEvent, description: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", rows: "3", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", htmlFor: "type", children: "Type" }), _jsxs("select", { id: "type", value: newEvent.type, onChange: (e) => setNewEvent({ ...newEvent, type: e.target.value }), className: "w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", required: true, children: [_jsx("option", { value: "event", children: "Event" }), _jsx("option", { value: "order", children: "Order" })] })] }), _jsxs("div", { className: "flex justify-between", children: [selectedEvent && (_jsx("button", { type: "button", onClick: handleDelete, className: "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200", children: "Delete" })), _jsx("button", { type: "submit", className: "bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 ml-auto", children: selectedEvent ? 'Update' : 'Create' })] })] })] }) }))] }));
};
export default AdminCalendar;
