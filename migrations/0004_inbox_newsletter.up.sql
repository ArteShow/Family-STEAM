-- ── Inbox / messaging ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
    id            TEXT PRIMARY KEY,
    thread_id     TEXT NOT NULL,
    sender_id     TEXT NOT NULL,
    sender_name   TEXT NOT NULL,
    receiver_id   TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    subject       TEXT NOT NULL DEFAULT '',
    content       TEXT NOT NULL,
    is_read       BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread_id   ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id   ON messages(sender_id);

-- ── Newsletter subscriptions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id            TEXT PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Newsletter campaign history ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id              TEXT PRIMARY KEY,
    subject         TEXT NOT NULL,
    heading         TEXT NOT NULL,
    body            TEXT NOT NULL,
    recipient_count INT  NOT NULL DEFAULT 0,
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
