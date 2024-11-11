import React, { useState } from 'react';
import { Wine, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const MyWines = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [wines, setWines] = useState([
    { id: 1, name: 'Chateau Margaux 2015', type: 'Red', region: 'Bordeaux', rating: 95, notes: 'Exceptional balance and complexity' },
    { id: 2, name: 'Opus One 2018', type: 'Red', region: 'Napa Valley', rating: 92, notes: 'Rich and full-bodied' },
    { id: 3, name: 'Dom Perignon 2010', type: 'Champagne', region: 'Champagne', rating: 98, notes: 'Luxurious and refined' },
  ]);

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Wines</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wines.map((wine) => (
          <div key={wine.id} className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105`}>
            <div className="flex items-center mb-4">
              <Wine className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{wine.name}</h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{wine.type} | {wine.region}</p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{wine.rating}</span>
              <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/100</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{wine.notes}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
              Update Rating
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWines;