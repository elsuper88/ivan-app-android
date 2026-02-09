import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

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

// Color classes for events
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

function getStyles(isDark) {
  return {
    cardBg: isDark ? '#18181b' : '#ffffff',
    labelColor: isDark ? '#a1a1aa' : '#64748b',
  };
}

function ColorPickerComponent({ wire, mingleData }) {
  const isDark = useFilamentDarkMode();
  const colors = useMemo(() => getStyles(isDark), [isDark]);
  const colorOptions = mingleData.colors || ['violet', 'blue', 'emerald', 'amber', 'rose'];
  const [selectedColor, setSelectedColor] = useState(mingleData.value || 'violet');

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    wire.updateColor(color);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {colorOptions.map(color => {
        const colorClasses = getColorClasses(color, isDark);
        return (
          <button
            key={color}
            type="button"
            onClick={() => handleColorSelect(color)}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '9999px',
              backgroundColor: colorClasses.dot,
              border: 'none',
              cursor: 'pointer',
              boxShadow: selectedColor === color
                ? `0 0 0 2px ${colors.cardBg}, 0 0 0 4px ${colors.labelColor}`
                : 'none',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
        );
      })}
    </div>
  );
}

// Mingle boot function
window.Mingle = window.Mingle || { Elements: {} };

window.Mingle.Elements['resources/js/Mingles/ColorPickerReact.jsx'] = {
  boot: function(mingleId, livewireId) {
    const container = document.getElementById(mingleId);
    const mingleData = JSON.parse(container.dataset.mingleData || '{}');
    const wire = Livewire.find(livewireId);

    const root = createRoot(container);
    root.render(<ColorPickerComponent wire={wire} mingleData={mingleData} />);
  }
};

export default ColorPickerComponent;
