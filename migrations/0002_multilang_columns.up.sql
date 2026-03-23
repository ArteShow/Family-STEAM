-- Add multilingual title and description columns (if they don't exist)
-- This migration is idempotent since 0001_init.up.sql already creates these columns
ALTER TABLE calendar
    ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS title_de TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS title_ru TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description_de TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description_ru TEXT NOT NULL DEFAULT '';

-- Only copy data if old columns exist (for backward compatibility with older schemas)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='calendar' AND column_name='title') THEN
        UPDATE calendar
        SET title_en = title,
            description_en = description
        WHERE title_en = '';
        
        ALTER TABLE calendar
            DROP COLUMN IF EXISTS title,
            DROP COLUMN IF EXISTS description;
    END IF;
END $$;
