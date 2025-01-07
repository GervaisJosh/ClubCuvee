import React, { useState, useEffect } from 'react';
import { Wine } from 'lucide-react';
import { 
  fetchRecommendations, 
  type WineData, 
  type RecommendationResponse, 
  sortWinesByScore 
} from '../utils/recommendationClient';
import BentoBox from './BentoBox';

interface RecommendationBentoBoxProps {
  userId: string;
  title: string;
  size: string;
  titleColor: string;
  backgroundColor: string;
  isDark: boolean;
}

interface WineCardProps {
  wine: WineData;
  score: number;
  isDark: boolean;
}

const WineCard: React.FC<WineCardProps> = ({ wine, score, isDark }) => (
  <div className="flex flex-col">
    <div className="relative aspect-[3/5] bg-black rounded-lg overflow-hidden group">
      <img
        src={wine.image_path}
        alt={wine.name}
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-wine.png';
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs">Match Score</span>
          <span className="text-white text-xs font-bold">{Math.round(score)}%</span>
        </div>
        <div className="w-full bg-gray-600 h-1 mt-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${Math.round(score)}%` }}
          />
        </div>
      </div>
    </div>
    <div className="mt-3 text-center">
      <h3 className={`font-bold uppercase tracking-wider text-sm ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {wine.name}
      </h3>
      <p className={`text-xs mt-1 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {wine.producer} {wine.vintage}
      </p>
      <div className={`text-xs mt-1 ${
        isDark ? 'text-gray-500' : 'text-gray-500'
      }`}>
        <p>{wine.region}, {wine.country}</p>
        <p className="mt-1">{wine.varietal}</p>
      </div>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="aspect-[3/5] bg-gray-800 rounded-lg mb-2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto" />
          <div className="h-3 bg-gray-800 rounded w-1/2 mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

const RecommendationBentoBox: React.FC<RecommendationBentoBoxProps> = ({
  userId,
  title,
  size,
  titleColor,
  backgroundColor,
  isDark,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const recommendationData = await fetchRecommendations(userId);
        setRecommendations(recommendationData);
      } catch (err) {
        setError('Unable to load recommendations');
        console.error('Error loading recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadRecommendations();
    }
  }, [userId]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-8">
          <Wine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {error}
          </p>
        </div>
      );
    }

    if (loading) {
      return <LoadingSkeleton />;
    }

    if (!recommendations?.wines.length) {
      return (
        <div className="text-center py-8">
          <Wine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Rate some wines to get personalized recommendations
          </p>
        </div>
      );
    }

    const sortedWines = sortWinesByScore(recommendations);

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
        {sortedWines.map((wine) => (
          <WineCard 
            key={wine.id} 
            wine={wine} 
            score={recommendations.scores[wine.id]}
            isDark={isDark}
          />
        ))}
      </div>
    );
  };

  return (
    <BentoBox
      title={title}
      size={size}
      titleColor={titleColor}
      backgroundColor={backgroundColor}
      path="/recommendations"
    >
      {renderContent()}
    </BentoBox>
  );
};

export default RecommendationBentoBox;