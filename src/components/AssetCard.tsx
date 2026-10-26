import { Star, ExternalLink, Gift, Tag, Clock } from 'lucide-react';
import type { Asset } from '@/lib/types';
import { CATEGORY_LABELS, formatPrice, daysUntil } from '@/lib/types';

interface Props {
  asset: Asset;
  reasons?: string[];
  style?: React.CSSProperties;
}

export function AssetCard({ asset, reasons, style }: Props) {
  const freeDays = daysUntil(asset.free_until);
  const showFreeBadge = asset.is_free && freeDays !== null;

  return (
    <article
      style={style}
      className="group card-surface overflow-hidden transition-all duration-300 hover:border-brand-400/50 hover:shadow-card hover:-translate-y-1 animate-fadeIn"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        {asset.image_url ? (
          <img
            src={asset.image_url}
            alt={asset.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full shimmer-bg animate-shimmer" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {asset.is_free ? (
            <span className="chip bg-success-500 text-white shadow-lg">
              <Gift className="h-3 w-3" /> Free
            </span>
          ) : (
            asset.discount_percent > 0 && (
              <span className="chip bg-accent-500 text-ink-950 shadow-lg font-bold">
                <Tag className="h-3 w-3" /> {asset.discount_percent}% OFF
              </span>
            )
          )}
        </div>

        {/* Top-right store */}
        <span className="absolute top-3 right-3 chip bg-ink-950/70 text-ink-100 backdrop-blur-sm border border-ink-600/40">
          {asset.store}
        </span>

        {/* Free countdown */}
        {showFreeBadge && (
          <div className="absolute bottom-3 left-3 chip bg-ink-950/80 text-success-400 border border-success-500/30 backdrop-blur-sm">
            <Clock className="h-3 w-3" /> {freeDays}d left
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-ink-100 line-clamp-1">
            {asset.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1 text-xs text-ink-300">
            <Star className="h-3.5 w-3.5 fill-warning-400 text-warning-400" />
            {asset.rating.toFixed(1)}
          </div>
        </div>

        <p className="mt-1.5 text-sm text-ink-300 line-clamp-2 min-h-[2.5rem]">
          {asset.description ?? 'No description available.'}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="chip bg-ink-800 text-ink-200 border border-ink-600/40">
            {CATEGORY_LABELS[asset.category]}
          </span>
          <span className="chip bg-brand-900/40 text-brand-300 border border-brand-500/20">
            {asset.theme}
          </span>
          {asset.format && (
            <span className="chip bg-ink-800 text-ink-400 border border-ink-600/40">
              {asset.format}
            </span>
          )}
        </div>

        {/* Color palette dots */}
        <div className="mt-3 flex items-center gap-1">
          {asset.colors.slice(0, 5).map((c) => (
            <span
              key={c}
              className="h-3.5 w-3.5 rounded-full border border-ink-600/40 ring-1 ring-black/20"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {reasons && reasons.length > 0 && (
          <div className="mt-3 rounded-lg border border-brand-500/20 bg-brand-900/20 p-2.5">
            <p className="text-xs font-medium text-brand-300 mb-1">Why we picked this</p>
            <ul className="space-y-0.5">
              {reasons.slice(0, 2).map((r) => (
                <li key={r} className="text-xs text-ink-200 flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 rounded-full bg-brand-400 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {asset.is_free ? (
              <span className="font-display text-lg font-bold text-success-400">Free</span>
            ) : (
              <>
                <span className="font-display text-lg font-bold text-ink-100">
                  {formatPrice(asset.current_price)}
                </span>
                {asset.original_price && asset.original_price !== asset.current_price && (
                  <span className="text-sm text-ink-400 line-through">
                    {formatPrice(asset.original_price)}
                  </span>
                )}
              </>
            )}
          </div>
          <a
            href={asset.store_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost !px-3 !py-2 text-xs hover:border-brand-400/50 hover:text-brand-300"
          >
            View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
