// TV Dashboard Frontend for The Board

export const FRONTEND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>The Board</title>
  
  <!-- PWA Meta Tags -->
  <meta name="application-name" content="The Board">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="The Board">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#1a1a1a">
  
  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- Apple Touch Icons -->
  <link rel="apple-touch-icon" href="/icon-180.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png">
  <link rel="apple-touch-icon" sizes="167x167" href="/icon-167.png">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png">
  
  <!-- Splash Screens for iOS -->
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  
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
    .pin-btn { transition: all 0.15s ease; }
    .pin-btn:hover { transform: scale(1.15); }
    /* iOS safe area padding */
    @supports (padding: env(safe-area-inset-top)) {
      body { 
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      }
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useMemo, useRef } = React;
    const API_BASE = '';
    const ALICE_IMAGE = 'https://res.cloudinary.com/dxzw1zwez/image/upload/v1772644026/alice_profile_kpamkm.jpg';

    // Relative time helper
    const timeAgo = (dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return \`\${minutes}m ago\`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return \`\${hours}h ago\`;
      const days = Math.floor(hours / 24);
      if (days < 7) return \`\${days}d ago\`;
      return date.toLocaleDateString();
    };

    // Check if mobile
    const useIsMobile = () => {
      const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
      useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
      return isMobile;
    };

    // Alice Chat Panel
    const AliceChat = ({ boardData, isOpen, onToggle }) => {
      const [messages, setMessages] = useState([{ role: 'assistant', content: "Hey. What do you need?" }]);
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const messagesEndRef = useRef(null);
      const isMobile = useIsMobile();

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      const buildContext = () => {
        const projects = boardData?.projects?.map(p => \`[\${p.id}] \${p.name} (\${p.active ? 'ACTIVE' : 'inactive'})\${p.status_notes ? ': ' + p.status_notes : ''}\`).join(String.fromCharCode(10)) || 'None';
        const tasks = boardData?.cleanTasks?.map(t => \`[\${t.id}] \${t.text}\`).join(String.fromCharCode(10)) || 'None';
        const dump = boardData?.messyTasks?.map(t => \`[\${t.id}] \${t.text}\`).join(String.fromCharCode(10)) || 'None';
        
        const notepads = boardData?.notepads?.map(n => {
          const items = n.items?.map(i => \`  [\${i.id}] \${i.done ? '[x]' : '[ ]'} \${i.text}\`).join(String.fromCharCode(10)) || '  (empty)';
          const pinned = boardData?.pinnedNotepads?.includes(n.id) ? ' (PINNED)' : '';
          return \`[\${n.id}] \${n.title}\${pinned}\${String.fromCharCode(10)}\${items}\`;
        }).join(String.fromCharCode(10) + String.fromCharCode(10)) || 'None';
        
        const checkins = boardData?.checkins?.map(c => \`[\${c.id}] \${c.summary}\${c.project_name ? ' (' + c.project_name + ')' : ''}\`).join(String.fromCharCode(10)) || 'None';
        
        const pinnedIds = boardData?.pinnedNotepads?.join(', ') || 'None';
        
        return \`You are Alice, a friendly secretary who helps Micaiah think through his work. You have full access to edit the board.

CURRENT BOARD STATE:

PROJECTS:
\${projects}

TASKS (clean list):
\${tasks}

DUMP (messy brain dump):
\${dump}

NOTEPADS:
\${notepads}

RECENT CHECKINS:
\${checkins}

PINNED NOTEPAD IDs: \${pinnedIds}

You can:
- Add/delete tasks, dump items, projects, notepads
- Update project status notes and active/inactive state
- Add items to notepads, check/uncheck them
- Pin/unpin notepads (max 3 pinned)
- Move dump items to the clean task list
- Log checkins (progress updates)

PERSONALITY & GUARDRAILS:
- Be warm but efficient. You're a secretary, not a therapist.
- Keep responses to 1-3 sentences unless explaining something complex.
- Don't ask "Is there anything else?" or "How can I help?" - just wait.
- Don't over-explain what you did. "Done." or "Added." is often enough.
- Don't repeat back information the user just gave you.
- No small talk unless the user initiates it.
- If asked about yourself, keep it brief and redirect to work.
- Never use emojis.
- When you take an action, confirm briefly: "Added to tasks." not "I've successfully added that item to your task list for you!"
- If something is unclear, ask ONE clarifying question, not multiple.
- If flirted with, you can play along briefly with light humor, but keep it classy and steer back to work. You're not opposed to being charming, but you've got things to do.\`;
      };

      const sendMessage = async () => {
        if (!input.trim() || loading) return;
        
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
          const response = await fetch(API_BASE + '/api/alice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system: buildContext(),
              messages: [...messages.slice(1), userMessage].map(m => ({ role: m.role, content: m.content }))
            })
          });

          const data = await response.json();
          const textContent = data.content?.filter(c => c.type === 'text').map(c => c.text).join(String.fromCharCode(10)) || "Sorry, I couldn't process that.";
          const assistantMessage = { role: 'assistant', content: textContent };
          setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
          setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, I had trouble connecting. Try again?" }]);
        }
        setLoading(false);
      };

      if (!isOpen) {
        return (
          <button onClick={onToggle} style={{
            position: 'fixed', 
            left: isMobile ? 16 : 24, 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: isMobile ? 48 : 56, 
            height: isMobile ? 48 : 56, 
            borderRadius: '50%',
            background: '#FFD60A',
            border: '3px solid #1a1a1a',
            padding: 0, cursor: 'pointer',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, overflow: 'hidden'
          }}>
            <img src={ALICE_IMAGE} alt="Alice" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </button>
        );
      }

      // Mobile: full screen panel
      // Desktop: side panel
      const panelStyle = isMobile ? {
        position: 'fixed', 
        left: 0, 
        top: 0, 
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fef9c3',
        borderRadius: 0, 
        border: 'none',
        boxShadow: 'none',
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        zIndex: 300
      } : {
        position: 'fixed', 
        left: 24, 
        top: 24, 
        bottom: 24,
        width: 320, 
        backgroundColor: '#fef9c3',
        borderRadius: 8, 
        border: '3px solid #1a1a1a',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.2)',
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        zIndex: 200
      };

      return (
        <div style={panelStyle}>
          <div style={{
            padding: isMobile ? '16px 20px' : '14px 16px', 
            backgroundColor: '#FFD60A',
            borderBottom: '3px solid #1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
                <img src={ALICE_IMAGE} alt="Alice" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: isMobile ? 24 : 20, color: '#1a1a1a' }}>Alice</span>
            </div>
            <button onClick={onToggle} style={{ background: 'none', border: 'none', color: '#1a1a1a', fontSize: isMobile ? 28 : 22, cursor: 'pointer', fontFamily: "'Permanent Marker', cursive", padding: '4px 8px' }}>✕</button>
          </div>
          
          <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? 16 : 14, display: 'flex', flexDirection: 'column', gap: 10, backgroundColor: '#fef9c3' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: isMobile ? '12px 16px' : '10px 14px', borderRadius: 4,
                backgroundColor: msg.role === 'user' ? '#1a1a1a' : '#fff',
                color: msg.role === 'user' ? '#FFD60A' : '#1a1a1a',
                border: msg.role === 'user' ? 'none' : '2px solid #1a1a1a',
                fontFamily: "'Architects Daughter', cursive", fontSize: isMobile ? 17 : 15, lineHeight: 1.4,
                boxShadow: '2px 2px 0 rgba(0,0,0,0.15)'
              }}>{msg.content}</div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: isMobile ? '12px 16px' : '10px 14px', borderRadius: 4, backgroundColor: '#fff', border: '2px solid #1a1a1a', color: '#6b7280', fontFamily: "'Architects Daughter', cursive", fontStyle: 'italic' }}>typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div style={{ padding: isMobile ? 16 : 12, borderTop: '3px solid #1a1a1a', backgroundColor: '#FFD60A', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Talk to Alice..."
              style={{
                flex: 1, padding: isMobile ? '14px 16px' : '10px 14px', borderRadius: 4, border: '2px solid #1a1a1a',
                fontFamily: "'Architects Daughter', cursive", fontSize: isMobile ? 17 : 15, outline: 'none',
                backgroundColor: '#fff'
              }}
            />
            <button onClick={sendMessage} disabled={loading} style={{
              padding: isMobile ? '14px 20px' : '10px 16px', borderRadius: 4, border: '2px solid #1a1a1a',
              backgroundColor: '#1a1a1a',
              color: '#FFD60A', fontFamily: "'Permanent Marker', cursive", fontSize: isMobile ? 16 : 14, cursor: 'pointer',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
            }}>Send</button>
          </div>
        </div>
      );
    };

    // Checkin card (clickable) - KEPT FOR FUTURE USE
    const CheckinCard = ({ checkin, onExpand }) => (
      <div className="item-enter" onClick={() => onExpand(checkin)} style={{
        backgroundColor: 'rgba(255,255,255,0.9)', border: '2px solid #9ca3af',
        borderRadius: 6, padding: '10px 12px',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.1)', flexShrink: 0,
        cursor: 'pointer', transition: 'transform 0.1s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <NumberBadge number={checkin.id} size="tiny" />
          <span style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 11, color: '#6b7280' }}>
            {timeAgo(checkin.created_at)}
          </span>
          {checkin.project_name && (
            <span style={{
              backgroundColor: '#FFD60A', padding: '2px 6px', borderRadius: 3,
              fontFamily: "'Architects Daughter', cursive", fontSize: 10, color: '#1a1a1a',
              border: '1px solid #1a1a1a'
            }}>{checkin.project_name}</span>
          )}
        </div>
        <p style={{
          fontFamily: "'Architects Daughter', cursive", fontSize: 13,
          color: '#374151', lineHeight: 1.3,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
        }}>{checkin.summary}</p>
      </div>
    );

    // Pin button component
    const PinButton = ({ isPinned, onToggle, disabled }) => (
      <button
        className="pin-btn"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        disabled={disabled}
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          border: isPinned ? '2px solid #d4a017' : '2px solid #9ca3af',
          backgroundColor: isPinned ? '#fef9c3' : 'rgba(255,255,255,0.8)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          opacity: disabled ? 0.5 : 1,
          flexShrink: 0,
          boxShadow: isPinned ? '0 0 8px rgba(212, 160, 23, 0.4)' : 'none'
        }}
        title={isPinned ? 'Unpin notepad' : (disabled ? 'Max 3 pinned' : 'Pin notepad')}
      >
        <span style={{ 
          transform: isPinned ? 'rotate(0deg)' : 'rotate(45deg)',
          transition: 'transform 0.15s ease',
          color: isPinned ? '#d4a017' : '#9ca3af'
        }}>
          📌
        </span>
      </button>
    );

    // Notepad list card (for sidebar)
    const NotepadListCard = ({ notepad, isPinned, onPin, pinnedCount }) => {
      const canPin = pinnedCount < 3 || isPinned;
      
      return (
        <div className="item-enter" style={{
          backgroundColor: isPinned ? '#fef9c3' : 'rgba(255,255,255,0.9)', 
          border: isPinned ? '2px solid #d4a017' : '2px solid #9ca3af',
          borderRadius: 6, padding: '10px 12px',
          boxShadow: isPinned ? '2px 2px 0 rgba(212, 160, 23, 0.3)' : '2px 2px 0 rgba(0,0,0,0.1)', 
          flexShrink: 0,
          transition: 'all 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <NumberBadge number={notepad.id} size="tiny" />
            <span style={{
              fontFamily: "'Permanent Marker', cursive", fontSize: 14,
              color: '#1a1a1a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>{notepad.title}</span>
            <PinButton 
              isPinned={isPinned} 
              onToggle={() => onPin(notepad.id, isPinned)}
              disabled={!canPin}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 30 }}>
            <span style={{
              fontFamily: "'Architects Daughter', cursive", fontSize: 12,
              color: '#6b7280'
            }}>
              {notepad.items?.length || 0} items
            </span>
            {notepad.items?.length > 0 && (
              <span style={{
                fontFamily: "'Architects Daughter', cursive", fontSize: 11,
                color: '#9ca3af'
              }}>
                ({notepad.items.filter(i => i.done).length} done)
              </span>
            )}
          </div>
        </div>
      );
    };

    // Number badge
    const NumberBadge = ({ number, size = 'normal' }) => {
      const sizes = {
        tiny: { width: 22, height: 22, fontSize: 11, border: 2 },
        small: { width: 28, height: 28, fontSize: 14, border: 2 },
        normal: { width: 36, height: 36, fontSize: 18, border: 3 },
        large: { width: 44, height: 44, fontSize: 22, border: 3 }
      };
      const s = sizes[size];
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

    // Status light
    const StatusLight = ({ active, size = 'normal' }) => {
      const s = size === 'small' ? 28 : 40;
      const b = size === 'small' ? 3 : 4;
      return (
        <div className={active ? 'light-active' : ''} style={{
          width: s, height: s, borderRadius: '50%',
          backgroundColor: active ? '#22c55e' : '#ef4444',
          border: \`\${b}px solid #374151\`,
          boxShadow: active 
            ? '0 0 15px #22c55e, inset 0 -6px 12px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.3)' 
            : '0 0 10px #ef4444, inset 0 -6px 12px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.2)',
          position: 'relative', flexShrink: 0
        }}>
          <div style={{
            position: 'absolute', top: size === 'small' ? 3 : 5, left: size === 'small' ? 5 : 8,
            width: size === 'small' ? 6 : 10, height: size === 'small' ? 4 : 6,
            borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)'
          }} />
        </div>
      );
    };

    // Project card
    const ProjectCard = ({ project, scale }) => {
      const titleSize = scale > 0.7 ? 24 : scale > 0.5 ? 20 : 16;
      const statusSize = scale > 0.7 ? 16 : scale > 0.5 ? 14 : 12;
      const padding = scale > 0.7 ? 16 : scale > 0.5 ? 12 : 8;
      const badgeSize = scale > 0.7 ? 'small' : 'tiny';
      const lightSize = 'small';
      
      return (
        <div className="item-enter" style={{
          backgroundColor: 'rgba(255,255,255,0.85)', border: '2px solid #374151',
          borderRadius: 6, padding, display: 'flex', flexDirection: 'column',
          gap: scale > 0.5 ? 8 : 4, boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
          flexShrink: 0, overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NumberBadge number={project.id} size={badgeSize} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontFamily: "'Permanent Marker', cursive", fontSize: titleSize,
                color: '#1a1a1a', letterSpacing: 0.5,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>{project.name}</h2>
            </div>
            <StatusLight active={project.active} size={lightSize} />
          </div>
          {project.status_notes && (
            <p style={{
              fontFamily: "'Architects Daughter', cursive", fontSize: statusSize,
              color: '#374151', lineHeight: 1.3, paddingLeft: 38,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
            }}>{project.status_notes}</p>
          )}
        </div>
      );
    };

    // Clean task
    const CleanTask = ({ task, scale, onDelete }) => {
      const fontSize = scale > 0.7 ? 16 : scale > 0.5 ? 14 : 12;
      const padding = scale > 0.7 ? '10px 14px' : scale > 0.5 ? '8px 10px' : '6px 8px';
      const badgeSize = 'tiny';
      
      return (
        <div className="item-enter" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 5,
          border: '2px solid #9ca3af', flexShrink: 0
        }}>
          <NumberBadge number={task.id} size={badgeSize} />
          <span style={{
            fontFamily: "'Architects Daughter', cursive", fontSize,
            color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
          }}>{task.text}</span>
          <button onClick={() => onDelete(task.id, task.text)} style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'rgba(0,0,0,0.4)', color: 'white',
            border: 'none', fontSize: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.5, flexShrink: 0
          }}>✕</button>
        </div>
      );
    };

    // Messy task (sticky note)
    const MessyTask = ({ task, index, scale, onDelete, onExpand }) => {
      const rotation = useMemo(() => (Math.random() - 0.5) * 10, []);
      const colors = ['#fef08a', '#fde68a', '#fcd34d', '#fbbf24'];
      const bgColor = useMemo(() => colors[index % colors.length], [index]);
      const fontSize = scale > 0.6 ? 14 : scale > 0.4 ? 12 : 10;
      const padding = scale > 0.6 ? '8px 10px' : '6px 8px';
      const badgeSize = 'tiny';
      
      return (
        <div className="item-enter" onClick={() => onExpand(task)} style={{
          backgroundColor: bgColor, padding, borderRadius: 2,
          boxShadow: '2px 2px 6px rgba(0,0,0,0.2)', transform: \`rotate(\${rotation}deg)\`,
          display: 'flex', flexDirection: 'column', gap: 4,
          width: scale > 0.6 ? 120 : scale > 0.4 ? 100 : 80,
          position: 'relative', cursor: 'pointer', flexShrink: 0
        }}>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} style={{
            position: 'absolute', top: -5, right: -5,
            width: 16, height: 16, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', color: 'white',
            border: 'none', fontSize: 9, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.6
          }}>✕</button>
          <NumberBadge number={task.id} size={badgeSize} />
          <span style={{
            fontFamily: "'Caveat', cursive", fontSize, color: '#1a1a1a',
            fontWeight: 500, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
          }}>{task.text}</span>
        </div>
      );
    };

    // Notepad overlay
    const Notepad = ({ notepad, style, onUnpin }) => (
      <div style={{
        backgroundColor: '#fef9c3', borderRadius: 4,
        boxShadow: '6px 6px 20px rgba(0,0,0,0.35), 0 0 0 2px #d4a017',
        display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', ...style
      }}>
        <div style={{ position: 'absolute', left: 48, top: 0, bottom: 0, width: 2, backgroundColor: '#f87171', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: -8, left: '30%', width: 60, height: 24, backgroundColor: 'rgba(200, 180, 150, 0.6)', transform: 'rotate(-2deg)', borderRadius: 2, zIndex: 2 }} />
        <div style={{ position: 'absolute', top: -6, right: '25%', width: 50, height: 22, backgroundColor: 'rgba(200, 180, 150, 0.5)', transform: 'rotate(3deg)', borderRadius: 2, zIndex: 2 }} />
        
        {/* Unpin button on notepad overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); onUnpin(notepad.id); }}
          className="pin-btn"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: 6,
            border: '2px solid #d4a017',
            backgroundColor: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            zIndex: 10,
            boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
          title="Unpin notepad"
        >
          📌
        </button>
        
        <div style={{ padding: '20px 20px 16px 60px', borderBottom: '2px solid #d4a017', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <NumberBadge number={notepad.id} />
          <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 26, color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: 4, paddingRight: 40 }}>{notepad.title}</h3>
        </div>
        <div style={{ padding: '16px 20px 20px 60px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
          {notepad.items?.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 22, height: 22, border: '2px solid #1a1a1a', borderRadius: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, backgroundColor: 'white' }}>
                {item.done ? <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 18, color: '#16a34a' }}>✓</span> : null}
              </div>
              <span style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 19, color: item.done ? '#6b7280' : '#1a1a1a', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>{item.text}</span>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, bottom: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #bfdbfe 31px, #bfdbfe 32px)', pointerEvents: 'none', opacity: 0.5 }} />
      </div>
    );

    // Empty state
    const EmptyState = () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontFamily: "'Architects Daughter', cursive", fontSize: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <div>The Board is empty</div>
        <div style={{ fontSize: 18, marginTop: 8 }}>Add projects and tasks to get started</div>
      </div>
    );

    // Main Whiteboard
    const Whiteboard = () => {
      const [data, setData] = useState(null);
      const [expandedTask, setExpandedTask] = useState(null);
      const [expandedCheckin, setExpandedCheckin] = useState(null);
      const [confirmDelete, setConfirmDelete] = useState(null);
      const [aliceOpen, setAliceOpen] = useState(false);

      const fetchBoard = async () => {
        try {
          const res = await fetch(API_BASE + '/api/board');
          setData(await res.json());
        } catch (e) { console.error(e); }
      };

      const deleteItem = async (id) => {
        await fetch(API_BASE + '/api/item/' + id, { method: 'DELETE' });
        fetchBoard();
      };

      const toggleNotepadPin = async (notepadId, isPinned) => {
        const endpoint = isPinned ? 'unpin' : 'pin';
        await fetch(API_BASE + '/api/notepads/' + notepadId + '/' + endpoint, { method: 'POST' });
        fetchBoard();
      };

      const copyToClipboard = (text) => navigator.clipboard.writeText(text);

      useEffect(() => {
        fetchBoard();
        const interval = setInterval(fetchBoard, 5000);
        return () => clearInterval(interval);
      }, []);

      if (!data) {
        return (
          <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Permanent Marker', cursive", fontSize: 32, color: '#6b7280' }}>
            Loading The Board...
          </div>
        );
      }

      const pinnedNotepads = data.notepads?.filter(n => data.pinnedNotepads?.includes(n.id)) || [];
      const pinnedCount = pinnedNotepads.length;
      const notepadCount = pinnedNotepads.length;
      const projectScale = Math.max(0.5, 1 - ((data.projects?.length || 1) - 1) * 0.1);
      const cleanTaskScale = Math.max(0.5, 1 - ((data.cleanTasks?.length || 1) - 1) * 0.06);
      const messyTaskScale = Math.max(0.5, 1 - ((data.messyTasks?.length || 1) - 1) * 0.04);
      const isEmpty = !data.projects?.length && !data.cleanTasks?.length && !data.messyTasks?.length;

      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#f5f5f0',
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 200, 150, 0.08) 0%, transparent 50%)",
          display: 'flex', padding: 24, gap: 20, overflow: 'hidden'
        }}>
          {isEmpty ? <EmptyState /> : (
            <>
              {/* Projects column */}
              <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 22, color: '#6b7280', paddingLeft: 4, opacity: 0.7, flexShrink: 0 }}>PROJECTS</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', paddingRight: 4 }}>
                  {data.projects?.map(project => <ProjectCard key={project.id} project={project} scale={projectScale} />)}
                </div>
              </div>

              {/* Tasks column */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 22, color: '#6b7280', paddingLeft: 4, opacity: 0.7, flexShrink: 0 }}>TASKS</div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 8, border: '2px dashed #d1d5db', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'auto' }}>
                  {data.cleanTasks?.map(task => <CleanTask key={task.id} task={task} scale={cleanTaskScale} onDelete={(id, text) => setConfirmDelete({ id, text })} />)}
                </div>
              </div>

              {/* Dump column */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 22, color: '#6b7280', paddingLeft: 4, opacity: 0.7, flexShrink: 0 }}>DUMP</div>
                <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 8, border: '2px dashed #9ca3af', padding: 10, display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start', overflow: 'auto' }}>
                  {data.messyTasks?.map((task, i) => <MessyTask key={task.id} task={task} index={i} scale={messyTaskScale} onDelete={deleteItem} onExpand={setExpandedTask} />)}
                </div>
              </div>

              {/* COMMENTED OUT: Progress column
              <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 22, color: '#6b7280', paddingLeft: 4, opacity: 0.7, flexShrink: 0 }}>PROGRESS</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', paddingRight: 4 }}>
                  {data.checkins?.length > 0 ? (
                    data.checkins.map(checkin => <CheckinCard key={checkin.id} checkin={checkin} onExpand={setExpandedCheckin} />)
                  ) : (
                    <div style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 20 }}>No checkins yet</div>
                  )}
                </div>
              </div>
              */}

              {/* Notepads List column (replaces Progress) */}
              <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 22, color: '#6b7280', paddingLeft: 4, opacity: 0.7, flexShrink: 0 }}>NOTEPADS</div>
                  <span style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 12, color: '#9ca3af' }}>
                    ({pinnedCount}/3 pinned)
                  </span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', paddingRight: 4 }}>
                  {data.notepads?.length > 0 ? (
                    data.notepads.map(notepad => (
                      <NotepadListCard 
                        key={notepad.id} 
                        notepad={notepad} 
                        isPinned={data.pinnedNotepads?.includes(notepad.id)}
                        onPin={toggleNotepadPin}
                        pinnedCount={pinnedCount}
                      />
                    ))
                  ) : (
                    <div style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 20 }}>No notepads yet</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notepads overlay */}
          {notepadCount > 0 && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, padding: 40, zIndex: 100 }}>
              {pinnedNotepads.map((notepad, index) => (
                <Notepad 
                  key={notepad.id} 
                  notepad={notepad} 
                  onUnpin={(id) => toggleNotepadPin(id, true)}
                  style={{
                    width: notepadCount === 1 ? 450 : notepadCount === 2 ? 400 : 350,
                    maxHeight: 'calc(100vh - 80px)',
                    overflow: 'hidden',
                    transform: notepadCount === 3 ? \`rotate(\${(index - 1) * 2}deg)\` : notepadCount === 2 ? \`rotate(\${(index - 0.5) * 3}deg)\` : 'rotate(-1deg)'
                  }} 
                />
              ))}
            </div>
          )}

          {/* Alice Chat - always on top */}
          <AliceChat boardData={data} isOpen={aliceOpen} onToggle={() => setAliceOpen(!aliceOpen)} />

          {/* Expanded task modal */}
          {expandedTask && (
            <div onClick={() => setExpandedTask(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 40 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fef08a', padding: 32, borderRadius: 8, boxShadow: '8px 8px 24px rgba(0,0,0,0.4)', maxWidth: 600, width: '100%', maxHeight: 'calc(100vh - 80px)', overflow: 'auto', transform: 'rotate(-1deg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <NumberBadge number={expandedTask.id} size="normal" />
                  <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 20, color: '#6b7280' }}>DUMP ITEM</span>
                </div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: 28, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 24, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{expandedTask.text}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => copyToClipboard(expandedTask.text)} style={{ padding: '12px 24px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>Copy</button>
                  <button onClick={() => { deleteItem(expandedTask.id); setExpandedTask(null); }} style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm delete modal */}
          {confirmDelete && (
            <div onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 40 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: 32, borderRadius: 8, boxShadow: '8px 8px 24px rgba(0,0,0,0.4)', maxWidth: 400, width: '100%' }}>
                <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 24, color: '#1a1a1a', marginBottom: 16 }}>Delete Task?</h3>
                <p style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 18, color: '#374151', marginBottom: 24 }}>{confirmDelete.text}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px 24px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => { deleteItem(confirmDelete.id); setConfirmDelete(null); }} style={{ flex: 1, padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Expanded checkin modal */}
          {expandedCheckin && (
            <div onClick={() => setExpandedCheckin(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 40 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: 32, borderRadius: 8, boxShadow: '8px 8px 24px rgba(0,0,0,0.4)', maxWidth: 600, width: '100%', maxHeight: 'calc(100vh - 80px)', overflow: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <NumberBadge number={expandedCheckin.id} size="normal" />
                  <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 20, color: '#6b7280' }}>CHECKIN</span>
                  <span style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 14, color: '#9ca3af', marginLeft: 'auto' }}>{timeAgo(expandedCheckin.created_at)}</span>
                </div>
                {expandedCheckin.project_name && (
                  <span style={{ display: 'inline-block', backgroundColor: '#FFD60A', padding: '4px 12px', borderRadius: 4, fontFamily: "'Architects Daughter', cursive", fontSize: 14, color: '#1a1a1a', border: '2px solid #1a1a1a', marginBottom: 16 }}>{expandedCheckin.project_name}</span>
                )}
                <div style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 20, color: '#1a1a1a', lineHeight: 1.5, marginBottom: 16 }}>{expandedCheckin.summary}</div>
                {expandedCheckin.details && (
                  <div style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 16, color: '#6b7280', lineHeight: 1.6, whiteSpace: 'pre-wrap', padding: 16, backgroundColor: '#f5f5f0', borderRadius: 6 }}>{expandedCheckin.details}</div>
                )}
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
