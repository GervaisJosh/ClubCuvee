import React from 'react';
import { Wine, Star, ShoppingCart } from 'lucide-react';

const PersonalizedRecommendations = () => {
  const recommendations = [
    { id: 1, name: 'Chateau Margaux 2016', type: 'Red', region: 'Bordeaux', rating: 98, price: 899.99, description: 'A perfect blend of power and finesse. Recommended based on your love for full-bodied reds.' },
    { id: 2, name: 'Krug Grande Cuvée', type: 'Champagne', region: 'Champagne', rating: 96, price: 249.99, description: 'Luxurious and complex. Suggested due to your preference for premium sparkling wines.' },
    { id: 3, name: 'Sassicaia 2018', type: 'Red', region: 'Tuscany', rating: 97, price: 349.99, description: 'Bold and elegant Super Tuscan. Recommended based on your ratings of Italian wines.' },
    { id: 4, name: 'Cloudy Bay Sauvignon Blanc 2022', type: 'White', region: 'Marlborough', rating: 93, price: 34.99, description: 'Crisp and aromatic. Suggested to diversify your white wine experience.' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Personalized Wine Recommendations</h1>
      <p className="text-gray-400 mb-6">Based on your taste profile, purchase history, and ratings, we think you'll love these wines:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((wine) => (
          <div key={wine.id} className="bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Wine className="h-8 w-8 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold">{wine.name}</h2>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-bold">{wine.rating}</span>
              </div>
            </div>
            <p className="text-gray-400 mb-2">{wine.type} | {wine.region}</p>
            <p className="mb-4">{wine.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${wine.price.toFixed(2)}</span>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;