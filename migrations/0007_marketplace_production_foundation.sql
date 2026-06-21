-- Production marketplace foundation. Additive only: existing records and seed data are preserved.

ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN deleted_at TEXT;

ALTER TABLE reviews ADD COLUMN client_user_id TEXT;
ALTER TABLE reviews ADD COLUMN project_id TEXT;

UPDATE users SET role = 'superadmin'
WHERE id = (SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1);

CREATE TABLE IF NOT EXISTS client_profiles (
  user_id TEXT PRIMARY KEY,
  preferred_language TEXT NOT NULL DEFAULT 'es',
  country TEXT,
  city TEXT,
  phone TEXT,
  notifications_enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS company_profiles (
  user_id TEXT PRIMARY KEY,
  company_name TEXT,
  vat_number TEXT,
  country TEXT,
  city TEXT,
  description TEXT,
  specialties_json TEXT NOT NULL DEFAULT '[]',
  service_areas_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'incomplete',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subcontractor_profiles (
  user_id TEXT PRIMARY KEY,
  trading_name TEXT,
  vat_number TEXT,
  country TEXT,
  city TEXT,
  description TEXT,
  specialties_json TEXT NOT NULL DEFAULT '[]',
  equipment_json TEXT NOT NULL DEFAULT '[]',
  availability_json TEXT NOT NULL DEFAULT '{}',
  service_areas_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'incomplete',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_photos (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  context_type TEXT NOT NULL,
  context_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_read_at TEXT,
  blocked_at TEXT,
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_user_id TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  edited_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS project_interests (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  professional_id TEXT,
  user_id TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'interested',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to TEXT,
  resolution TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS verification_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT,
  requested_level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  documents_json TEXT NOT NULL DEFAULT '[]',
  reviewed_by TEXT,
  review_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL DEFAULT '{}',
  updated_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS legal_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  is_public INTEGER NOT NULL DEFAULT 0,
  updated_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cookie_consents (
  id TEXT PRIMARY KEY,
  consent_id TEXT NOT NULL UNIQUE,
  user_id TEXT,
  necessary INTEGER NOT NULL DEFAULT 1,
  analytics INTEGER NOT NULL DEFAULT 0,
  maps INTEGER NOT NULL DEFAULT 0,
  marketing INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'es',
  policy_version TEXT NOT NULL,
  decided_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS seo_pages (
  id TEXT PRIMARY KEY,
  page_type TEXT NOT NULL,
  country_code TEXT,
  place_id TEXT,
  category_id TEXT,
  locale TEXT NOT NULL DEFAULT 'es',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(page_type, country_code, place_id, category_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_real_interaction ON reviews(client_user_id, project_id, professional_id);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status, created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id, joined_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_project_interests_project ON project_interests(project_id, status);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON admin_actions(admin_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at, created_at);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_user ON cookie_consents(user_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_seo_pages_lookup ON seo_pages(page_type, country_code, place_id, category_id, locale, status);
