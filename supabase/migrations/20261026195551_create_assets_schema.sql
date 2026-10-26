/*
# Create assets table for the Asset Deals & Recommendations app

1. New Tables
- `assets`
  - `id` (uuid, primary key)
  - `name` (text, not null) - asset display name
  - `store` (text, not null) - source store, e.g. "Fab", "Unity Asset Store", "Sketchfab", "CGTrader", "ArtStation"
  - `category` (text, not null) - one of: character, structure, object, vehicle, effect, environment, material, ui
  - `theme` (text, not null) - thematic tag, e.g. "Sci-Fi", "Fantasy", "Medieval", "Modern", "Nature", "Horror", "Stylized", "Cyberpunk"
  - `colors` (text[]) - dominant color palette as hex strings
  - `is_free` (boolean, default false) - whether the asset is currently free
  - `original_price` (numeric, nullable) - original price in USD
  - `current_price` (numeric, nullable) - current/discounted price in USD (0 when free)
  - `discount_percent` (integer, default 0) - discount percentage 0-100
  - `rating` (numeric, default 0) - average rating 0-5
  - `popularity` (integer, default 0) - popularity score for sorting
  - `image_url` (text, nullable) - preview image URL
  - `store_url` (text, not null) - link to the asset on its store
  - `description` (text, nullable) - short description
  - `poly_count` (text, nullable) - polygon count range as text, e.g. "10K-50K"
  - `format` (text, nullable) - file format, e.g. "FBX", "GLTF", "USD"
  - `free_until` (timestamptz, nullable) - when the temporary free deal expires
  - `created_at` (timestamptz, default now())

2. Indexes
- Index on `is_free`, `discount_percent`, `category`, `theme`, `store` for fast filtering.

3. Security
- Enable RLS on `assets`.
- Grant SELECT to `anon` + `authenticated` (no-auth app: the catalog is intentionally public/shared).
- No INSERT/UPDATE/DELETE grants from the client (catalog is managed server-side); data is seeded via this migration.
- Public read policies for anon + authenticated.
*/

CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  store text NOT NULL,
  category text NOT NULL,
  theme text NOT NULL,
  colors text[] NOT NULL DEFAULT '{}',
  is_free boolean NOT NULL DEFAULT false,
  original_price numeric(10,2),
  current_price numeric(10,2),
  discount_percent integer NOT NULL DEFAULT 0,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  popularity integer NOT NULL DEFAULT 0,
  image_url text,
  store_url text NOT NULL,
  description text,
  poly_count text,
  format text,
  free_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_is_free ON assets (is_free);
CREATE INDEX IF NOT EXISTS idx_assets_discount ON assets (discount_percent DESC);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets (category);
CREATE INDEX IF NOT EXISTS idx_assets_theme ON assets (theme);
CREATE INDEX IF NOT EXISTS idx_assets_store ON assets (store);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON assets TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_assets" ON assets;
CREATE POLICY "anon_select_assets"
ON assets FOR SELECT
TO anon, authenticated USING (true);
