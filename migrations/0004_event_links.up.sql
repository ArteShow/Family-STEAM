CREATE TABLE IF NOT EXISTS event_links (
    id TEXT PRIMARY KEY,
    calender_entry_id TEXT NOT NULL,
    title_en TEXT NOT NULL DEFAULT '',
    title_de TEXT NOT NULL DEFAULT '',
    title_ru TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL,
    link_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_event_links_calendar
        FOREIGN KEY (calender_entry_id)
        REFERENCES calendar(id)
        ON DELETE CASCADE
);
