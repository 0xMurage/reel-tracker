-- migrate:up
CREATE UNIQUE INDEX idx_media_title_type ON media(title, type);

-- migrate:down
DROP INDEX idx_media_title_type;
