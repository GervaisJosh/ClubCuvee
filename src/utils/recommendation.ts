// src/utils/recommendation.ts
export interface User {
  favorite_regions: string[];
  favorite_styles: string[];
  average_rating: number;
}

export interface RegionWeights {
  [key: string]: number;
}

export interface StyleWeights {
  [key: string]: number;
}

export const cosineSimilarity = (vec1: number[], vec2: number[]): number => {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
};

export const createUserVector = (user: User): number[] => {
  const favoriteRegions = user.favorite_regions || [];
  const favoriteStyles = user.favorite_styles || [];
  const averageRating = user.average_rating || 0;

  const regionWeights: RegionWeights = {
    Italy: 1.0,
    France: 0.9,
    Spain: 0.8,
    USA: 0.7,
    Australia: 0.6,
    Germany: 0.5,
    Other: 0.4,
  };

  const styleWeights: StyleWeights = {
    Red: 1.0,
    White: 0.9,
    Sparkling: 0.8,
    Rose: 0.7,
    Dessert: 0.6,
    Fortified: 0.5,
    Other: 0.4,
  };

  const regionVector = favoriteRegions.map((region) => regionWeights[region] || regionWeights.Other);
  const styleVector = favoriteStyles.map((style) => styleWeights[style] || styleWeights.Other);

  const normalize = (vector: number[]): number[] => {
    const sum = vector.reduce((acc, val) => acc + val, 0);
    return sum === 0 ? vector : vector.map((val) => val / sum);
  };

  const normalizedRegionVector = normalize(regionVector);
  const normalizedStyleVector = normalize(styleVector);
  const normalizedRating = averageRating / 100;

  return [
    ...normalizedRegionVector,
    ...normalizedStyleVector,
    normalizedRating,
  ];
};

export const calculateCompatibility = (
  user: User, 
  wineVector: number[], 
  wineTheory: number[]
): number => {
  const userVector = createUserVector(user);
  const similarity = cosineSimilarity(userVector, wineVector);
  const theoryAdjustment = cosineSimilarity(userVector, wineTheory);
  const rawScore = similarity + 0.5 * theoryAdjustment;
  return Math.min(Math.max(rawScore * 100, 0), 100);
};