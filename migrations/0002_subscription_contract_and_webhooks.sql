-- Suscripción obligatoria, contrato digital y fundadores.
-- Migración incremental: no borra perfiles, portfolio, reseñas ni seeds.

ALTER TABLE subscriptions ADD COLUMN contract_acceptance_id TEXT;
ALTER TABLE subscriptions ADD COLUMN founder_slot_id TEXT;
ALTER TABLE subscriptions ADD COLUMN checkout_session_id TEXT;
ALTER TABLE subscriptions ADD COLUMN cancel_at_period_end INTEGER NOT NULL DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN payment_method_status TEXT;

ALTER TABLE founder_slots ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE founder_slots ADD COLUMN stripe_subscription_id TEXT;

ALTER TABLE subscription_contract_acceptances ADD COLUMN contract_snapshot_json TEXT;
ALTER TABLE subscription_contract_acceptances ADD COLUMN accepted_locale TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_founder_slots_user ON founder_slots(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_contract ON subscriptions(contract_acceptance_id);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS billing_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subscription_id TEXT,
  type TEXT NOT NULL,
  scheduled_for TEXT,
  sent_at TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, subscription_id, type, scheduled_for)
);

CREATE INDEX IF NOT EXISTS idx_billing_notifications_user ON billing_notifications(user_id, read_at, scheduled_for);
