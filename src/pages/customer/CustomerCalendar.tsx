import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wine } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const CustomerCalendar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState([
    { id: 1, date: new Date(2023, 5, 25), title: 'Wine Tasting Event', description: 'Bordeaux Classics', type: 'event' },
    { id: 2, date: new Date(2023, 5, 15), title: 'Wine Delivery', description: '2 bottle order', type: 'delivery' },
  ]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const monthEvents = events.filter(event => 
      event.date.getMonth() === currentDate.getMonth() && 
      event.date.getFullYear() === currentDate.getFullYear()
    );

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className={`h-24 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = monthEvents.filter(event => event.date.getDate() === day);

      days.push(
        <div 
          key={day} 
          className={`h-24 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-1 overflow-hidden`}
        >
          <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{day}</div>
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`text-xs rounded p-1 mb-1 truncate ${
                event.type === 'event' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-blue-500/20 text-blue-500'
              }`}
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
        <h1 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Upcoming Events
        </h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={prevMonth} 
            className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className={`h-6 w-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
          </button>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button 
            onClick={nextMonth} 
            className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight className={`h-6 w-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default CustomerCalendar;
