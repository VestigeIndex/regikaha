# Backend Schema

The current release is local-first. The following D1 model is the intended server contract, not an applied migration.

```sql
CREATE TABLE b1l_organisations (id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, name TEXT NOT NULL, country TEXT NOT NULL, currency TEXT NOT NULL, default_tax_rate REAL NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE b1l_members (organisation_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, PRIMARY KEY (organisation_id, user_id));
CREATE TABLE b1l_clients (id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL, payload_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE b1l_projects (id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL, client_id TEXT NOT NULL, payload_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE b1l_quotes (id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL, client_id TEXT NOT NULL, project_id TEXT NOT NULL, number TEXT NOT NULL, status TEXT NOT NULL, payload_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE b1l_documents (id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL, project_id TEXT NOT NULL, verification_code TEXT NOT NULL UNIQUE, r2_key TEXT, sha256 TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE b1l_audit_events (id TEXT PRIMARY KEY, organisation_id TEXT NOT NULL, actor_user_id TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, action TEXT NOT NULL, payload_json TEXT NOT NULL, created_at TEXT NOT NULL);
```

Every API read and write must authorise organisation membership server-side. Sequential numbers require a D1 transaction or Durable Object coordinator. Photos and generated PDFs belong in private R2 buckets with short-lived signed access.
