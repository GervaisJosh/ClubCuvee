import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext } from 'react';
const CalendarContext = createContext(undefined);
export const CalendarProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const addEvent = (event) => {
        setEvents([...events, { ...event, id: events.length + 1 }]);
    };
    const updateEvent = (updatedEvent) => {
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };
    const deleteEvent = (id) => {
        setEvents(events.filter(event => event.id !== id));
    };
    return (_jsx(CalendarContext.Provider, { value: { events, addEvent, updateEvent, deleteEvent }, children: children }));
};
export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};
