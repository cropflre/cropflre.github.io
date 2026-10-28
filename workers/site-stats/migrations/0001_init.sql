-- Apply before Worker deploy. Counts start at zero unless explicitly migrated.
CREATE TABLE IF NOT EXISTS site_counters (
  id INTEGER PRIMARY KEY CHECK (id=1),
  pv INTEGER NOT NULL DEFAULT 0 CHECK (pv>=0),
  uv INTEGER NOT NULL DEFAULT 0 CHECK (uv>=0)
);
INSERT OR IGNORE INTO site_counters(id,pv,uv) VALUES(1,0,0);
CREATE TABLE IF NOT EXISTS site_visitors (
  visitor_hash TEXT PRIMARY KEY NOT NULL,
  first_seen_at INTEGER NOT NULL,
  last_counted_at INTEGER NOT NULL,
  last_path TEXT NOT NULL
);
