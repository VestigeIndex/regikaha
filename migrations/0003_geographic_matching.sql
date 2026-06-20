-- Geographic search and matching. Additive only: preserves existing users, seeds and commercial data.

ALTER TABLE professionals ADD COLUMN latitude REAL;
ALTER TABLE professionals ADD COLUMN longitude REAL;

ALTER TABLE service_areas ADD COLUMN latitude REAL;
ALTER TABLE service_areas ADD COLUMN longitude REAL;

ALTER TABLE project_requests ADD COLUMN latitude REAL;
ALTER TABLE project_requests ADD COLUMN longitude REAL;
ALTER TABLE project_requests ADD COLUMN radius_km INTEGER NOT NULL DEFAULT 25;

ALTER TABLE b2b_project_requests ADD COLUMN latitude REAL;
ALTER TABLE b2b_project_requests ADD COLUMN longitude REAL;
ALTER TABLE b2b_project_requests ADD COLUMN radius_km INTEGER NOT NULL DEFAULT 50;
ALTER TABLE b2b_project_requests ADD COLUMN contact_name TEXT;
ALTER TABLE b2b_project_requests ADD COLUMN contact_email TEXT;
ALTER TABLE b2b_project_requests ADD COLUMN contact_phone TEXT;

ALTER TABLE quote_requests ADD COLUMN latitude REAL;
ALTER TABLE quote_requests ADD COLUMN longitude REAL;
ALTER TABLE quote_requests ADD COLUMN radius_km INTEGER NOT NULL DEFAULT 25;

CREATE INDEX IF NOT EXISTS idx_professionals_coordinates ON professionals(country, latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_service_areas_coordinates ON service_areas(country, latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_project_requests_coordinates ON project_requests(country, latitude, longitude);

CREATE TABLE IF NOT EXISTS business_tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  due_date TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'open',
  related_type TEXT,
  related_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS estimate_templates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  summary TEXT,
  line_items TEXT NOT NULL DEFAULT '[]',
  vat_rate REAL NOT NULL DEFAULT 21,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_business_tasks_user_status ON business_tasks(user_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_estimate_templates_user ON estimate_templates(user_id, name);
