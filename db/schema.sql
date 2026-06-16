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
  logo_image TEXT,
  cover_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
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
  estimated_time TEXT,
  includes TEXT DEFAULT '[]',
  excludes TEXT DEFAULT '[]',
  process TEXT DEFAULT '[]',
  faqs TEXT DEFAULT '[]',
  service_area TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  location TEXT,
  image_url TEXT NOT NULL,
  r2_key TEXT,
  sort_order INTEGER DEFAULT 0,
  completion_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
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

CREATE TABLE IF NOT EXISTS quote_estimates (
  id TEXT PRIMARY KEY,
  quote_request_id TEXT NOT NULL,
  professional_id TEXT NOT NULL,
  client_email TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  line_items TEXT NOT NULL DEFAULT '[]',
  subtotal_eur REAL NOT NULL DEFAULT 0,
  vat_rate REAL NOT NULL DEFAULT 21,
  vat_eur REAL NOT NULL DEFAULT 0,
  total_eur REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'sent', -- draft|sent|accepted|rejected
  sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_requests (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  client_type TEXT NOT NULL DEFAULT 'particular',
  country TEXT,
  city TEXT,
  postal_code TEXT,
  category_id TEXT,
  subcategory TEXT,
  description TEXT,
  urgency TEXT DEFAULT 'flexible',
  budget_range TEXT,
  property_type TEXT,
  approximate_measures TEXT,
  files TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS b2b_project_requests (
  id TEXT PRIMARY KEY,
  company_id TEXT,
  company_type TEXT,
  country TEXT,
  city TEXT,
  required_specialty TEXT,
  project_type TEXT,
  start_date TEXT,
  duration TEXT,
  team_size TEXT,
  required_documents TEXT DEFAULT '[]',
  description TEXT,
  budget_range TEXT,
  files TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS coverage_status (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  category_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'verificando',
  professionals_count INTEGER NOT NULL DEFAULT 0,
  demand_count INTEGER NOT NULL DEFAULT 0,
  last_updated TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(country, city, category_id)
);

CREATE TABLE IF NOT EXISTS lead_sources (
  id TEXT PRIMARY KEY,
  source TEXT,
  professional_name TEXT,
  category_id TEXT,
  city TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'nuevo',
  phone TEXT,
  email TEXT,
  website TEXT,
  notes TEXT,
  campaign TEXT,
  related_demand_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS growth_tasks (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  country TEXT,
  city TEXT,
  category_id TEXT,
  priority INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to TEXT,
  prompt TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  provider TEXT NOT NULL,      -- google
  provider_user_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_service_areas_loc ON service_areas(country, region, city);
CREATE INDEX IF NOT EXISTS idx_service_areas_pro ON service_areas(professional_id);
CREATE INDEX IF NOT EXISTS idx_prof_cat_cat ON professional_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_prof_status ON professionals(verification_status, active_status);
CREATE INDEX IF NOT EXISTS idx_docs_pro ON documents(professional_id);
CREATE INDEX IF NOT EXISTS idx_quotes_pro ON quote_requests(professional_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_pro ON portfolio_items(professional_id);
CREATE INDEX IF NOT EXISTS idx_quote_estimates_pro ON quote_estimates(professional_id);
CREATE INDEX IF NOT EXISTS idx_quote_estimates_request ON quote_estimates(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_geo ON project_requests(country, city, category_id);
CREATE INDEX IF NOT EXISTS idx_b2b_requests_geo ON b2b_project_requests(country, city, required_specialty);
CREATE INDEX IF NOT EXISTS idx_coverage_geo ON coverage_status(country, city, category_id);
CREATE INDEX IF NOT EXISTS idx_growth_tasks_status ON growth_tasks(status, priority);
CREATE INDEX IF NOT EXISTS idx_lead_sources_status ON lead_sources(status, country, city);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user ON oauth_accounts(user_id);
