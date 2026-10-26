import { supabase } from './supabase';
import type { Asset, AssetCategory, AssetTheme } from './types';

export interface DealFilters {
  store: string | null;
  category: AssetCategory | null;
  theme: AssetTheme | null;
  dealType: 'all' | 'free' | 'discount';
  minDiscount: number;
  sortBy: 'popularity' | 'discount' | 'rating' | 'price-low' | 'price-high';
  search: string;
}

export const DEFAULT_FILTERS: DealFilters = {
  store: null,
  category: null,
  theme: null,
  dealType: 'all',
  minDiscount: 0,
  sortBy: 'popularity',
  search: '',
};

export async function fetchAssets(): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('popularity', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Asset[];
}

export function applyFilters(assets: Asset[], filters: DealFilters): Asset[] {
  let result = assets.filter((a) => {
    if (filters.store && a.store !== filters.store) return false;
    if (filters.category && a.category !== filters.category) return false;
    if (filters.theme && a.theme !== filters.theme) return false;
    if (filters.dealType === 'free' && !a.is_free) return false;
    if (filters.dealType === 'discount' && a.discount_percent < filters.minDiscount)
      return false;
    if (filters.dealType === 'all' && filters.minDiscount > 0 && a.discount_percent < filters.minDiscount)
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !a.name.toLowerCase().includes(q) &&
        !a.description?.toLowerCase().includes(q) &&
        !a.theme.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  switch (filters.sortBy) {
    case 'discount':
      result = [...result].sort((a, b) => b.discount_percent - a.discount_percent);
      break;
    case 'rating':
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    case 'price-low':
      result = [...result].sort(
        (a, b) => (a.current_price ?? 9999) - (b.current_price ?? 9999)
      );
      break;
    case 'price-high':
      result = [...result].sort(
        (a, b) => (b.current_price ?? 0) - (a.current_price ?? 0)
      );
      break;
    default:
      result = [...result].sort((a, b) => b.popularity - a.popularity);
  }
  return result;
}

export function countFreeLive(assets: Asset[]): number {
  return assets.filter((a) => a.is_free).length;
}

export function maxDiscount(assets: Asset[]): number {
  return assets.reduce((m, a) => Math.max(m, a.discount_percent), 0);
}
