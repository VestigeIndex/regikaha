-- RegiWorks Cloud Sync (local-first + cloud).
-- Aditivo: solo crea tablas nuevas. El workspace es texto normalizado SIN base64;
-- las imágenes se guardan comprimidas en R2 y aquí solo su referencia.

CREATE TABLE IF NOT EXISTS regiworks_workspaces (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL DEFAULT '{}',          -- JSON del workspace (sin imágenes base64)
  revision INTEGER NOT NULL DEFAULT 0,      -- contador para last-write-wins
  size_bytes INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS regiworks_media (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT,
  r2_key TEXT NOT NULL,
  thumb_key TEXT,
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_regiworks_media_user ON regiworks_media(user_id);
