import { useMemo } from 'react';
import { Gift, Flame, TrendingUp, Sparkles } from 'lucide-react';
import type { Asset } from '@/lib/types';
import { applyFilters, DEFAULT_FILTERS } from '@/lib/data';
import type { DealFilters } from '@/lib/data';
import { FilterBar } from '@/components/FilterBar';
import { AssetCard } from '@/components/AssetCard';

interface Props {
  assets: Asset[];
  filters: DealFilters;
  onFiltersChange: (f: DealFilters) => void;
}

export function DealsView({ assets, filters, onFiltersChange }: Props) {
  const filtered = useMemo(() => applyFilters(assets, filters), [assets, filters]);

  const freeItems = useMemo(
    () => assets.filter((a) => a.is_free).sort((a, b) => (a.free_until ?? '').localeCompare(b.free_until ?? '')),
    [assets]
  );
  const topDeals = useMemo(
    () => assets.filter((a) => !a.is_free && a.discount_percent >= 40).sort((a, b) => b.discount_percent - a.discount_percent).slice(0, 6),
    [assets]
  );

  return (
    <div className="space-y-8">
      {/* Hero stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Gift className="h-5 w-5" />}
          label="Free right now"
          value={freeItems.length}
          accent="success"
          subtitle="Temporarily free assets"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Biggest discount"
          value={`${Math.max(0, ...assets.map((a) => a.discount_percent))}%`}
          accent="accent"
          subtitle="Across all stores"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total deals"
          value={assets.filter((a) => a.is_free || a.discount_percent > 0).length}
          accent="brand"
          subtitle="Free + discounted assets"
        />
      </section>

      {/* Free now spotlight */}
      {freeItems.length > 0 && filters.dealType === 'all' && filters.search === '' && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-success-400" />
            <h2 className="font-display text-xl font-semibold">Free right now</h2>
            <span className="chip bg-success-500/15 text-success-400 border border-success-500/30">
              Limited time
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {freeItems.slice(0, 4).map((a, i) => (
              <AssetCard
                key={a.id}
                asset={a}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Top deals strip */}
      {topDeals.length > 0 && filters.dealType === 'all' && filters.search === '' && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent-500" />
            <h2 className="font-display text-xl font-semibold">Hottest discounts</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {topDeals.map((a, i) => (
              <AssetCard
                key={a.id}
                asset={a}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Full browse with filters */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-400" />
          <h2 className="font-display text-xl font-semibold">Browse all deals</h2>
        </div>
        <FilterBar filters={filters} onChange={onFiltersChange} resultCount={filtered.length} />

        {filtered.length === 0 ? (
          <div className="mt-8 card-surface flex flex-col items-center justify-center py-16 text-center">
            <SearchEmpty />
            <p className="mt-4 text-ink-300">No assets match these filters.</p>
            <button
              onClick={() => onFiltersChange({ ...DEFAULT_FILTERS })}
              className="btn-ghost mt-4"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((a, i) => (
              <AssetCard
                key={a.id}
                asset={a}
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  accent: 'brand' | 'accent' | 'success';
}) {
  const accentMap = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    accent: 'text-accent-500 bg-accent-500/10 border-accent-500/20',
    success: 'text-success-400 bg-success-500/10 border-success-500/20',
  };
  return (
    <div className="card-surface flex items-center gap-4 p-5 transition-all hover:border-ink-500/50">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accentMap[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-100">{value}</p>
        <p className="text-xs text-ink-400">{subtitle}</p>
      </div>
    </div>
  );
}

function SearchEmpty() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="28" cy="28" r="18" stroke="#3a4070" strokeWidth="2.5" />
      <path d="M42 42 L54 54" stroke="#3a4070" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="28" r="6" stroke="#5a6090" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}
