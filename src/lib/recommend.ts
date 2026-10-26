import type { Asset, AssetCategory, AssetTheme } from './types';

export interface Preferences {
  categories: AssetCategory[];
  themes: AssetTheme[];
  colors: string[];
  priceRange: 'free' | 'under25' | 'under50' | 'any';
  detail: 'low' | 'medium' | 'high' | 'any';
}

export const EMPTY_PREFERENCES: Preferences = {
  categories: [],
  themes: [],
  colors: [],
  priceRange: 'any',
  detail: 'any',
};

const COLOR_FAMILIES: { name: string; hex: string; match: string[] }[] = [
  { name: 'Blue', hex: '#22bcf0', match: ['#1a1a2e', '#0f3460', '#16213e', '#2a3b5c', '#2c3e50', '#3498db'] },
  { name: 'Green', hex: '#10b981', match: ['#2d4a2b', '#5a7a3a', '#3a5a3a', '#2e8b57', '#5cb85c', '#27ae60', '#3a2a1a'] },
  { name: 'Orange', hex: '#ff9a1f', match: ['#ff9a3c', '#e07c00', '#ffb347', '#e67e22', '#8b6f47', '#c0975a'] },
  { name: 'Red', hex: '#ef4444', match: ['#c43c3c', '#8b0000', '#e74c3c'] },
  { name: 'Purple', hex: '#9b59b6', match: ['#9b59b6', '#aa96da'] },
  { name: 'Neutral', hex: '#8b91b8', match: ['#c0c0c0', '#8a8270', '#5a5345', '#d4d4d4', '#6a7b8c', '#a3b1c2', '#c2c7e0', '#8b95a3', '#3a3a3a', '#6a6a6a', '#1a1a1a'] },
  { name: 'Pastel', hex: '#fcbad3', match: ['#a8d8ea', '#aa96da', '#fcbad3', '#4ecdc4', '#ffe66d'] },
];

export const COLOR_OPTIONS = COLOR_FAMILIES.map((c) => ({ name: c.name, hex: c.hex }));

function colorMatchScore(assetColors: string[], prefColors: string[]): number {
  if (prefColors.length === 0) return 0;
  const prefHexes = new Set<string>();
  for (const prefName of prefColors) {
    const fam = COLOR_FAMILIES.find((f) => f.name === prefName);
    if (fam) fam.match.forEach((h) => prefHexes.add(h.toLowerCase()));
  }
  let hits = 0;
  for (const c of assetColors) {
    if (prefHexes.has(c.toLowerCase())) hits += 1;
  }
  return hits / Math.max(1, assetColors.length);
}

function priceInRange(asset: Asset, range: Preferences['priceRange']): boolean {
  const price = asset.current_price ?? asset.original_price ?? 0;
  switch (range) {
    case 'free':
      return asset.is_free || price === 0;
    case 'under25':
      return price <= 25;
    case 'under50':
      return price <= 50;
    default:
      return true;
  }
}

function detailInRange(asset: Asset, detail: Preferences['detail']): boolean {
  if (detail === 'any') return true;
  const poly = asset.poly_count?.toLowerCase() ?? '';
  if (detail === 'low') return /k$/.test(poly) && !/k\+/.test(poly) && parseInt(poly) < 50 || /low|stylized|low.?poly/.test(poly);
  if (detail === 'high') return /\d{3,}k|\d00k|k\+/.test(poly);
  return true;
}

export interface ScoredAsset {
  asset: Asset;
  score: number;
  reasons: string[];
}

export function recommend(assets: Asset[], prefs: Preferences): ScoredAsset[] {
  const scored: ScoredAsset[] = assets.map((asset) => {
    let score = 0;
    const reasons: string[] = [];

    if (prefs.categories.includes(asset.category)) {
      score += 35;
      reasons.push(`Matches your interest in ${asset.category}`);
    }

    if (prefs.themes.includes(asset.theme)) {
      score += 30;
      reasons.push(`${asset.theme} theme you like`);
    }

    const colorScore = colorMatchScore(asset.colors, prefs.colors);
    if (colorScore > 0) {
      score += colorScore * 20;
      if (colorScore > 0.4) reasons.push('Colors fit your palette');
    }

    if (priceInRange(asset, prefs.priceRange)) {
      score += 10;
      if (prefs.priceRange === 'free' && (asset.is_free || asset.current_price === 0))
        reasons.push('Currently free');
    }

    if (detailInRange(asset, prefs.detail)) {
      score += 8;
    }

    score += (asset.rating / 5) * 12;
    score += Math.min(10, asset.popularity / 200);

    return { asset, score, reasons };
  });

  return scored
    .filter((s) => s.score > 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

export function hasPreferences(prefs: Preferences): boolean {
  return (
    prefs.categories.length > 0 ||
    prefs.themes.length > 0 ||
    prefs.colors.length > 0 ||
    prefs.priceRange !== 'any' ||
    prefs.detail !== 'any'
  );
}
