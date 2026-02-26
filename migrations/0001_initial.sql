-- The Board: Initial Schema
-- Global counter for unique badge numbers across all items

CREATE TABLE global_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    next_id INTEGER NOT NULL DEFAULT 1
);

INSERT INTO global_counter (id, next_id) VALUES (1, 1);

-- Projects (left side of board)
CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    status_notes TEXT DEFAULT '',
    active INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Clean tasks (middle-right, organized list)
CREATE TABLE clean_tasks (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Messy tasks (far-right, brain dump sticky notes)
CREATE TABLE messy_tasks (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Notepads (legal pad style checklists, can attach to projects)
CREATE TABLE notepads (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    project_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Notepad items (checklist items on a notepad)
CREATE TABLE notepad_items (
    id INTEGER PRIMARY KEY,
    notepad_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (notepad_id) REFERENCES notepads(id) ON DELETE CASCADE
);

-- Pinned notepads (which notepads are currently shown on board, max 3)
CREATE TABLE pinned_notepads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notepad_id INTEGER NOT NULL UNIQUE,
    position INTEGER NOT NULL CHECK (position >= 1 AND position <= 3),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (notepad_id) REFERENCES notepads(id) ON DELETE CASCADE
);

-- Indexes for common queries
CREATE INDEX idx_projects_sort ON projects(sort_order);
CREATE INDEX idx_projects_active ON projects(active);
CREATE INDEX idx_clean_tasks_sort ON clean_tasks(sort_order);
CREATE INDEX idx_messy_tasks_created ON messy_tasks(created_at);
CREATE INDEX idx_notepad_items_notepad ON notepad_items(notepad_id, sort_order);
CREATE INDEX idx_notepads_project ON notepads(project_id);