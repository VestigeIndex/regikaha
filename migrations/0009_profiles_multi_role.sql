-- Regi Kaha — perfiles multi-rol.
-- Antes: profiles.user_id era UNIQUE, así que un usuario solo podía tener UN perfil
-- no-profesional (cliente O empresa O subcontrata). me.ts ya está escrito para multi-rol.
-- Ahora: la unicidad pasa a ser (user_id, role) -> un perfil por rol y usuario.
-- Reconstrucción de tabla (SQLite no permite alterar constraints in-place). Conserva datos.

CREATE TABLE profiles_new (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
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
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, role)
);

INSERT INTO profiles_new
  (id,user_id,role,status,display_name,contact_name,phone,country,region,city,place_id,place_slug,latitude,longitude,description,email_verified,onboarding_completed,subscription_status,commercial_access_status,created_at,updated_at)
  SELECT id,user_id,role,status,display_name,contact_name,phone,country,region,city,place_id,place_slug,latitude,longitude,description,email_verified,onboarding_completed,subscription_status,commercial_access_status,created_at,updated_at
  FROM profiles;

DROP TABLE profiles;
ALTER TABLE profiles_new RENAME TO profiles;

-- UNIQUE(user_id, role) ya crea el índice de búsqueda por usuario+rol.
CREATE INDEX idx_profiles_geo ON profiles(country, city);
