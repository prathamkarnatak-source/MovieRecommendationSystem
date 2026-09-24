export type Genre =
  | 'Sci-Fi'
  | 'Action'
  | 'Drama'
  | 'Thriller'
  | 'Crime'
  | 'Adventure'
  | 'Animation'
  | 'Comedy'
  | 'Romance'
  | 'Fantasy'
  | 'Mystery'
  | 'Horror';

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: Genre[];
  duration: string;
  rating: number; // Global aggregate rating out of 10
  voteCount: number;
  synopsis: string;
  keywords: string[];
  backdropUrl: string;
  posterUrl: string;
}

export interface UserRating {
  movieId: string;
  rating: number; // 1 to 5 stars
  timestamp: number;
  favorite?: boolean;
}

export interface SeedUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  ratings: Record<string, number>; // movieId -> rating (1 to 5)
}

export type AlgorithmType = 'content-based' | 'collaborative' | 'hybrid';

export interface ContentBasedExplanation {
  type: 'content-based';
  topMatchingGenres: { genre: Genre; weight: number; userAffinity: number }[];
  topMatchingKeywords: string[];
  directorBonus?: { director: string; points: number };
  cosineSimilarity: number;
}

export interface CollaborativeExplanation {
  type: 'collaborative';
  similarUsersCount: number;
  topNeighbors: {
    userName: string;
    similarity: number; // -1 to 1
    ratingGiven: number;
  }[];
  predictedScore: number;
}

export interface HybridExplanation {
  type: 'hybrid';
  contentScore: number;
  collaborativeScore: number;
  contentWeight: number;
  collaborativeWeight: number;
  finalScore: number;
  contentDetails: ContentBasedExplanation;
  collaborativeDetails: CollaborativeExplanation;
}

export type Explanation = ContentBasedExplanation | CollaborativeExplanation | HybridExplanation;

export interface RecommendationItem {
  movie: Movie;
  score: number; // 0 to 100 percentage match
  rawScore: number;
  predictedStars?: number; // 1.0 to 5.0
  algorithmUsed: AlgorithmType;
  explanation: Explanation;
  reasonPhrase: string;
}

export interface FilterOptions {
  genre: Genre | 'All';
  searchQuery: string;
  minYear: number;
  maxYear: number;
  onlyUnrated: boolean;
}
