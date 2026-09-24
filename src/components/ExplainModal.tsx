import React from 'react';
import { RecommendationItem } from '../types';
import { X, Cpu, Users, GitMerge, CheckCircle, Percent, ArrowRight, UserCheck } from 'lucide-react';

interface ExplainModalProps {
  item: RecommendationItem | null;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { movie, score, algorithmUsed, explanation, reasonPhrase, predictedStars } = item;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-neutral-900 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              {algorithmUsed === 'content-based' && <Cpu className="w-5 h-5" />}
              {algorithmUsed === 'collaborative' && <Users className="w-5 h-5" />}
              {algorithmUsed === 'hybrid' && <GitMerge className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 font-display">
                Recommendation Breakdown
              </h3>
              <p className="text-xs text-neutral-400">
                Mathematical explanation for {movie.title}
              </p>
            </div>
          </div>
          <button
            id="close-explain-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Movie snapshot */}
          <div className="flex items-center space-x-4 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              referrerPolicy="no-referrer"
              className="w-16 h-22 object-cover rounded-lg shrink-0 border border-neutral-800"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-neutral-100 truncate">{movie.title}</h4>
                <span className="text-xs text-neutral-400">({movie.year})</span>
              </div>
              <p className="text-xs text-neutral-400 mb-2">
                Directed by {movie.director} • {movie.genres.join(', ')}
              </p>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  {score}% Match Score
                </span>
                {predictedStars !== undefined && (
                  <span className="text-xs font-semibold text-neutral-300">
                    Predicted: ★ {predictedStars.toFixed(1)}/5
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick summary phrase */}
          <div className="bg-neutral-800/50 border border-neutral-700/60 p-3.5 rounded-xl">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Primary Driver
            </span>
            <p className="text-sm text-neutral-200 leading-relaxed">{reasonPhrase}</p>
          </div>

          {/* Content-Based Breakdown */}
          {explanation.type === 'content-based' && (
            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Vector Distance & Feature Cosine Similarity
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <span className="text-xs text-neutral-500 block mb-1">Cosine Similarity</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {explanation.cosineSimilarity}
                  </span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <span className="text-xs text-neutral-500 block mb-1">Director Affinity</span>
                  <span className="text-sm font-semibold text-neutral-300">
                    {explanation.directorBonus
                      ? `+${explanation.directorBonus.points} pts (${explanation.directorBonus.director})`
                      : 'None'}
                  </span>
                </div>
              </div>

              {/* Matching Genres */}
              <div>
                <span className="text-xs text-neutral-400 block mb-2">
                  Matching Genres with Your Profile:
                </span>
                <div className="space-y-2">
                  {explanation.topMatchingGenres.map((g) => (
                    <div
                      key={g.genre}
                      className="flex items-center justify-between text-xs bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800"
                    >
                      <span className="text-neutral-200 font-medium">{g.genre}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-neutral-400">Your Affinity Weight:</span>
                        <span className="font-mono text-amber-400 font-semibold">
                          {g.userAffinity > 0 ? `+${g.userAffinity}` : '0.0'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matching Keywords */}
              {explanation.topMatchingKeywords.length > 0 && (
                <div>
                  <span className="text-xs text-neutral-400 block mb-1.5">
                    Co-occurring Thematic Keywords:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {explanation.topMatchingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-xs border border-neutral-700"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collaborative Breakdown */}
          {explanation.type === 'collaborative' && (
            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                User-Based Nearest Neighbors (Pearson Correlation)
              </h5>

              {explanation.topNeighbors.length > 0 ? (
                <div className="space-y-2">
                  {explanation.topNeighbors.map((nb, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800"
                    >
                      <div className="flex items-center space-x-2.5">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="text-xs font-bold text-neutral-200 block">
                            {nb.userName}
                          </span>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            Pearson Correlation r = {nb.similarity > 0 ? `+${nb.similarity}` : nb.similarity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-300">
                          Rated: ★{nb.ratingGiven}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  Global baseline estimation. Rate more movies to discover specific cinephile neighbors!
                </p>
              )}

              <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200 block mb-1">
                  Calculation Formula:
                </span>
                <p className="font-mono text-[11px] text-amber-400/90 leading-relaxed">
                  r̂(u,i) = r̄ᵤ + [ Σ sim(u,v) · (rᵥ,ᵢ - r̄ᵥ) ] / [ Σ |sim(u,v)| ]
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Adjusts neighbor ratings by their personal rating bias and weights them by their taste correlation with you.
                </p>
              </div>
            </div>
          )}

          {/* Hybrid Breakdown */}
          {explanation.type === 'hybrid' && (
            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Weighted Hybrid Blend
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <span className="text-xs text-neutral-400 block mb-1">
                    Content Score ({explanation.contentWeight}%)
                  </span>
                  <span className="text-xl font-bold text-amber-400 font-mono">
                    {explanation.contentScore}%
                  </span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <span className="text-xs text-neutral-400 block mb-1">
                    Collab Score ({explanation.collaborativeWeight}%)
                  </span>
                  <span className="text-xl font-bold text-amber-400 font-mono">
                    {explanation.collaborativeScore}%
                  </span>
                </div>
              </div>

              {/* Progress Bar of blend */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Content Influence</span>
                  <span>Collaborative Influence</span>
                </div>
                <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden flex border border-neutral-800">
                  <div
                    style={{ width: `${explanation.contentWeight}%` }}
                    className="bg-amber-500 h-full"
                    title={`Content: ${explanation.contentWeight}%`}
                  />
                  <div
                    style={{ width: `${explanation.collaborativeWeight}%` }}
                    className="bg-blue-500 h-full"
                    title={`Collaborative: ${explanation.collaborativeWeight}%`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex justify-end">
          <button
            id="modal-close-confirm-btn"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
