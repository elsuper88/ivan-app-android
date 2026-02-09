import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

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

function getStyles(isDark) {
  return isDark ? {
    cardBg: '#18181b',
    modalBg: '#27272a',
    modalBorder: 'rgba(255, 255, 255, 0.1)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.2)',
    inputColor: '#ffffff',
    inputPlaceholder: '#71717a',
    inputFocusBorder: '#8b5cf6',
    inputFocusRing: 'rgba(139, 92, 246, 0.25)',
    labelColor: '#a1a1aa',
    badgeBg: 'rgba(255, 255, 255, 0.1)',
    iconWrapperBg: 'rgba(139, 92, 246, 0.15)',
    iconWrapperColor: '#a78bfa',
    submitBtnBg: '#8b5cf6',
    submitBtnText: '#ffffff',
    chevronColor: '#71717a',
  } : {
    cardBg: '#ffffff',
    modalBg: '#ffffff',
    modalBorder: '#e2e8f0',
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    inputColor: '#1e293b',
    inputPlaceholder: '#94a3b8',
    inputFocusBorder: '#8b5cf6',
    inputFocusRing: 'rgba(139, 92, 246, 0.25)',
    labelColor: '#64748b',
    badgeBg: '#f1f5f9',
    iconWrapperBg: '#ede9fe',
    iconWrapperColor: '#7c3aed',
    submitBtnBg: '#8b5cf6',
    submitBtnText: '#ffffff',
    chevronColor: '#64748b',
  };
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

function TimePickerComponent({ wire, mingleData }) {
  const isDark = useFilamentDarkMode();
  const colors = useMemo(() => getStyles(isDark), [isDark]);

  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return { hour, minute: m, period };
  };

  const initialTime = parseTime(mingleData.value);
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState(initialTime.period);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(mingleData.value || '');
  const pickerRef = useRef(null);

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
    setValue(timeStr);
    wire.updateTime(timeStr);
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
    setValue('');
    wire.updateTime('');
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

// Mingle boot function
window.Mingle = window.Mingle || { Elements: {} };

window.Mingle.Elements['resources/js/Mingles/TimePickerReact.jsx'] = {
  boot: function(mingleId, livewireId) {
    const container = document.getElementById(mingleId);
    const mingleData = JSON.parse(container.dataset.mingleData || '{}');
    const wire = Livewire.find(livewireId);

    const root = createRoot(container);
    root.render(<TimePickerComponent wire={wire} mingleData={mingleData} />);
  }
};

export default TimePickerComponent;
