// Mobile view for The Board

export const MOBILE_HTML = `<!DOCTYPE html>
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
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Permanent+Marker&family=Architects+Daughter&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f0; min-height: 100vh; padding-bottom: 80px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 16px 20px; position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; }
    .header h1 { font-family: 'Permanent Marker', cursive; color: #FFD60A; font-size: 24px; }
    .header .refresh { background: none; border: none; color: #FFD60A; font-size: 20px; cursor: pointer; padding: 8px; }
    .section { padding: 16px; }
    .section-title { font-family: 'Permanent Marker', cursive; font-size: 18px; color: #6b7280; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
    .section-title .count { background: #e5e7eb; padding: 2px 8px; border-radius: 12px; font-size: 14px; font-family: -apple-system, sans-serif; }
    .project-card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #ef4444; }
    .project-card.active { border-left-color: #22c55e; }
    .project-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .badge { background: #FFD60A; color: #1a1a1a; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
    .badge.small { width: 22px; height: 22px; font-size: 11px; }
    .project-name { font-family: 'Permanent Marker', cursive; font-size: 20px; flex: 1; }
    .status-light { width: 16px; height: 16px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444; }
    .status-light.active { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
    .project-notes { font-family: 'Caveat', cursive; font-size: 18px; color: #4b5563; line-height: 1.4; padding-left: 40px; }
    .task-item { background: white; border-radius: 10px; padding: 12px 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .task-item .badge { width: 24px; height: 24px; font-size: 12px; }
    .task-text { flex: 1; font-size: 16px; color: #1a1a1a; }
    .task-delete { background: none; border: none; color: #9ca3af; font-size: 18px; padding: 4px 8px; cursor: pointer; }
    .messy-item { background: #fef08a; border-radius: 4px; padding: 12px; margin-bottom: 8px; box-shadow: 2px 2px 6px rgba(0,0,0,0.15); transform: rotate(-0.5deg); }
    .messy-item:nth-child(even) { background: #fde68a; transform: rotate(0.5deg); }
    .messy-header { display: flex; align-items: flex-start; gap: 8px; }
    .messy-header .badge { width: 22px; height: 22px; font-size: 11px; }
    .messy-text { flex: 1; font-family: 'Caveat', cursive; font-size: 18px; font-weight: 500; color: #1a1a1a; }
    .messy-delete { background: none; border: none; color: #92400e; font-size: 16px; padding: 2px 6px; cursor: pointer; opacity: 0.6; }
    .notepad-card { background: #fef9c3; border-radius: 8px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 3px solid #f87171; }
    .notepad-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #fcd34d; }
    .notepad-title { font-family: 'Permanent Marker', cursive; font-size: 18px; flex: 1; }
    .notepad-pin { background: none; border: none; font-size: 18px; cursor: pointer; }
    .notepad-item { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; }
    .notepad-check { width: 20px; height: 20px; border: 2px solid #1a1a1a; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; background: white; }
    .notepad-check.done { color: #16a34a; font-weight: bold; }
    .notepad-item-text { font-family: 'Caveat', cursive; font-size: 17px; flex: 1; }
    .notepad-item-text.done { text-decoration: line-through; color: #6b7280; }
    .checkin-card { background: white; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .checkin-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
    .checkin-time { font-size: 12px; color: #9ca3af; }
    .checkin-project { background: #FFD60A; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .checkin-summary { font-family: 'Architects Daughter', cursive; font-size: 15px; color: #374151; line-height: 1.4; }
    .fab { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: #FFD60A; border: none; font-size: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; z-index: 200; }
    .fab:active { transform: scale(0.95); }
    .alice-fab { position: fixed; bottom: 20px; left: 20px; width: 50px; height: 50px; border-radius: 50%; background: #FFD60A; border: 3px solid #1a1a1a; padding: 0; cursor: pointer; z-index: 200; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .alice-fab img { width: 100%; height: 100%; object-fit: cover; }
    .empty { text-align: center; padding: 40px 20px; color: #9ca3af; }
    .empty-icon { font-size: 48px; margin-bottom: 12px; }
    .tabs { display: flex; background: white; border-radius: 8px; margin: 16px; padding: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .tab { flex: 1; padding: 10px 6px; border: none; background: none; font-size: 12px; font-weight: 600; color: #6b7280; cursor: pointer; border-radius: 6px; }
    .tab.active { background: #FFD60A; color: #1a1a1a; }
    .loading { text-align: center; padding: 60px 20px; color: #6b7280; }
    .alice-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 400; flex-direction: column; }
    .alice-chat { flex: 1; display: flex; flex-direction: column; background: #fef9c3; }
    .alice-header { padding: 16px; background: #FFD60A; display: flex; align-items: center; gap: 12px; }
    .alice-avatar { width: 44px; height: 44px; border-radius: 50%; border: 2px solid #1a1a1a; overflow: hidden; }
    .alice-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .alice-name { font-family: 'Permanent Marker', cursive; font-size: 22px; flex: 1; }
    .alice-close { background: none; border: none; font-size: 24px; cursor: pointer; padding: 8px; }
    .alice-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .alice-msg { max-width: 85%; padding: 12px 16px; border-radius: 12px; font-family: 'Architects Daughter', cursive; font-size: 16px; line-height: 1.4; }
    .alice-msg.user { align-self: flex-end; background: #1a1a1a; color: #FFD60A; }
    .alice-msg.assistant { align-self: flex-start; background: white; border: 2px solid #1a1a1a; }
    .alice-msg.typing { color: #6b7280; font-style: italic; }
    .alice-input-area { padding: 12px; background: #FFD60A; display: flex; gap: 10px; }
    .alice-input { flex: 1; padding: 12px 16px; border: 2px solid #1a1a1a; border-radius: 8px; font-size: 16px; background: white; }
    .alice-send { padding: 12px 20px; background: #1a1a1a; color: #FFD60A; border: none; border-radius: 8px; font-family: 'Permanent Marker', cursive; font-size: 16px; cursor: pointer; }
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
    <button class="tab" onclick="showTab('progress')">Progress</button>
  </div>

  <div id="content"><div class="loading">Loading...</div></div>

  <button class="alice-fab" onclick="openAlice()">
    <img src="https://res.cloudinary.com/dxzw1zwez/image/upload/v1772644026/alice_profile_kpamkm.jpg" alt="Alice">
  </button>

  <button class="fab" onclick="openQuickAdd()">+</button>

  <div id="quickAddModal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:300;padding:20px;flex-direction:column;justify-content:center;">
    <div style="background:white;border-radius:16px;padding:20px;max-width:400px;margin:0 auto;width:100%;">
      <textarea id="quickInput" placeholder="What's on your mind?" style="width:100%;height:100px;padding:12px;font-size:16px;border:2px solid #e5e7eb;border-radius:8px;resize:none;font-family:inherit;"></textarea>
      <div style="display:flex;gap:12px;margin-top:12px;">
        <button onclick="closeQuickAdd()" style="flex:1;padding:12px;border:2px solid #e5e7eb;background:white;border-radius:8px;font-size:16px;cursor:pointer;">Cancel</button>
        <button onclick="submitQuickAdd()" style="flex:1;padding:12px;border:none;background:#FFD60A;border-radius:8px;font-size:16px;font-weight:bold;cursor:pointer;">Add</button>
      </div>
    </div>
  </div>

  <div id="aliceModal" class="alice-modal">
    <div class="alice-chat">
      <div class="alice-header">
        <div class="alice-avatar">
          <img src="https://res.cloudinary.com/dxzw1zwez/image/upload/v1772644026/alice_profile_kpamkm.jpg" alt="Alice">
        </div>
        <div class="alice-name">Alice</div>
        <button class="alice-close" onclick="closeAlice()">✕</button>
      </div>
      <div class="alice-messages" id="aliceMessages">
        <div class="alice-msg assistant">Hey. What do you need?</div>
      </div>
      <div class="alice-input-area">
        <input type="text" class="alice-input" id="aliceInput" placeholder="Talk to Alice..." onkeydown="handleAliceKey(event)">
        <button class="alice-send" onclick="sendAlice()">Send</button>
      </div>
    </div>
  </div>

  <script>
    let data = null;
    let activeTab = 'projects';
    let aliceMessages = [{ role: 'assistant', content: 'Hey. What do you need?' }];
    let aliceLoading = false;

    function timeAgo(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return minutes + 'm ago';
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return hours + 'h ago';
      const days = Math.floor(hours / 24);
      if (days < 7) return days + 'd ago';
      return date.toLocaleDateString();
    }

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
      await fetch('/api/tasks/messy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      closeQuickAdd();
      loadData();
    }

    function openAlice() {
      document.getElementById('aliceModal').style.display = 'flex';
      document.getElementById('aliceInput').focus();
      scrollAlice();
    }

    function closeAlice() {
      document.getElementById('aliceModal').style.display = 'none';
    }

    function handleAliceKey(e) {
      if (e.key === 'Enter') sendAlice();
    }

    function scrollAlice() {
      const msgs = document.getElementById('aliceMessages');
      msgs.scrollTop = msgs.scrollHeight;
    }

    function renderAliceMessages() {
      const container = document.getElementById('aliceMessages');
      let html = '';
      for (let i = 0; i < aliceMessages.length; i++) {
        const m = aliceMessages[i];
        html += '<div class="alice-msg ' + m.role + '">' + m.content + '</div>';
      }
      if (aliceLoading) {
        html += '<div class="alice-msg assistant typing">typing...</div>';
      }
      container.innerHTML = html;
      scrollAlice();
    }

    function buildAliceContext() {
      let projects = 'None';
      let tasks = 'None';
      let dump = 'None';
      let checkins = 'None';
      
      if (data && data.projects && data.projects.length) {
        projects = data.projects.map(function(p) {
          return '[' + p.id + '] ' + p.name + ' (' + (p.active ? 'ACTIVE' : 'inactive') + ')' + (p.status_notes ? ': ' + p.status_notes : '');
        }).join('\n');
      }
      if (data && data.cleanTasks && data.cleanTasks.length) {
        tasks = data.cleanTasks.map(function(t) { return '[' + t.id + '] ' + t.text; }).join('\n');
      }
      if (data && data.messyTasks && data.messyTasks.length) {
        dump = data.messyTasks.map(function(t) { return '[' + t.id + '] ' + t.text; }).join('\n');
      }
      if (data && data.checkins && data.checkins.length) {
        checkins = data.checkins.map(function(c) { return '[' + c.id + '] ' + c.summary + (c.project_name ? ' (' + c.project_name + ')' : ''); }).join('\n');
      }
      
      return 'You are Alice, a friendly secretary who helps Micaiah think through his work. You have full access to edit the board.\n\nCURRENT BOARD STATE:\n\nPROJECTS:\n' + projects + '\n\nTASKS:\n' + tasks + '\n\nDUMP:\n' + dump + '\n\nRECENT CHECKINS:\n' + checkins + '\n\nPERSONALITY: Be warm but efficient. Keep responses to 1-3 sentences. No emojis. Brief confirmations only.';
    }

    async function sendAlice() {
      const input = document.getElementById('aliceInput');
      const text = input.value.trim();
      if (!text || aliceLoading) return;
      
      input.value = '';
      aliceMessages.push({ role: 'user', content: text });
      aliceLoading = true;
      renderAliceMessages();

      try {
        const apiMessages = [];
        for (let i = 1; i < aliceMessages.length; i++) {
          apiMessages.push({ role: aliceMessages[i].role, content: aliceMessages[i].content });
        }
        
        const res = await fetch('/api/alice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: buildAliceContext(),
            messages: apiMessages
          })
        });
        const respData = await res.json();
        let reply = "Sorry, couldn't process that.";
        if (respData.content) {
          const textParts = [];
          for (let i = 0; i < respData.content.length; i++) {
            if (respData.content[i].type === 'text') {
              textParts.push(respData.content[i].text);
            }
          }
          if (textParts.length) reply = textParts.join('\n');
        }
        aliceMessages.push({ role: 'assistant', content: reply });
        loadData();
      } catch (e) {
        aliceMessages.push({ role: 'assistant', content: 'Hmm, trouble connecting. Try again?' });
      }
      aliceLoading = false;
      renderAliceMessages();
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
      document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelector('.tab[onclick*="' + tab + '"]').classList.add('active');
      render();
    }

    function render() {
      if (!data) return;
      const content = document.getElementById('content');

      if (activeTab === 'projects') {
        if (!data.projects || !data.projects.length) { content.innerHTML = '<div class="empty"><div class="empty-icon">📁</div>No projects yet</div>'; return; }
        content.innerHTML = '<div class="section">' + data.projects.map(function(p) {
          return '<div class="project-card ' + (p.active ? 'active' : '') + '"><div class="project-header"><div class="badge">' + p.id + '</div><div class="project-name">' + p.name + '</div><div class="status-light ' + (p.active ? 'active' : '') + '"></div></div>' + (p.status_notes ? '<div class="project-notes">' + p.status_notes + '</div>' : '') + '</div>';
        }).join('') + '</div>';
      }
      else if (activeTab === 'tasks') {
        if (!data.cleanTasks || !data.cleanTasks.length) { content.innerHTML = '<div class="empty"><div class="empty-icon">✓</div>No tasks yet</div>'; return; }
        content.innerHTML = '<div class="section"><div class="section-title">Tasks <span class="count">' + data.cleanTasks.length + '</span></div>' + data.cleanTasks.map(function(t) {
          return '<div class="task-item"><div class="badge">' + t.id + '</div><div class="task-text">' + t.text + '</div><button class="task-delete" onclick="deleteItem(' + t.id + ')">✕</button></div>';
        }).join('') + '</div>';
      }
      else if (activeTab === 'dump') {
        if (!data.messyTasks || !data.messyTasks.length) { content.innerHTML = '<div class="empty"><div class="empty-icon">🗑️</div>Dump is empty<br><small>Tap + to add</small></div>'; return; }
        content.innerHTML = '<div class="section"><div class="section-title">Dump <span class="count">' + data.messyTasks.length + '</span></div>' + data.messyTasks.map(function(t) {
          return '<div class="messy-item"><div class="messy-header"><div class="badge">' + t.id + '</div><div class="messy-text">' + t.text + '</div><button class="messy-delete" onclick="deleteItem(' + t.id + ')">✕</button></div></div>';
        }).join('') + '</div>';
      }
      else if (activeTab === 'notepads') {
        if (!data.notepads || !data.notepads.length) { content.innerHTML = '<div class="empty"><div class="empty-icon">📝</div>No notepads yet</div>'; return; }
        content.innerHTML = '<div class="section">' + data.notepads.map(function(n) {
          const isPinned = data.pinnedNotepads && data.pinnedNotepads.indexOf(n.id) >= 0;
          let itemsHtml = '';
          if (n.items && n.items.length) {
            itemsHtml = n.items.map(function(item) {
              return '<div class="notepad-item"><div class="notepad-check ' + (item.done ? 'done' : '') + '" onclick="toggleCheck(' + n.id + ', ' + item.id + ', ' + item.done + ')">' + (item.done ? '✓' : '') + '</div><div class="notepad-item-text ' + (item.done ? 'done' : '') + '">' + item.text + '</div></div>';
            }).join('');
          } else {
            itemsHtml = '<div style="color:#9ca3af;font-style:italic;padding:8px 0;">Empty notepad</div>';
          }
          return '<div class="notepad-card"><div class="notepad-header"><div class="badge">' + n.id + '</div><div class="notepad-title">' + n.title + '</div><button class="notepad-pin" onclick="togglePin(' + n.id + ', ' + isPinned + ')">' + (isPinned ? '📌' : '📍') + '</button></div>' + itemsHtml + '</div>';
        }).join('') + '</div>';
      }
      else if (activeTab === 'progress') {
        if (!data.checkins || !data.checkins.length) { content.innerHTML = '<div class="empty"><div class="empty-icon">📊</div>No checkins yet</div>'; return; }
        content.innerHTML = '<div class="section"><div class="section-title">Progress <span class="count">' + data.checkins.length + '</span></div>' + data.checkins.map(function(c) {
          return '<div class="checkin-card"><div class="checkin-header"><div class="badge small">' + c.id + '</div><div class="checkin-time">' + timeAgo(c.created_at) + '</div>' + (c.project_name ? '<span class="checkin-project">' + c.project_name + '</span>' : '') + '</div><div class="checkin-summary">' + c.summary + '</div></div>';
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
      await fetch('/api/notepads/' + notepadId + '/items/' + itemId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done: !isDone }) });
      loadData();
    }

    loadData();
    setInterval(loadData, 30000);
  </script>
</body>
</html>`;
