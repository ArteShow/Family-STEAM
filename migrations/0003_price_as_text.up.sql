ALTER TABLE calendar
ALTER COLUMN price TYPE TEXT USING price::text;
