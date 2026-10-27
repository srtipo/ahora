export const SCHEMA = `
CREATE TABLE IF NOT EXISTS now_tasks (
  id           TEXT    PRIMARY KEY NOT NULL CHECK (length(id) > 0),
  name         TEXT    NOT NULL CHECK (length(trim(name)) > 0),
  status       TEXT    NOT NULL CHECK (status IN ('todo', 'inProgress', 'done')),
  marked       BOOLEAN NOT NULL DEFAULT 0 CHECK (marked IN (0, 1)),
  created_at   INTEGER NOT NULL,
  completed_at INTEGER
);

CREATE TABLE IF NOT EXISTS stack_task (
  id         TEXT    PRIMARY KEY NOT NULL CHECK (length(id) > 0),
  name       TEXT    NOT NULL CHECK (length(trim(name)) > 0),
  marked     BOOLEAN NOT NULL DEFAULT 0 CHECK (marked IN (0, 1)),
  created_at INTEGER NOT NULL
);
`;
