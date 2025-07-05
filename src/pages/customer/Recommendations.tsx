import React from 'react';
import { Wine, Star, Droplet, Thermometer, Grape } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Recommendations = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const recommendedWines = [
    { 
      id: 1, 
      name: 'Chateau Margaux 2016', 
      type: 'Red', 
      region: 'Bordeaux', 
      rating: 98, 
      attributes: ['full-bodied', 'tannic', 'oak'], 
      varietal: 'Cabernet Sauvignon' 
    },
    { 
      id: 2, 
      name: 'Krug Grande Cuvée', 
      type: 'Champagne', 
      region: 'Champagne', 
      rating: 96, 
      attributes: ['bubbly', 'crisp', 'yeasty'], 
      varietal: 'Chardonnay Blend' 
    },
    { 
      id: 3, 
      name: 'Sassicaia 2018', 
      type: 'Red', 
      region: 'Tuscany', 
      rating: 97, 
      attributes: ['bold', 'structured', 'complex'], 
      varietal: 'Cabernet Blend' 
    },
    { 
      id: 4, 
      name: 'Cloudy Bay Sauvignon Blanc 2022', 
      type: 'White', 
      region: 'Marlborough', 
      rating: 93, 
      attributes: ['crisp', 'zesty', 'herbaceous'], 
      varietal: 'Sauvignon Blanc' 
    },
  ];

  const getWineIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'red':
        return <Wine className="h-8 w-8 text-red-500" />;
      case 'white':
        return <Wine className="h-8 w-8 text-yellow-300" />;
      case 'champagne':
        return <Wine className="h-8 w-8 text-yellow-100" />;
      default:
        return <Wine className="h-8 w-8 text-purple-500" />;
    }
  };

  const getAttributeIcon = (attribute) => {
    switch (attribute) {
      case 'full-bodied':
      case 'bold':
        return <Thermometer className="h-5 w-5 text-red-400" />;
      case 'crisp':
      case 'zesty':
        return <Droplet className="h-5 w-5 text-blue-400" />;
      case 'tannic':
      case 'structured':
        return <Grape className="h-5 w-5 text-purple-400" />;
      default:
        return <Star className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recommended Wines</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendedWines.map((wine) => (
          <div key={wine.id} className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                {getWineIcon(wine.type)}
                <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{wine.type}</span>
              </div>
              <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{wine.name}</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{wine.region}</p>
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className={`font-bold mr-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{wine.rating}</span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/ 100</span>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{wine.varietal}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {wine.attributes.map((attr, index) => (
                  <div key={index} className={`flex items-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-full px-3 py-1`}>
                    {getAttributeIcon(attr)}
                    <span className={`ml-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{attr}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
