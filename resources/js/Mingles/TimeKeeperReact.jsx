import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// ============================================
// DARK MODE HOOK
// ============================================
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

// ============================================
// THEME STYLES
// ============================================
function getStyles(isDark) {
  return isDark ? {
    // Container
    containerBg: '#18181b',
    containerBorder: 'rgba(255, 255, 255, 0.1)',
    containerHoverBorder: 'rgba(255, 255, 255, 0.2)',
    // Button states
    runningBg: 'rgba(249, 115, 22, 0.15)',
    runningBorder: 'rgba(249, 115, 22, 0.3)',
    runningText: '#fb923c',
    pausedBg: 'rgba(59, 130, 246, 0.15)',
    pausedBorder: 'rgba(59, 130, 246, 0.3)',
    pausedText: '#60a5fa',
    // Text
    primaryText: '#ffffff',
    secondaryText: '#a1a1aa',
    mutedText: '#71717a',
    // Divider
    divider: 'rgba(255, 255, 255, 0.1)',
    // Modal/Slider
    overlayBg: 'rgba(0, 0, 0, 0.7)',
    modalBg: '#18181b',
    modalBorder: 'rgba(255, 255, 255, 0.1)',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
    // Input
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.2)',
    inputFocusBorder: '#6366f1',
    inputFocusRing: 'rgba(99, 102, 241, 0.25)',
    // Buttons
    primaryBtnBg: '#6366f1',
    primaryBtnHoverBg: '#4f46e5',
    secondaryBtnBg: 'rgba(255, 255, 255, 0.1)',
    secondaryBtnHoverBg: 'rgba(255, 255, 255, 0.15)',
    dangerBtnBg: 'rgba(239, 68, 68, 0.1)',
    dangerBtnHoverBg: 'rgba(239, 68, 68, 0.2)',
    dangerText: '#f87171',
    // Entries
    entryBg: '#18181b',
    entryBorder: 'rgba(255, 255, 255, 0.1)',
    entryHoverBg: 'rgba(255, 255, 255, 0.05)',
    badgeBg: 'rgba(251, 191, 36, 0.15)',
    badgeText: '#fbbf24',
    // Dropdown
    dropdownBg: '#27272a',
    dropdownBorder: 'rgba(255, 255, 255, 0.1)',
    dropdownItemHover: 'rgba(255, 255, 255, 0.1)',
    // Segment
    segmentBg: 'rgba(255, 255, 255, 0.05)',
    activeSegmentBg: 'rgba(249, 115, 22, 0.15)',
    activeSegmentBorder: 'rgba(249, 115, 22, 0.3)',
    // Skeleton
    skeletonBg: 'rgba(255, 255, 255, 0.1)',
    // Cyan button
    cyanBtnBg: '#06b6d4',
    cyanBtnHoverBg: '#0891b2',
  } : {
    // Container
    containerBg: '#ffffff',
    containerBorder: '#e2e8f0',
    containerHoverBorder: '#cbd5e1',
    // Button states
    runningBg: '#fff7ed',
    runningBorder: '#fed7aa',
    runningText: '#ea580c',
    pausedBg: '#eff6ff',
    pausedBorder: '#bfdbfe',
    pausedText: '#2563eb',
    // Text
    primaryText: '#1e293b',
    secondaryText: '#64748b',
    mutedText: '#94a3b8',
    // Divider
    divider: '#e2e8f0',
    // Modal/Slider
    overlayBg: 'rgba(0, 0, 0, 0.5)',
    modalBg: '#ffffff',
    modalBorder: '#e2e8f0',
    headerBorder: '#f1f5f9',
    // Input
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    inputFocusBorder: '#6366f1',
    inputFocusRing: 'rgba(99, 102, 241, 0.2)',
    // Buttons
    primaryBtnBg: '#6366f1',
    primaryBtnHoverBg: '#4f46e5',
    secondaryBtnBg: '#f1f5f9',
    secondaryBtnHoverBg: '#e2e8f0',
    dangerBtnBg: '#fef2f2',
    dangerBtnHoverBg: '#fee2e2',
    dangerText: '#dc2626',
    // Entries
    entryBg: '#ffffff',
    entryBorder: '#e2e8f0',
    entryHoverBg: '#f8fafc',
    badgeBg: '#fffbeb',
    badgeText: '#b45309',
    // Dropdown
    dropdownBg: '#ffffff',
    dropdownBorder: '#e2e8f0',
    dropdownItemHover: '#f8fafc',
    // Segment
    segmentBg: '#f8fafc',
    activeSegmentBg: '#fff7ed',
    activeSegmentBorder: '#fed7aa',
    // Skeleton
    skeletonBg: '#e2e8f0',
    // Cyan button
    cyanBtnBg: '#06b6d4',
    cyanBtnHoverBg: '#0891b2',
  };
}

// ============================================
// ICONS (Heroicons - inline SVG with style prop)
// ============================================
const ClockIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18, ...style }}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);

const PlayIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, ...style }}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const PauseIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, ...style }}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20, ...style }}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

const ChevronLeftIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, ...style }}>
    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, ...style }}>
    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, ...style }}>
    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, ...style }}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, ...style }}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
  </svg>
);

const StopIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, ...style }}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);

// ============================================
// HELPERS
// ============================================
function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDurationReadable(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0 && mins > 0) return `${hrs}H ${mins}M`;
  if (hrs > 0) return `${hrs}H`;
  if (mins > 0) return `${mins}M`;
  return `${seconds}S`;
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const MONTHS_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function formatDateHeader(date) {
  const day = DAYS[date.getDay()];
  const dayNum = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_FULL[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${dayNum} ${month} ${year}`;
}

function formatStartTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function formatSegmentTimeRange(start, end) {
  const formatTimeShort = (d) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')}${ampm}`;
  };
  const day = start.getDate();
  const month = MONTHS_FULL[start.getMonth()];
  if (end) {
    return `${day} de ${month} ${formatTimeShort(start)} - ${formatTimeShort(end)}`;
  }
  return `${day} de ${month} ${formatTimeShort(start)} - en curso`;
}

function transformEntry(entry) {
  if (!entry) return null;
  return {
    ...entry,
    startTime: new Date(entry.startTime),
    endTime: entry.endTime ? new Date(entry.endTime) : undefined,
    segments: (entry.segments || []).map(seg => ({
      ...seg,
      startTime: new Date(seg.startTime),
      endTime: seg.endTime ? new Date(seg.endTime) : undefined,
    })),
  };
}

// ============================================
// SKELETON COMPONENTS
// ============================================
function TimeEntrySkeleton({ colors }) {
  const skeletonStyle = {
    backgroundColor: colors.skeletonBg,
    borderRadius: 4,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };
  return (
    <div style={{ backgroundColor: colors.entryBg, borderRadius: 12, border: `1px solid ${colors.entryBorder}`, padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ ...skeletonStyle, height: 16, width: 112 }} />
            <div style={{ ...skeletonStyle, height: 20, width: 64 }} />
          </div>
          <div style={{ ...skeletonStyle, height: 12, width: 160 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ ...skeletonStyle, height: 32, width: 96 }} />
          <div style={{ ...skeletonStyle, height: 24, width: 80 }} />
        </div>
      </div>
    </div>
  );
}

function TimeEntrySkeletonList({ count = 5, colors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <TimeEntrySkeleton key={i} colors={colors} />
      ))}
    </div>
  );
}

function LoadingMoreIndicator({ colors }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0', gap: 8 }}>
      <div style={{
        width: 16, height: 16,
        border: `2px solid ${colors.mutedText}`,
        borderTopColor: colors.primaryText,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <span style={{ fontSize: 14, color: colors.secondaryText }}>Cargando mas...</span>
    </div>
  );
}

// ============================================
// TIME ACTION DROPDOWN
// ============================================
function TimeActionDropdown({ isActive, isRunning, isPaused, displayDuration, onPause, onResume, onStop, onDelete, colors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAction = (action) => { action(); setIsOpen(false); };

  const getBtnStyle = () => {
    let bg = colors.containerBg;
    let border = colors.containerBorder;
    if (isRunning) { bg = colors.runningBg; border = colors.runningBorder; }
    else if (isPaused) { bg = colors.pausedBg; border = colors.pausedBorder; }
    if (isHovered && !isRunning && !isPaused) bg = colors.entryHoverBg;
    return {
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
      borderRadius: 8, border: `1px solid ${border}`, backgroundColor: bg,
      cursor: 'pointer', transition: 'all 0.2s',
    };
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={getBtnStyle()}
      >
        {isRunning ? <PauseIcon style={{ color: colors.runningText }} /> : <PlayIcon style={{ color: isPaused ? colors.pausedText : colors.mutedText }} />}
        <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, color: isRunning ? colors.runningText : isPaused ? colors.pausedText : colors.primaryText }}>
          {formatTime(displayDuration)}
        </span>
        <ChevronDownIcon style={{ color: isRunning ? colors.runningText : isPaused ? colors.pausedText : colors.mutedText, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', right: 0, marginTop: 4, backgroundColor: colors.dropdownBg,
          borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: `1px solid ${colors.dropdownBorder}`,
          padding: '4px 0', zIndex: 50, minWidth: 160,
        }}>
          {isRunning ? (
            <DropdownItem icon={<PauseIcon />} label="Pausar" onClick={() => handleAction(onPause)} colors={colors} />
          ) : (
            <DropdownItem icon={<PlayIcon />} label="Continuar" onClick={() => handleAction(onResume)} colors={colors} />
          )}
          {isActive && <DropdownItem icon={<StopIcon />} label="Parar" onClick={() => handleAction(onStop)} colors={colors} />}
          <div style={{ margin: '4px 8px', borderTop: `1px solid ${colors.divider}` }} />
          <DropdownItem icon={<TrashIcon />} label="Borrar" onClick={() => handleAction(onDelete)} colors={colors} danger />
        </div>
      )}
    </div>
  );
}

function DropdownItem({ icon, label, onClick, colors, danger }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: 14,
        color: danger ? colors.dangerText : colors.primaryText,
        backgroundColor: isHovered ? (danger ? colors.dangerBtnBg : colors.dropdownItemHover) : 'transparent',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background-color 0.2s',
      }}
    >
      {React.cloneElement(icon, { style: { color: danger ? colors.dangerText : colors.mutedText } })}
      {label}
    </button>
  );
}

// ============================================
// MODAL COMPONENT
// ============================================
function TimeKeeperModal({ isOpen, onClose, onStart, clients, colors }) {
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const modalRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => { if (isOpen) { setClientId(''); setDescription(''); } }, [isOpen]);
  useEffect(() => {
    const handler = (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);
  useEffect(() => {
    const handler = (e) => { if (selectRef.current && !selectRef.current.contains(e.target)) setIsSelectOpen(false); };
    if (isSelectOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isSelectOpen]);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const selectedClient = clients.find(c => c.id === clientId);
  const handleSubmit = (e) => { e.preventDefault(); if (clientId) onStart(clientId, description); };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: colors.overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div ref={modalRef} style={{ backgroundColor: colors.modalBg, borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottom: `1px solid ${colors.headerBorder}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.primaryText, margin: 0 }}>Nueva Entrada de Tiempo</h2>
          <button onClick={onClose} style={{ padding: 8, color: colors.mutedText, backgroundColor: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            <XMarkIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.primaryText, marginBottom: 8 }}>
              Cliente <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div ref={selectRef} style={{ position: 'relative' }}>
              <button type="button" onClick={() => setIsSelectOpen(!isSelectOpen)} style={{
                width: '100%', height: 44, padding: '0 16px', textAlign: 'left', backgroundColor: colors.inputBg,
                border: `1px solid ${isSelectOpen ? colors.inputFocusBorder : colors.inputBorder}`, borderRadius: 12, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                color: selectedClient ? colors.primaryText : colors.mutedText,
                boxShadow: isSelectOpen ? `0 0 0 3px ${colors.inputFocusRing}` : 'none',
              }}>
                <span>{selectedClient?.name || 'Seleccionar cliente...'}</span>
                <ChevronDownIcon style={{ color: colors.mutedText, transform: isSelectOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {isSelectOpen && (
                <div style={{
                  position: 'absolute', zIndex: 10, marginTop: 4, width: '100%', backgroundColor: colors.modalBg,
                  border: `1px solid ${colors.inputBorder}`, borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '4px 0', maxHeight: 192, overflowY: 'auto',
                }}>
                  {clients.map(client => (
                    <ClientOption key={client.id} client={client} isSelected={client.id === clientId} colors={colors} onClick={() => { setClientId(client.id); setIsSelectOpen(false); }} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.primaryText, marginBottom: 8 }}>Descripcion</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="En que estas trabajando?" rows={3} style={{
              width: '100%', padding: '12px 16px', backgroundColor: colors.inputBg, border: `1px solid ${colors.inputBorder}`,
              borderRadius: 12, fontSize: 14, resize: 'none', color: colors.primaryText, outline: 'none',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, height: 44, padding: '0 16px', fontSize: 14, fontWeight: 500, color: colors.secondaryText,
              backgroundColor: colors.secondaryBtnBg, border: 'none', borderRadius: 12, cursor: 'pointer',
            }}>Cancelar</button>
            <button type="submit" disabled={!clientId} style={{
              flex: 1, height: 44, padding: '0 16px', fontSize: 14, fontWeight: 500, color: '#ffffff',
              backgroundColor: clientId ? colors.primaryBtnBg : colors.mutedText, border: 'none', borderRadius: 12,
              cursor: clientId ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <PlayIcon style={{ color: '#ffffff' }} />
              Iniciar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientOption({ client, isSelected, colors, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{
      width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: 14, cursor: 'pointer', border: 'none',
      backgroundColor: isSelected ? colors.inputFocusRing : isHovered ? colors.dropdownItemHover : 'transparent',
      color: isSelected ? colors.primaryBtnBg : colors.primaryText, fontWeight: isSelected ? 500 : 400, transition: 'background-color 0.2s',
    }}>{client.name}</button>
  );
}

// ============================================
// SLIDER COMPONENT
// ============================================
function TimeKeeperSlider({ isOpen, onClose, activeEntry, activeEntryDuration, clients, wire, onPauseTimer, onResumeTimer, onStopTimer, onDeleteEntry, onEditEntry, onNewEntry, onStartTimer, colors }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [editingEntry, setEditingEntry] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false); // Controls actual skeleton visibility
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false, totalItems: 0 });
  const [totalDayDuration, setTotalDayDuration] = useState(0);
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const listContainerRef = useRef(null);
  const prevActiveEntryRef = useRef(activeEntry);
  const lastActiveDurationRef = useRef(activeEntryDuration);
  const loadingStartTimeRef = useRef(null);
  const skeletonTimeoutRef = useRef(null);
  const SKELETON_MIN_DURATION = 300; // Minimum skeleton visibility in ms

  // Helper to hide skeleton with minimum duration guarantee
  const hideSkeleton = useCallback(() => {
    if (!loadingStartTimeRef.current) {
      setShowSkeleton(false);
      setIsLoading(false);
      return;
    }

    const elapsed = Date.now() - loadingStartTimeRef.current;
    const remaining = SKELETON_MIN_DURATION - elapsed;

    if (remaining > 0) {
      // Wait for remaining time before hiding
      skeletonTimeoutRef.current = setTimeout(() => {
        setShowSkeleton(false);
        setIsLoading(false);
        loadingStartTimeRef.current = null;
      }, remaining);
    } else {
      // Minimum time already passed, hide immediately
      setShowSkeleton(false);
      setIsLoading(false);
      loadingStartTimeRef.current = null;
    }
  }, []);

  const fetchEntries = useCallback(async (date, page = 1) => {
    // Clear any pending skeleton timeout
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
      skeletonTimeoutRef.current = null;
    }

    if (page === 1) {
      loadingStartTimeRef.current = Date.now();
      setIsLoading(true);
      setShowSkeleton(true);
      setEntries([]);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await wire.getEntriesForDate(dateStr, page);
      const transformed = response.data.map(transformEntry);

      if (page === 1) {
        setEntries(transformed);
        hideSkeleton(); // Use minimum duration logic
      } else {
        // Append new entries for infinite scroll
        setEntries(prev => [...prev, ...transformed]);
        setIsLoadingMore(false);
      }
      setPagination(response.pagination);
      setTotalDayDuration(response.totalDayDuration || 0);
    } catch (err) {
      setError(err.message || 'Error al cargar entradas');
      // On error, hide skeleton immediately
      setShowSkeleton(false);
      setIsLoading(false);
      setIsLoadingMore(false);
      loadingStartTimeRef.current = null;
    }
  }, [wire, hideSkeleton]);

  useEffect(() => { if (isOpen) fetchEntries(selectedDate); }, [selectedDate, isOpen, fetchEntries]);

  // Cleanup skeleton timeout on unmount
  useEffect(() => {
    return () => {
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, []);

  // Update entry in list when activeEntry changes (for segments update after pause/resume)
  useEffect(() => {
    if (activeEntry && entries.length > 0) {
      setEntries(prev => prev.map(entry =>
        entry.id === activeEntry.id ? activeEntry : entry
      ));
    }
  }, [activeEntry]);

  // Track last active duration while timer is running (needed for stop handling)
  useEffect(() => {
    if (activeEntry && activeEntryDuration > 0) {
      lastActiveDurationRef.current = activeEntryDuration;
    }
  }, [activeEntry, activeEntryDuration]);

  // Detect when timer is stopped (activeEntry goes from non-null to null)
  // Update local state with final duration - no network requests needed
  useEffect(() => {
    if (prevActiveEntryRef.current && !activeEntry) {
      const stoppedEntryId = prevActiveEntryRef.current.id;
      const finalDuration = lastActiveDurationRef.current;

      // Update the stopped entry in our local entries array
      setEntries(prev => prev.map(entry => {
        if (entry.id === stoppedEntryId) {
          return { ...entry, duration: finalDuration, isRunning: false, isPaused: false };
        }
        return entry;
      }));

      // Update totalDayDuration: replace old duration with final duration
      setTotalDayDuration(prev => {
        const oldEntry = entries.find(e => e.id === stoppedEntryId);
        if (oldEntry) {
          return prev - oldEntry.duration + finalDuration;
        }
        return prev;
      });
    }
    prevActiveEntryRef.current = activeEntry;
  }, [activeEntry]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((observerEntries) => {
      const [entry] = observerEntries;
      if (entry.isIntersecting && pagination.hasNextPage && !isLoadingMore && !isLoading) {
        fetchEntries(selectedDate, pagination.page + 1);
      }
    }, { root: null, rootMargin: '100px', threshold: 0.1 });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [pagination, isLoadingMore, isLoading, fetchEntries, selectedDate]);

  // Calculate total time: use server's totalDayDuration + add active entry's live duration difference
  const totalTime = useMemo(() => {
    if (!activeEntry) return totalDayDuration;
    // Add the difference between live calculated duration and stored duration for active entry
    const liveDiff = activeEntryDuration - (activeEntry.duration || 0);
    return totalDayDuration + Math.max(0, liveDiff);
  }, [totalDayDuration, activeEntry, activeEntryDuration]);

  // Sort entries: active (running/paused) first, then by most recent segment
  const sortedEntries = useMemo(() => {
    if (!entries.length) return entries;

    return [...entries].sort((a, b) => {
      // 1. Active entries (running or paused) come first
      const aIsActive = a.id === activeEntry?.id;
      const bIsActive = b.id === activeEntry?.id;
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;

      // 2. Sort by most recent segment startTime (descending)
      const aLastSegment = a.segments?.length > 0 ? a.segments[a.segments.length - 1] : null;
      const bLastSegment = b.segments?.length > 0 ? b.segments[b.segments.length - 1] : null;
      const aTime = aLastSegment?.startTime?.getTime() || a.startTime?.getTime() || 0;
      const bTime = bLastSegment?.startTime?.getTime() || b.startTime?.getTime() || 0;
      return bTime - aTime;
    });
  }, [entries, activeEntry]);

  const toggleExpanded = (entryId) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(entryId)) next.delete(entryId);
      else next.add(entryId);
      return next;
    });
  };

  useEffect(() => {
    if (isOpen) { setIsVisible(true); requestAnimationFrame(() => { requestAnimationFrame(() => { setIsAnimating(true); }); }); }
    else { setIsAnimating(false); const timer = setTimeout(() => { setIsVisible(false); }, 300); return () => clearTimeout(timer); }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { if (editingEntry) setEditingEntry(null); else onClose(); } };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose, editingEntry]);

  const handlePrevDay = () => setSelectedDate(prev => { const d = new Date(prev); d.setDate(d.getDate() - 1); return d; });
  const handleNextDay = () => setSelectedDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + 1); return d; });
  const handleEditSave = async (clientId, description) => { if (editingEntry) { await onEditEntry(editingEntry.id, clientId, description); setEditingEntry(null); fetchEntries(selectedDate); } };

  // Handle resume: if entry is from a different day, start a new timer for today instead
  const handleResumeEntry = async (entry) => {
    const today = new Date();
    // Ensure entryDate is a Date object
    const entryDate = entry.startTime instanceof Date ? entry.startTime : new Date(entry.startTime);

    // Use toDateString for reliable date-only comparison (e.g., "Sat Jan 25 2025")
    const isFromToday = entryDate.toDateString() === today.toDateString();

    console.log('[handleResumeEntry] Entry:', entry.id, 'startTime:', entry.startTime, 'entryDate.toDateString():', entryDate.toDateString(), 'today.toDateString():', today.toDateString(), 'isFromToday:', isFromToday);

    if (isFromToday) {
      // Same day - just resume normally
      console.log('[handleResumeEntry] Same day - calling onResumeTimer');
      onResumeTimer(entry.id);
    } else {
      // Different day - start a new timer with same client/description for TODAY
      console.log('[handleResumeEntry] Different day - calling onStartTimer with clientId:', entry.clientId, 'description:', entry.description);
      await onStartTimer(entry.clientId, entry.description || '');
      // Switch date view to today to see the new entry
      setSelectedDate(new Date());
      console.log('[handleResumeEntry] Switched to today');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: colors.overlayBg, zIndex: 40, opacity: isAnimating ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%', width: '100%', maxWidth: 400, backgroundColor: colors.modalBg,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', zIndex: 50, transform: isAnimating ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: colors.modalBg, borderBottom: `1px solid ${colors.headerBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClockIcon style={{ color: colors.secondaryText }} />
            <h2 style={{ fontWeight: 600, color: colors.primaryText, margin: 0, fontSize: 16 }}>Timekeeper</h2>
          </div>
          <button onClick={onClose} style={{ padding: 6, color: colors.mutedText, backgroundColor: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            <XMarkIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>
        {/* Date Navigator */}
        <div style={{ padding: 12 }}>
          <div style={{ backgroundColor: colors.entryBg, borderRadius: 12, border: `1px solid ${colors.entryBorder}`, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.inputBorder}`, borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={handlePrevDay} style={{ padding: 6, color: colors.mutedText, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronLeftIcon /></button>
              <div style={{ width: 1, height: 16, backgroundColor: colors.divider }} />
              <button onClick={handleNextDay} style={{ padding: 6, color: colors.mutedText, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronRightIcon /></button>
            </div>
            <span style={{ fontSize: 14, color: colors.secondaryText, fontWeight: 500 }}>{formatDateHeader(selectedDate)}</span>
            <span style={{ fontSize: 18, fontFamily: 'monospace', fontWeight: 700, color: colors.primaryText }}>{formatTime(totalTime)}</span>
          </div>
        </div>
        {/* Entries List */}
        <div ref={listContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '0 12px 96px 12px', maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {showSkeleton && <TimeEntrySkeletonList count={5} colors={colors} />}
          {error && !showSkeleton && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
              <p style={{ color: colors.primaryText, fontWeight: 500, marginBottom: 4 }}>Error al cargar</p>
              <p style={{ color: colors.secondaryText, fontSize: 14, textAlign: 'center', marginBottom: 16 }}>{error}</p>
              <button onClick={() => fetchEntries(selectedDate)} style={{ padding: '8px 16px', fontSize: 14, fontWeight: 500, color: '#ffffff', backgroundColor: colors.primaryBtnBg, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Reintentar</button>
            </div>
          )}
          {!showSkeleton && !error && entries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <ClockIcon style={{ width: 32, height: 32, margin: '0 auto 12px', color: colors.mutedText }} />
              <p style={{ color: colors.secondaryText, fontSize: 14 }}>No hay entradas para este dia</p>
            </div>
          )}
          {!showSkeleton && !error && sortedEntries.map(entry => {
            const isActive = activeEntry?.id === entry.id;
            const isRunning = isActive && activeEntry?.isRunning && !activeEntry?.isPaused;
            const isPaused = isActive && activeEntry?.isPaused;
            const entryDisplayDuration = isActive ? activeEntryDuration : entry.duration;
            const isExpanded = expandedEntries.has(entry.id);
            return (
              <div key={entry.id} style={{ backgroundColor: colors.entryBg, borderRadius: 12, border: `1px solid ${colors.entryBorder}` }}>
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <h3 style={{ fontWeight: 600, color: colors.primaryText, fontSize: 14, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.clientName}</h3>
                        <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, backgroundColor: colors.badgeBg, color: colors.badgeText, fontWeight: 500, whiteSpace: 'nowrap' }}>{formatStartTime(entry.startTime)}</span>
                      </div>
                      {entry.description && <p style={{ fontSize: 12, color: colors.secondaryText, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.description}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <TimeActionDropdown isActive={isActive} isRunning={isRunning} isPaused={isPaused} displayDuration={entryDisplayDuration} onPause={() => onPauseTimer(entry.id)} onResume={() => handleResumeEntry(entry)} onStop={() => onStopTimer(entry.id)} onDelete={() => onDeleteEntry(entry.id)} colors={colors} />
                      <button onClick={() => setEditingEntry(entry)} style={{ padding: '4px 10px', fontSize: 12, color: colors.secondaryText, border: `1px solid ${colors.inputBorder}`, borderRadius: 8, backgroundColor: 'transparent', cursor: 'pointer' }}>Editar entrada</button>
                    </div>
                  </div>
                </div>
                {entry.segments && entry.segments.length > 0 && (
                  <div style={{ borderTop: `1px solid ${colors.headerBorder}` }}>
                    <button onClick={() => toggleExpanded(entry.id)} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: colors.secondaryText, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <span style={{ fontWeight: 500 }}>Segmentos ({entry.segments.length})</span>
                      <ChevronDownIcon style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {isExpanded && (
                      <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {entry.segments.map((segment, idx) => {
                          const isCurrentSegment = isActive && idx === entry.segments.length - 1 && !segment.endTime;
                          // Calculate segment duration client-side for active segment
                          let segmentDuration = segment.duration;
                          if (isCurrentSegment) {
                            const elapsedMs = Date.now() - segment.startTime.getTime();
                            segmentDuration = Math.max(0, Math.floor(elapsedMs / 1000));
                          }
                          return (
                            <div key={segment.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, fontSize: 12, backgroundColor: isCurrentSegment ? colors.activeSegmentBg : colors.segmentBg, border: isCurrentSegment ? `1px solid ${colors.activeSegmentBorder}` : 'none' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: isCurrentSegment ? colors.runningText : colors.mutedText }}>#{idx + 1}</span>
                                <span style={{ color: colors.secondaryText }}>{formatSegmentTimeRange(segment.startTime, segment.endTime)}</span>
                              </div>
                              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: isCurrentSegment ? colors.runningText : colors.primaryText }}>{formatDurationReadable(segmentDuration)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {/* Infinite scroll trigger */}
          {pagination.hasNextPage && <div ref={loadMoreRef} style={{ padding: 8 }}>{isLoadingMore && <LoadingMoreIndicator colors={colors} />}</div>}
          {!pagination.hasNextPage && entries.length > 0 && <div style={{ textAlign: 'center', padding: 16 }}><p style={{ fontSize: 12, color: colors.mutedText }}>{pagination.totalItems} {pagination.totalItems === 1 ? 'entrada' : 'entradas'} en total</p></div>}
        </div>
        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: colors.modalBg, borderTop: `1px solid ${colors.headerBorder}` }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, height: 40, padding: '0 12px', fontSize: 14, fontWeight: 500, color: colors.secondaryText, backgroundColor: colors.entryBg, border: `1px solid ${colors.inputBorder}`, borderRadius: 8, cursor: 'pointer' }}>Ver todas las entradas</button>
            <button onClick={onNewEntry} style={{ flex: 1, height: 40, padding: '0 12px', fontSize: 14, fontWeight: 500, color: '#ffffff', backgroundColor: colors.cyanBtnBg, border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <PlusIcon style={{ color: '#ffffff' }} />
              Nueva entrada
            </button>
          </div>
        </div>
      </div>
      {editingEntry && <EditEntryModal entry={editingEntry} onClose={() => setEditingEntry(null)} onSave={handleEditSave} clients={clients} colors={colors} />}
    </>
  );
}

// ============================================
// EDIT MODAL
// ============================================
function EditEntryModal({ entry, onClose, onSave, clients, colors }) {
  const [clientId, setClientId] = useState(entry.clientId);
  const [description, setDescription] = useState(entry.description || '');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const modalRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  useEffect(() => {
    const handler = (e) => { if (selectRef.current && !selectRef.current.contains(e.target)) setIsSelectOpen(false); };
    if (isSelectOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isSelectOpen]);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const selectedClient = clients.find(c => c.id === clientId);
  const handleSubmit = (e) => { e.preventDefault(); onSave(clientId, description); };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: colors.overlayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }}>
      <div ref={modalRef} style={{ backgroundColor: colors.modalBg, borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottom: `1px solid ${colors.headerBorder}` }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.primaryText, margin: 0 }}>Editar Entrada de Tiempo</h2>
          <button onClick={onClose} style={{ padding: 8, color: colors.mutedText, backgroundColor: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer' }}><XMarkIcon /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.primaryText, marginBottom: 8 }}>Duracion</label>
            <div style={{ height: 44, padding: '0 16px', backgroundColor: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: 12, fontSize: 14, display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontWeight: 600, color: colors.primaryText }}>{formatTime(entry.duration)}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.primaryText, marginBottom: 8 }}>Cliente <span style={{ color: '#ef4444' }}>*</span></label>
            <div ref={selectRef} style={{ position: 'relative' }}>
              <button type="button" onClick={() => setIsSelectOpen(!isSelectOpen)} style={{
                width: '100%', height: 44, padding: '0 16px', textAlign: 'left', backgroundColor: colors.inputBg,
                border: `1px solid ${isSelectOpen ? colors.inputFocusBorder : colors.inputBorder}`, borderRadius: 12, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: colors.primaryText,
                boxShadow: isSelectOpen ? `0 0 0 3px ${colors.inputFocusRing}` : 'none',
              }}>
                <span>{selectedClient?.name || 'Seleccionar cliente...'}</span>
                <ChevronDownIcon style={{ color: colors.mutedText, transform: isSelectOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {isSelectOpen && (
                <div style={{ position: 'absolute', zIndex: 10, marginTop: 4, width: '100%', backgroundColor: colors.modalBg, border: `1px solid ${colors.inputBorder}`, borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '4px 0', maxHeight: 192, overflowY: 'auto' }}>
                  {clients.map(client => <ClientOption key={client.id} client={client} isSelected={client.id === clientId} colors={colors} onClick={() => { setClientId(client.id); setIsSelectOpen(false); }} />)}
                </div>
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.primaryText, marginBottom: 8 }}>Descripcion</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="En que estas trabajando?" rows={3} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.inputBg, border: `1px solid ${colors.inputBorder}`, borderRadius: 12, fontSize: 14, resize: 'none', color: colors.primaryText, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: 44, padding: '0 16px', fontSize: 14, fontWeight: 500, color: colors.secondaryText, backgroundColor: colors.secondaryBtnBg, border: 'none', borderRadius: 12, cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ flex: 1, height: 44, padding: '0 16px', fontSize: 14, fontWeight: 500, color: '#ffffff', backgroundColor: colors.primaryBtnBg, border: 'none', borderRadius: 12, cursor: 'pointer' }}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
// Calculate duration client-side based on segments
function calculateEntryDuration(entry) {
  if (!entry || !entry.segments) return entry?.duration || 0;

  let totalDuration = 0;
  const now = Date.now();

  for (const segment of entry.segments) {
    if (segment.endTime) {
      // Completed segment - use stored duration
      totalDuration += segment.duration;
    } else {
      // Active segment - calculate from startTime to now
      const startMs = segment.startTime.getTime();
      const elapsedSeconds = Math.floor((now - startMs) / 1000);
      totalDuration += Math.max(0, elapsedSeconds);
    }
  }

  return totalDuration;
}

function TimeKeeperComponent({ wire, mingleData }) {
  const isDark = useFilamentDarkMode();
  const colors = useMemo(() => getStyles(isDark), [isDark]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState(() => transformEntry(mingleData.activeEntry));
  const [clients] = useState(mingleData.clients || []);
  const [isHovered, setIsHovered] = useState(false);
  const [displayDuration, setDisplayDuration] = useState(() => calculateEntryDuration(transformEntry(mingleData.activeEntry)));
  const intervalRef = useRef(null);

  // Update display duration every second (client-side only, no network calls)
  useEffect(() => {
    if (activeEntry?.isRunning && !activeEntry?.isPaused) {
      // Calculate initial duration immediately
      setDisplayDuration(calculateEntryDuration(activeEntry));

      intervalRef.current = window.setInterval(() => {
        setDisplayDuration(calculateEntryDuration(activeEntry));
      }, 1000);
    } else {
      // Not running - calculate from segments to get accurate duration (includes all completed segments)
      setDisplayDuration(calculateEntryDuration(activeEntry));
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [activeEntry]);

  const handleTimeClick = () => {
    if (!activeEntry) setIsModalOpen(true);
    else if (activeEntry.isPaused) handleResumeTimer(activeEntry.id);
    else handlePauseTimer(activeEntry.id);
  };

  const handleClockIconClick = (e) => { e.stopPropagation(); setIsSliderOpen(true); };
  const handleStartTimer = async (clientId, description) => { const entry = await wire.startTimer(clientId, description); if (entry) setActiveEntry(transformEntry(entry)); setIsModalOpen(false); };
  const handlePauseTimer = async (entryId) => { const entry = await wire.pauseTimer(entryId); if (entry) setActiveEntry(transformEntry(entry)); };
  const handleResumeTimer = async (entryId) => { const entry = await wire.resumeTimer(entryId); if (entry) setActiveEntry(transformEntry(entry)); };
  const handleStopTimer = async (entryId) => { const entry = await wire.stopTimer(entryId); if (entry && entry.id === activeEntry?.id) setActiveEntry(null); };
  const handleDeleteEntry = async (entryId) => { await wire.deleteEntry(entryId); if (entryId === activeEntry?.id) setActiveEntry(null); };
  const handleEditEntry = async (entryId, clientId, description) => { const entry = await wire.editEntry(entryId, clientId, description); if (entry && entry.id === activeEntry?.id) setActiveEntry(transformEntry(entry)); };

  const displayTime = formatTime(displayDuration);
  const isRunning = activeEntry?.isRunning && !activeEntry?.isPaused;
  const isPaused = activeEntry?.isPaused;

  const getContainerStyle = () => {
    let bg = colors.containerBg;
    let border = colors.containerBorder;
    let shadow = 'none';
    if (isRunning) { bg = colors.runningBg; border = colors.runningBorder; shadow = `0 1px 3px ${colors.runningBg}`; }
    else if (isPaused) { bg = colors.pausedBg; border = colors.pausedBorder; shadow = `0 1px 3px ${colors.pausedBg}`; }
    else if (isHovered) { border = colors.containerHoverBorder; }
    return {
      display: 'flex', alignItems: 'center', borderRadius: 12, border: `1px solid ${border}`,
      backgroundColor: bg, overflow: 'hidden', transition: 'all 0.2s', boxShadow: shadow,
    };
  };

  return (
    <>
      <div style={getContainerStyle()} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button onClick={handleTimeClick} title={!activeEntry ? 'Iniciar nuevo tiempo' : isPaused ? 'Reanudar timer' : 'Pausar timer'} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', cursor: 'pointer',
          backgroundColor: 'transparent', border: 'none', color: isRunning ? colors.runningText : isPaused ? colors.pausedText : colors.secondaryText,
        }}>
          {isRunning && <PauseIcon style={{ color: colors.runningText }} />}
          {isPaused && <PlayIcon style={{ color: colors.pausedText }} />}
          <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, minWidth: 72, textAlign: 'center' }}>{displayTime}</span>
        </button>
        <div style={{ width: 1, height: 24, backgroundColor: isRunning ? colors.runningBorder : isPaused ? colors.pausedBorder : colors.divider }} />
        <button onClick={handleClockIconClick} title="Ver tiempos del dia" style={{
          padding: 10, cursor: 'pointer', backgroundColor: 'transparent', border: 'none',
          color: isRunning ? colors.runningText : isPaused ? colors.pausedText : colors.mutedText,
        }}>
          <ClockIcon />
        </button>
      </div>

      <TimeKeeperModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onStart={handleStartTimer} clients={clients} colors={colors} />
      <TimeKeeperSlider isOpen={isSliderOpen} onClose={() => setIsSliderOpen(false)} activeEntry={activeEntry} activeEntryDuration={displayDuration} clients={clients} wire={wire} onPauseTimer={handlePauseTimer} onResumeTimer={handleResumeTimer} onStopTimer={handleStopTimer} onDeleteEntry={handleDeleteEntry} onEditEntry={handleEditEntry} onNewEntry={() => { setIsSliderOpen(false); setIsModalOpen(true); }} onStartTimer={handleStartTimer} colors={colors} />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// ============================================
// MINGLE BOOT
// ============================================
window.Mingle = window.Mingle || { Elements: {} };

window.Mingle.Elements['resources/js/Mingles/TimeKeeperReact.jsx'] = {
  boot: function(mingleId, livewireId) {
    const container = document.getElementById(mingleId);
    const mingleData = JSON.parse(container.dataset.mingleData || '{}');
    const wire = Livewire.find(livewireId);
    const root = createRoot(container);
    root.render(<TimeKeeperComponent wire={wire} mingleData={mingleData} />);
  }
};

export default TimeKeeperComponent;
