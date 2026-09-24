import { Movie, SeedUser, CollaborativeExplanation } from '../types';
import { SEED_USERS } from '../data/seedUsers';

// Compute Mean Rating for a user's ratings map
export function computeUserMean(ratings: Record<string, number>): number {
  const values = Object.values(ratings);
  if (values.length === 0) return 3.0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// Compute Pearson Correlation Coefficient between Active User and a Seed User
export function computePearsonCorrelation(
  activeRatings: Record<string, number>,
  otherRatings: Record<string, number>
): { similarity: number; sharedCount: number } {
  const sharedItemIds = Object.keys(activeRatings).filter((id) => id in otherRatings);
  const sharedCount = sharedItemIds.length;

  if (sharedCount < 2) {
    // If only 1 shared item, calculate raw difference similarity
    if (sharedCount === 1) {
      const id = sharedItemIds[0];
      const diff = Math.abs(activeRatings[id] - otherRatings[id]);
      // diff 0 -> 0.4, diff 1 -> 0.2, diff 2 -> 0.0
      return { similarity: Math.max(0, (4 - diff) / 10), sharedCount: 1 };
    }
    return { similarity: 0, sharedCount: 0 };
  }

  const activeMean = computeUserMean(activeRatings);
  const otherMean = computeUserMean(otherRatings);

  let numerator = 0;
  let denomActive = 0;
  let denomOther = 0;

  for (const id of sharedItemIds) {
    const diffActive = activeRatings[id] - activeMean;
    const diffOther = otherRatings[id] - otherMean;

    numerator += diffActive * diffOther;
    denomActive += diffActive * diffActive;
    denomOther += diffOther * diffOther;
  }

  if (denomActive === 0 || denomOther === 0) {
    // Zero variance (e.g. user rated everything 5) -> Fallback to absolute difference
    let totalDiff = 0;
    for (const id of sharedItemIds) {
      totalDiff += Math.abs(activeRatings[id] - otherRatings[id]);
    }
    const avgDiff = totalDiff / sharedCount;
    return { similarity: Math.max(0, 1 - avgDiff / 4), sharedCount };
  }

  const rawCorrelation = numerator / (Math.sqrt(denomActive) * Math.sqrt(denomOther));

  // Significance weighting: penalize correlation if based on few shared items
  // e.g., 2 items has less confidence than 5+ items
  const significanceWeight = Math.min(1.0, sharedCount / 4);
  const weightedSim = rawCorrelation * significanceWeight;

  return {
    similarity: Math.max(-1, Math.min(1, weightedSim)),
    sharedCount,
  };
}

export interface NeighborMatch {
  user: SeedUser;
  similarity: number;
  sharedCount: number;
}

// Find top-K nearest neighbors
export function findNearestNeighbors(
  activeRatings: Record<string, number>,
  seedUsers: SeedUser[] = SEED_USERS,
  k: number = 4
): NeighborMatch[] {
  const matches: NeighborMatch[] = [];

  for (const user of seedUsers) {
    const { similarity, sharedCount } = computePearsonCorrelation(activeRatings, user.ratings);
    // Only consider positive correlation neighbors for recommendations
    if (similarity > 0.05 && sharedCount >= 1) {
      matches.push({ user, similarity, sharedCount });
    }
  }

  matches.sort((a, b) => b.similarity - a.similarity);
  return matches.slice(0, k);
}

// Predict rating for an unrated movie using User-Based CF formula
export function predictRatingForMovie(
  movieId: string,
  activeRatings: Record<string, number>,
  neighbors: NeighborMatch[],
  defaultRating: number = 3.5
): {
  predictedRating: number;
  contributors: { userName: string; similarity: number; ratingGiven: number }[];
} {
  const activeMean = computeUserMean(activeRatings);
  const contributors: { userName: string; similarity: number; ratingGiven: number }[] = [];

  let weightedSum = 0;
  let simSum = 0;

  for (const { user, similarity } of neighbors) {
    if (movieId in user.ratings) {
      const neighborRating = user.ratings[movieId];
      const neighborMean = computeUserMean(user.ratings);

      weightedSum += similarity * (neighborRating - neighborMean);
      simSum += Math.abs(similarity);

      contributors.push({
        userName: user.name,
        similarity: Math.round(similarity * 100) / 100,
        ratingGiven: neighborRating,
      });
    }
  }

  if (simSum === 0) {
    return { predictedRating: defaultRating, contributors: [] };
  }

  let predicted = activeMean + weightedSum / simSum;
  // Bound to 1.0 - 5.0 range
  predicted = Math.max(1.0, Math.min(5.0, predicted));

  return {
    predictedRating: Math.round(predicted * 10) / 10,
    contributors,
  };
}

// Compute Collaborative Filtering recommendations for all unrated movies
export function computeCollaborativeRecommendations(
  movies: Movie[],
  activeRatings: Record<string, number>,
  seedUsers: SeedUser[] = SEED_USERS,
  excludeRated: boolean = true
): {
  movie: Movie;
  predictedStars: number;
  score: number; // 0 to 100
  explanation: CollaborativeExplanation;
  reasonPhrase: string;
  hasSufficientData: boolean;
}[] {
  const ratedCount = Object.keys(activeRatings).length;
  const neighbors = findNearestNeighbors(activeRatings, seedUsers, 5);
  const activeMean = computeUserMean(activeRatings);

  const hasSufficientData = ratedCount >= 2 && neighbors.length >= 1;

  const results = movies
    .filter((m) => (!excludeRated ? true : activeRatings[m.id] === undefined))
    .map((movie) => {
      let predictedStars = 3.5;
      let contributors: { userName: string; similarity: number; ratingGiven: number }[] = [];

      if (hasSufficientData) {
        const prediction = predictRatingForMovie(movie.id, activeRatings, neighbors, movie.rating / 2);
        predictedStars = prediction.predictedRating;
        contributors = prediction.contributors;
      } else {
        // Cold start fallback: blended average of global movie score
        predictedStars = Math.round((movie.rating / 2) * 10) / 10;
      }

      // Convert 1-5 scale into a 0-100 score percentage
      // E.g. 5.0 stars => 98%, 4.0 stars => 80%, 3.0 stars => 60%
      const score = Math.min(100, Math.max(20, Math.round(((predictedStars - 1) / 4) * 100)));

      const explanation: CollaborativeExplanation = {
        type: 'collaborative',
        similarUsersCount: neighbors.length,
        topNeighbors: contributors,
        predictedScore: predictedStars,
      };

      let reasonPhrase = '';
      if (contributors.length > 0) {
        const topUser = contributors[0];
        reasonPhrase = `Users with tastes similar to yours (${topUser.userName}) rated this ${topUser.ratingGiven}★`;
      } else if (hasSufficientData) {
        reasonPhrase = `Estimated based on community watching patterns`;
      } else {
        reasonPhrase = `Popular with community viewers (Rate 2+ movies to unlock personal neighbor matching)`;
      }

      return {
        movie,
        predictedStars,
        score,
        explanation,
        reasonPhrase,
        hasSufficientData,
      };
    });

  return results.sort((a, b) => b.predictedStars - a.predictedStars || b.movie.rating - a.movie.rating);
}
