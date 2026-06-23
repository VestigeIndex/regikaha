-- Moderación de imágenes de portfolio (cola de aprobación, sin coste/IA).
-- Las imágenes nuevas quedan 'pending' y NO se muestran públicamente hasta que
-- un admin las aprueba. Los items ya existentes se conservan como 'approved'.

ALTER TABLE portfolio_items ADD COLUMN moderation_status TEXT NOT NULL DEFAULT 'pending';
UPDATE portfolio_items SET moderation_status = 'approved' WHERE created_at < datetime('now');
CREATE INDEX IF NOT EXISTS idx_portfolio_moderation ON portfolio_items(moderation_status);
