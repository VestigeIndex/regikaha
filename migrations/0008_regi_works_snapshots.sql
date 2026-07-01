CREATE TABLE IF NOT EXISTS regi_works_snapshots (
  user_id TEXT PRIMARY KEY,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_regi_works_snapshots_updated ON regi_works_snapshots(updated_at);
