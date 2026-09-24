/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MOVIES } from './data/movies';
import { PRESET_PROFILES, PresetProfile } from './data/seedUsers';
import {
  Movie,
  Genre,
  AlgorithmType,
  RecommendationItem,
} from './types';
import { generateRecommendations } from './algorithms/recommender';
import { Navbar } from './components/Navbar';
import { AlgorithmControls } from './components/AlgorithmControls';
import { GenreSelector } from './components/GenreSelector';
import { MovieCard } from './components/MovieCard';
import { ExplainModal } from './components/ExplainModal';
import { RateMoviesCatalog } from './components/RateMoviesCatalog';
import { Sparkles, SlidersHorizontal, ArrowUpDown, EyeOff, Film, HelpCircle } from 'lucide-react';

const STORAGE_KEY_RATINGS = 'cinerec_user_ratings';
const STORAGE_KEY_GENRES = 'cinerec_genre_affinities';
const STORAGE_KEY_ALGO = 'cinerec_active_algo';

export default function App() {
  // Initial state from first preset (Sci-Fi Fanatic) or LocalStorage
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RATINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PRESET_PROFILES[0].initialRatings;
  });

  const [genreAffinities, setGenreAffinities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GENRES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PRESET_PROFILES[0].genreAffinities;
  });

  const [algorithm, setAlgorithm] = useState<AlgorithmType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALGO);
      if (saved && (saved === 'content-based' || saved === 'collaborative' || saved === 'hybrid')) {
        return saved as AlgorithmType;
      }
    } catch {
      // ignore
    }
    return 'content-based';
  });

  const [hybridWeight, setHybridWeight] = useState<number>(0.5);
  const [currentPresetId, setCurrentPresetId] = useState<string>('preset-scifi');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [excludeRated, setExcludeRated] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'year'>('match');

  // Modals state
  const [selectedExplainItem, setSelectedExplainItem] = useState<RecommendationItem | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(userRatings));
    } catch {
      // ignore
    }
  }, [userRatings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GENRES, JSON.stringify(genreAffinities));
    } catch {
      // ignore
    }
  }, [genreAffinities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALGO, algorithm);
    } catch {
      // ignore
    }
  }, [algorithm]);

  // Handle movie rating update
  const handleRateMovie = (movieId: string, rating: number) => {
    setUserRatings((prev) => {
      const next = { ...prev };
      if (rating === 0) {
        delete next[movieId];
      } else {
        next[movieId] = rating;
      }
      return next;
    });
    setCurrentPresetId('custom');
  };

  // Handle genre affinity toggling
  const handleToggleGenre = (genre: Genre) => {
    setGenreAffinities((prev) => {
      const current = prev[genre] || 0;
      const next = { ...prev };
      if (current === 0) {
        next[genre] = 4; // default high affinity
      } else if (current === 4) {
        next[genre] = 5; // maximum affinity
      } else {
        delete next[genre];
      }
      return next;
    });
    setCurrentPresetId('custom');
  };

  const handleClearGenres = () => {
    setGenreAffinities({});
    setCurrentPresetId('custom');
  };

  // Switch preset profile
  const handleSelectPreset = (preset: PresetProfile) => {
    setCurrentPresetId(preset.id);
    setUserRatings({ ...preset.initialRatings });
    setGenreAffinities({ ...preset.genreAffinities });
  };

  // Reset ratings completely
  const handleResetRatings = () => {
    setUserRatings({});
    setGenreAffinities({});
    setCurrentPresetId('custom');
  };

  // Generate recommendations using active algorithm
  const recommendations = useMemo(() => {
    const raw = generateRecommendations({
      movies: MOVIES,
      userRatings,
      genreAffinities,
      algorithm,
      hybridWeight,
      excludeRated,
    });

    // Apply sorting
    return [...raw].sort((a, b) => {
      if (sortBy === 'match') {
        return b.score - a.score;
      } else if (sortBy === 'rating') {
        return b.movie.rating - a.movie.rating;
      } else {
        return b.movie.year - a.movie.year;
      }
    });
  }, [userRatings, genreAffinities, algorithm, hybridWeight, excludeRated, sortBy]);

  const ratedCount = Object.keys(userRatings).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        ratedCount={ratedCount}
        currentPreset={currentPresetId}
        onSelectPreset={handleSelectPreset}
        onResetRatings={handleResetRatings}
        onOpenRateMore={() => setIsCatalogOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Cinema Discovery Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight font-display">
              Movie Recommendations
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Experience the mechanics of recommendation algorithms in real time. Rate movies or select genre affinities to watch the engine compute recommendations via Content-Based feature vectors, Collaborative Filtering nearest neighbors, or a Hybrid blend.
            </p>
          </div>

          <button
            id="browse-all-catalog-btn"
            onClick={() => setIsCatalogOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Open Movie Catalog ({MOVIES.length})</span>
          </button>
        </div>

        {/* Algorithm Configuration & Technique Switcher */}
        <AlgorithmControls
          algorithm={algorithm}
          onChangeAlgorithm={setAlgorithm}
          hybridWeight={hybridWeight}
          onChangeHybridWeight={setHybridWeight}
          ratedCount={ratedCount}
          showExplanation={showExplanation}
          onToggleExplanation={() => setShowExplanation(!showExplanation)}
        />

        {/* Genre Affinity Selector Bar */}
        <GenreSelector
          genreAffinities={genreAffinities}
          onToggleGenre={handleToggleGenre}
          onClearGenres={handleClearGenres}
        />

        {/* Recommendations Section Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-neutral-100 font-display">
              Suggested for You
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-neutral-900 border border-neutral-800 text-amber-400 rounded-full">
              {recommendations.length} titles
            </span>
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Exclude Rated Toggle */}
            <label
              htmlFor="exclude-rated-toggle"
              className="flex items-center space-x-2 text-neutral-400 cursor-pointer hover:text-neutral-200"
            >
              <input
                id="exclude-rated-toggle"
                type="checkbox"
                checked={excludeRated}
                onChange={(e) => setExcludeRated(e.target.checked)}
                className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900"
              />
              <span>Hide already rated</span>
            </label>

            <span className="text-neutral-700">|</span>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 text-neutral-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort by:</span>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-neutral-200 focus:outline-none"
              >
                <option value="match">Highest Match %</option>
                <option value="rating">Top Critic Rating</option>
                <option value="year">Newest Release</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        {recommendations.length === 0 ? (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-12 text-center">
            <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-200 mb-1 font-display">
              No recommendations available
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4">
              All movies in this catalog have either been rated or filtered out. Try unchecking "Hide already rated" or reset your ratings.
            </p>
            <button
              id="reset-filter-btn"
              onClick={() => setExcludeRated(false)}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Show All Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recommendations.map((item) => (
              <MovieCard
                key={item.movie.id}
                movie={item.movie}
                recommendation={item}
                userRating={userRatings[item.movie.id]}
                onRateMovie={handleRateMovie}
                onExplain={(rec) => setSelectedExplainItem(rec)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-900 bg-neutral-950 py-8 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Movie Recommendation System • Content-Based (Cosine Similarity) & Collaborative Filtering (Pearson Correlation)
          </p>
          <div className="flex items-center space-x-4 text-neutral-400">
            <span>{MOVIES.length} Curated Films</span>
            <span>•</span>
            <span>8 Seed Cinephiles</span>
            <span>•</span>
            <span>Mathematical Grounding</span>
          </div>
        </div>
      </footer>

      {/* Explain Algorithm Calculation Modal */}
      <ExplainModal
        item={selectedExplainItem}
        onClose={() => setSelectedExplainItem(null)}
      />

      {/* Catalog Search & Rate Modal */}
      <RateMoviesCatalog
        movies={MOVIES}
        userRatings={userRatings}
        onRateMovie={handleRateMovie}
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
}
