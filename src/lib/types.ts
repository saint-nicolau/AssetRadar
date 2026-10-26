export type AssetCategory =
  | 'character'
  | 'structure'
  | 'object'
  | 'vehicle'
  | 'effect'
  | 'environment'
  | 'material'
  | 'ui';

export type AssetTheme =
  | 'Sci-Fi'
  | 'Fantasy'
  | 'Medieval'
  | 'Modern'
  | 'Nature'
  | 'Horror'
  | 'Stylized'
  | 'Cyberpunk';

export interface Asset {
  id: string;
  name: string;
  store: string;
  category: AssetCategory;
  theme: AssetTheme;
  colors: string[];
  is_free: boolean;
  original_price: number | null;
  current_price: number | null;
  discount_percent: number;
  rating: number;
  popularity: number;
  image_url: string | null;
  store_url: string;
  description: string | null;
  poly_count: string | null;
  format: string | null;
  free_until: string | null;
  created_at: string;
}

export const CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'character', label: 'Characters' },
  { value: 'structure', label: 'Structures' },
  { value: 'object', label: 'Objects' },
  { value: 'vehicle', label: 'Vehicles' },
  { value: 'effect', label: 'Effects' },
  { value: 'environment', label: 'Environments' },
  { value: 'material', label: 'Materials' },
  { value: 'ui', label: 'UI' },
];

export const THEMES: AssetTheme[] = [
  'Sci-Fi',
  'Fantasy',
  'Medieval',
  'Modern',
  'Nature',
  'Horror',
  'Stylized',
  'Cyberpunk',
];

export const STORES = [
  'Fab',
  'Unity Asset Store',
  'Sketchfab',
  'CGTrader',
  'ArtStation',
] as const;

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  character: 'Characters',
  structure: 'Structures',
  object: 'Objects',
  vehicle: 'Vehicles',
  effect: 'Effects',
  environment: 'Environments',
  material: 'Materials',
  ui: 'UI',
};

export function formatPrice(price: number | null): string {
  if (price === null) return '—';
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
