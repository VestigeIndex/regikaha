-- Regi Kaha — campos de perfil profesional adicionales.
-- Aditivo: solo añade columnas nuevas, no borra ni modifica datos existentes.
-- service_area_note: nota libre de cobertura ("toda la provincia de Madrid y alrededores").
-- docs_declared: el profesional declara disponer de documentación profesional al día.

ALTER TABLE professionals ADD COLUMN service_area_note TEXT;
ALTER TABLE professionals ADD COLUMN docs_declared INTEGER NOT NULL DEFAULT 0;
