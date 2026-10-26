import { Search, SlidersHorizontal, X, Gift, Tag, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { DealFilters } from '@/lib/data';
import { DEFAULT_FILTERS } from '@/lib/data';
import { CATEGORIES, THEMES, STORES } from '@/lib/types';
import type { AssetCategory, AssetTheme } from '@/lib/types';

interface Props {
  filters: DealFilters;
  onChange: (f: DealFilters) => void;
  resultCount: number;
}

export function FilterBar({ filters, onChange, resultCount }: Props) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<DealFilters>) => onChange({ ...filters, ...patch });
  const activeCount =
    (filters.store ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.theme ? 1 : 0) +
    (filters.dealType !== 'all' ? 1 : 0) +
    (filters.minDiscount > 0 ? 1 : 0);

  return (
    <div className="card-surface p-4 md:p-5">
      {/* Search + deal type toggles */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search assets, themes, descriptions..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DealToggle
            active={filters.dealType === 'all'}
            onClick={() => update({ dealType: 'all' })}
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="All"
          />
          <DealToggle
            active={filters.dealType === 'free'}
            onClick={() => update({ dealType: 'free' })}
            icon={<Gift className="h-3.5 w-3.5" />}
            label="Free"
          />
          <DealToggle
            active={filters.dealType === 'discount'}
            onClick={() => update({ dealType: 'discount' })}
            icon={<Tag className="h-3.5 w-3.5" />}
            label="Discounts"
          />
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="btn-ghost lg:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Sort row */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink-400">Sort:</span>
        {(
          [
            ['popularity', 'Most Popular'],
            ['discount', 'Biggest Discount'],
            ['rating', 'Top Rated'],
            ['price-low', 'Price: Low → High'],
            ['price-high', 'Price: High → Low'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => update({ sortBy: key })}
            className={`chip transition-all ${
              filters.sortBy === key
                ? 'bg-brand-500 text-white'
                : 'bg-ink-800 text-ink-300 hover:text-ink-100 border border-ink-600/40'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-400">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Expandable filters */}
      {open && (
        <div className="mt-4 grid gap-4 border-t border-ink-600/40 pt-4 md:grid-cols-2 lg:grid-cols-4 animate-fadeIn">
          <FilterGroup label="Store">
            <SelectChip
              value={filters.store}
              onChange={(v) => update({ store: v as string | null })}
              options={STORES.map((s) => ({ value: s, label: s }))}
              allLabel="All stores"
            />
          </FilterGroup>

          <FilterGroup label="Category">
            <SelectChip
              value={filters.category}
              onChange={(v) => update({ category: v as AssetCategory | null })}
              options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
              allLabel="All categories"
            />
          </FilterGroup>

          <FilterGroup label="Theme">
            <SelectChip
              value={filters.theme}
              onChange={(v) => update({ theme: v as AssetTheme | null })}
              options={THEMES.map((t) => ({ value: t, label: t }))}
              allLabel="All themes"
            />
          </FilterGroup>

          <FilterGroup label={`Min Discount: ${filters.minDiscount}%`}>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={filters.minDiscount}
              onChange={(e) => update({ minDiscount: Number(e.target.value) })}
              className="w-full accent-brand-400"
            />
          </FilterGroup>

          {activeCount > 0 && (
            <button
              onClick={() => onChange({ ...DEFAULT_FILTERS, search: filters.search })}
              className="btn-ghost col-span-full !w-fit text-xs"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DealToggle({
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
      className={`chip px-3.5 py-2 font-semibold transition-all ${
        active
          ? 'bg-brand-500 text-white shadow-glow'
          : 'bg-ink-800 text-ink-300 hover:text-ink-100 border border-ink-600/40'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectChip({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="input-field cursor-pointer"
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
