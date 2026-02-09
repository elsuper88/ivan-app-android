import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Edit3,
  Trash2,
  Copy,
  CalendarPlus,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

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

// Theme-aware styles
function getStyles(isDark) {
  const colors = isDark ? {
    cardBg: '#18181b',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    headerBg: '#18181b',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
    iconWrapperBg: 'rgba(139, 92, 246, 0.15)',
    iconWrapperColor: '#a78bfa',
    titleColor: '#ffffff',
    badgeBg: 'rgba(255, 255, 255, 0.1)',
    badgeColor: '#a1a1aa',
    navBg: 'rgba(255, 255, 255, 0.03)',
    navBorder: 'rgba(255, 255, 255, 0.1)',
    navButtonHover: 'rgba(255, 255, 255, 0.1)',
    monthText: '#ffffff',
    todayLink: '#a78bfa',
    weekdayText: '#71717a',
    weekdayBorder: 'rgba(255, 255, 255, 0.1)',
    dayBg: 'transparent',
    dayHoverBg: 'rgba(139, 92, 246, 0.1)',
    dayTodayBg: 'rgba(139, 92, 246, 0.15)',
    dayBorder: 'rgba(255, 255, 255, 0.05)',
    dayEmptyBg: 'rgba(255, 255, 255, 0.02)',
    dayText: '#e4e4e7',
    dayTodayBadgeBg: '#8b5cf6',
    dayTodayBadgeText: '#ffffff',
    footerBg: 'rgba(255, 255, 255, 0.03)',
    footerBorder: 'rgba(255, 255, 255, 0.1)',
    footerText: '#71717a',
    modalOverlay: 'rgba(0, 0, 0, 0.7)',
    modalBg: '#27272a',
    modalBorder: 'rgba(255, 255, 255, 0.1)',
    modalHeaderBorder: 'rgba(255, 255, 255, 0.1)',
    modalTitleColor: '#ffffff',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.2)',
    inputColor: '#ffffff',
    inputPlaceholder: '#71717a',
    inputFocusBorder: '#8b5cf6',
    inputFocusRing: 'rgba(139, 92, 246, 0.25)',
    labelColor: '#a1a1aa',
    dateBadgeBg: 'rgba(255, 255, 255, 0.05)',
    dateBadgeText: '#a1a1aa',
    cancelBtnBg: 'transparent',
    cancelBtnBorder: 'rgba(255, 255, 255, 0.2)',
    cancelBtnText: '#e4e4e7',
    cancelBtnHoverBg: 'rgba(255, 255, 255, 0.05)',
    submitBtnBg: '#8b5cf6',
    submitBtnHoverBg: '#7c3aed',
    submitBtnText: '#ffffff',
    contextMenuBg: '#27272a',
    contextMenuBorder: 'rgba(255, 255, 255, 0.1)',
    contextMenuItemHover: 'rgba(139, 92, 246, 0.15)',
    contextMenuItemText: '#e4e4e7',
    contextMenuItemHoverText: '#a78bfa',
    deleteHoverBg: 'rgba(248, 113, 113, 0.15)',
    deleteHoverText: '#f87171',
    addBtnBg: '#8b5cf6',
    addBtnHoverBg: '#7c3aed',
    chevronColor: '#71717a',
  } : {
    cardBg: '#ffffff',
    cardBorder: 'rgba(3, 7, 18, 0.05)',
    cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    headerBg: '#ffffff',
    headerBorder: '#e5e7eb',
    iconWrapperBg: '#ede9fe',
    iconWrapperColor: '#7c3aed',
    titleColor: '#1e293b',
    badgeBg: '#f1f5f9',
    badgeColor: '#64748b',
    navBg: 'rgba(248, 250, 252, 0.5)',
    navBorder: '#f1f5f9',
    navButtonHover: '#f1f5f9',
    monthText: '#1e293b',
    todayLink: '#8b5cf6',
    weekdayText: '#64748b',
    weekdayBorder: '#f1f5f9',
    dayBg: 'transparent',
    dayHoverBg: 'rgba(139, 92, 246, 0.08)',
    dayTodayBg: 'rgba(139, 92, 246, 0.1)',
    dayBorder: '#f1f5f9',
    dayEmptyBg: 'rgba(248, 250, 252, 0.3)',
    dayText: '#334155',
    dayTodayBadgeBg: '#8b5cf6',
    dayTodayBadgeText: '#ffffff',
    footerBg: '#f8fafc',
    footerBorder: '#f1f5f9',
    footerText: '#94a3b8',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
    modalBg: '#ffffff',
    modalBorder: '#e2e8f0',
    modalHeaderBorder: '#f1f5f9',
    modalTitleColor: '#1e293b',
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    inputColor: '#1e293b',
    inputPlaceholder: '#94a3b8',
    inputFocusBorder: '#8b5cf6',
    inputFocusRing: 'rgba(139, 92, 246, 0.25)',
    labelColor: '#64748b',
    dateBadgeBg: '#f8fafc',
    dateBadgeText: '#64748b',
    cancelBtnBg: 'transparent',
    cancelBtnBorder: '#e2e8f0',
    cancelBtnText: '#475569',
    cancelBtnHoverBg: '#f8fafc',
    submitBtnBg: '#8b5cf6',
    submitBtnHoverBg: '#7c3aed',
    submitBtnText: '#ffffff',
    contextMenuBg: '#ffffff',
    contextMenuBorder: '#e2e8f0',
    contextMenuItemHover: 'rgba(139, 92, 246, 0.08)',
    contextMenuItemText: '#475569',
    contextMenuItemHoverText: '#7c3aed',
    deleteHoverBg: '#fef2f2',
    deleteHoverText: '#ef4444',
    addBtnBg: '#8b5cf6',
    addBtnHoverBg: '#7c3aed',
    chevronColor: '#64748b',
  };

  return { colors };
}

// Color classes for events
const COLOR_OPTIONS = ['violet', 'blue', 'emerald', 'amber', 'rose'];

const getColorClasses = (color, isDark) => {
  const colorMap = {
    violet: {
      bg: isDark ? 'rgba(139, 92, 246, 0.2)' : '#ede9fe',
      text: isDark ? '#c4b5fd' : '#6d28d9',
      dot: '#8b5cf6',
      hover: isDark ? 'rgba(139, 92, 246, 0.3)' : '#ddd6fe',
    },
    blue: {
      bg: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
      text: isDark ? '#93c5fd' : '#1d4ed8',
      dot: '#3b82f6',
      hover: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
    },
    emerald: {
      bg: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5',
      text: isDark ? '#6ee7b7' : '#047857',
      dot: '#10b981',
      hover: isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0',
    },
    amber: {
      bg: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7',
      text: isDark ? '#fcd34d' : '#b45309',
      dot: '#f59e0b',
      hover: isDark ? 'rgba(245, 158, 11, 0.3)' : '#fde68a',
    },
    rose: {
      bg: isDark ? 'rgba(244, 63, 94, 0.2)' : '#ffe4e6',
      text: isDark ? '#fda4af' : '#be123c',
      dot: '#f43f5e',
      hover: isDark ? 'rgba(244, 63, 94, 0.3)' : '#fecdd3',
    },
  };
  return colorMap[color] || colorMap.violet;
};

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Generate temporary ID for optimistic updates
let tempIdCounter = 0;
const generateTempId = () => `temp_${Date.now()}_${++tempIdCounter}`;

// TimePicker Component
function TimePicker({ value, onChange, colors }) {
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return { hour, minute: m, period };
  };

  const { hour: initHour, minute: initMinute, period: initPeriod } = parseTime(value);
  const [hour, setHour] = useState(initHour);
  const [minute, setMinute] = useState(initMinute);
  const [period, setPeriod] = useState(initPeriod);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const { hour: h, minute: m, period: p } = parseTime(value);
    setHour(h);
    setMinute(m);
    setPeriod(p);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const emitChange = (h, m, p) => {
    let hour24 = h;
    if (p === 'AM' && h === 12) hour24 = 0;
    else if (p === 'PM' && h !== 12) hour24 = h + 12;
    const timeStr = `${hour24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onChange(timeStr);
  };

  const incrementHour = () => {
    const newHour = hour === 12 ? 1 : hour + 1;
    setHour(newHour);
    emitChange(newHour, minute, period);
  };

  const decrementHour = () => {
    const newHour = hour === 1 ? 12 : hour - 1;
    setHour(newHour);
    emitChange(newHour, minute, period);
  };

  const incrementMinute = () => {
    const newMinute = minute >= 55 ? 0 : minute + 5;
    setMinute(newMinute);
    emitChange(hour, newMinute, period);
  };

  const decrementMinute = () => {
    const newMinute = minute <= 0 ? 55 : minute - 5;
    setMinute(newMinute);
    emitChange(hour, newMinute, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    emitChange(hour, minute, newPeriod);
  };

  const clearTime = () => {
    onChange('');
    setIsOpen(false);
  };

  const displayValue = value
    ? `${hour}:${minute.toString().padStart(2, '0')} ${period}`
    : '';

  return (
    <div ref={pickerRef} style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '2.75rem',
          padding: '0 1rem',
          backgroundColor: colors.inputBg,
          border: 'none',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: `0 0 0 1px ${colors.inputBorder}`,
          color: value ? colors.inputColor : colors.inputPlaceholder,
        }}
      >
        <Clock size={16} style={{ color: colors.inputPlaceholder }} />
        <span>{displayValue || 'Seleccionar hora'}</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: colors.modalBg,
          borderRadius: '0.75rem',
          boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 1px ${colors.modalBorder}`,
          padding: '1rem',
          zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {/* Hour */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button type="button" onClick={incrementHour} style={spinnerBtnStyle(colors)}>
                <ChevronUp size={20} style={{ color: colors.chevronColor }} />
              </button>
              <div style={spinnerValueStyle(colors)}>{hour}</div>
              <button type="button" onClick={decrementHour} style={spinnerBtnStyle(colors)}>
                <ChevronDown size={20} style={{ color: colors.chevronColor }} />
              </button>
            </div>

            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.labelColor }}>:</span>

            {/* Minute */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button type="button" onClick={incrementMinute} style={spinnerBtnStyle(colors)}>
                <ChevronUp size={20} style={{ color: colors.chevronColor }} />
              </button>
              <div style={spinnerValueStyle(colors)}>{minute.toString().padStart(2, '0')}</div>
              <button type="button" onClick={decrementMinute} style={spinnerBtnStyle(colors)}>
                <ChevronDown size={20} style={{ color: colors.chevronColor }} />
              </button>
            </div>

            {/* AM/PM */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '0.5rem' }}>
              <button type="button" onClick={togglePeriod} style={spinnerBtnStyle(colors)}>
                <ChevronUp size={20} style={{ color: colors.chevronColor }} />
              </button>
              <div
                onClick={togglePeriod}
                style={{
                  ...spinnerValueStyle(colors),
                  backgroundColor: colors.badgeBg,
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                {period}
              </div>
              <button type="button" onClick={togglePeriod} style={spinnerBtnStyle(colors)}>
                <ChevronDown size={20} style={{ color: colors.chevronColor }} />
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={clearTime}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.labelColor,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: colors.submitBtnText,
                backgroundColor: colors.submitBtnBg,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const spinnerBtnStyle = (colors) => ({
  padding: '0.5rem',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
});

const spinnerValueStyle = (colors) => ({
  width: '3.5rem',
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.iconWrapperBg,
  borderRadius: '0.75rem',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: colors.iconWrapperColor,
});

function CalendarComponent({ wire, mingleData }) {
  const isDark = useFilamentDarkMode();
  const { colors } = useMemo(() => getStyles(isDark), [isDark]);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState(mingleData.events || []);

  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    type: 'date',
    date: null,
    event: null,
  });

  // For backward compatibility - keep modal state but use Filament modals
  const [modal, setModal] = useState({
    isOpen: false,
    mode: 'add',
    date: formatDate(today),
    event: null,
  });

  const [formData, setFormData] = useState({
    title: '',
    time: '',
    color: 'violet',
    description: '',
  });

  const contextMenuRef = useRef(null);

  // Listen for Livewire events from Filament form actions
  useEffect(() => {
    const handleEventCreated = (data) => {
      const newEvent = data.eventData;
      setEvents(prev => [...prev, newEvent]);
    };

    const handleEventUpdated = (data) => {
      const updatedEvent = data.eventData;
      setEvents(prev => prev.map(ev =>
        ev.id === updatedEvent.id ? updatedEvent : ev
      ));
    };

    // Listen to Livewire events
    Livewire.on('calendar-event-created', handleEventCreated);
    Livewire.on('calendar-event-updated', handleEventUpdated);

    return () => {
      Livewire.on('calendar-event-created', () => {});
      Livewire.on('calendar-event-updated', () => {});
    };
  }, []);

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }

  function isToday(date) {
    return date === formatDate(today);
  }

  function getEventsForDate(date) {
    return events.filter(event => event.date === date);
  }

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(prev => ({ ...prev, isOpen: false }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setContextMenu(prev => ({ ...prev, isOpen: false }));
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const goToPreviousMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }, [currentMonth, currentYear]);

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }, [currentMonth, currentYear]);

  const goToToday = useCallback(() => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  }, []);

  const handleContextMenu = useCallback((e, type, date, event) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      type,
      date,
      event,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Open Filament modal for adding event
  const openAddModal = useCallback((date) => {
    closeContextMenu();
    // Call Livewire method to open Filament modal
    wire.openAddModal(date);
  }, [wire]);

  // Open Filament modal for editing event
  const openEditModal = useCallback((event) => {
    closeContextMenu();
    // Call Livewire method to open Filament modal
    wire.openEditModal(parseInt(event.id, 10));
  }, [wire]);

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Optimistic add
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (modal.mode === 'add') {
      const tempId = generateTempId();
      const newEvent = {
        id: tempId,
        title: formData.title.trim(),
        date: modal.date,
        time: formData.time || null,
        color: formData.color,
        description: formData.description.trim() || null,
      };

      // Optimistic update
      setEvents(prev => [...prev, newEvent]);
      closeModal();

      // Sync in background
      wire.addEvent(tempId, {
        title: formData.title.trim(),
        date: modal.date,
        time: formData.time || null,
        color: formData.color,
        description: formData.description.trim() || null,
      }).then((realId) => {
        if (realId) {
          setEvents(prev => prev.map(ev =>
            ev.id === tempId ? { ...ev, id: realId } : ev
          ));
        }
      });
    } else if (modal.event) {
      const updatedEvent = {
        ...modal.event,
        title: formData.title.trim(),
        time: formData.time || null,
        color: formData.color,
        description: formData.description.trim() || null,
      };

      // Optimistic update
      setEvents(prev => prev.map(ev =>
        ev.id === modal.event.id ? updatedEvent : ev
      ));
      closeModal();

      // Sync in background
      wire.updateEvent(modal.event.id, {
        title: formData.title.trim(),
        date: modal.date,
        time: formData.time || null,
        color: formData.color,
        description: formData.description.trim() || null,
      });
    }
  }, [formData, modal, wire]);

  // Optimistic delete
  const handleDelete = useCallback((eventId) => {
    // Optimistic update
    setEvents(prev => prev.filter(ev => ev.id !== eventId));
    closeContextMenu();

    // Sync in background
    wire.deleteEvent(eventId);
  }, [wire]);

  // Optimistic duplicate
  const handleDuplicate = useCallback((event) => {
    const tempId = generateTempId();
    const duplicated = {
      ...event,
      id: tempId,
      title: `${event.title} (copia)`,
    };

    // Optimistic update
    setEvents(prev => [...prev, duplicated]);
    closeContextMenu();

    // Sync in background and update with real data
    wire.duplicateEvent(event.id).then((realEvent) => {
      if (realEvent) {
        setEvents(prev => prev.map(ev =>
          ev.id === tempId ? realEvent : ev
        ));
      }
    });
  }, [wire]);

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div style={{ width: '100%', fontFamily: 'ui-sans-serif, system-ui, sans-serif', minWidth: 0 }}>
      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: `${colors.cardShadow}, 0 0 0 1px ${colors.cardBorder}`,
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: colors.headerBg,
          padding: 'clamp(0.5rem, 2vw, 1rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.headerBorder}`,
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.375rem, 1.5vw, 0.75rem)', minWidth: 0, flex: '1 1 auto' }}>
            <div style={{
              padding: 'clamp(0.25rem, 1vw, 0.5rem)',
              backgroundColor: colors.iconWrapperBg,
              color: colors.iconWrapperColor,
              borderRadius: '0.5rem',
              flexShrink: 0,
            }}>
              <CalendarIcon size={18} />
            </div>
            <h1 style={{
              fontWeight: '600',
              fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
              color: colors.titleColor,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              Calendario
            </h1>
            <span style={{
              backgroundColor: colors.badgeBg,
              color: colors.badgeColor,
              fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
              fontWeight: '500',
              padding: '0.125rem clamp(0.25rem, 1vw, 0.5rem)',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {events.length} eventos
            </span>
          </div>

          <button
            onClick={() => openAddModal(formatDate(today))}
            style={{
              padding: '0.5rem',
              backgroundColor: colors.addBtnBg,
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={18} />
          </button>
        </header>

        {/* Month Navigation */}
        <div style={{
          padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.5rem, 2vw, 1rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.navBg,
          borderBottom: `1px solid ${colors.navBorder}`,
          gap: '0.25rem',
        }}>
          <button
            onClick={goToPreviousMonth}
            style={{
              padding: 'clamp(0.25rem, 1vw, 0.5rem)',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={18} style={{ color: colors.chevronColor }} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.375rem, 1.5vw, 0.75rem)',
            minWidth: 0,
            overflow: 'hidden',
          }}>
            <h2 style={{
              fontWeight: '600',
              color: colors.monthText,
              margin: 0,
              fontSize: 'clamp(0.75rem, 3vw, 1rem)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={goToToday}
              style={{
                fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                fontWeight: '500',
                color: colors.todayLink,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Hoy
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            style={{
              padding: 'clamp(0.25rem, 1vw, 0.5rem)',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronRight size={18} style={{ color: colors.chevronColor }} />
          </button>
        </div>

        {/* Weekday Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          borderBottom: `1px solid ${colors.weekdayBorder}`,
        }}>
          {WEEKDAYS.map(day => (
            <div
              key={day}
              style={{
                padding: 'clamp(0.25rem, 1vw, 0.5rem)',
                textAlign: 'center',
                fontSize: 'clamp(0.5rem, 2vw, 0.75rem)',
                fontWeight: '600',
                color: colors.weekdayText,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  style={{
                    minHeight: 'clamp(3rem, 12vw, 5rem)',
                    backgroundColor: colors.dayEmptyBg,
                  }}
                />
              );
            }

            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            const isTodayDate = isToday(dateStr);

            return (
              <div
                key={dateStr}
                onContextMenu={(e) => handleContextMenu(e, 'date', dateStr)}
                onClick={() => openAddModal(dateStr)}
                style={{
                  minHeight: 'clamp(3rem, 12vw, 5rem)',
                  padding: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                  borderBottom: `1px solid ${colors.dayBorder}`,
                  borderRight: `1px solid ${colors.dayBorder}`,
                  cursor: 'pointer',
                  backgroundColor: isTodayDate ? colors.dayTodayBg : colors.dayBg,
                  transition: 'background-color 0.15s',
                  overflow: 'hidden',
                  minWidth: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isTodayDate) e.currentTarget.style.backgroundColor = colors.dayHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isTodayDate ? colors.dayTodayBg : colors.dayBg;
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'clamp(0.125rem, 0.5vw, 0.25rem)' }}>
                  <span style={{
                    fontSize: 'clamp(0.625rem, 2.5vw, 0.875rem)',
                    fontWeight: '500',
                    width: 'clamp(1rem, 4vw, 1.5rem)',
                    height: 'clamp(1rem, 4vw, 1.5rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                    backgroundColor: isTodayDate ? colors.dayTodayBadgeBg : 'transparent',
                    color: isTodayDate ? colors.dayTodayBadgeText : colors.dayText,
                    flexShrink: 0,
                  }}>
                    {day}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.0625rem',
                  overflow: 'hidden',
                  minWidth: 0,
                  width: '100%',
                }}>
                  {dayEvents.slice(0, 2).map(event => {
                    const colorClasses = getColorClasses(event.color, isDark);
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(event);
                        }}
                        onContextMenu={(e) => handleContextMenu(e, 'event', dateStr, event)}
                        style={{
                          fontSize: 'clamp(0.5rem, 1.8vw, 0.625rem)',
                          padding: 'clamp(0.0625rem, 0.25vw, 0.125rem) clamp(0.125rem, 0.5vw, 0.375rem)',
                          borderRadius: '0.1875rem',
                          backgroundColor: colorClasses.bg,
                          color: colorClasses.text,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                          maxWidth: '100%',
                          lineHeight: 1.3,
                        }}
                        title={event.title}
                      >
                        {event.time && <span style={{ fontWeight: '500' }}>{event.time} </span>}
                        {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div style={{
                      fontSize: 'clamp(0.5rem, 1.5vw, 0.625rem)',
                      color: colors.labelColor,
                      fontWeight: '500',
                      paddingLeft: 'clamp(0.125rem, 0.5vw, 0.25rem)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      +{dayEvents.length - 2} mas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.5rem, 2vw, 1rem)',
          backgroundColor: colors.footerBg,
          borderTop: `1px solid ${colors.footerBorder}`,
        }}>
          <p style={{
            fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
            color: colors.footerText,
            textAlign: 'center',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            Clic para agregar - Clic derecho para opciones
          </p>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: colors.contextMenuBg,
            borderRadius: '0.75rem',
            boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 1px ${colors.contextMenuBorder}`,
            padding: '0.5rem 0',
            zIndex: 50,
            minWidth: '180px',
          }}
        >
          {contextMenu.type === 'date' ? (
            <button
              onClick={() => openAddModal(contextMenu.date)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: colors.contextMenuItemText,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.contextMenuItemHover;
                e.currentTarget.style.color = colors.contextMenuItemHoverText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.contextMenuItemText;
              }}
            >
              <CalendarPlus size={16} />
              Agregar evento
            </button>
          ) : (
            <>
              <button
                onClick={() => openEditModal(contextMenu.event)}
                style={contextMenuItemStyle(colors)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.contextMenuItemHover;
                  e.currentTarget.style.color = colors.contextMenuItemHoverText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.contextMenuItemText;
                }}
              >
                <Edit3 size={16} />
                Editar evento
              </button>
              <button
                onClick={() => handleDuplicate(contextMenu.event)}
                style={contextMenuItemStyle(colors)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.contextMenuItemHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Copy size={16} />
                Duplicar
              </button>
              <hr style={{ margin: '0.25rem 0', border: 'none', borderTop: `1px solid ${colors.contextMenuBorder}` }} />
              <button
                onClick={() => handleDelete(contextMenu.event.id)}
                style={{
                  ...contextMenuItemStyle(colors),
                  color: colors.deleteHoverText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.deleteHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal */}
      {modal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: colors.modalOverlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: colors.modalBg,
              borderRadius: '1rem',
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${colors.modalBorder}`,
              width: '100%',
              maxWidth: '24rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: `1px solid ${colors.modalHeaderBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h2 style={{ fontWeight: '600', fontSize: '1.125rem', color: colors.modalTitleColor, margin: 0 }}>
                {modal.mode === 'add' ? 'Nuevo evento' : 'Editar evento'}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  padding: '0.375rem',
                  color: colors.labelColor,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
              {/* Date Display */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: colors.dateBadgeText,
                backgroundColor: colors.dateBadgeBg,
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
              }}>
                <CalendarIcon size={16} />
                <span>
                  {new Date(modal.date + 'T12:00:00').toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: colors.labelColor, marginBottom: '0.375rem', marginLeft: '0.25rem' }}>
                  Titulo del evento
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej. Reunion de equipo"
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    height: '2.75rem',
                    padding: '0 1rem',
                    backgroundColor: colors.inputBg,
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    color: colors.inputColor,
                    outline: 'none',
                    boxShadow: `0 0 0 1px ${colors.inputBorder}`,
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${colors.inputFocusBorder}, 0 0 0 4px ${colors.inputFocusRing}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = `0 0 0 1px ${colors.inputBorder}`;
                  }}
                />
              </div>

              {/* Time */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: colors.labelColor, marginBottom: '0.375rem', marginLeft: '0.25rem' }}>
                  Hora (opcional)
                </label>
                <TimePicker
                  value={formData.time}
                  onChange={(time) => setFormData(prev => ({ ...prev, time }))}
                  colors={colors}
                />
              </div>

              {/* Color */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: colors.labelColor, marginBottom: '0.5rem', marginLeft: '0.25rem' }}>
                  Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {COLOR_OPTIONS.map(color => {
                    const colorClasses = getColorClasses(color, isDark);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '9999px',
                          backgroundColor: colorClasses.dot,
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: formData.color === color ? `0 0 0 2px ${colors.cardBg}, 0 0 0 4px ${colors.labelColor}` : 'none',
                          transition: 'transform 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: colors.labelColor, marginBottom: '0.375rem', marginLeft: '0.25rem' }}>
                  Descripcion (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Agrega una descripcion..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: colors.inputBg,
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    color: colors.inputColor,
                    outline: 'none',
                    boxShadow: `0 0 0 1px ${colors.inputBorder}`,
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${colors.inputFocusBorder}, 0 0 0 4px ${colors.inputFocusRing}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = `0 0 0 1px ${colors.inputBorder}`;
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    height: '2.75rem',
                    backgroundColor: colors.cancelBtnBg,
                    color: colors.cancelBtnText,
                    fontWeight: '500',
                    borderRadius: '0.75rem',
                    border: `1px solid ${colors.cancelBtnBorder}`,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    height: '2.75rem',
                    backgroundColor: colors.submitBtnBg,
                    color: colors.submitBtnText,
                    fontWeight: '600',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.25)',
                  }}
                >
                  {modal.mode === 'add' ? 'Agregar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const contextMenuItemStyle = (colors) => ({
  width: '100%',
  padding: '0.5rem 1rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  color: colors.contextMenuItemText,
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

// Mingle boot function
window.Mingle = window.Mingle || { Elements: {} };

window.Mingle.Elements['resources/js/Mingles/CalendarReact.jsx'] = {
  boot: function(mingleId, livewireId) {
    const container = document.getElementById(mingleId);
    const mingleData = JSON.parse(container.dataset.mingleData || '{}');
    const wire = Livewire.find(livewireId);

    const root = createRoot(container);
    root.render(<CalendarComponent wire={wire} mingleData={mingleData} />);
  }
};

export default CalendarComponent;
