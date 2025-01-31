declare module 'vader-sentiment' {
  interface SentimentResult {
    compound: number;
    positive: number;
    negative: number;
    neutral: number;
  }

  export class SentimentIntensityAnalyzer {
    polarityScores(text: string): SentimentResult;
  }
}