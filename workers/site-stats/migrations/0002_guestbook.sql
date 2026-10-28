-- Guestbook is separate from PV/UV. Review is required before public visibility.
CREATE TABLE IF NOT EXISTS guestbook_messages (
  id TEXT PRIMARY KEY NOT NULL,
  nickname TEXT NOT NULL CHECK (length(nickname) BETWEEN 1 AND 100),
  content TEXT NOT NULL CHECK (length(content) BETWEEN 3 AND 2000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_reply TEXT,
  created_at INTEGER NOT NULL,
  reviewed_at INTEGER
);
CREATE INDEX IF NOT EXISTS guestbook_public_order ON guestbook_messages (status, created_at DESC, id DESC);
