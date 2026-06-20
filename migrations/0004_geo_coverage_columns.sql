-- Align geo_places with the complete search adapter without deleting seed data.
ALTER TABLE geo_places ADD COLUMN admin1_code TEXT;
ALTER TABLE geo_places ADD COLUMN admin2_code TEXT;
ALTER TABLE geo_places ADD COLUMN municipality_name TEXT;
ALTER TABLE geo_places ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE geo_places ADD COLUMN is_indexable INTEGER NOT NULL DEFAULT 0;

UPDATE geo_places
SET is_featured = CASE WHEN source = 'seed-small' THEN 1 ELSE is_featured END,
    is_indexable = CASE WHEN source = 'seed-small' THEN 1 ELSE is_indexable END;

CREATE INDEX IF NOT EXISTS idx_geo_places_country_featured_population
  ON geo_places(country_code, is_featured DESC, population DESC);
