-- Drop child table first: beers points at breweries,
-- so breweries can't be dropped while beers still reference it
DROP TABLE IF EXISTS beers;
DROP TABLE IF EXISTS breweries;

CREATE TABLE breweries (
  id INTEGER PRIMARY KEY,
  obdb_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brewery_type TEXT,
  city TEXT,
  state_province TEXT,
  country TEXT,
  website_url TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE beers (
  id INTEGER PRIMARY KEY, 
  brewery_id INTEGER NOT NULL REFERENCES breweries (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style TEXT,
  abv REAL CHECK (abv >= 0 AND abv <= 100),
  release_type TEXT CHECK (release_type IN ('core', 'seasonal', 'limited', 'one-off')),
  aroma TEXT,
  flavour TEXT,
  notes TEXT,
  score INTEGER CHECK (score BETWEEN 1 AND 5),
  malt INTEGER CHECK (malt BETWEEN 1 AND 5),
  bitterness INTEGER CHECK (bitterness BETWEEN 1 AND 5),
  hoppiness INTEGER CHECK (hoppiness BETWEEN 1 AND 5),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Starter data: real breweries from Open Brewery DB (obdb_id = the API's id)
INSERT INTO breweries (obdb_id, name, brewery_type, city, state_province, country, website_url, rating, notes)
VALUES
  ('3b836ff9-8088-4df0-b2f1-8287f2a35b81', '33 Acres Brewing Company', 'brewpub', 'Vancouver', 'British Columbia', 'Canada', 'http://www.33acresbrewing.com', 5, 'Clean, minimalist taproom. Great place to start a brewery crawl.'),
  ('ee5bc973-fb5d-4874-a775-8e9006d63951', 'Brassneck Brewery', 'micro', 'Vancouver', 'British Columbia', 'Canada', 'http://brassneck.ca', NULL, NULL),
  ('7b409017-6d81-4943-bd3c-0099f35d6232', 'Parallel 49 Brewing Company', 'brewpub', 'Vancouver', 'British Columbia', 'Canada', 'http://parallel49brewing.com', NULL, NULL),
  ('aa1aa238-89a8-4885-9f55-61a6b17ba9c7', 'Main Street Brewing Company', 'micro', 'Vancouver', 'British Columbia', 'Canada', 'http://mainstreetbeer.ca/', NULL, NULL);
