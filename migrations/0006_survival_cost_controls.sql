-- Cost controls and optimized media metadata. Additive only; preserves all existing data.

ALTER TABLE portfolio_items ADD COLUMN thumbnail_url TEXT;
ALTER TABLE portfolio_items ADD COLUMN thumbnail_r2_key TEXT;
ALTER TABLE portfolio_items ADD COLUMN image_size INTEGER;
ALTER TABLE portfolio_items ADD COLUMN image_width INTEGER;
ALTER TABLE portfolio_items ADD COLUMN image_height INTEGER;
ALTER TABLE portfolio_items ADD COLUMN mime_type TEXT;

CREATE TABLE IF NOT EXISTS cost_usage_counters (
  usage_key TEXT NOT NULL,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (usage_key, window_start)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'es',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cost_usage_expiry ON cost_usage_counters(expires_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status, created_at);
