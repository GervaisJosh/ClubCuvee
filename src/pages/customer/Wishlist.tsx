import React, { useState } from 'react';
import { Wine, Search, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Wishlist = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Chateau Lafite Rothschild 2016', type: 'Red', region: 'Bordeaux' },
    { id: 2, name: 'Krug Grande Cuvée', type: 'Champagne', region: 'Champagne' },
    { id: 3, name: 'Screaming Eagle Cabernet Sauvignon 2019', type: 'Red', region: 'Napa Valley' },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(wine => wine.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        My Top 10 Wines to Try
      </h1>
      
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for wines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-2 rounded-md ${
            isDark 
              ? 'bg-gray-800 text-white placeholder-gray-400' 
              : 'bg-white text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
        />
        <Search className={`absolute right-3 top-2.5 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>

      <div className="space-y-4">
        {wishlist.map((wine) => (
          <div 
            key={wine.id} 
            className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md p-4 flex items-center justify-between`}
          >
            <div className="flex items-center">
              <Wine className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {wine.name}
                </h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {wine.type} | {wine.region}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200">
                Add to Cart
              </button>
              <button 
                onClick={() => removeFromWishlist(wine.id)}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;