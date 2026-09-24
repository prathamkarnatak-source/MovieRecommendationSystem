import React from 'react';
import { AlgorithmType } from '../types';
import { Cpu, Users, GitMerge, Info, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AlgorithmControlsProps {
  algorithm: AlgorithmType;
  onChangeAlgorithm: (algo: AlgorithmType) => void;
  hybridWeight: number; // 0 to 1
  onChangeHybridWeight: (weight: number) => void;
  ratedCount: number;
  showExplanation: boolean;
  onToggleExplanation: () => void;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  algorithm,
  onChangeAlgorithm,
  hybridWeight,
  onChangeHybridWeight,
  ratedCount,
  showExplanation,
  onToggleExplanation,
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Mode Selection Buttons */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Recommendation Technique
          </span>
          <div className="inline-flex p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
            <button
              id="algo-content-btn"
              onClick={() => onChangeAlgorithm('content-based')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                algorithm === 'content-based'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Content-Based</span>
            </button>

            <button
              id="algo-collab-btn"
              onClick={() => onChangeAlgorithm('collaborative')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                algorithm === 'collaborative'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Collaborative Filtering</span>
            </button>

            <button
              id="algo-hybrid-btn"
              onClick={() => onChangeAlgorithm('hybrid')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                algorithm === 'hybrid'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <GitMerge className="w-4 h-4" />
              <span>Hybrid Blend</span>
            </button>
          </div>
        </div>

        {/* Algorithm details & interactive sliders */}
        <div className="flex items-center space-x-4">
          {algorithm === 'hybrid' && (
            <div className="flex flex-col bg-neutral-950 px-3.5 py-2 rounded-lg border border-neutral-800 min-w-[260px]">
              <div className="flex justify-between text-xs font-medium text-neutral-400 mb-1.5">
                <span>Content: {Math.round((1 - hybridWeight) * 100)}%</span>
                <span className="text-amber-400 font-semibold">Weight Balance</span>
                <span>Collab: {Math.round(hybridWeight * 100)}%</span>
              </div>
              <input
                id="hybrid-weight-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={hybridWeight}
                onChange={(e) => onChangeHybridWeight(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          )}

          <button
            id="toggle-algo-info-btn"
            onClick={onToggleExplanation}
            className="flex items-center space-x-1.5 text-xs font-medium text-neutral-400 hover:text-amber-300 transition-colors px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showExplanation ? 'Hide Algorithm Logic' : 'How It Works'}</span>
          </button>
        </div>
      </div>

      {/* Expandable How it works panel */}
      {showExplanation && (
        <div className="mt-4 pt-4 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div
            className={`p-3.5 rounded-lg border transition-all ${
              algorithm === 'content-based'
                ? 'bg-amber-500/5 border-amber-500/40 text-neutral-200'
                : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'
            }`}
          >
            <div className="flex items-center space-x-2 font-semibold text-amber-400 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Content-Based Filtering</span>
            </div>
            <p className="leading-relaxed mb-2">
              Analyzes movie features (genres, directors, keywords) and builds a high-dimensional user profile vector based on movies you rated 4★ & 5★. Uses Cosine Similarity to find unrated movies with the closest vector distance.
            </p>
            <span className="inline-block font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Cosine Sim = (A · B) / (||A|| ||B||)
            </span>
          </div>

          <div
            className={`p-3.5 rounded-lg border transition-all ${
              algorithm === 'collaborative'
                ? 'bg-amber-500/5 border-amber-500/40 text-neutral-200'
                : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'
            }`}
          >
            <div className="flex items-center space-x-2 font-semibold text-amber-400 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>2. Collaborative Filtering</span>
            </div>
            <p className="leading-relaxed mb-2">
              Compares your ratings against community cinephiles using Pearson Correlation. Finds nearest neighbors (users with matching taste) and computes weighted predicted ratings for movies you haven't seen yet.
            </p>
            <span className="inline-block font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Pearson r = Cov(X,Y) / (σX · σY)
            </span>
          </div>

          <div
            className={`p-3.5 rounded-lg border transition-all ${
              algorithm === 'hybrid'
                ? 'bg-amber-500/5 border-amber-500/40 text-neutral-200'
                : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'
            }`}
          >
            <div className="flex items-center space-x-2 font-semibold text-amber-400 mb-1">
              <GitMerge className="w-3.5 h-3.5" />
              <span>3. Hybrid Technique</span>
            </div>
            <p className="leading-relaxed mb-2">
              Combines both approaches! Solves the cold-start problem: uses Content-Based when few ratings exist, and smoothly transitions to Collaborative Filtering as your rating profile grows.
            </p>
            <span className="inline-block font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              Score = w₁·Content + w₂·Collab
            </span>
          </div>
        </div>
      )}

      {/* Cold start warning when in Collaborative mode with < 2 ratings */}
      {algorithm === 'collaborative' && ratedCount < 2 && (
        <div className="mt-4 flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3.5 py-2.5 rounded-lg">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Cold-Start State:</strong> You have rated {ratedCount} movie{ratedCount === 1 ? '' : 's'}. Rate at least 2 movies or switch to a preset profile so Pearson correlation can calculate your nearest neighbors!
          </span>
        </div>
      )}
    </div>
  );
};
