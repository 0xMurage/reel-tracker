-- migrate:up
CREATE TABLE user_media
(
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id             INTEGER NOT NULL,
    personal_rating      INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 10),
    status               TEXT    NOT NULL DEFAULT 'to_watch' CHECK (status IN ('to_watch', 'watching', 'completed', 'dropped')),
    last_watched_season  INTEGER,
    last_watched_episode INTEGER,
    rewatch_count        INTEGER          DEFAULT 0,
    notes                TEXT,
    watched_at           DATETIME,
    updated_at           DATETIME         DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
);

-- migrate:down
DROP TABLE user_media;