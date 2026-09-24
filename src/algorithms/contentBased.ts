import { Movie, Genre, ContentBasedExplanation, UserRating } from '../types';
import { ALL_GENRES } from '../data/movies';

export interface ContentProfile {
  genreWeights: Record<Genre, number>;
  keywordWeights: Record<string, number>;
  directorWeights: Record<string, number>;
}

// Build a feature vector representation for a movie
export function getMovieFeatureVector(movie: Movie) {
  const features: Record<string, number> = {};

  // Genres (weight = 2.0 each)
  movie.genres.forEach((g) => {
    features[`genre:${g}`] = 2.0;
  });

  // Keywords (weight = 1.0 each)
  movie.keywords.forEach((k) => {
    features[`kw:${k.toLowerCase()}`] = 1.0;
  });

  // Director (weight = 1.5)
  features[`dir:${movie.director.toLowerCase()}`] = 1.5;

  return features;
}

// Calculate Cosine Similarity between two feature maps
export function calculateCosineSimilarity(
  vecA: Record<string, number>,
  vecB: Record<string, number>
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key in vecA) {
    normA += vecA[key] * vecA[key];
    if (key in vecB) {
      dotProduct += vecA[key] * vecB[key];
    }
  }

  for (const key in vecB) {
    normB += vecB[key] * vecB[key];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Build User Feature Profile from:
// 1. Explicit Genre Affinities (1-5 scale)
// 2. Rated Movies (centered around 3.0: 5 stars => +2.0, 4 => +1.0, 3 => 0.2, 2 => -1.0, 1 => -2.0)
export function buildUserProfile(
  ratings: Record<string, number>,
  genreAffinities: Record<string, number>,
  movieCatalog: Movie[]
): Record<string, number> {
  const userVector: Record<string, number> = {};

  // 1. Incorporate explicit genre affinities
  for (const genre of ALL_GENRES) {
    const affinity = genreAffinities[genre];
    if (affinity && affinity > 0) {
      // Scale: 3 is neutral (1.0), 5 is high affinity (2.5), 1 is low (0.2)
      userVector[`genre:${genre}`] = (affinity / 5) * 2.5;
    }
  }

  // 2. Incorporate movie ratings
  const movieMap = new Map(movieCatalog.map((m) => [m.id, m]));

  for (const [movieId, starRating] of Object.entries(ratings)) {
    const movie = movieMap.get(movieId);
    if (!movie) continue;

    // Centered rating: 5 -> +2.0, 4 -> +1.0, 3 -> +0.1, 2 -> -1.0, 1 -> -2.0
    const ratingWeight = starRating - 2.9;

    // Add movie genre features
    movie.genres.forEach((g) => {
      const key = `genre:${g}`;
      userVector[key] = (userVector[key] || 0) + ratingWeight * 1.5;
    });

    // Add movie keywords
    movie.keywords.forEach((k) => {
      const key = `kw:${k.toLowerCase()}`;
      userVector[key] = (userVector[key] || 0) + ratingWeight * 0.8;
    });

    // Add director affinity
    const dirKey = `dir:${movie.director.toLowerCase()}`;
    userVector[dirKey] = (userVector[dirKey] || 0) + ratingWeight * 1.2;
  }

  return userVector;
}

// Compute Content-Based recommendations
export function computeContentBasedRecommendations(
  movies: Movie[],
  userRatings: Record<string, number>,
  genreAffinities: Record<string, number>,
  excludeRated: boolean = true
): {
  movie: Movie;
  similarity: number;
  explanation: ContentBasedExplanation;
  reasonPhrase: string;
}[] {
  const userVector = buildUserProfile(userRatings, genreAffinities, movies);

  const results = movies
    .filter((m) => (!excludeRated ? true : userRatings[m.id] === undefined))
    .map((movie) => {
      const movieVector = getMovieFeatureVector(movie);
      const similarity = Math.max(0, calculateCosineSimilarity(userVector, movieVector));

      // Calculate matching genres breakdown
      const topMatchingGenres = movie.genres
        .map((genre) => {
          const affinity = userVector[`genre:${genre}`] || 0;
          return {
            genre,
            weight: 2.0,
            userAffinity: Math.round(affinity * 10) / 10,
          };
        })
        .sort((a, b) => b.userAffinity - a.userAffinity);

      // Calculate matching keywords
      const topMatchingKeywords = movie.keywords.filter(
        (k) => (userVector[`kw:${k.toLowerCase()}`] || 0) > 0.5
      );

      // Check director bonus
      const directorScore = userVector[`dir:${movie.director.toLowerCase()}`] || 0;
      const directorBonus =
        directorScore > 1.0
          ? {
              director: movie.director,
              points: Math.round(directorScore * 10) / 10,
            }
          : undefined;

      const explanation: ContentBasedExplanation = {
        type: 'content-based',
        topMatchingGenres,
        topMatchingKeywords,
        directorBonus,
        cosineSimilarity: Math.round(similarity * 1000) / 1000,
      };

      // Construct a friendly human-readable reason
      let reasonPhrase = '';
      if (directorBonus && topMatchingGenres.length > 0) {
        reasonPhrase = `Directed by ${movie.director} & matches your ${topMatchingGenres[0].genre} preference`;
      } else if (topMatchingGenres.length > 0 && topMatchingGenres[0].userAffinity > 1.0) {
        reasonPhrase = `Strong match for your favorite genre: ${topMatchingGenres[0].genre}`;
        if (topMatchingKeywords.length > 0) {
          reasonPhrase += ` (${topMatchingKeywords.slice(0, 2).join(', ')})`;
        }
      } else if (topMatchingKeywords.length > 0) {
        reasonPhrase = `Shares themes you enjoy: ${topMatchingKeywords.slice(0, 2).join(', ')}`;
      } else {
        reasonPhrase = `Aligns with your overall genre distribution (${movie.genres.join(', ')})`;
      }

      return {
        movie,
        similarity,
        explanation,
        reasonPhrase,
      };
    });

  // Sort by highest similarity
  return results.sort((a, b) => b.similarity - a.similarity);
}
