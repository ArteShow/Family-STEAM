-- Migration 0006: Adapt reviews table for star-rating user reviews

-- 1. Add rating column with a permissive default for existing rows
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INTEGER NOT NULL DEFAULT 0;

-- 2. Add check constraint (allow 0 for back-compat with existing admin rows)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'reviews_rating_check'
    ) THEN
        ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 0 AND rating <= 5);
    END IF;
END $$;

-- 3. Rename avatar -> avatar_url (only if the old column still exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reviews' AND column_name = 'avatar'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reviews' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE reviews RENAME COLUMN avatar TO avatar_url;
    END IF;
END $$;

-- 4. Drop old admin-only columns that are no longer needed
ALTER TABLE reviews DROP COLUMN IF EXISTS is_admin;
ALTER TABLE reviews DROP COLUMN IF EXISTS admin_name;
