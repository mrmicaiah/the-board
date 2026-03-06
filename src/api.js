// API handlers for The Board

// Get next global ID
async function getNextId(db) {
  const result = await db.prepare('UPDATE global_counter SET next_id = next_id + 1 WHERE id = 1 RETURNING next_id - 1 as id').first();
  return result.id;
}

// Alice's tools definition
const ALICE_TOOLS = [
  {
    name: "add_task",
    description: "Add a task to the clean task list",
    input_schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "The task text" }
      },
      required: ["text"]
    }
  },
  {
    name: "add_dump",
    description: "Add an item to the messy dump (brain dump area)",
    input_schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "The dump item text" }
      },
      required: ["text"]
    }
  },
  {
    name: "add_project",
    description: "Add a new project to the board",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Project name" },
        status_notes: { type: "string", description: "Optional status notes" },
        active: { type: "boolean", description: "Whether the project is active (green light)" }
      },
      required: ["name"]
    }
  },
  {
    name: "update_project",
    description: "Update a project's status notes or active state",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Project badge number" },
        status_notes: { type: "string", description: "New status notes" },
        active: { type: "boolean", description: "Set active (green) or inactive (red)" }
      },
      required: ["id"]
    }
  },
  {
    name: "delete_item",
    description: "Delete any item from the board by its badge number",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Badge number of item to delete" }
      },
      required: ["id"]
    }
  },
  {
    name: "create_notepad",
    description: "Create a new notepad",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Notepad title" }
      },
      required: ["title"]
    }
  },
  {
    name: "add_notepad_item",
    description: "Add an item to a notepad",
    input_schema: {
      type: "object",
      properties: {
        notepad_id: { type: "number", description: "Notepad badge number" },
        text: { type: "string", description: "Item text" }
      },
      required: ["notepad_id", "text"]
    }
  },
  {
    name: "check_notepad_item",
    description: "Mark a notepad item as done or undone",
    input_schema: {
      type: "object",
      properties: {
        notepad_id: { type: "number", description: "Notepad badge number" },
        item_id: { type: "number", description: "Item badge number" },
        done: { type: "boolean", description: "Mark as done (true) or undone (false)" }
      },
      required: ["notepad_id", "item_id", "done"]
    }
  },
  {
    name: "pin_notepad",
    description: "Pin a notepad to display on the board (max 3)",
    input_schema: {
      type: "object",
      properties: {
        notepad_id: { type: "number", description: "Notepad badge number to pin" }
      },
      required: ["notepad_id"]
    }
  },
  {
    name: "unpin_notepad",
    description: "Unpin a notepad from the board display",
    input_schema: {
      type: "object",
      properties: {
        notepad_id: { type: "number", description: "Notepad badge number to unpin" }
      },
      required: ["notepad_id"]
    }
  },
  {
    name: "move_dump_to_tasks",
    description: "Move an item from the dump to the clean task list",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Badge number of dump item to promote" }
      },
      required: ["id"]
    }
  },
  {
    name: "add_checkin",
    description: "Log a progress update or work session recap",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Short recap, ~280 chars, casual/fun tone" },
        details: { type: "string", description: "Optional longer notes in markdown" },
        project_id: { type: "number", description: "Optional project badge number to link to" }
      },
      required: ["summary"]
    }
  }
];

// Execute Alice's tool calls
async function executeAliceTool(db, toolName, toolInput) {
  switch (toolName) {
    case "add_task": {
      const id = await getNextId(db);
      const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM clean_tasks').first();
      await db.prepare('INSERT INTO clean_tasks (id, text, sort_order) VALUES (?, ?, ?)').bind(id, toolInput.text, maxSort.next).run();
      return { success: true, id, message: `Added task [${id}]: ${toolInput.text}` };
    }
    case "add_dump": {
      const id = await getNextId(db);
      await db.prepare('INSERT INTO messy_tasks (id, text) VALUES (?, ?)').bind(id, toolInput.text).run();
      return { success: true, id, message: `Added to dump [${id}]: ${toolInput.text}` };
    }
    case "add_project": {
      const id = await getNextId(db);
      const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM projects').first();
      await db.prepare('INSERT INTO projects (id, name, status_notes, active, sort_order) VALUES (?, ?, ?, ?, ?)')
        .bind(id, toolInput.name, toolInput.status_notes || '', toolInput.active ? 1 : 0, maxSort.next).run();
      return { success: true, id, message: `Added project [${id}]: ${toolInput.name}` };
    }
    case "update_project": {
      const updates = [];
      const values = [];
      if (toolInput.status_notes !== undefined) { updates.push('status_notes = ?'); values.push(toolInput.status_notes); }
      if (toolInput.active !== undefined) { updates.push('active = ?'); values.push(toolInput.active ? 1 : 0); }
      if (updates.length > 0) {
        updates.push("updated_at = datetime('now')");
        values.push(toolInput.id);
        await db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
      }
      return { success: true, id: toolInput.id, message: `Updated project [${toolInput.id}]` };
    }
    case "delete_item": {
      const tables = ['projects', 'clean_tasks', 'messy_tasks', 'notepads', 'notepad_items', 'checkins'];
      for (const table of tables) {
        const result = await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(toolInput.id).run();
        if (result.meta.changes > 0) {
          return { success: true, id: toolInput.id, message: `Deleted item [${toolInput.id}]` };
        }
      }
      return { success: false, message: `Item [${toolInput.id}] not found` };
    }
    case "create_notepad": {
      const id = await getNextId(db);
      await db.prepare('INSERT INTO notepads (id, title) VALUES (?, ?)').bind(id, toolInput.title).run();
      return { success: true, id, message: `Created notepad [${id}]: ${toolInput.title}` };
    }
    case "add_notepad_item": {
      const id = await getNextId(db);
      const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM notepad_items WHERE notepad_id = ?').bind(toolInput.notepad_id).first();
      await db.prepare('INSERT INTO notepad_items (id, notepad_id, text, sort_order) VALUES (?, ?, ?, ?)').bind(id, toolInput.notepad_id, toolInput.text, maxSort.next).run();
      return { success: true, id, message: `Added item [${id}] to notepad [${toolInput.notepad_id}]` };
    }
    case "check_notepad_item": {
      await db.prepare('UPDATE notepad_items SET done = ? WHERE id = ? AND notepad_id = ?').bind(toolInput.done ? 1 : 0, toolInput.item_id, toolInput.notepad_id).run();
      return { success: true, message: `Marked item [${toolInput.item_id}] as ${toolInput.done ? 'done' : 'undone'}` };
    }
    case "pin_notepad": {
      const existing = await db.prepare('SELECT * FROM pinned_notepads WHERE notepad_id = ?').bind(toolInput.notepad_id).first();
      if (existing) return { success: true, message: `Notepad [${toolInput.notepad_id}] already pinned` };
      const pinned = await db.prepare('SELECT position FROM pinned_notepads ORDER BY position').all();
      const usedPositions = new Set(pinned.results.map(p => p.position));
      let position = null;
      for (let i = 1; i <= 3; i++) {
        if (!usedPositions.has(i)) { position = i; break; }
      }
      if (position === null) return { success: false, message: 'Maximum 3 notepads can be pinned' };
      await db.prepare('INSERT INTO pinned_notepads (notepad_id, position) VALUES (?, ?)').bind(toolInput.notepad_id, position).run();
      return { success: true, message: `Pinned notepad [${toolInput.notepad_id}]` };
    }
    case "unpin_notepad": {
      await db.prepare('DELETE FROM pinned_notepads WHERE notepad_id = ?').bind(toolInput.notepad_id).run();
      return { success: true, message: `Unpinned notepad [${toolInput.notepad_id}]` };
    }
    case "move_dump_to_tasks": {
      const messy = await db.prepare('SELECT * FROM messy_tasks WHERE id = ?').bind(toolInput.id).first();
      if (!messy) return { success: false, message: `Dump item [${toolInput.id}] not found` };
      const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM clean_tasks').first();
      await db.prepare('INSERT INTO clean_tasks (id, text, sort_order) VALUES (?, ?, ?)').bind(toolInput.id, messy.text, maxSort.next).run();
      await db.prepare('DELETE FROM messy_tasks WHERE id = ?').bind(toolInput.id).run();
      return { success: true, id: toolInput.id, message: `Moved [${toolInput.id}] from dump to tasks` };
    }
    case "add_checkin": {
      const id = await getNextId(db);
      await db.prepare('INSERT INTO checkins (id, summary, details, project_id) VALUES (?, ?, ?, ?)')
        .bind(id, toolInput.summary, toolInput.details || null, toolInput.project_id || null).run();
      return { success: true, id, message: `Logged checkin [${id}]` };
    }
    default:
      return { success: false, message: `Unknown tool: ${toolName}` };
  }
}

export async function handleAPI(request, env, path) {
  const db = env.DB;
  const method = request.method;

  // POST /api/alice - Proxy to Anthropic API with tools
  if (path === '/api/alice' && method === 'POST') {
    const body = await request.json();
    
    // First call to Claude with tools
    let response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: body.system,
        messages: body.messages,
        tools: ALICE_TOOLS
      })
    });

    let data = await response.json();
    
    // Handle tool use loop
    let messages = [...body.messages];
    while (data.stop_reason === 'tool_use') {
      const assistantMessage = { role: 'assistant', content: data.content };
      messages.push(assistantMessage);
      
      const toolResults = [];
      for (const block of data.content) {
        if (block.type === 'tool_use') {
          const result = await executeAliceTool(db, block.name, block.input);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result)
          });
        }
      }
      
      messages.push({ role: 'user', content: toolResults });
      
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: body.system,
          messages: messages,
          tools: ALICE_TOOLS
        })
      });
      
      data = await response.json();
    }

    return data;
  }

  // GET /api/board - Full board state
  if (path === '/api/board' && method === 'GET') {
    const projects = await db.prepare('SELECT * FROM projects ORDER BY sort_order, id').all();
    const cleanTasks = await db.prepare('SELECT * FROM clean_tasks ORDER BY sort_order, id').all();
    const messyTasks = await db.prepare('SELECT * FROM messy_tasks ORDER BY created_at DESC').all();
    const notepads = await db.prepare('SELECT * FROM notepads ORDER BY id').all();
    const notepadItems = await db.prepare('SELECT * FROM notepad_items ORDER BY notepad_id, sort_order, id').all();
    const pinnedNotepads = await db.prepare('SELECT * FROM pinned_notepads ORDER BY position').all();
    const checkins = await db.prepare('SELECT c.*, p.name as project_name FROM checkins c LEFT JOIN projects p ON c.project_id = p.id ORDER BY c.created_at DESC LIMIT 10').all();

    const notepadsWithItems = notepads.results.map(notepad => ({
      ...notepad,
      items: notepadItems.results.filter(item => item.notepad_id === notepad.id),
    }));

    return {
      projects: projects.results,
      cleanTasks: cleanTasks.results,
      messyTasks: messyTasks.results,
      notepads: notepadsWithItems,
      pinnedNotepads: pinnedNotepads.results.map(p => p.notepad_id),
      checkins: checkins.results,
    };
  }

  // GET /api/checkins - List checkins
  if (path === '/api/checkins' && method === 'GET') {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const checkins = await db.prepare('SELECT c.*, p.name as project_name FROM checkins c LEFT JOIN projects p ON c.project_id = p.id ORDER BY c.created_at DESC LIMIT ?').bind(limit).all();
    return { checkins: checkins.results };
  }

  // POST /api/checkins - Create checkin
  if (path === '/api/checkins' && method === 'POST') {
    const body = await request.json();
    const id = await getNextId(db);
    await db.prepare('INSERT INTO checkins (id, summary, details, project_id) VALUES (?, ?, ?, ?)')
      .bind(id, body.summary, body.details || null, body.project_id || null).run();
    return { id, summary: body.summary, success: true };
  }

  // DELETE /api/checkins/:id
  const deleteCheckinMatch = path.match(/^\/api\/checkins\/(\d+)$/);
  if (deleteCheckinMatch && method === 'DELETE') {
    const id = parseInt(deleteCheckinMatch[1]);
    await db.prepare('DELETE FROM checkins WHERE id = ?').bind(id).run();
    return { id, success: true };
  }

  // POST /api/projects - Create project
  if (path === '/api/projects' && method === 'POST') {
    const body = await request.json();
    const id = await getNextId(db);
    const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM projects').first();
    
    await db.prepare(
      'INSERT INTO projects (id, name, status_notes, active, sort_order) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, body.name, body.status_notes || '', body.active ? 1 : 0, maxSort.next).run();
    
    return { id, name: body.name, success: true };
  }

  // PATCH /api/projects/:id - Update project
  const projectMatch = path.match(/^\/api\/projects\/(\d+)$/);
  if (projectMatch && method === 'PATCH') {
    const id = parseInt(projectMatch[1]);
    const body = await request.json();
    const updates = [];
    const values = [];

    if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }
    if (body.status_notes !== undefined) { updates.push('status_notes = ?'); values.push(body.status_notes); }
    if (body.active !== undefined) { updates.push('active = ?'); values.push(body.active ? 1 : 0); }
    if (body.sort_order !== undefined) { updates.push('sort_order = ?'); values.push(body.sort_order); }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      values.push(id);
      await db.prepare(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
    }

    return { id, success: true };
  }

  // DELETE /api/projects/:id
  if (projectMatch && method === 'DELETE') {
    const id = parseInt(projectMatch[1]);
    await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
    return { id, success: true };
  }

  // POST /api/projects/:id/activate
  const activateMatch = path.match(/^\/api\/projects\/(\d+)\/activate$/);
  if (activateMatch && method === 'POST') {
    const id = parseInt(activateMatch[1]);
    await db.prepare("UPDATE projects SET active = 1, updated_at = datetime('now') WHERE id = ?").bind(id).run();
    return { id, active: true, success: true };
  }

  // POST /api/projects/:id/deactivate
  const deactivateMatch = path.match(/^\/api\/projects\/(\d+)\/deactivate$/);
  if (deactivateMatch && method === 'POST') {
    const id = parseInt(deactivateMatch[1]);
    await db.prepare("UPDATE projects SET active = 0, updated_at = datetime('now') WHERE id = ?").bind(id).run();
    return { id, active: false, success: true };
  }

  // POST /api/tasks/clean - Create clean task
  if (path === '/api/tasks/clean' && method === 'POST') {
    const body = await request.json();
    const id = await getNextId(db);
    const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM clean_tasks').first();
    
    await db.prepare('INSERT INTO clean_tasks (id, text, sort_order) VALUES (?, ?, ?)').bind(id, body.text, maxSort.next).run();
    return { id, text: body.text, success: true };
  }

  // POST /api/tasks/messy - Create messy task
  if (path === '/api/tasks/messy' && method === 'POST') {
    const body = await request.json();
    const id = await getNextId(db);
    
    await db.prepare('INSERT INTO messy_tasks (id, text) VALUES (?, ?)').bind(id, body.text).run();
    return { id, text: body.text, success: true };
  }

  // POST /api/tasks/messy/:id/to-clean
  const toCleanMatch = path.match(/^\/api\/tasks\/messy\/(\d+)\/to-clean$/);
  if (toCleanMatch && method === 'POST') {
    const id = parseInt(toCleanMatch[1]);
    const messy = await db.prepare('SELECT * FROM messy_tasks WHERE id = ?').bind(id).first();
    
    if (!messy) return { error: 'Task not found', success: false };

    const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM clean_tasks').first();
    await db.prepare('INSERT INTO clean_tasks (id, text, sort_order) VALUES (?, ?, ?)').bind(id, messy.text, maxSort.next).run();
    await db.prepare('DELETE FROM messy_tasks WHERE id = ?').bind(id).run();

    return { id, promoted: true, success: true };
  }

  // POST /api/tasks/messy/:id/to-notepad/:notepadId
  const toNotepadMatch = path.match(/^\/api\/tasks\/messy\/(\d+)\/to-notepad\/(\d+)$/);
  if (toNotepadMatch && method === 'POST') {
    const taskId = parseInt(toNotepadMatch[1]);
    const notepadId = parseInt(toNotepadMatch[2]);
    
    const messy = await db.prepare('SELECT * FROM messy_tasks WHERE id = ?').bind(taskId).first();
    if (!messy) return { error: 'Task not found', success: false };

    const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM notepad_items WHERE notepad_id = ?').bind(notepadId).first();
    await db.prepare('INSERT INTO notepad_items (id, notepad_id, text, sort_order) VALUES (?, ?, ?, ?)').bind(taskId, notepadId, messy.text, maxSort.next).run();
    await db.prepare('DELETE FROM messy_tasks WHERE id = ?').bind(taskId).run();

    return { id: taskId, notepadId, success: true };
  }

  // DELETE /api/tasks/clean/:id
  const deleteCleanMatch = path.match(/^\/api\/tasks\/clean\/(\d+)$/);
  if (deleteCleanMatch && method === 'DELETE') {
    const id = parseInt(deleteCleanMatch[1]);
    await db.prepare('DELETE FROM clean_tasks WHERE id = ?').bind(id).run();
    return { id, success: true };
  }

  // DELETE /api/tasks/messy/:id
  const deleteMessyMatch = path.match(/^\/api\/tasks\/messy\/(\d+)$/);
  if (deleteMessyMatch && method === 'DELETE') {
    const id = parseInt(deleteMessyMatch[1]);
    await db.prepare('DELETE FROM messy_tasks WHERE id = ?').bind(id).run();
    return { id, success: true };
  }

  // POST /api/notepads - Create notepad
  if (path === '/api/notepads' && method === 'POST') {
    const body = await request.json();
    const id = await getNextId(db);
    
    await db.prepare('INSERT INTO notepads (id, title, project_id) VALUES (?, ?, ?)').bind(id, body.title, body.project_id || null).run();
    return { id, title: body.title, success: true };
  }

  // PATCH /api/notepads/:id
  const notepadMatch = path.match(/^\/api\/notepads\/(\d+)$/);
  if (notepadMatch && method === 'PATCH') {
    const id = parseInt(notepadMatch[1]);
    const body = await request.json();
    
    if (body.title !== undefined) {
      await db.prepare('UPDATE notepads SET title = ? WHERE id = ?').bind(body.title, id).run();
    }
    if (body.project_id !== undefined) {
      await db.prepare('UPDATE notepads SET project_id = ? WHERE id = ?').bind(body.project_id, id).run();
    }

    return { id, success: true };
  }

  // DELETE /api/notepads/:id
  if (notepadMatch && method === 'DELETE') {
    const id = parseInt(notepadMatch[1]);
    await db.prepare('DELETE FROM notepads WHERE id = ?').bind(id).run();
    return { id, success: true };
  }

  // POST /api/notepads/:id/items
  const notepadItemsMatch = path.match(/^\/api\/notepads\/(\d+)\/items$/);
  if (notepadItemsMatch && method === 'POST') {
    const notepadId = parseInt(notepadItemsMatch[1]);
    const body = await request.json();
    const id = await getNextId(db);
    const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM notepad_items WHERE notepad_id = ?').bind(notepadId).first();

    await db.prepare('INSERT INTO notepad_items (id, notepad_id, text, sort_order) VALUES (?, ?, ?, ?)').bind(id, notepadId, body.text, maxSort.next).run();
    return { id, notepadId, text: body.text, success: true };
  }

  // PATCH /api/notepads/:id/items/:itemId
  const notepadItemMatch = path.match(/^\/api\/notepads\/(\d+)\/items\/(\d+)$/);
  if (notepadItemMatch && method === 'PATCH') {
    const notepadId = parseInt(notepadItemMatch[1]);
    const itemId = parseInt(notepadItemMatch[2]);
    const body = await request.json();

    if (body.text !== undefined) {
      await db.prepare('UPDATE notepad_items SET text = ? WHERE id = ? AND notepad_id = ?').bind(body.text, itemId, notepadId).run();
    }
    if (body.done !== undefined) {
      await db.prepare('UPDATE notepad_items SET done = ? WHERE id = ? AND notepad_id = ?').bind(body.done ? 1 : 0, itemId, notepadId).run();
    }

    return { id: itemId, success: true };
  }

  // DELETE /api/notepads/:id/items/:itemId
  if (notepadItemMatch && method === 'DELETE') {
    const itemId = parseInt(notepadItemMatch[2]);
    await db.prepare('DELETE FROM notepad_items WHERE id = ?').bind(itemId).run();
    return { id: itemId, success: true };
  }

  // POST /api/notepads/:id/pin
  const pinMatch = path.match(/^\/api\/notepads\/(\d+)\/pin$/);
  if (pinMatch && method === 'POST') {
    const notepadId = parseInt(pinMatch[1]);
    
    const existing = await db.prepare('SELECT * FROM pinned_notepads WHERE notepad_id = ?').bind(notepadId).first();
    if (existing) return { notepadId, position: existing.position, alreadyPinned: true, success: true };

    const pinned = await db.prepare('SELECT position FROM pinned_notepads ORDER BY position').all();
    const usedPositions = new Set(pinned.results.map(p => p.position));
    
    let position = null;
    for (let i = 1; i <= 3; i++) {
      if (!usedPositions.has(i)) { position = i; break; }
    }

    if (position === null) return { error: 'Maximum 3 notepads can be pinned', success: false };

    await db.prepare('INSERT INTO pinned_notepads (notepad_id, position) VALUES (?, ?)').bind(notepadId, position).run();
    return { notepadId, position, success: true };
  }

  // POST /api/notepads/:id/unpin
  const unpinMatch = path.match(/^\/api\/notepads\/(\d+)\/unpin$/);
  if (unpinMatch && method === 'POST') {
    const notepadId = parseInt(unpinMatch[1]);
    await db.prepare('DELETE FROM pinned_notepads WHERE notepad_id = ?').bind(notepadId).run();
    return { notepadId, success: true };
  }

  // DELETE /api/item/:id - Delete any item by badge number
  const deleteAnyMatch = path.match(/^\/api\/item\/(\d+)$/);
  if (deleteAnyMatch && method === 'DELETE') {
    const id = parseInt(deleteAnyMatch[1]);
    
    let deleted = false;
    const tables = ['projects', 'clean_tasks', 'messy_tasks', 'notepads', 'notepad_items', 'checkins'];
    
    for (const table of tables) {
      const result = await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
      if (result.meta.changes > 0) {
        deleted = true;
        break;
      }
    }

    return { id, deleted, success: deleted };
  }

  return { error: 'Not found', success: false };
}
