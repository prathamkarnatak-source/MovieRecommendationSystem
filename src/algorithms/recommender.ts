import {
  Movie,
  AlgorithmType,
  RecommendationItem,
  HybridExplanation,
} from '../types';
import { computeContentBasedRecommendations } from './contentBased';
import { computeCollaborativeRecommendations } from './collaborative';
import { SEED_USERS } from '../data/seedUsers';

export interface RecommenderParams {
  movies: Movie[];
  userRatings: Record<string, number>;
  genreAffinities: Record<string, number>;
  algorithm: AlgorithmType;
  hybridWeight?: number; // 0.0 (100% content) to 1.0 (100% collaborative), default 0.5
  excludeRated?: boolean;
}

export function generateRecommendations({
  movies,
  userRatings,
  genreAffinities,
  algorithm,
  hybridWeight = 0.5,
  excludeRated = true,
}: RecommenderParams): RecommendationItem[] {
  // 1. Content-Based recommendations
  const contentResults = computeContentBasedRecommendations(
    movies,
    userRatings,
    genreAffinities,
    excludeRated
  );

  // 2. Collaborative Filtering recommendations
  const collabResults = computeCollaborativeRecommendations(
    movies,
    userRatings,
    SEED_USERS,
    excludeRated
  );

  if (algorithm === 'content-based') {
    return contentResults.map((item) => {
      // Content similarity is 0 to 1 -> map to percentage 0 to 100
      const score = Math.round(item.similarity * 100);
      return {
        movie: item.movie,
        score,
        rawScore: item.similarity,
        algorithmUsed: 'content-based' as const,
        explanation: item.explanation,
        reasonPhrase: item.reasonPhrase,
      };
    });
  }

  if (algorithm === 'collaborative') {
    return collabResults.map((item) => {
      return {
        movie: item.movie,
        score: item.score,
        rawScore: item.predictedStars,
        predictedStars: item.predictedStars,
        algorithmUsed: 'collaborative' as const,
        explanation: item.explanation,
        reasonPhrase: item.reasonPhrase,
      };
    });
  }

  // Hybrid Mode
  const collabMap = new Map(collabResults.map((c) => [c.movie.id, c]));

  const hybridResults: RecommendationItem[] = contentResults.map((cItem) => {
    const colItem = collabMap.get(cItem.movie.id);

    const contentScore = Math.round(cItem.similarity * 100);
    const collabScore = colItem ? colItem.score : 50;

    // Weighted blend
    const contentWeight = 1 - hybridWeight;
    const collaborativeWeight = hybridWeight;
    const finalScore = Math.round(contentScore * contentWeight + collabScore * collaborativeWeight);

    const hybridExplanation: HybridExplanation = {
      type: 'hybrid',
      contentScore,
      collaborativeScore: collabScore,
      contentWeight: Math.round(contentWeight * 100),
      collaborativeWeight: Math.round(collaborativeWeight * 100),
      finalScore,
      contentDetails: cItem.explanation,
      collaborativeDetails: colItem
        ? colItem.explanation
        : {
            type: 'collaborative',
            similarUsersCount: 0,
            topNeighbors: [],
            predictedScore: 3.5,
          },
    };

    let reasonPhrase = '';
    if (contentWeight > collaborativeWeight) {
      reasonPhrase = `${cItem.reasonPhrase} (Hybrid: Content weighted higher)`;
    } else if (colItem && colItem.hasSufficientData) {
      reasonPhrase = `${colItem.reasonPhrase} + aligns with your genres`;
    } else {
      reasonPhrase = `Blended match based on genre profile & community ratings`;
    }

    return {
      movie: cItem.movie,
      score: finalScore,
      rawScore: finalScore,
      predictedStars: colItem ? colItem.predictedStars : undefined,
      algorithmUsed: 'hybrid' as const,
      explanation: hybridExplanation,
      reasonPhrase,
    };
  });

  return hybridResults.sort((a, b) => b.score - a.score);
}
