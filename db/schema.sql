-- RegiKaha — esquema D1 (marketplace europeo)
-- Idempotente: usa IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'professional',   -- professional | admin
  verify_token TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS professionals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT UNIQUE,
  type TEXT,
  type_label TEXT,
  public_name TEXT,
  legal_name TEXT,
  nif_cif TEXT,
  country TEXT,                 -- código país UE (ES, FR, DE, ...)
  region TEXT,                  -- provincia / región / estado
  city TEXT,
  phone TEXT,
  years_experience INTEGER DEFAULT 0,
  languages TEXT DEFAULT '[]',  -- JSON array
  description TEXT,
  short_tagline TEXT,
  service_radius_km INTEGER DEFAULT 30,
  insurance_declared INTEGER DEFAULT 0,
  invoice_declared INTEGER DEFAULT 0,
  offers_urgent INTEGER DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'pending', -- pending|verified|limited|suspended
  average_rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  response_time_hours INTEGER DEFAULT 24,
  price_from REAL DEFAULT 0,
  logo_color TEXT DEFAULT '#198C68',
  cover_image TEXT,
  active_status INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS professional_categories (
  professional_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (professional_id, category_id)
);

-- Zonas donde opera el profesional
CREATE TABLE IF NOT EXISTS service_areas (
  id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL,
  country TEXT NOT NULL,        -- código país UE
  region TEXT,                  -- provincia / región
  city TEXT,
  postal_prefix TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL,
  category_id TEXT,
  title TEXT,
  slug TEXT,
  description TEXT,
  price_from REAL,
  price_type TEXT DEFAULT 'from',
  is_active INTEGER NOT NULL DEFAULT 1
);

-- Documentación de verificación (autónomo / empresa / seguro / identidad)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL,
  type TEXT NOT NULL,          -- autonomo_alta | company_registry | insurance | id_document | other
  filename TEXT,
  r2_key TEXT NOT NULL,
  size INTEGER,
  status TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  professional_id TEXT,
  category_id TEXT,
  service_id TEXT,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  description TEXT,
  budget_range TEXT,
  urgency TEXT DEFAULT 'flexible',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL,
  client_name TEXT,
  service_label TEXT,
  rating INTEGER,
  comment TEXT,
  reply TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  verified INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,         -- token de sesión
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_service_areas_loc ON service_areas(country, region, city);
CREATE INDEX IF NOT EXISTS idx_service_areas_pro ON service_areas(professional_id);
CREATE INDEX IF NOT EXISTS idx_prof_cat_cat ON professional_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_prof_status ON professionals(verification_status, active_status);
CREATE INDEX IF NOT EXISTS idx_docs_pro ON documents(professional_id);
CREATE INDEX IF NOT EXISTS idx_quotes_pro ON quote_requests(professional_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
