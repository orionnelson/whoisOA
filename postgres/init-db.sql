CREATE TABLE IF NOT EXISTS cache (
  key VARCHAR PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at);

CREATE OR REPLACE FUNCTION delete_expired_cache_entries()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM cache WHERE expires_at <= NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;