import { useMemo } from 'react';
import { Sparkles, RotateCcw, Heart, Filter } from 'lucide-react';
import type { Asset } from '@/lib/types';
import type { Preferences } from '@/lib/recommend';
import { recommend } from '@/lib/recommend';
import { AssetCard } from '@/components/AssetCard';
import { CATEGORY_LABELS } from '@/lib/types';

interface Props {
  assets: Asset[];
  prefs: Preferences;
  onRetake: () => void;
  onBrowse: () => void;
}

export function RecommendationsView({ assets, prefs, onRetake, onBrowse }: Props) {
  const scored = useMemo(() => recommend(assets, prefs), [assets, prefs]);

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (prefs.categories.length)
      parts.push(prefs.categories.map((c) => CATEGORY_LABELS[c]).join(', '));
    if (prefs.themes.length) parts.push(prefs.themes.join(', '));
    if (prefs.colors.length) parts.push(prefs.colors.join(', '));
    if (prefs.priceRange === 'free') parts.push('Free only');
    return parts.join(' · ');
  }, [prefs]);

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="card-surface relative overflow-hidden p-6 md:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 chip bg-brand-500/15 text-brand-300 border border-brand-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Tailored for you
          </div>
          <h1 className="font-display text-3xl font-bold">Your recommendations</h1>
          <p className="mt-2 max-w-2xl text-ink-300">
            Based on your preferences, here are the assets we think you'll love —
            ranked by how well they match.
          </p>
          {summary && (
            <div className="mt-4 flex flex-wrap gap-2">
              {prefs.categories.map((c) => (
                <span key={c} className="chip bg-ink-800 text-ink-200 border border-ink-600/40">
                  {CATEGORY_LABELS[c]}
                </span>
              ))}
              {prefs.themes.map((t) => (
                <span key={t} className="chip bg-brand-900/40 text-brand-300 border border-brand-500/20">
                  {t}
                </span>
              ))}
              {prefs.colors.map((c) => (
                <span key={c} className="chip bg-ink-800 text-ink-200 border border-ink-600/40">
                  {c}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex gap-2">
            <button onClick={onRetake} className="btn-ghost">
              <RotateCcw className="h-4 w-4" /> Retake quiz
            </button>
            <button onClick={onBrowse} className="btn-ghost">
              <Filter className="h-4 w-4" /> Browse all deals
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {scored.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-16 text-center">
          <Heart className="mb-4 h-10 w-10 text-ink-500" />
          <p className="text-ink-300">
            We couldn't find strong matches. Try widening your preferences.
          </p>
          <button onClick={onRetake} className="btn-primary mt-4">
            Retake quiz
          </button>
        </div>
      ) : (
        <>
          {/* Top match highlight */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent-500" />
              <h2 className="font-display text-xl font-semibold">Top match</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {scored.slice(0, 2).map((s, i) => (
                <AssetCard
                  key={s.asset.id}
                  asset={s.asset}
                  reasons={s.reasons}
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          </section>

          {scored.length > 2 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold">More picks for you</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {scored.slice(2).map((s, i) => (
                  <AssetCard
                    key={s.asset.id}
                    asset={s.asset}
                    reasons={s.reasons}
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
