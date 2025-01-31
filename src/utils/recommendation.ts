import { SentimentIntensityAnalyzer } from 'vader-sentiment';

const analyzer = new SentimentIntensityAnalyzer();

export interface WineRating {
  region: string;
  style: string;
  rating: number;
  review: string;
}

export interface EnhancedUser {
  id: string;
  ratings: WineRating[];
}

const EXPECTED_USER_VECTOR_LENGTH = 6; // 3 regions + 2 styles + 1 rating
const REGION_WEIGHTS: Record<string, number> = {
  'Italy': 1.0,
  'France': 0.9,
  'Spain': 0.8,
  'USA': 0.7,
  'Argentina': 0.6,
  'Germany': 0.5,
  'Portugal': 0.4,
  'Other': 0.3
};

const STYLE_WEIGHTS: Record<string, number> = {
  'Red': 1.0,
  'White': 0.9,
  'Sparkling': 0.8,
  'Rosé': 0.7,
  'Dessert': 0.6,
  'Fortified': 0.5,
  'Other': 0.4
};

export const computeUserVector = (user: EnhancedUser): number[] => {
  const regionWeights: Record<string, number> = {};
  const styleWeights: Record<string, number> = {};
  let totalRating = 0;

  user.ratings.forEach(({ region, style, rating, review }) => {
    const sentiment = analyzer.polarityScores(review).compound;
    const adjustedSentiment = Math.min(Math.max(sentiment + 1, 0.8), 1.2);
    const weightedRating = rating * adjustedSentiment;

    regionWeights[region] = (regionWeights[region] || 0) + weightedRating;
    styleWeights[style] = (styleWeights[style] || 0) + weightedRating;
    totalRating += rating;
  });

  const regions = Object.entries(regionWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([region]) => region);

  const styles = Object.entries(styleWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([style]) => style);

  const regionVector = regions.map(r => REGION_WEIGHTS[r] || REGION_WEIGHTS.Other);
  const styleVector = styles.map(s => STYLE_WEIGHTS[s] || STYLE_WEIGHTS.Other);

  const finalVector = [
    ...regionVector,
    ...styleVector,
    (totalRating / user.ratings.length) / 100
  ];

  if (finalVector.length !== EXPECTED_USER_VECTOR_LENGTH) {
    throw new Error(`User vector dimension mismatch: Expected ${EXPECTED_USER_VECTOR_LENGTH} elements, got ${finalVector.length}`);
  }

  return finalVector;
};

export const cosineSimilarity = (vec1: number[], vec2: number[]): number => {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * (vec2[i] || 0), 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return mag1 && mag2 ? dotProduct / (mag1 * mag2) : 0;
};

export const calculateCompatibility = (
  user: EnhancedUser,
  wineVector: number[],
  wineTheory: number[] = []
): number => {
  const userVector = computeUserVector(user);
  const baseSimilarity = cosineSimilarity(userVector, wineVector);
  const theoryBonus = wineTheory.length > 0 
    ? 0.5 * cosineSimilarity(userVector, wineTheory)
    : 0;
  
  return Math.min(Math.max((baseSimilarity + theoryBonus) * 100, 0), 100);
};