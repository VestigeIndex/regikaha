-- Marketplace de oportunidades y saldo de contactos.
-- Migracion aditiva: conserva solicitudes, matching, perfiles y datos seed.

ALTER TABLE project_requests ADD COLUMN region TEXT;
ALTER TABLE project_requests ADD COLUMN title TEXT;
ALTER TABLE project_requests ADD COLUMN locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE project_requests ADD COLUMN expires_at TEXT;
ALTER TABLE project_requests ADD COLUMN max_professionals INTEGER NOT NULL DEFAULT 4;
ALTER TABLE project_requests ADD COLUMN unlocked_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE project_requests ADD COLUMN quality_score REAL NOT NULL DEFAULT 0;
ALTER TABLE project_requests ADD COLUMN source TEXT NOT NULL DEFAULT 'web';
ALTER TABLE project_requests ADD COLUMN contact_name TEXT;
ALTER TABLE project_requests ADD COLUMN contact_email TEXT;
ALTER TABLE project_requests ADD COLUMN contact_phone TEXT;

CREATE TABLE IF NOT EXISTS professional_lead_preferences (
  professional_id TEXT PRIMARY KEY,
  countries TEXT NOT NULL DEFAULT '[]',
  regions TEXT NOT NULL DEFAULT '[]',
  cities TEXT NOT NULL DEFAULT '[]',
  categories TEXT NOT NULL DEFAULT '[]',
  max_distance_km INTEGER NOT NULL DEFAULT 50,
  min_budget INTEGER NOT NULL DEFAULT 0,
  weekly_budget INTEGER NOT NULL DEFAULT 0,
  auto_unlock_enabled INTEGER NOT NULL DEFAULT 0,
  instant_notifications INTEGER NOT NULL DEFAULT 1,
  languages TEXT NOT NULL DEFAULT '[]',
  excluded_categories TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lead_balances (
  user_id TEXT NOT NULL,
  currency TEXT NOT NULL,
  promotional_balance INTEGER NOT NULL DEFAULT 0,
  paid_balance INTEGER NOT NULL DEFAULT 0,
  reserved_balance INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, currency)
);

CREATE TABLE IF NOT EXISTS lead_balance_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_type TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lead_unlocks (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  professional_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL,
  country_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unlocked',
  refund_status TEXT NOT NULL DEFAULT 'none',
  contact_data_snapshot TEXT NOT NULL,
  tax_info TEXT NOT NULL DEFAULT '{}',
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (lead_id, professional_id)
);

CREATE TABLE IF NOT EXISTS lead_pricing_rules (
  id TEXT PRIMARY KEY,
  country_code TEXT NOT NULL,
  currency TEXT NOT NULL,
  category_id TEXT,
  min_project_value INTEGER NOT NULL DEFAULT 0,
  max_project_value INTEGER,
  lead_price INTEGER NOT NULL,
  max_professionals INTEGER NOT NULL DEFAULT 4,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lead_invalid_reports (
  id TEXT PRIMARY KEY,
  lead_unlock_id TEXT NOT NULL,
  lead_id TEXT NOT NULL,
  professional_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  refund_amount INTEGER NOT NULL DEFAULT 0,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (lead_unlock_id)
);

CREATE TABLE IF NOT EXISTS lead_topup_orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT
);

UPDATE project_requests
SET expires_at = COALESCE(expires_at, datetime(created_at, '+30 days')),
    max_professionals = CASE
      WHEN urgency = 'urgent' THEN 3
      WHEN budget_range = 'mas-50000' THEN 3
      ELSE 4
    END,
    locale = COALESCE(NULLIF(locale, ''), 'es'),
    source = COALESCE(NULLIF(source, ''), 'web')
WHERE expires_at IS NULL OR locale IS NULL OR source IS NULL;

CREATE INDEX IF NOT EXISTS idx_project_requests_marketplace
  ON project_requests(status, country, category_id, expires_at, unlocked_count);
CREATE INDEX IF NOT EXISTS idx_lead_unlocks_professional
  ON lead_unlocks(professional_id, unlocked_at);
CREATE INDEX IF NOT EXISTS idx_lead_unlocks_lead
  ON lead_unlocks(lead_id, status);
CREATE INDEX IF NOT EXISTS idx_lead_balance_transactions_user
  ON lead_balance_transactions(user_id, currency, created_at);
CREATE INDEX IF NOT EXISTS idx_lead_invalid_reports_status
  ON lead_invalid_reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_lead_pricing_market
  ON lead_pricing_rules(country_code, category_id, active);
CREATE INDEX IF NOT EXISTS idx_lead_topup_orders_user
  ON lead_topup_orders(user_id, created_at);
