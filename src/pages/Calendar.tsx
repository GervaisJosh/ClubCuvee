import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wine, Plus, X, Edit, Trash } from 'lucide-react';
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
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, title: newEvent.title, date: eventDateTime, description: newEvent.description, type: newEvent.type }
          : event
      );
      setEvents(updatedEvents);
    } else {
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
    const monthEvents = events.filter(event => 
      event.date.getMonth() === currentDate.getMonth() && 
      event.date.getFullYear() === currentDate.getFullYear()
    );

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={`h-24 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = monthEvents.filter(event => event.date.getDate() === day);

      days.push(
        <div key={day} className={`h-24 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} border ${isDark ? 'border-gray-700' : 'border-gray-300'} p-1 overflow-hidden`}>
          <div className="font-bold mb-1">{day}</div>
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`text-xs ${event.type === 'event' ? (isDark ? 'bg-green-800' : 'bg-green-200') : (isDark ? 'bg-blue-800' : 'bg-blue-200')} rounded p-1 mb-1 truncate cursor-pointer`}
              onClick={() => handleEventClick(event)}
            >
              {event.type === 'event' ? <CalendarIcon className="inline-block h-3 w-3 mr-1" /> : <Wine className="inline-block h-3 w-3 mr-1" />}
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Wine Events & Deliveries</h1>
        <div className="flex items-center space-x-4">
          <button onClick={prevMonth} className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      <button 
        onClick={handleNewEvent}
        className={`mb-4 ${isDark ? 'bg-green-500' : 'bg-green-400'} text-white px-4 py-2 rounded-md hover:${isDark ? 'bg-green-600' : 'bg-green-500'} transition-colors duration-200 flex items-center`}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Event
      </button>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-lg w-96 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedEvent ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 focus:ring-green-500' : 'bg-gray-100 border-gray-300 focus:ring-green-400'}`}
                  required
                />
              </div>
              {/* Additional input fields for date, time, description, and type as in the original component */}
              <div className="flex justify-between">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${isDark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-400 hover:bg-red-500'} text-white`}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ml-auto transition-colors duration-200 ${isDark ? 'bg-green-500 hover:bg-green-600' : 'bg-green-400 hover:bg-green-500'} text-white`}
                >
                  {selectedEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
