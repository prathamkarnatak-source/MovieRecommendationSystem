import React from 'react';
import { Film, Sparkles, RefreshCw, User, SlidersHorizontal } from 'lucide-react';
import { PRESET_PROFILES, PresetProfile } from '../data/seedUsers';

interface NavbarProps {
  ratedCount: number;
  currentPreset: string;
  onSelectPreset: (preset: PresetProfile) => void;
  onResetRatings: () => void;
  onOpenRateMore: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  ratedCount,
  currentPreset,
  onSelectPreset,
  onResetRatings,
  onOpenRateMore,
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-neutral-100 font-display">
                CINE<span className="text-amber-400">REC</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                Algorithm Engine
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Content-Based & Collaborative Filtering System
            </p>
          </div>
        </div>

        {/* Profile Preset Selector & Actions */}
        <div className="flex items-center space-x-3">
          {/* Preset Selector Dropdown */}
          <div className="flex items-center bg-neutral-800/80 rounded-lg p-1 border border-neutral-700/80 text-xs">
            <User className="w-3.5 h-3.5 ml-2 mr-1 text-neutral-400" />
            <span className="text-neutral-400 hidden md:inline mr-1">Profile:</span>
            <select
              id="preset-profile-select"
              aria-label="Select Demo Profile"
              value={currentPreset}
              onChange={(e) => {
                const found = PRESET_PROFILES.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="bg-transparent text-neutral-200 font-medium focus:outline-none cursor-pointer pr-1 py-1"
            >
              {PRESET_PROFILES.map((p) => (
                <option key={p.id} value={p.id} className="bg-neutral-900 text-neutral-200">
                  {p.name}
                </option>
              ))}
              {currentPreset === 'custom' && (
                <option value="custom" className="bg-neutral-900 text-amber-300">
                  Custom User ({ratedCount} rated)
                </option>
              )}
            </select>
          </div>

          {/* Rate Movies Button */}
          <button
            id="open-catalog-btn"
            onClick={onOpenRateMore}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Rate Movies ({ratedCount})</span>
          </button>

          {/* Reset Ratings */}
          <button
            id="reset-ratings-btn"
            title="Clear all ratings and reset"
            onClick={onResetRatings}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
