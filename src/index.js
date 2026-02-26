// The Board - Cloudflare Worker
// API + Frontend served from same worker

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // App icon
    if (path === '/icon.png' || path === '/apple-touch-icon.png') {
      const iconData = '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';
      const binaryData = Uint8Array.from(atob(iconData), c => c.charCodeAt(0));
      return new Response(binaryData, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
      });
    }

    // Mobile view
    if (path === '/mobile') {
      return new Response(MOBILE_HTML, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // API routes
    if (path.startsWith('/api/')) {
      try {
        const result = await handleAPI(request, env, path);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Serve frontend
    return new Response(FRONTEND_HTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};

// Get next global ID
async function getNextId(db) {
  const result = await db.prepare('UPDATE global_counter SET next_id = next_id + 1 WHERE id = 1 RETURNING next_id - 1 as id').first();
  return result.id;
}

// API handler
async function handleAPI(request, env, path) {
  const db = env.DB;
  const method = request.method;

  // GET /api/board - Full board state
  if (path === '/api/board' && method === 'GET') {
    const projects = await db.prepare('SELECT * FROM projects ORDER BY sort_order, id').all();
    const cleanTasks = await db.prepare('SELECT * FROM clean_tasks ORDER BY sort_order, id').all();
    const messyTasks = await db.prepare('SELECT * FROM messy_tasks ORDER BY created_at DESC').all();
    const notepads = await db.prepare('SELECT * FROM notepads ORDER BY id').all();
    const notepadItems = await db.prepare('SELECT * FROM notepad_items ORDER BY notepad_id, sort_order, id').all();
    const pinnedNotepads = await db.prepare('SELECT * FROM pinned_notepads ORDER BY position').all();

    // Attach items to notepads
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
    };
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

  // POST /api/tasks/messy - Create messy task (brain dump)
  if (path === '/api/tasks/messy' && method === 'POST') {
    const body = await request.json();
    const id = await getNextId(db);
    
    await db.prepare('INSERT INTO messy_tasks (id, text) VALUES (?, ?)').bind(id, body.text).run();
    return { id, text: body.text, success: true };
  }

  // POST /api/tasks/messy/:id/to-clean - Promote messy to clean
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

  // POST /api/tasks/messy/:id/to-notepad/:notepadId - Move messy to notepad
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

  // PATCH /api/notepads/:id - Update notepad
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

  // POST /api/notepads/:id/items - Add item to notepad
  const notepadItemsMatch = path.match(/^\/api\/notepads\/(\d+)\/items$/);
  if (notepadItemsMatch && method === 'POST') {
    const notepadId = parseInt(notepadItemsMatch[1]);
    const body = await request.json();
    const id = await getNextId(db);
    const maxSort = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM notepad_items WHERE notepad_id = ?').bind(notepadId).first();

    await db.prepare('INSERT INTO notepad_items (id, notepad_id, text, sort_order) VALUES (?, ?, ?, ?)').bind(id, notepadId, body.text, maxSort.next).run();
    return { id, notepadId, text: body.text, success: true };
  }

  // PATCH /api/notepads/:id/items/:itemId - Update notepad item
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

  // POST /api/notepads/:id/pin - Pin notepad to board
  const pinMatch = path.match(/^\/api\/notepads\/(\d+)\/pin$/);
  if (pinMatch && method === 'POST') {
    const notepadId = parseInt(pinMatch[1]);
    
    // Check if already pinned
    const existing = await db.prepare('SELECT * FROM pinned_notepads WHERE notepad_id = ?').bind(notepadId).first();
    if (existing) return { notepadId, position: existing.position, alreadyPinned: true, success: true };

    // Find next available position (max 3)
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

  // POST /api/notepads/:id/unpin - Unpin notepad from board
  const unpinMatch = path.match(/^\/api\/notepads\/(\d+)\/unpin$/);
  if (unpinMatch && method === 'POST') {
    const notepadId = parseInt(unpinMatch[1]);
    await db.prepare('DELETE FROM pinned_notepads WHERE notepad_id = ?').bind(notepadId).run();
    return { notepadId, success: true };
  }

  // DELETE /api/item/:id - Delete any item by its badge number
  const deleteAnyMatch = path.match(/^\/api\/item\/(\d+)$/);
  if (deleteAnyMatch && method === 'DELETE') {
    const id = parseInt(deleteAnyMatch[1]);
    
    // Try deleting from each table
    let deleted = false;
    const tables = ['projects', 'clean_tasks', 'messy_tasks', 'notepads', 'notepad_items'];
    
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

// Embedded Frontend HTML
const FRONTEND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Board</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Permanent+Marker&family=Architects+Daughter&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; }
    body { font-family: 'Caveat', cursive; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { box-shadow: 0 0 20px #22c55e; } 50% { box-shadow: 0 0 30px #22c55e, 0 0 40px #22c55e; } }
    .item-enter { animation: fadeIn 0.3s ease-out; }
    .light-active { animation: pulse 2s ease-in-out infinite; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    const API_BASE = '';

    // Number badge component
    const NumberBadge = ({ number, size = 'normal' }) => {
      const sizeClasses = {
        tiny: { width: 22, height: 22, fontSize: 11, border: 2 },
        small: { width: 28, height: 28, fontSize: 14, border: 2 },
        normal: { width: 36, height: 36, fontSize: 18, border: 3 },
        large: { width: 44, height: 44, fontSize: 22, border: 3 }
      };
      const s = sizeClasses[size];
      
      return (
        <div style={{
          width: s.width, height: s.height, backgroundColor: '#FFD60A',
          border: \`\${s.border}px solid #1a1a1a\`, borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Permanent Marker', cursive", fontSize: s.fontSize,
          color: '#1a1a1a', fontWeight: 'bold', flexShrink: 0,
          boxShadow: '2px 2px 0 rgba(0,0,0,0.3)'
        }}>{number}</div>
      );
    };

    // Status light component
    const StatusLight = ({ active, size = 'normal' }) => {
      const s = size === 'small' ? 32 : 48;
      const b = size === 'small' ? 3 : 4;
      return (
        <div className={active ? 'light-active' : ''} style={{
          width: s, height: s, borderRadius: '50%',
          backgroundColor: active ? '#22c55e' : '#ef4444',
          border: \`\${b}px solid #374151\`,
          boxShadow: active 
            ? '0 0 20px #22c55e, inset 0 -8px 16px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.3)' 
            : '0 0 12px #ef4444, inset 0 -8px 16px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.2)',
          position: 'relative', flexShrink: 0
        }}>
          <div style={{
            position: 'absolute', top: size === 'small' ? 4 : 6, left: size === 'small' ? 7 : 10,
            width: size === 'small' ? 8 : 12, height: size === 'small' ? 5 : 8,
            borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)'
          }} />
        </div>
      );
    };

    // Project card
    const ProjectCard = ({ project, scale }) => {
      const titleSize = scale > 0.7 ? 32 : scale > 0.5 ? 26 : 20;
      const statusSize = scale > 0.7 ? 20 : scale > 0.5 ? 17 : 14;
      const padding = scale > 0.7 ? 24 : scale > 0.5 ? 16 : 12;
      const badgeSize = scale > 0.7 ? 'large' : scale > 0.5 ? 'normal' : 'small';
      const lightSize = scale > 0.5 ? 'normal' : 'small';
      
      return (
        <div className="item-enter" style={{
          backgroundColor: 'rgba(255,255,255,0.85)', border: '3px solid #374151',
          borderRadius: 8, padding, display: 'flex', flexDirection: 'column',
          gap: scale > 0.5 ? 12 : 8, boxShadow: '4px 4px 0 rgba(0,0,0,0.15)',
          flex: 1, minHeight: 0, overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: scale > 0.5 ? 16 : 10 }}>
            <NumberBadge number={project.id} size={badgeSize} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontFamily: "'Permanent Marker', cursive", fontSize: titleSize,
                color: '#1a1a1a', marginBottom: 2, letterSpacing: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>{project.name}</h2>
              <div style={{ height: 3, backgroundColor: '#1a1a1a', borderRadius: 2 }} />
            </div>
            <StatusLight active={project.active} size={lightSize} />
          </div>
          <p style={{
            fontFamily: "'Architects Daughter', cursive", fontSize: statusSize,
            color: '#374151', lineHeight: 1.4, paddingLeft: scale > 0.5 ? 52 : 38,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: scale > 0.7 ? 4 : scale > 0.5 ? 3 : 2, WebkitBoxOrient: 'vertical'
          }}>{project.status_notes}</p>
        </div>
      );
    };

    // Clean task
    const CleanTask = ({ task, scale, onDelete }) => {
      const fontSize = scale > 0.7 ? 18 : scale > 0.5 ? 15 : 13;
      const padding = scale > 0.7 ? '12px 16px' : scale > 0.5 ? '8px 12px' : '6px 10px';
      const badgeSize = scale > 0.7 ? 'small' : 'tiny';
      
      return (
        <div className="item-enter" style={{
          display: 'flex', alignItems: 'center', gap: scale > 0.5 ? 12 : 8,
          padding, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 6,
          border: '2px solid #9ca3af', flex: 1, minHeight: 0, position: 'relative'
        }}>
          <NumberBadge number={task.id} size={badgeSize} />
          <span style={{
            fontFamily: "'Architects Daughter', cursive", fontSize,
            color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
          }}>{task.text}</span>
          <button onClick={() => onDelete(task.id, task.text)} style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', color: 'white',
            border: 'none', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.6, flexShrink: 0
          }}>✕</button>
        </div>
      );
    };

    // Messy task
    const MessyTask = ({ task, index, scale, onDelete, onExpand }) => {
      const rotation = useMemo(() => (Math.random() - 0.5) * 12, []);
      const colors = ['#fef08a', '#fde68a', '#fcd34d', '#fbbf24'];
      const bgColor = useMemo(() => colors[index % colors.length], [index]);
      const fontSize = scale > 0.6 ? 16 : scale > 0.4 ? 13 : 11;
      const padding = scale > 0.6 ? '10px 12px' : scale > 0.4 ? '7px 9px' : '5px 7px';
      const badgeSize = scale > 0.6 ? 'small' : 'tiny';
      
      return (
        <div className="item-enter" onClick={() => onExpand(task)} style={{
          backgroundColor: bgColor, padding, borderRadius: 2,
          boxShadow: '3px 3px 8px rgba(0,0,0,0.25)', transform: \`rotate(\${rotation}deg)\`,
          display: 'flex', flexDirection: 'column', gap: scale > 0.5 ? 6 : 4,
          flex: '1 1 auto', minWidth: scale > 0.6 ? 90 : scale > 0.4 ? 70 : 55,
          maxWidth: scale > 0.6 ? 150 : scale > 0.4 ? 120 : 95,
          position: 'relative', cursor: 'pointer'
        }}>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} style={{
            position: 'absolute', top: -6, right: -6,
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)', color: 'white',
            border: 'none', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.7, transition: 'opacity 0.2s'
          }}>✕</button>
          <NumberBadge number={task.id} size={badgeSize} />
          <span style={{
            fontFamily: "'Caveat', cursive", fontSize, color: '#1a1a1a',
            fontWeight: 500, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: scale > 0.5 ? 3 : 2, WebkitBoxOrient: 'vertical'
          }}>{task.text}</span>
        </div>
      );
    };

    // Notepad
    const Notepad = ({ notepad, style }) => (
      <div style={{
        backgroundColor: '#fef9c3', borderRadius: 4,
        boxShadow: '6px 6px 20px rgba(0,0,0,0.35), 0 0 0 2px #d4a017',
        display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', ...style
      }}>
        <div style={{ position: 'absolute', left: 48, top: 0, bottom: 0, width: 2, backgroundColor: '#f87171' }} />
        <div style={{
          position: 'absolute', top: -8, left: '30%', width: 60, height: 24,
          backgroundColor: 'rgba(200, 180, 150, 0.6)', transform: 'rotate(-2deg)', borderRadius: 2
        }} />
        <div style={{
          position: 'absolute', top: -6, right: '25%', width: 50, height: 22,
          backgroundColor: 'rgba(200, 180, 150, 0.5)', transform: 'rotate(3deg)', borderRadius: 2
        }} />
        <div style={{
          padding: '20px 20px 16px 60px', borderBottom: '2px solid #d4a017',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <NumberBadge number={notepad.id} />
          <h3 style={{
            fontFamily: "'Permanent Marker', cursive", fontSize: 26, color: '#1a1a1a',
            textDecoration: 'underline', textUnderlineOffset: 4
          }}>{notepad.title}</h3>
        </div>
        <div style={{ padding: '16px 20px 20px 60px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {notepad.items?.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 22, height: 22, border: '2px solid #1a1a1a', borderRadius: 3,
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2
              }}>
                {item.done ? <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 18, color: '#16a34a' }}>✓</span> : null}
              </div>
              <span style={{
                fontFamily: "'Architects Daughter', cursive", fontSize: 19,
                color: item.done ? '#6b7280' : '#1a1a1a',
                textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4
              }}>{item.text}</span>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', top: 80, left: 0, right: 0, bottom: 0,
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #bfdbfe 31px, #bfdbfe 32px)',
          pointerEvents: 'none', opacity: 0.5
        }} />
      </div>
    );

    // Empty state
    const EmptyState = () => (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', color: '#9ca3af', fontFamily: "'Architects Daughter', cursive", fontSize: 24
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <div>The Board is empty</div>
        <div style={{ fontSize: 18, marginTop: 8 }}>Add projects and tasks to get started</div>
      </div>
    );

    // Main Whiteboard
    const Whiteboard = () => {
      const [data, setData] = useState(null);
      const [error, setError] = useState(null);
      const [expandedTask, setExpandedTask] = useState(null);
      const [confirmDelete, setConfirmDelete] = useState(null);

      const fetchBoard = async () => {
        try {
          const res = await fetch(API_BASE + '/api/board');
          const json = await res.json();
          setData(json);
          setError(null);
        } catch (e) {
          setError(e.message);
        }
      };

      const deleteItem = async (id) => {
        await fetch(API_BASE + '/api/item/' + id, { method: 'DELETE' });
        fetchBoard();
      };

      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
      };

      useEffect(() => {
        fetchBoard();
        const interval = setInterval(fetchBoard, 5000);
        return () => clearInterval(interval);
      }, []);

      if (!data) {
        return (
          <div style={{
            width: '100vw', height: '100vh', backgroundColor: '#f5f5f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Permanent Marker', cursive", fontSize: 32, color: '#6b7280'
          }}>Loading The Board...</div>
        );
      }

      const pinnedNotepads = data.notepads?.filter(n => data.pinnedNotepads?.includes(n.id)) || [];
      const notepadCount = pinnedNotepads.length;

      const projectScale = Math.max(0.3, 1 - ((data.projects?.length || 1) - 1) * 0.15);
      const cleanTaskScale = Math.max(0.3, 1 - ((data.cleanTasks?.length || 1) - 1) * 0.1);
      const messyTaskScale = Math.max(0.3, 1 - ((data.messyTasks?.length || 1) - 1) * 0.06);

      const isEmpty = !data.projects?.length && !data.cleanTasks?.length && !data.messyTasks?.length;

      return (
        <div style={{
          width: '100vw', height: '100vh', backgroundColor: '#f5f5f0',
          backgroundImage: \`
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 200, 150, 0.08) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")
          \`, display: 'flex', position: 'relative', padding: 20, gap: 20
        }}>
          {isEmpty ? <EmptyState /> : (
            <>
              {/* Projects */}
              <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                <div style={{
                  fontFamily: "'Permanent Marker', cursive", fontSize: 28, color: '#6b7280',
                  paddingLeft: 8, opacity: 0.7, flexShrink: 0
                }}>PROJECTS</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                  {data.projects?.map(project => (
                    <ProjectCard key={project.id} project={project} scale={projectScale} />
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div style={{ flex: '0 0 50%', display: 'flex', gap: 16, minHeight: 0 }}>
                {/* Clean */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                  <div style={{
                    fontFamily: "'Permanent Marker', cursive", fontSize: 24, color: '#6b7280',
                    paddingLeft: 8, opacity: 0.7, flexShrink: 0
                  }}>TASKS</div>
                  <div style={{
                    flex: 1, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 8,
                    border: '2px dashed #d1d5db', padding: 12, display: 'flex',
                    flexDirection: 'column', gap: 8, minHeight: 0
                  }}>
                    {data.cleanTasks?.map(task => (
                      <CleanTask key={task.id} task={task} scale={cleanTaskScale} onDelete={(id, text) => setConfirmDelete({ id, text })} />
                    ))}
                  </div>
                </div>

                {/* Messy */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                  <div style={{
                    fontFamily: "'Permanent Marker', cursive", fontSize: 24, color: '#6b7280',
                    paddingLeft: 8, opacity: 0.7, flexShrink: 0
                  }}>DUMP</div>
                  <div style={{
                    flex: 1, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 8,
                    border: '2px dashed #9ca3af', padding: 12, display: 'flex',
                    flexWrap: 'wrap', gap: 10, alignContent: 'flex-start', minHeight: 0, overflow: 'hidden'
                  }}>
                    {data.messyTasks?.map((task, i) => (
                      <MessyTask key={task.id} task={task} index={i} scale={messyTaskScale} onDelete={deleteItem} onExpand={setExpandedTask} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notepads overlay */}
          {notepadCount > 0 && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 32, padding: 40, zIndex: 100
            }}>
              {pinnedNotepads.map((notepad, index) => (
                <Notepad key={notepad.id} notepad={notepad} style={{
                  width: notepadCount === 1 ? 450 : notepadCount === 2 ? 400 : 350,
                  maxHeight: '80vh',
                  transform: notepadCount === 3 
                    ? \`rotate(\${(index - 1) * 2}deg)\` 
                    : notepadCount === 2 ? \`rotate(\${(index - 0.5) * 3}deg)\` : 'rotate(-1deg)'
                }} />
              ))}
            </div>
          )}

          {/* Expanded task modal */}
          {expandedTask && (
            <div onClick={() => setExpandedTask(null)} style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 40
            }}>
              <div onClick={(e) => e.stopPropagation()} style={{
                backgroundColor: '#fef08a', padding: 32, borderRadius: 8,
                boxShadow: '8px 8px 24px rgba(0,0,0,0.4)', maxWidth: 600, width: '100%',
                transform: 'rotate(-1deg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <NumberBadge number={expandedTask.id} size="normal" />
                  <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 20, color: '#6b7280' }}>DUMP ITEM</span>
                </div>
                <div style={{
                  fontFamily: "'Caveat', cursive", fontSize: 28, color: '#1a1a1a',
                  lineHeight: 1.4, marginBottom: 24, whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>{expandedTask.text}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => { copyToClipboard(expandedTask.text); }} style={{
                    padding: '12px 24px', backgroundColor: '#1a1a2e', color: 'white',
                    border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive",
                    fontSize: 16, cursor: 'pointer'
                  }}>📋 Copy</button>
                  <button onClick={() => setExpandedTask(null)} style={{
                    padding: '12px 24px', backgroundColor: 'transparent', color: '#1a1a1a',
                    border: '2px solid #1a1a1a', borderRadius: 6, fontFamily: "'Permanent Marker', cursive",
                    fontSize: 16, cursor: 'pointer'
                  }}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm delete modal */}
          {confirmDelete && (
            <div onClick={() => setConfirmDelete(null)} style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 40
            }}>
              <div onClick={(e) => e.stopPropagation()} style={{
                backgroundColor: 'white', padding: 32, borderRadius: 12,
                boxShadow: '8px 8px 24px rgba(0,0,0,0.4)', maxWidth: 400, width: '100%',
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 24, marginBottom: 16, color: '#ef4444' }}>
                  Delete Task?
                </div>
                <div style={{
                  fontFamily: "'Architects Daughter', cursive", fontSize: 18, color: '#4b5563',
                  marginBottom: 24, lineHeight: 1.4
                }}>"{confirmDelete.text}"</div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={() => setConfirmDelete(null)} style={{
                    padding: '12px 24px', backgroundColor: 'transparent', color: '#1a1a1a',
                    border: '2px solid #d1d5db', borderRadius: 6, fontFamily: "'Permanent Marker', cursive",
                    fontSize: 16, cursor: 'pointer'
                  }}>Cancel</button>
                  <button onClick={() => { deleteItem(confirmDelete.id); setConfirmDelete(null); }} style={{
                    padding: '12px 24px', backgroundColor: '#ef4444', color: 'white',
                    border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive",
                    fontSize: 16, cursor: 'pointer'
                  }}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    ReactDOM.render(<Whiteboard />, document.getElementById('root'));
  </script>
</body>
</html>`;

// Mobile view
const MOBILE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Board">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" href="/icon.png">
  <title>The Board</title>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Permanent+Marker&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f0;
      min-height: 100vh;
      padding-bottom: 80px;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 16px 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header h1 {
      font-family: 'Permanent Marker', cursive;
      color: #FFD60A;
      font-size: 24px;
    }
    .header .refresh {
      background: none;
      border: none;
      color: #FFD60A;
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
    }
    .section {
      padding: 16px;
    }
    .section-title {
      font-family: 'Permanent Marker', cursive;
      font-size: 18px;
      color: #6b7280;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title .count {
      background: #e5e7eb;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 14px;
      font-family: -apple-system, sans-serif;
    }
    .project-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid #ef4444;
    }
    .project-card.active {
      border-left-color: #22c55e;
    }
    .project-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .badge {
      background: #FFD60A;
      color: #1a1a1a;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      flex-shrink: 0;
    }
    .project-name {
      font-family: 'Permanent Marker', cursive;
      font-size: 20px;
      flex: 1;
    }
    .status-light {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 8px #ef4444;
    }
    .status-light.active {
      background: #22c55e;
      box-shadow: 0 0 8px #22c55e;
    }
    .project-notes {
      font-family: 'Caveat', cursive;
      font-size: 18px;
      color: #4b5563;
      line-height: 1.4;
      padding-left: 40px;
    }
    .task-item {
      background: white;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .task-item .badge {
      width: 24px;
      height: 24px;
      font-size: 12px;
    }
    .task-text {
      flex: 1;
      font-size: 16px;
      color: #1a1a1a;
    }
    .task-delete {
      background: none;
      border: none;
      color: #9ca3af;
      font-size: 18px;
      padding: 4px 8px;
      cursor: pointer;
    }
    .messy-item {
      background: #fef08a;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 8px;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.15);
      transform: rotate(-0.5deg);
    }
    .messy-item:nth-child(even) {
      background: #fde68a;
      transform: rotate(0.5deg);
    }
    .messy-header {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .messy-header .badge {
      width: 22px;
      height: 22px;
      font-size: 11px;
    }
    .messy-text {
      flex: 1;
      font-family: 'Caveat', cursive;
      font-size: 18px;
      font-weight: 500;
      color: #1a1a1a;
    }
    .messy-delete {
      background: none;
      border: none;
      color: #92400e;
      font-size: 16px;
      padding: 2px 6px;
      cursor: pointer;
      opacity: 0.6;
    }
    .notepad-card {
      background: #fef9c3;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 3px solid #f87171;
    }
    .notepad-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #fcd34d;
    }
    .notepad-title {
      font-family: 'Permanent Marker', cursive;
      font-size: 18px;
      flex: 1;
    }
    .notepad-pin {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
    }
    .notepad-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 6px 0;
    }
    .notepad-check {
      width: 20px;
      height: 20px;
      border: 2px solid #1a1a1a;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      cursor: pointer;
      background: white;
    }
    .notepad-check.done {
      color: #16a34a;
      font-weight: bold;
    }
    .notepad-item-text {
      font-family: 'Caveat', cursive;
      font-size: 17px;
      flex: 1;
    }
    .notepad-item-text.done {
      text-decoration: line-through;
      color: #6b7280;
    }
    .fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #FFD60A;
      border: none;
      font-size: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: pointer;
      z-index: 200;
    }
    .fab:active {
      transform: scale(0.95);
    }
    .empty {
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
    }
    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    .tabs {
      display: flex;
      background: white;
      border-radius: 8px;
      margin: 16px;
      padding: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    .tab {
      flex: 1;
      padding: 10px;
      border: none;
      background: none;
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      border-radius: 6px;
    }
    .tab.active {
      background: #FFD60A;
      color: #1a1a1a;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 THE BOARD</h1>
    <button class="refresh" onclick="loadData()">↻</button>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="showTab('projects')">Projects</button>
    <button class="tab" onclick="showTab('tasks')">Tasks</button>
    <button class="tab" onclick="showTab('dump')">Dump</button>
    <button class="tab" onclick="showTab('notepads')">Pads</button>
  </div>

  <div id="content">
    <div class="loading">Loading...</div>
  </div>

  <button class="fab" onclick="openQuickAdd()">+</button>

  <div id="quickAddModal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:300;padding:20px;display:none;flex-direction:column;justify-content:center;">
    <div style="background:white;border-radius:16px;padding:20px;max-width:400px;margin:0 auto;width:100%;">
      <textarea id="quickInput" placeholder="What's on your mind?" style="width:100%;height:100px;padding:12px;font-size:16px;border:2px solid #e5e7eb;border-radius:8px;resize:none;font-family:inherit;"></textarea>
      <div style="display:flex;gap:12px;margin-top:12px;">
        <button onclick="closeQuickAdd()" style="flex:1;padding:12px;border:2px solid #e5e7eb;background:white;border-radius:8px;font-size:16px;cursor:pointer;">Cancel</button>
        <button onclick="submitQuickAdd()" style="flex:1;padding:12px;border:none;background:#FFD60A;border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer;">Add</button>
      </div>
    </div>
  </div>

  <script>
    let data = null;
    let activeTab = 'projects';

    function openQuickAdd() {
      document.getElementById('quickAddModal').style.display = 'flex';
      document.getElementById('quickInput').focus();
    }

    function closeQuickAdd() {
      document.getElementById('quickAddModal').style.display = 'none';
      document.getElementById('quickInput').value = '';
    }

    async function submitQuickAdd() {
      const text = document.getElementById('quickInput').value.trim();
      if (!text) return;
      
      await fetch('/api/tasks/messy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      closeQuickAdd();
      loadData();
    }

    async function loadData() {
      try {
        const res = await fetch('/api/board');
        data = await res.json();
        render();
      } catch (e) {
        document.getElementById('content').innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div>Failed to load</div>';
      }
    }

    function showTab(tab) {
      activeTab = tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.tab[onclick*="' + tab + '"]').classList.add('active');
      render();
    }

    function render() {
      if (!data) return;
      const content = document.getElementById('content');

      if (activeTab === 'projects') {
        if (!data.projects?.length) {
          content.innerHTML = '<div class="empty"><div class="empty-icon">📁</div>No projects yet</div>';
          return;
        }
        content.innerHTML = '<div class="section">' + data.projects.map(p => 
          '<div class="project-card ' + (p.active ? 'active' : '') + '">' +
            '<div class="project-header">' +
              '<div class="badge">' + p.id + '</div>' +
              '<div class="project-name">' + p.name + '</div>' +
              '<div class="status-light ' + (p.active ? 'active' : '') + '"></div>' +
            '</div>' +
            (p.status_notes ? '<div class="project-notes">' + p.status_notes + '</div>' : '') +
          '</div>'
        ).join('') + '</div>';
      }

      else if (activeTab === 'tasks') {
        if (!data.cleanTasks?.length) {
          content.innerHTML = '<div class="empty"><div class="empty-icon">✓</div>No tasks yet</div>';
          return;
        }
        content.innerHTML = '<div class="section"><div class="section-title">Tasks <span class="count">' + data.cleanTasks.length + '</span></div>' + 
          data.cleanTasks.map(t => 
            '<div class="task-item">' +
              '<div class="badge">' + t.id + '</div>' +
              '<div class="task-text">' + t.text + '</div>' +
              '<button class="task-delete" onclick="deleteItem(' + t.id + ')">✕</button>' +
            '</div>'
          ).join('') + '</div>';
      }

      else if (activeTab === 'dump') {
        if (!data.messyTasks?.length) {
          content.innerHTML = '<div class="empty"><div class="empty-icon">🗑️</div>Dump is empty<br><small>Tap + to add</small></div>';
          return;
        }
        content.innerHTML = '<div class="section"><div class="section-title">Dump <span class="count">' + data.messyTasks.length + '</span></div>' + 
          data.messyTasks.map(t => 
            '<div class="messy-item">' +
              '<div class="messy-header">' +
                '<div class="badge">' + t.id + '</div>' +
                '<div class="messy-text">' + t.text + '</div>' +
                '<button class="messy-delete" onclick="deleteItem(' + t.id + ')">✕</button>' +
              '</div>' +
            '</div>'
          ).join('') + '</div>';
      }

      else if (activeTab === 'notepads') {
        if (!data.notepads?.length) {
          content.innerHTML = '<div class="empty"><div class="empty-icon">📝</div>No notepads yet</div>';
          return;
        }
        content.innerHTML = '<div class="section">' + data.notepads.map(n => {
          const isPinned = data.pinnedNotepads?.includes(n.id);
          return '<div class="notepad-card">' +
            '<div class="notepad-header">' +
              '<div class="badge">' + n.id + '</div>' +
              '<div class="notepad-title">' + n.title + '</div>' +
              '<button class="notepad-pin" onclick="togglePin(' + n.id + ', ' + isPinned + ')">' + (isPinned ? '📌' : '📍') + '</button>' +
            '</div>' +
            (n.items?.map(item => 
              '<div class="notepad-item">' +
                '<div class="notepad-check ' + (item.done ? 'done' : '') + '" onclick="toggleCheck(' + n.id + ', ' + item.id + ', ' + item.done + ')">' + (item.done ? '✓' : '') + '</div>' +
                '<div class="notepad-item-text ' + (item.done ? 'done' : '') + '">' + item.text + '</div>' +
              '</div>'
            ).join('') || '<div style="color:#9ca3af;font-style:italic;padding:8px 0;">Empty notepad</div>') +
          '</div>';
        }).join('') + '</div>';
      }
    }

    async function deleteItem(id) {
      if (!confirm('Delete this item?')) return;
      await fetch('/api/item/' + id, { method: 'DELETE' });
      loadData();
    }

    async function togglePin(id, isPinned) {
      await fetch('/api/notepads/' + id + '/' + (isPinned ? 'unpin' : 'pin'), { method: 'POST' });
      loadData();
    }

    async function toggleCheck(notepadId, itemId, isDone) {
      await fetch('/api/notepads/' + notepadId + '/items/' + itemId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !isDone })
      });
      loadData();
    }

    // Initial load
    loadData();

    // Auto-refresh every 30 seconds
    setInterval(loadData, 30000);
  </script>
</body>
</html>`;