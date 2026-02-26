# The Board

A visual whiteboard dashboard for your second monitor. Projects, tasks, and notepads with a hand-drawn marker aesthetic.

## Features

- **Projects** (left side) - Big boxes with status notes and red/green active lights
- **Clean Tasks** (middle-right) - Organized task list
- **Messy Tasks / Dump** (far-right) - Brain dump sticky notes
- **Notepads** - Legal pad style checklists that overlay the board
- **Everything numbered** - Yellow-black badge numbers for easy reference

## Setup

### 1. Create the D1 Database

```bash
wrangler d1 create the-board-db
```

Copy the database_id from the output and update `wrangler.toml`.

### 2. Run Migrations

```bash
wrangler d1 execute the-board-db --file=./migrations/0001_initial.sql
```

### 3. Deploy

```bash
wrangler deploy
```

### 4. Open The Board

Navigate to your worker URL in a browser. For a second monitor/TV setup, run it fullscreen (F11).

## API Endpoints

### Board State
- `GET /api/board` - Full board state

### Projects
- `POST /api/projects` - Create project `{ name, status_notes?, active? }`
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/activate` - Turn light green
- `POST /api/projects/:id/deactivate` - Turn light red

### Tasks
- `POST /api/tasks/clean` - Create clean task `{ text }`
- `POST /api/tasks/messy` - Create messy task (brain dump) `{ text }`
- `POST /api/tasks/messy/:id/to-clean` - Promote to clean tasks
- `POST /api/tasks/messy/:id/to-notepad/:notepadId` - Move to notepad
- `DELETE /api/tasks/clean/:id` - Delete clean task
- `DELETE /api/tasks/messy/:id` - Delete messy task

### Notepads
- `POST /api/notepads` - Create notepad `{ title, project_id? }`
- `PATCH /api/notepads/:id` - Update notepad
- `DELETE /api/notepads/:id` - Delete notepad
- `POST /api/notepads/:id/items` - Add item `{ text }`
- `PATCH /api/notepads/:id/items/:itemId` - Update item `{ text?, done? }`
- `DELETE /api/notepads/:id/items/:itemId` - Delete item
- `POST /api/notepads/:id/pin` - Pin to board (max 3)
- `POST /api/notepads/:id/unpin` - Remove from board

### Universal Delete
- `DELETE /api/item/:id` - Delete any item by its badge number

## MCP Integration

The Board integrates with the productivity MCP server. Commands:

```
board status                    - Show current board
add project "Name"              - Create project
update project 1 "new notes"    - Update status notes
activate 1                      - Turn light green
deactivate 1                    - Turn light red
add task "do something"         - Add to dump
move 5 to clean                 - Promote to clean tasks
move 5 to notepad 3             - Add to notepad
delete 5                        - Delete any item
create notepad "Title"          - New notepad
show notepad 3                  - Pin to board
hide notepad 3                  - Remove from board
notepad 3 add "item"            - Add checklist item
notepad 3 check 7               - Mark item done
list notepads                   - Show all notepads
```

## Local Development

```bash
wrangler dev
```

Open http://localhost:8787
