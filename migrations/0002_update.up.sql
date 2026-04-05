-- Add multilingual fields to calendar table
-- Rename existing title/description to _en variants and add de/ru
ALTER TABLE calendar RENAME COLUMN title TO title_en;
ALTER TABLE calendar RENAME COLUMN description TO description_en;
ALTER TABLE calendar ADD COLUMN IF NOT EXISTS title_de TEXT NOT NULL DEFAULT '';
ALTER TABLE calendar ADD COLUMN IF NOT EXISTS title_ru TEXT NOT NULL DEFAULT '';
ALTER TABLE calendar ADD COLUMN IF NOT EXISTS description_de TEXT NOT NULL DEFAULT '';
ALTER TABLE calendar ADD COLUMN IF NOT EXISTS description_ru TEXT NOT NULL DEFAULT '';

-- Ensure tickets table exists (created in 0001 if schema was fresh;
-- safe to run idempotently via CREATE TABLE IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT '',
    username TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    admin_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add user fields to tickets table (idempotent)
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS username TEXT NOT NULL DEFAULT '';
