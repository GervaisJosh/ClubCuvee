import React, { useState } from 'react';
import { Wine, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const WineInventory = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [wines, setWines] = useState([
    { id: 1, name: 'Chateau Margaux 2015', type: 'Red', region: 'Bordeaux', stock: 24, price: 599.99 },
    { id: 2, name: 'Opus One 2018', type: 'Red', region: 'Napa Valley', stock: 18, price: 399.99 },
    { id: 3, name: 'Dom Perignon 2010', type: 'Champagne', region: 'Champagne', stock: 36, price: 249.99 },
  ]);

  const handleEdit = (id) => {
    // Placeholder for edit functionality
    console.log('Edit wine with id:', id);
  };

  const handleDelete = (id) => {
    // Placeholder for delete functionality
    setWines(wines.filter(wine => wine.id !== id));
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-semibold mb-6">
        Wine Inventory Management
      </h1>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} shadow-md rounded-lg overflow-hidden`}>
        <table className="w-full">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                Name
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                Type
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                Region
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                Stock
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                Price
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`${isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-300'}`}>
            {wines.map((wine) => (
              <tr key={wine.id} className={isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Wine className={`h-6 w-6 ${isDark ? 'text-red-500' : 'text-red-700'} mr-2`} />
                    <div className="text-sm font-medium">{wine.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{wine.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{wine.region}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{wine.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${wine.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => handleEdit(wine.id)} 
                    className={`mr-2 ${isDark ? 'text-blue-400 hover:text-blue-500' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(wine.id)} 
                    className={`${isDark ? 'text-red-400 hover:text-red-500' : 'text-red-600 hover:text-red-700'}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WineInventory;
