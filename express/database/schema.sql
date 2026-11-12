CREATE TABLE IF NOT EXISTS breweries (
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

CREATE TABLE IF NOT EXISTS beers (
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
