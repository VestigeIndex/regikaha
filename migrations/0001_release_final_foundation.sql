-- RegiKaha release foundation.
-- Idempotente: solo crea tablas e índices nuevos. No borra seeds ni modifica datos existentes.

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'client',
  status TEXT NOT NULL DEFAULT 'active',
  display_name TEXT,
  contact_name TEXT,
  phone TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  place_id TEXT,
  place_slug TEXT,
  latitude REAL,
  longitude REAL,
  description TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0,
  onboarding_completed INTEGER NOT NULL DEFAULT 0,
  subscription_status TEXT NOT NULL DEFAULT 'no_subscription',
  commercial_access_status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS geo_places (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'manual',
  source_id TEXT,
  name TEXT NOT NULL,
  normalized_name TEXT,
  ascii_name TEXT,
  slug TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT,
  admin1_name TEXT,
  admin2_name TEXT,
  locality_name TEXT,
  postal_code TEXT,
  latitude REAL,
  longitude REAL,
  place_type TEXT NOT NULL DEFAULT 'city',
  population INTEGER,
  search_text TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS geo_aliases (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL,
  alias TEXT NOT NULL,
  normalized_alias TEXT,
  language TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS geo_import_runs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  rows_seen INTEGER NOT NULL DEFAULT 0,
  rows_imported INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  role TEXT,
  plan TEXT,
  interval TEXT,
  status TEXT NOT NULL DEFAULT 'no_subscription',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  current_period_end TEXT,
  trial_starts_at TEXT,
  trial_ends_at TEXT,
  first_charge_at TEXT,
  future_price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS founder_slots (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  profile_id TEXT,
  email TEXT,
  role TEXT,
  country_code TEXT,
  place_id TEXT,
  city TEXT,
  selected_plan TEXT,
  trial_months INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'reserved',
  reserved_at TEXT NOT NULL DEFAULT (datetime('now')),
  activated_at TEXT,
  trial_ends_at TEXT,
  converted_at TEXT,
  cancelled_at TEXT
);

CREATE TABLE IF NOT EXISTS subscription_contract_acceptances (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT,
  subscription_id TEXT,
  plan_id TEXT,
  role TEXT,
  contract_version TEXT NOT NULL,
  terms_version TEXT,
  privacy_version TEXT,
  verification_policy_version TEXT,
  reviews_policy_version TEXT,
  ranking_policy_version TEXT,
  cancellation_policy_version TEXT,
  price_today INTEGER NOT NULL DEFAULT 0,
  future_price INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  trial_starts_at TEXT,
  trial_ends_at TEXT,
  first_charge_at TEXT,
  renewal_interval TEXT,
  ip_address_hash TEXT,
  user_agent_hash TEXT,
  accepted_checkboxes_json TEXT NOT NULL DEFAULT '{}',
  contract_snapshot_hash TEXT NOT NULL,
  accepted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS match_candidates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  professional_id TEXT NOT NULL,
  country TEXT,
  city TEXT,
  category_id TEXT,
  score REAL NOT NULL DEFAULT 0,
  reasons TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'candidate',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(project_id, professional_id)
);

CREATE TABLE IF NOT EXISTS b2b_match_candidates (
  id TEXT PRIMARY KEY,
  b2b_project_id TEXT NOT NULL,
  profile_id TEXT,
  professional_id TEXT,
  country TEXT,
  city TEXT,
  specialty TEXT,
  score REAL NOT NULL DEFAULT 0,
  reasons TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'candidate',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS demand_signals (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  city TEXT,
  category_id TEXT,
  source TEXT NOT NULL,
  signal_count INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON profiles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_profiles_geo ON profiles(country, city);
CREATE INDEX IF NOT EXISTS idx_geo_places_country_type ON geo_places(country_code, place_type);
CREATE INDEX IF NOT EXISTS idx_geo_places_search ON geo_places(country_code, normalized_name, postal_code);
CREATE INDEX IF NOT EXISTS idx_geo_aliases_place ON geo_aliases(place_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_founder_slots_status ON founder_slots(status, reserved_at);
CREATE INDEX IF NOT EXISTS idx_contract_acceptances_user ON subscription_contract_acceptances(user_id, accepted_at);
CREATE INDEX IF NOT EXISTS idx_match_candidates_project ON match_candidates(project_id, score);
CREATE INDEX IF NOT EXISTS idx_b2b_match_candidates_project ON b2b_match_candidates(b2b_project_id, score);
CREATE INDEX IF NOT EXISTS idx_demand_signals_geo ON demand_signals(country, city, category_id);
