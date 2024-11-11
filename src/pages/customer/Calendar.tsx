import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wine } from 'lucide-react';

const CustomerCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, date: new Date(2023, 5, 25), title: 'Wine Tasting Event', description: 'Bordeaux Classics', type: 'event' },
    { id: 2, date: new Date(2023, 5, 15), title: 'Wine Delivery', description: '2 bottle order', type: 'delivery' },
    { id: 3, date: new Date(2023, 5, 10), title: 'Winemaker Dinner', description: 'With Chateau Margaux', type: 'event' },
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
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-800 border border-gray-700"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = monthEvents.filter(event => event.date.getDate() === day);

      days.push(
        <div key={day} className="h-24 bg-gray-800 border border-gray-700 p-1 overflow-hidden">
          <div className="font-bold mb-1">{day}</div>
          {dayEvents.map(event => (
            <div key={event.id} className={`text-xs ${event.type === 'event' ? 'bg-green-800' : 'bg-blue-800'} rounded p-1 mb-1 truncate`}>
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
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default CustomerCalendar;