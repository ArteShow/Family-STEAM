CREATE TABLE IF NOT EXISTS reviews (
    id          TEXT PRIMARY KEY,
    calendar_id TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    username    TEXT NOT NULL,
    avatar_url  TEXT NOT NULL DEFAULT '',
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, calendar_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_calendar_id ON reviews(calendar_id);
