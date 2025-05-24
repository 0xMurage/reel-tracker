-- migrate:up
CREATE TABLE media
(
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    type          TEXT NOT NULL CHECK (type IN ('movie', 'series')),
    year          INTEGER,
    public_rating REAL,
    cover_art     TEXT,
    description   TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE media;