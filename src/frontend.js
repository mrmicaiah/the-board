// TV Dashboard Frontend for The Board

export const FRONTEND_HTML = `<!DOCTYPE html>
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

    // Messy task (sticky note)
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
            opacity: 0.7
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

    // Notepad overlay
    const Notepad = ({ notepad, style }) => (
      <div style={{
        backgroundColor: '#fef9c3', borderRadius: 4,
        boxShadow: '6px 6px 20px rgba(0,0,0,0.35), 0 0 0 2px #d4a017',
        display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', ...style
      }}>
        <div style={{ position: 'absolute', left: 48, top: 0, bottom: 0, width: 2, backgroundColor: '#f87171' }} />
        <div style={{ position: 'absolute', top: -8, left: '30%', width: 60, height: 24, backgroundColor: 'rgba(200, 180, 150, 0.6)', transform: 'rotate(-2deg)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: -6, right: '25%', width: 50, height: 22, backgroundColor: 'rgba(200, 180, 150, 0.5)', transform: 'rotate(3deg)', borderRadius: 2 }} />
        <div style={{ padding: '20px 20px 16px 60px', borderBottom: '2px solid #d4a017', display: 'flex', alignItems: 'center', gap: 12 }}>
          <NumberBadge number={notepad.id} />
          <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 26, color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: 4 }}>{notepad.title}</h3>
        </div>
        <div style={{ padding: '16px 20px 20px 60px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {notepad.items?.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 22, height: 22, border: '2px solid #1a1a1a', borderRadius: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
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
      const [confirmDelete, setConfirmDelete] = useState(null);

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
      const notepadCount = pinnedNotepads.length;
      const projectScale = Math.max(0.3, 1 - ((data.projects?.length || 1) - 1) * 0.15);
      const cleanTaskScale = Math.max(0.3, 1 - ((data.cleanTasks?.length || 1) - 1) * 0.1);
      const messyTaskScale = Math.max(0.3, 1 - ((data.messyTasks?.length || 1) - 1) * 0.06);
      const isEmpty = !data.projects?.length && !data.cleanTasks?.length && !data.messyTasks?.length;

      return (
        <div style={{
          width: '100vw', height: '100vh', backgroundColor: '#f5f5f0',
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 200, 150, 0.08) 0%, transparent 50%)",
          display: 'flex', position: 'relative', padding: 20, gap: 20
        }}>
          {isEmpty ? <EmptyState /> : (
            <>
              {/* Projects column */}
              <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 28, color: '#6b7280', paddingLeft: 8, opacity: 0.7, flexShrink: 0 }}>PROJECTS</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                  {data.projects?.map(project => <ProjectCard key={project.id} project={project} scale={projectScale} />)}
                </div>
              </div>

              {/* Tasks column */}
              <div style={{ flex: '0 0 50%', display: 'flex', gap: 16, minHeight: 0 }}>
                {/* Clean tasks */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                  <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 24, color: '#6b7280', paddingLeft: 8, opacity: 0.7, flexShrink: 0 }}>TASKS</div>
                  <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 8, border: '2px dashed #d1d5db', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
                    {data.cleanTasks?.map(task => <CleanTask key={task.id} task={task} scale={cleanTaskScale} onDelete={(id, text) => setConfirmDelete({ id, text })} />)}
                  </div>
                </div>

                {/* Messy dump */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                  <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 24, color: '#6b7280', paddingLeft: 8, opacity: 0.7, flexShrink: 0 }}>DUMP</div>
                  <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 8, border: '2px dashed #9ca3af', padding: 12, display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'flex-start', minHeight: 0, overflow: 'hidden' }}>
                    {data.messyTasks?.map((task, i) => <MessyTask key={task.id} task={task} index={i} scale={messyTaskScale} onDelete={deleteItem} onExpand={setExpandedTask} />)}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notepads overlay */}
          {notepadCount > 0 && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, padding: 40, zIndex: 100 }}>
              {pinnedNotepads.map((notepad, index) => (
                <Notepad key={notepad.id} notepad={notepad} style={{
                  width: notepadCount === 1 ? 450 : notepadCount === 2 ? 400 : 350,
                  maxHeight: '80vh',
                  transform: notepadCount === 3 ? \`rotate(\${(index - 1) * 2}deg)\` : notepadCount === 2 ? \`rotate(\${(index - 0.5) * 3}deg)\` : 'rotate(-1deg)'
                }} />
              ))}
            </div>
          )}

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
                  <button onClick={() => copyToClipboard(expandedTask.text)} style={{ padding: '12px 24px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>📋 Copy</button>
                  <button onClick={() => setExpandedTask(null)} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#1a1a1a', border: '2px solid #1a1a1a', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm delete modal */}
          {confirmDelete && (
            <div onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 40 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: 32, borderRadius: 12, boxShadow: '8px 8px 24px rgba(0,0,0,0.4)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 24, marginBottom: 16, color: '#ef4444' }}>Delete Task?</div>
                <div style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 18, color: '#4b5563', marginBottom: 24, lineHeight: 1.4 }}>"{confirmDelete.text}"</div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={() => setConfirmDelete(null)} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#1a1a1a', border: '2px solid #d1d5db', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => { deleteItem(confirmDelete.id); setConfirmDelete(null); }} style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 6, fontFamily: "'Permanent Marker', cursive", fontSize: 16, cursor: 'pointer' }}>Delete</button>
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
