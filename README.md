# The Board

A visual whiteboard dashboard for your second monitor/TV. Hand-drawn marker aesthetic with projects, tasks, and notepads.

## Features

- **Projects** - Left side with status lights (green=active, red=inactive)
- **Tasks** - Clean organized list
- **Dump** - Sticky note brain dump area
- **Notepads** - Legal pad checklists that overlay the board (max 3 pinned)
- **Mobile view** - `/mobile` for phone access
- **MCP Integration** - Control via Claude chat

## URLs

- Dashboard: https://the-board.micaiah-tasks.workers.dev
- Mobile: https://the-board.micaiah-tasks.workers.dev/mobile

## Setup

1. Create D1 database: `wrangler d1 create the-board-db`
2. Update `database_id` in wrangler.toml
3. Run migration: `wrangler d1 execute the-board-db --remote --file=./migrations/0001_initial.sql`
4. Deploy: `wrangler deploy`

## API Endpoints

- `GET /api/board` - Full board state
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `POST /api/projects/:id/activate` - Turn light green
- `POST /api/projects/:id/deactivate` - Turn light red
- `POST /api/tasks/clean` - Add clean task
- `POST /api/tasks/messy` - Add to dump
- `DELETE /api/item/:id` - Delete any item by badge number
- And more for notepads...