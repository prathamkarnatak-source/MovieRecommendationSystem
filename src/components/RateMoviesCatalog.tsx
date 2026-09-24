import React, { useState, useMemo } from 'react';
import { Movie, Genre } from '../types';
import { ALL_GENRES } from '../data/movies';
import { MovieCard } from './MovieCard';
import { Search, Filter, X, SlidersHorizontal, Star } from 'lucide-react';

interface RateMoviesCatalogProps {
  movies: Movie[];
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const RateMoviesCatalog: React.FC<RateMoviesCatalogProps> = ({
  movies,
  userRatings,
  onRateMovie,
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<'all' | 'unrated' | 'rated'>('all');

  const ratedCount = Object.keys(userRatings).length;

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(query);
        const matchesDirector = m.director.toLowerCase().includes(query);
        const matchesKeywords = m.keywords.some((k) => k.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDirector && !matchesKeywords) return false;
      }

      // Genre filter
      if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre as Genre)) {
        return false;
      }

      // Rating status filter
      const isRated = userRatings[m.id] !== undefined;
      if (filterMode === 'rated' && !isRated) return false;
      if (filterMode === 'unrated' && isRated) return false;

      return true;
    });
  }, [movies, search, selectedGenre, filterMode, userRatings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-neutral-100 font-display">
              Movie Rating Catalog
            </h3>
            <p className="text-xs text-neutral-400">
              Rate your favorite and least favorite films to sharpen collaborative & content-based recommendations
            </p>
          </div>

          <button
            id="close-catalog-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="catalog-search-input"
              type="text"
              placeholder="Search by title, director or theme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Genre & Rating Status filters */}
          <div className="flex items-center space-x-2">
            <select
              id="catalog-genre-filter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none"
            >
              <option value="All">All Genres</option>
              {ALL_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <div className="inline-flex p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
              <button
                id="filter-all-btn"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterMode === 'all' ? 'bg-neutral-800 text-amber-300' : 'text-neutral-400'
                }`}
              >
                All ({movies.length})
              </button>
              <button
                id="filter-rated-btn"
                onClick={() => setFilterMode('rated')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterMode === 'rated' ? 'bg-neutral-800 text-amber-300' : 'text-neutral-400'
                }`}
              >
                Rated ({ratedCount})
              </button>
              <button
                id="filter-unrated-btn"
                onClick={() => setFilterMode('unrated')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterMode === 'unrated' ? 'bg-neutral-800 text-amber-300' : 'text-neutral-400'
                }`}
              >
                Unrated ({movies.length - ratedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredMovies.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <p className="text-sm">No movies match the selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  userRating={userRatings[movie.id]}
                  onRateMovie={onRateMovie}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-400 flex items-center space-x-1">
            <span>You have rated</span>
            <span className="text-amber-400 font-bold">{ratedCount}</span>
            <span>of {movies.length} movies</span>
          </div>

          <button
            id="catalog-done-btn"
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors"
          >
            Apply & View Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};
