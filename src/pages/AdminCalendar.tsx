import React, { useState } from 'react';
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
    } else {
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
    const monthEvents = events.filter(event => 
      event.date.getMonth() === currentDate.getMonth() && 
      event.date.getFullYear() === currentDate.getFullYear()
    );

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-800 border border-gray-700"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = monthEvents.filter(event => event.date.getDate() === day);

      days.push(
        <div key={day} className="h-24 bg-gray-800 border border-gray-700 p-1 overflow-hidden">
          <div className="font-bold mb-1">{day}</div>
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`text-xs ${event.type === 'event' ? 'bg-green-800' : 'bg-blue-800'} rounded p-1 mb-1 truncate cursor-pointer`}
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Wine Events & Deliveries</h1>
        <div className="flex items-center space-x-4">
          <button onClick={prevMonth} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      <button 
        onClick={handleNewEvent}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Event
      </button>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedEvent ? 'Edit Event' : 'New Event'}</h2>
              <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-white">
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
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="startTime">Start Time</label>
                  <select
                    id="startTime"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="endTime">End Time</label>
                  <select
                    id="endTime"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                <select
                  id="type"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="event">Event</option>
                  <option value="order">Order</option>
                </select>
              </div>
              <div className="flex justify-between">
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 ml-auto"
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