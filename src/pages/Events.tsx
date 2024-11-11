import React from 'react';
import { useCalendar } from '../contexts/CalendarContext';
import { Calendar, Package } from 'lucide-react';

const Events = () => {
  const { events } = useCalendar();

  const sortedEvents = [...events].sort((a, b) => a.date - b.date);
  const eventsList = sortedEvents.filter(event => event.type === 'event');
  const ordersList = sortedEvents.filter(event => event.type === 'order');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Events and Orders</h1>
      {sortedEvents.length === 0 ? (
        <p className="text-gray-400">No events or orders have been added yet. Add some from the Calendar page.</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Events</h2>
          <div className="space-y-6 mb-8">
            {eventsList.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-gray-400 mb-2">
                  {event.date.toLocaleDateString()} | {event.timeRange}
                </p>
                <p className="text-gray-300">{event.description}</p>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          <div className="space-y-6">
            {ordersList.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{order.title}</h2>
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-gray-400 mb-2">
                  {order.date.toLocaleDateString()} | {order.timeRange}
                </p>
                <p className="text-gray-300">{order.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Events;