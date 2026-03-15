-- Add multilingual title and description columns
ALTER TABLE calendar
    ADD COLUMN IF NOT EXISTS title_en TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS title_de TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS title_ru TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description_en TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description_de TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description_ru TEXT NOT NULL DEFAULT '';

-- Copy existing single-language data into the English columns
UPDATE calendar
SET title_en = title,
    description_en = description
WHERE title_en = '';

-- Drop the old single-language columns
ALTER TABLE calendar
    DROP COLUMN IF EXISTS title,
    DROP COLUMN IF EXISTS description;
