import { useEffect, useState } from 'react';
import { Gift, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { DealsView } from '@/views/DealsView';
import { QuizView } from '@/views/QuizView';
import { RecommendationsView } from '@/views/RecommendationsView';
import { fetchAssets, DEFAULT_FILTERS } from '@/lib/data';
import type { DealFilters } from '@/lib/data';
import type { Asset } from '@/lib/types';
import type { Preferences } from '@/lib/recommend';
import { EMPTY_PREFERENCES, hasPreferences } from '@/lib/recommend';

type View = 'deals' | 'quiz' | 'recommendations';

export default function App() {
  const [view, setView] = useState<View>('deals');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DealFilters>(DEFAULT_FILTERS);
  const [prefs, setPrefs] = useState<Preferences>(EMPTY_PREFERENCES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAssets();
        if (!cancelled) {
          setAssets(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load assets.');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleQuizComplete = (p: Preferences) => {
    setPrefs(p);
    setView('recommendations');
  };

  const navToRecommendations = () => {
    if (hasPreferences(prefs)) {
      setView('recommendations');
    } else {
      setView('quiz');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink-600/40 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
          <button
            onClick={() => setView('deals')}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Logo size={34} />
            <div className="text-left">
              <span className="font-display text-lg font-bold tracking-tight">
                Asset<span className="text-brand-400">Radar</span>
              </span>
              <span className="hidden text-xs text-ink-400 sm:block">
                Game asset deals & recommendations
              </span>
            </div>
          </button>

          <nav className="flex items-center gap-1.5">
            <NavButton
              active={view === 'deals'}
              onClick={() => setView('deals')}
              icon={<Gift className="h-4 w-4" />}
              label="Deals"
            />
            <NavButton
              active={view === 'quiz' || view === 'recommendations'}
              onClick={navToRecommendations}
              icon={<Sparkles className="h-4 w-4" />}
              label="For You"
            />
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : view === 'deals' ? (
          <DealsView assets={assets} filters={filters} onFiltersChange={setFilters} />
        ) : view === 'quiz' ? (
          <QuizView onComplete={handleQuizComplete} initial={prefs} />
        ) : (
          <RecommendationsView
            assets={assets}
            prefs={prefs}
            onRetake={() => setView('quiz')}
            onBrowse={() => setView('deals')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="border-t border-ink-600/30 pt-6 text-center text-xs text-ink-400">
          <p>
            AssetRadar scans FAB, Unity Asset Store, Sketchfab, CGTrader & ArtStation
            for free and discounted 3D/2D game assets.
          </p>
          <p className="mt-1 text-ink-500">
            Prices and availability shown for discovery purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
        active
          ? 'bg-brand-500/15 text-brand-300 shadow-glow'
          : 'text-ink-300 hover:bg-ink-800/60 hover:text-ink-100'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Loader2 className="h-10 w-10 animate-spin text-brand-400" />
      <p className="mt-4 text-ink-300">Scanning asset stores for deals...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="card-surface mx-auto flex max-w-lg flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-error-400" />
      <p className="mt-4 font-display text-lg font-semibold">Couldn't load assets</p>
      <p className="mt-1 text-sm text-ink-400">{message}</p>
      <button onClick={() => location.reload()} className="btn-primary mt-5">
        Try again
      </button>
    </div>
  );
}
