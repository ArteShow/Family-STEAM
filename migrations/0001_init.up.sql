CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    price INT NOT NULL,
    tag TEXT NOT NULL,
    image_ids TEXT[] NOT NULL,
    amount INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibility TEXT,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    duration TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_files_calendar
        FOREIGN KEY (parent_id)
        REFERENCES calendar(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    calendar_id TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    paid BOOLEAN NOT NULL,
    birthday DATE,
    age INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_clients_calendar
        FOREIGN KEY (calendar_id)
        REFERENCES calendar(id)
        ON DELETE CASCADE
);
