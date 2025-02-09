import React, { useState, useEffect } from 'react';
import { Wine, Star } from 'lucide-react';
import { fetchWines, addWineRating } from '../../api/supabaseQueries';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface WineRating {
  id: string;
  wine_id: string;
  rating: number;
  review: string;
  created_at: string;
}

const defaultWines = [
  { id: '1', name: 'Chateau Margaux 2015', varietal: 'Cabernet Sauvignon', region: 'Bordeaux' },
  { id: '2', name: 'Opus One 2018', varietal: 'Bordeaux Blend', region: 'Napa Valley' },
  { id: '3', name: 'Dom Perignon 2010', varietal: 'Chardonnay', region: 'Champagne' },
];

const defaultRatings = [
  { id: '1', wine_id: '1', rating: 95, review: 'Exceptional balance and complexity', created_at: '2023-06-01' },
  { id: '2', wine_id: '2', rating: 92, review: 'Rich and full-bodied', created_at: '2023-06-02' },
];

const RateWines = () => {
  const [wines, setWines] = useState(defaultWines);
  const [userRatings, setUserRatings] = useState<WineRating[]>(defaultRatings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchWineData();
    fetchUserRatings();
  }, [user]);

  const fetchWineData = async () => {
    try {
      const data = await fetchWines();
      setWines(data.length > 0 ? data : defaultWines);
    } catch (err) {
      console.error('Error fetching wines:', err);
      setError('Failed to load wines. Using default data.');
      setWines(defaultWines);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    if (user) {
      try {
        setUserRatings(defaultRatings);
      } catch (err) {
        console.error('Error fetching user ratings:', err);
        setError('Failed to load your ratings. Using default data.');
        setUserRatings(defaultRatings);
      }
    }
  };

  const handleRating = (id: string, rating: string) => {
    const numRating = parseInt(rating);
    if (numRating >= 1 && numRating <= 100) {
      setWines(wines.map(wine => 
        wine.id === id ? { ...wine, rating: numRating } : wine
      ));
    }
  };

  const handleReview = (id: string, review: string) => {
    setWines(wines.map(wine => 
      wine.id === id ? { ...wine, review } : wine
    ));
  };

  const handleSubmit = async (id: string) => {
    if (!user) {
      setError('You must be logged in to submit a rating.');
      return;
    }
    const wine = wines.find(w => w.id === id);
    if (!wine || !wine.rating || !wine.review) {
      setError('Please provide both a rating and a review before submitting.');
      return;
    }
    try {
      await addWineRating({
        user_id: user.id,
        wine_id: id,
        rating: wine.rating,
        review: wine.review
      });
      fetchUserRatings();
      setError(null);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating. Please try again.');
    }
  };

  if (loading) return <div className={isDark ? 'text-white' : 'text-gray-900'}>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className={`text-3xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Rate Your Wines</h1>
      
      <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recently Rated Wines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {userRatings.map((rating) => {
          const wine = wines.find(w => w.id === rating.wine_id);
          return (
            <div key={rating.id} className={`rounded-lg p-4 ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
              <div className="flex items-center mb-2">
                <Wine className="h-6 w-6 text-red-500 mr-2" />
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {wine ? wine.name : 'Unknown Wine'}
                </h3>
              </div>
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-bold">{rating.rating}/100</span>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{rating.review}</p>
            </div>
          );
        })}
      </div>

      <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Rate More Wines</h2>
      <div className="space-y-6">
        {wines.map((wine) => (
          <div key={wine.id} className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Wine className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{wine.name}</h2>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{wine.varietal} | {wine.region}</p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={wine.rating || ''}
                  onChange={(e) => handleRating(wine.id, e.target.value)}
                  className={`w-16 px-2 py-1 rounded-md text-right ${
                    isDark 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  placeholder="1-100"
                />
                <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>/100</span>
              </div>
            </div>
            <textarea
              className={`w-full rounded-md p-2 mt-2 ${
                isDark 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}
              placeholder="Add your tasting notes..."
              rows={3}
              value={wine.review || ''}
              onChange={(e) => handleReview(wine.id, e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleSubmit(wine.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateWines;
