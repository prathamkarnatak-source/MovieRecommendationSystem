import React, { useState } from 'react';
import { Movie, RecommendationItem } from '../types';
import { Star, Clock, User, Sparkles, HelpCircle } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  recommendation?: RecommendationItem;
  userRating?: number;
  onRateMovie: (movieId: string, rating: number) => void;
  onExplain?: (item: RecommendationItem) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  recommendation,
  userRating,
  onRateMovie,
  onExplain,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeScore = recommendation?.score;
  const isRecommended = activeScore !== undefined;

  return (
    <div className="group relative bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-xl overflow-hidden transition-all duration-200 flex flex-col h-full shadow-sm hover:shadow-md">
      {/* Poster Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

        {/* Match Score Badge */}
        {isRecommended && (
          <div className="absolute top-2.5 right-2.5">
            <button
              id={`explain-badge-${movie.id}`}
              onClick={() => recommendation && onExplain?.(recommendation)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-950/85 backdrop-blur-md border border-amber-500/40 text-amber-400 hover:bg-neutral-900 transition-colors shadow-lg cursor-pointer"
              title="Click to see why this movie was recommended"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{activeScore}% Match</span>
            </button>
          </div>
        )}

        {/* Global Rating Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md text-xs font-semibold text-neutral-300 border border-neutral-800 flex items-center space-x-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Year and Duration bottom strip */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="font-medium text-neutral-300">{movie.year}</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{movie.duration}</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Director */}
          <h3 className="text-base font-bold text-neutral-100 tracking-tight line-clamp-1 mb-1 font-display">
            {movie.title}
          </h3>
          <p className="text-xs text-neutral-400 mb-2.5 flex items-center space-x-1">
            <span>Dir. {movie.director}</span>
          </p>

          {/* Genres Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {movie.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-neutral-800/80 text-neutral-300 border border-neutral-700/50"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Recommendation Reason Snippet */}
          {recommendation && (
            <p className="text-xs text-neutral-400 line-clamp-2 mb-3 bg-neutral-950/60 p-2 rounded-lg border border-neutral-800/80">
              <span className="text-amber-400/90 font-medium">Why: </span>
              {recommendation.reasonPhrase}
            </p>
          )}

          {!recommendation && (
            <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
              {movie.synopsis}
            </p>
          )}
        </div>

        {/* Footer: User Interactive Rating Controls */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 mb-1">
              Your Rating
            </span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled =
                  hoverRating !== null
                    ? star <= hoverRating
                    : userRating !== undefined && star <= userRating;

                return (
                  <button
                    key={star}
                    id={`rate-${movie.id}-${star}`}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => {
                      if (userRating === star) {
                        onRateMovie(movie.id, 0); // Clear rating
                      } else {
                        onRateMovie(movie.id, star);
                      }
                    }}
                    className="p-0.5 text-neutral-600 hover:text-amber-400 transition-colors focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-4 h-4 transition-all ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 scale-110'
                          : 'text-neutral-600'
                      }`}
                    />
                  </button>
                );
              })}
              {userRating ? (
                <span className="text-xs font-semibold text-amber-300 ml-1.5">
                  {userRating}★
                </span>
              ) : null}
            </div>
          </div>

          {/* Explain details button */}
          {recommendation && (
            <button
              id={`inspect-btn-${movie.id}`}
              onClick={() => onExplain?.(recommendation)}
              className="text-xs font-medium text-neutral-400 hover:text-amber-300 flex items-center space-x-1 transition-colors px-2 py-1 rounded hover:bg-neutral-800"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
