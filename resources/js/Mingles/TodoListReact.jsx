import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckSquare, ChevronUp, ChevronDown, Plus, GripVertical, Check, Edit3, Trash2 } from 'lucide-react';

// Hook to detect Filament's dark mode
function useFilamentDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

// Theme-aware styles - Matching Filament v4
function getStyles(isDark) {
  const colors = isDark ? {
    cardBg: '#18181b',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    headerBg: '#18181b',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
    iconWrapperBg: 'rgba(16, 185, 129, 0.15)',
    iconWrapperColor: '#34d399',
    titleColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.1)',
    badgeColor: '#a1a1aa',
    progressBg: 'rgba(255, 255, 255, 0.1)',
    progressFill: '#10b981',
    progressText: '#34d399',
    chevronColor: '#71717a',
    emptyStateColor: '#71717a',
    listItemBg: 'rgba(255, 255, 255, 0.03)',
    listItemHoverBg: 'rgba(255, 255, 255, 0.05)',
    listItemBorder: 'rgba(16, 185, 129, 0.15)',
    dragHandleColor: '#71717a',
    dragHandleHoverColor: '#a1a1aa',
    checkboxBorder: '#71717a',
    checkboxCheckedBg: '#10b981',
    checkboxCheckedBorder: '#10b981',
    todoTextColor: '#ffffff',
    todoTextCompletedColor: '#71717a',
    buttonColor: '#71717a',
    buttonHoverColor: '#34d399',
    deleteHoverColor: '#f87171',
    deleteHoverBg: 'rgba(248, 113, 113, 0.1)',
    formBg: '#18181b',
    formBorder: 'rgba(255, 255, 255, 0.1)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.2)',
    inputColor: '#ffffff',
    inputPlaceholder: '#71717a',
    submitBg: '#10b981',
    submitHoverBg: '#059669',
    footerBg: 'rgba(255, 255, 255, 0.03)',
    footerBorder: 'rgba(255, 255, 255, 0.1)',
    footerColor: '#a1a1aa',
    footerLinkColor: '#34d399',
    inputFocusBorder: '#10b981',
    inputFocusRing: 'rgba(16, 185, 129, 0.25)',
  } : {
    cardBg: '#ffffff',
    cardBorder: 'rgba(3, 7, 18, 0.05)',
    cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    headerBg: '#ffffff',
    headerBorder: '#e5e7eb',
    iconWrapperBg: '#d1fae5',
    iconWrapperColor: '#059669',
    titleColor: '#030712',
    badgeBg: '#f1f5f9',
    badgeColor: '#475569',
    progressBg: '#e2e8f0',
    progressFill: '#10b981',
    progressText: '#059669',
    chevronColor: '#9ca3af',
    emptyStateColor: '#9ca3af',
    listItemBg: 'rgba(16, 185, 129, 0.03)',
    listItemHoverBg: 'rgba(16, 185, 129, 0.08)',
    listItemBorder: 'rgba(16, 185, 129, 0.15)',
    dragHandleColor: '#d1d5db',
    dragHandleHoverColor: '#9ca3af',
    checkboxBorder: '#d1d5db',
    checkboxCheckedBg: '#10b981',
    checkboxCheckedBorder: '#10b981',
    todoTextColor: '#1f2937',
    todoTextCompletedColor: '#9ca3af',
    buttonColor: '#9ca3af',
    buttonHoverColor: '#059669',
    deleteHoverColor: '#ef4444',
    deleteHoverBg: '#fef2f2',
    formBg: '#ffffff',
    formBorder: '#e5e7eb',
    inputBg: '#f9fafb',
    inputBorder: 'rgba(3, 7, 18, 0.1)',
    inputColor: '#030712',
    inputPlaceholder: '#9ca3af',
    submitBg: '#10b981',
    submitHoverBg: '#059669',
    footerBg: '#f9fafb',
    footerBorder: '#e5e7eb',
    footerColor: '#6b7280',
    footerLinkColor: '#059669',
    inputFocusBorder: '#10b981',
    inputFocusRing: 'rgba(16, 185, 129, 0.25)',
  };

  return { colors };
}

// Generate temporary ID for optimistic updates
let tempIdCounter = 0;
const generateTempId = () => `temp_${Date.now()}_${++tempIdCounter}`;

function TodoListComponent({ wire, mingleData }) {
  const isDark = useFilamentDarkMode();
  const { colors } = useMemo(() => getStyles(isDark), [isDark]);

  const [todos, setTodos] = useState(mingleData.todos || []);
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Optimistic add - update UI immediately, sync in background
  const handleAddTodo = useCallback((e) => {
    e.preventDefault();
    const text = newTodoText.trim();
    if (!text) return;

    const tempId = generateTempId();
    const newTodo = { id: tempId, text, completed: false };

    // Optimistic update
    setTodos(prev => [...prev, newTodo]);
    setNewTodoText('');
    inputRef.current?.focus();

    // Sync to server in background, update temp ID when done
    wire.addTodo(tempId, text).then((realId) => {
      if (realId) {
        setTodos(prev => prev.map(t => t.id === tempId ? { ...t, id: realId } : t));
      }
    });
  }, [newTodoText, wire]);

  // Optimistic toggle
  const handleToggleComplete = useCallback((id) => {
    // Optimistic update
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));

    // Sync in background (fire and forget)
    wire.toggleTodo(id);
  }, [wire]);

  // Optimistic delete
  const handleDelete = useCallback((id) => {
    // Optimistic update
    setTodos(prev => prev.filter(todo => todo.id !== id));

    // Sync in background
    wire.deleteTodo(id);
  }, [wire]);

  const handleStartEdit = useCallback((todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  }, []);

  // Optimistic edit save
  const handleSaveEdit = useCallback(() => {
    const text = editText.trim();
    if (!text) {
      setEditingId(null);
      setEditText('');
      return;
    }

    const id = editingId;

    // Optimistic update
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
    setEditingId(null);
    setEditText('');

    // Sync in background
    wire.updateTodo(id, text);
  }, [editingId, editText, wire]);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditText('');
  }, []);

  const handleEditKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  const handleDragStart = useCallback((e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      e.currentTarget.style.opacity = '0.5';
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = useCallback((e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggedId) {
      setDragOverId(id);
    }
  }, [draggedId]);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  // Optimistic reorder
  const handleDrop = useCallback((e, targetId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    setTodos(prev => {
      const draggedIndex = prev.findIndex(t => t.id === draggedId);
      const targetIndex = prev.findIndex(t => t.id === targetId);

      const newTodos = [...prev];
      const [draggedItem] = newTodos.splice(draggedIndex, 1);
      newTodos.splice(targetIndex, 0, draggedItem);

      // Sync in background
      wire.reorderTodos(newTodos.map(t => t.id));

      return newTodos;
    });

    setDraggedId(null);
    setDragOverId(null);
  }, [draggedId, wire]);

  return (
    <div style={{ width: '100%', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: `${colors.cardShadow}, 0 0 0 1px ${colors.cardBorder}`,
      }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: colors.headerBg,
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.headerBorder}`,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              backgroundColor: colors.iconWrapperBg,
              color: colors.iconWrapperColor,
              borderRadius: '0.5rem',
            }}>
              <CheckSquare size={20} />
            </div>
            <h1 style={{ fontWeight: '600', fontSize: '1.125rem', color: colors.titleColor, margin: 0 }}>
              Tareas
            </h1>
            <span style={{
              backgroundColor: colors.badgeBg,
              color: colors.badgeColor,
              fontSize: '0.75rem',
              fontWeight: '500',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
            }}>
              {completedCount}/{totalCount}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '4rem',
                height: '0.375rem',
                backgroundColor: colors.progressBg,
                borderRadius: '9999px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: colors.progressFill,
                  borderRadius: '9999px',
                  transition: 'width 0.3s',
                  width: `${progress}%`,
                }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: colors.progressText }}>
                {progress}%
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp size={20} style={{ color: colors.chevronColor }} />
            ) : (
              <ChevronDown size={20} style={{ color: colors.chevronColor }} />
            )}
          </div>
        </header>

        {/* Content Area */}
        <div style={{
          transition: 'all 0.3s ease-in-out',
          maxHeight: isExpanded ? '600px' : 0,
          opacity: isExpanded ? 1 : 0,
          overflow: isExpanded ? 'visible' : 'hidden',
        }}>
          {/* Todos List */}
          <div style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f9fafb', maxHeight: '350px', overflowY: 'auto' }}>
            {todos.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: colors.emptyStateColor, fontSize: '0.875rem' }}>
                No hay tareas pendientes.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    colors={colors}
                    editingId={editingId}
                    editText={editText}
                    setEditText={setEditText}
                    editInputRef={editInputRef}
                    draggedId={draggedId}
                    dragOverId={dragOverId}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onToggle={handleToggleComplete}
                    onEdit={handleStartEdit}
                    onSaveEdit={handleSaveEdit}
                    onEditKeyDown={handleEditKeyDown}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Add Todo Form */}
          <div style={{
            padding: '1rem',
            backgroundColor: colors.formBg,
            borderTop: `1px solid ${colors.formBorder}`,
          }}>
            <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                ref={inputRef}
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Agregar nueva tarea..."
                style={{
                  flex: 1,
                  height: '2.75rem',
                  padding: '0 1rem',
                  backgroundColor: colors.inputBg,
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: colors.inputColor,
                  outline: 'none',
                  boxShadow: `0 0 0 1px ${colors.inputBorder}`,
                  transition: 'box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 2px ${colors.inputFocusBorder}, 0 0 0 4px ${colors.inputFocusRing}`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = `0 0 0 1px ${colors.inputBorder}`;
                }}
              />
              <button
                type="submit"
                disabled={!newTodoText.trim()}
                style={{
                  height: '2.75rem',
                  padding: '0 1.25rem',
                  backgroundColor: newTodoText.trim() ? colors.submitBg : colors.badgeBg,
                  color: newTodoText.trim() ? '#ffffff' : colors.badgeColor,
                  fontWeight: '600',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: newTodoText.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (newTodoText.trim()) {
                    e.currentTarget.style.backgroundColor = colors.submitHoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = newTodoText.trim() ? colors.submitBg : colors.badgeBg;
                }}
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            </form>
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: colors.emptyStateColor,
              textAlign: 'center',
            }}>
              Doble clic para editar - Arrastra para reordenar
            </p>
          </div>
        </div>

        {/* Footer Summary (visible when collapsed) */}
        {!isExpanded && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: colors.footerBg,
            borderTop: `1px solid ${colors.footerBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: colors.footerColor,
          }}>
            <span>{completedCount} de {totalCount} completadas</span>
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
              style={{
                color: colors.footerLinkColor,
                fontWeight: '500',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Ver detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  colors,
  editingId,
  editText,
  setEditText,
  editInputRef,
  draggedId,
  dragOverId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onToggle,
  onEdit,
  onSaveEdit,
  onEditKeyDown,
  onDelete,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      draggable={editingId !== todo.id}
      onDragStart={(e) => onDragStart(e, todo.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, todo.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, todo.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '0.75rem 1rem',
        backgroundColor: dragOverId === todo.id
          ? colors.listItemHoverBg
          : isHovered
            ? colors.listItemHoverBg
            : colors.listItemBg,
        borderBottom: `1px solid ${colors.listItemBorder}`,
        opacity: draggedId === todo.id ? 0.5 : 1,
        borderTop: dragOverId === todo.id ? `2px solid ${colors.progressFill}` : 'none',
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            cursor: 'grab',
            color: isHovered ? colors.dragHandleHoverColor : colors.dragHandleColor,
            transition: 'color 0.2s',
          }}
        >
          <GripVertical size={18} />
        </div>

        <button
          onClick={() => onToggle(todo.id)}
          style={{
            width: '1.25rem',
            height: '1.25rem',
            borderRadius: '0.375rem',
            border: `2px solid ${todo.completed ? colors.checkboxCheckedBorder : colors.checkboxBorder}`,
            backgroundColor: todo.completed ? colors.checkboxCheckedBg : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          {todo.completed && <Check size={12} strokeWidth={3} color="#ffffff" />}
        </button>

        {editingId === todo.id ? (
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={onEditKeyDown}
            onBlur={onSaveEdit}
            style={{
              flex: 1,
              padding: '0.25rem 0.5rem',
              fontSize: '0.875rem',
              backgroundColor: colors.inputBg,
              border: `1px solid ${colors.inputFocusBorder}`,
              borderRadius: '0.5rem',
              color: colors.inputColor,
              outline: 'none',
              boxShadow: `0 0 0 2px ${colors.inputFocusRing}`,
            }}
          />
        ) : (
          <span
            style={{
              flex: 1,
              fontSize: '0.875rem',
              color: todo.completed ? colors.todoTextCompletedColor : colors.todoTextColor,
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onDoubleClick={() => onEdit(todo)}
          >
            {todo.text}
          </span>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          opacity: isHovered && editingId !== todo.id ? 1 : 0,
          transition: 'opacity 0.2s',
        }}>
          <ActionButton
            icon={<Edit3 size={14} />}
            colors={colors}
            hoverColor={colors.buttonHoverColor}
            onClick={() => onEdit(todo)}
          />
          <ActionButton
            icon={<Trash2 size={14} />}
            colors={colors}
            hoverColor={colors.deleteHoverColor}
            hoverBg={colors.deleteHoverBg}
            onClick={() => onDelete(todo.id)}
          />
        </div>
      </div>
    </li>
  );
}

function ActionButton({ icon, colors, hoverColor, hoverBg, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '0.375rem',
        color: isHovered ? hoverColor : colors.buttonColor,
        backgroundColor: isHovered && hoverBg ? hoverBg : 'transparent',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </button>
  );
}

// Mingle boot function
window.Mingle = window.Mingle || { Elements: {} };

window.Mingle.Elements['resources/js/Mingles/TodoListReact.jsx'] = {
  boot: function(mingleId, livewireId) {
    const container = document.getElementById(mingleId);
    const mingleData = JSON.parse(container.dataset.mingleData || '{}');
    const wire = Livewire.find(livewireId);

    const root = createRoot(container);
    root.render(<TodoListComponent wire={wire} mingleData={mingleData} />);
  }
};

export default TodoListComponent;
