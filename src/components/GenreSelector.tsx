import React from 'react';
import { ALL_GENRES } from '../data/movies';
import { Genre } from '../types';
import { Tag, Sparkles } from 'lucide-react';

interface GenreSelectorProps {
  genreAffinities: Record<string, number>;
  onToggleGenre: (genre: Genre) => void;
  onClearGenres: () => void;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  genreAffinities,
  onToggleGenre,
  onClearGenres,
}) => {
  const activeCount = Object.keys(genreAffinities).filter((g) => (genreAffinities[g] || 0) > 0).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Genre Affinity Preferences
          </h2>
          <span className="text-xs text-neutral-500">
            ({activeCount} selected)
          </span>
        </div>
        {activeCount > 0 && (
          <button
            id="clear-genres-btn"
            onClick={onClearGenres}
            className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Reset genres
          </button>
        )}
      </div>

      {/* Genre Chips */}
      <div className="flex flex-wrap gap-2">
        {ALL_GENRES.map((genre) => {
          const affinity = genreAffinities[genre] || 0;
          const isSelected = affinity > 0;

          return (
            <button
              key={genre}
              id={`genre-chip-${genre.toLowerCase()}`}
              onClick={() => onToggleGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 border ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              <span>{genre}</span>
              {isSelected && (
                <span className="text-[10px] font-semibold px-1 py-0.2 bg-amber-500/30 text-amber-200 rounded">
                  ★{affinity}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
