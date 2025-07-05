import React, { useState } from 'react';
import { Wine, Star, Filter } from 'lucide-react';
import BentoBox from '../components/BentoBox';
import { useTheme } from '../contexts/ThemeContext';

const WineReviews = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [reviews, setReviews] = useState([
    { id: 1, customer: 'John Doe', wine: 'Chateau Margaux 2015', rating: 95, comment: 'Exceptional wine, perfect balance and complexity.' },
    { id: 2, customer: 'Jane Smith', wine: 'Opus One 2018', rating: 92, comment: 'Excellent Napa blend, rich and full-bodied.' },
    { id: 3, customer: 'Bob Johnson', wine: 'Dom Perignon 2010', rating: 98, comment: 'The epitome of luxury champagne. Absolutely stunning.' },
  ]);

  const [sortBy, setSortBy] = useState('rating');
  const [filterRating, setFilterRating] = useState(0);

  const getRatingColor = (rating) => {
    if (rating >= 95) return isDark ? 'text-green-500' : 'text-green-600';
    if (rating >= 90) return isDark ? 'text-blue-500' : 'text-blue-600';
    if (rating >= 85) return isDark ? 'text-yellow-500' : 'text-yellow-600';
    return isDark ? 'text-red-500' : 'text-red-600';
  };

  const sortedAndFilteredReviews = reviews
    .filter(review => review.rating >= filterRating)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className={`p-6 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Wine Reviews
      </h1>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Filter className="mr-2" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`rounded-md px-2 py-1 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
          >
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Minimum Rating:</span>
          <input
            type="number"
            min="0"
            max="100"
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
            className={`rounded-md px-2 py-1 w-16 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredReviews.map((review) => (
          <BentoBox
            key={review.id}
            title={review.wine}
            icon={Wine}
            color="bg-purple-500"
            size="col-span-1"
            path={`/wine-reviews/${review.id}`}
          >
            <div className="mb-2">
              <Star className={`inline-block ${getRatingColor(review.rating)} mr-1`} />
              <span className={`font-bold ${getRatingColor(review.rating)}`}>{review.rating}</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{review.comment}</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Reviewed by {review.customer}</p>
          </BentoBox>
        ))}
      </div>
    </div>
  );
};

export default WineReviews;
