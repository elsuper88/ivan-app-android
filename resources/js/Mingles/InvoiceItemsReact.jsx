import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutGrid, ChevronUp, ChevronDown, X, Plus, Package, Scale, DollarSign, AlignLeft } from 'lucide-react';

// Hook to detect Filament's dark mode
function useFilamentDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    // Create observer to watch for class changes on html element
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

// Theme-aware styles generator - Matching Filament v4 exactly
function getStyles(isDark) {
  const colors = isDark ? {
    // Dark mode colors - Matching Filament's Zinc palette (neutral grays)
    // Filament uses Color::Zinc by default (see ColorManager.php line 17)
    cardBg: '#18181b',                          // zinc-900 (Filament section dark bg)
    cardBorder: 'rgba(255, 255, 255, 0.1)',     // white/10 (Filament ring)
    cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
    headerBg: '#18181b',                         // zinc-900
    headerBorder: 'rgba(255, 255, 255, 0.1)',   // white/10
    iconWrapperBg: 'rgba(99, 102, 241, 0.15)',  // indigo with transparency
    iconWrapperColor: '#818cf8',                // indigo-400
    titleColor: '#ffffff',                       // white (Filament heading)
    badgeBg: 'rgba(255, 255, 255, 0.1)',        // white/10
    badgeColor: '#a1a1aa',                       // zinc-400
    totalColor: '#818cf8',                       // indigo-400
    chevronColor: '#71717a',                     // zinc-500 (Filament icon)
    itemsListBg: 'rgba(255, 255, 255, 0.02)',   // subtle bg
    emptyStateColor: '#71717a',                  // zinc-500
    listItemBg: 'rgba(255, 255, 255, 0.03)',    // subtle highlight
    listItemHoverBg: 'rgba(255, 255, 255, 0.05)', // white/5
    listItemBorder: 'rgba(255, 255, 255, 0.1)', // white/10
    dragHandleColor: '#818cf8',                  // indigo-400
    itemNameColor: '#ffffff',                    // white
    itemDescColor: '#a1a1aa',                    // zinc-400 (Filament description)
    itemTotalColor: '#ffffff',                   // white
    itemBreakdownColor: '#a1a1aa',               // zinc-400
    formBg: '#18181b',                           // zinc-900
    formBorder: 'rgba(255, 255, 255, 0.1)',     // white/10
    labelColor: '#a1a1aa',                       // zinc-400 (Filament label)
    inputBg: 'rgba(255, 255, 255, 0.05)',       // white/5 (Filament input wrapper)
    inputBorder: 'rgba(255, 255, 255, 0.2)',    // white/20 (Filament input ring)
    inputColor: '#ffffff',                       // white (Filament input text)
    inputPlaceholder: '#71717a',                 // zinc-500 (Filament placeholder)
    stepperBg: 'rgba(255, 255, 255, 0.05)',     // white/5
    stepperBorder: 'rgba(255, 255, 255, 0.2)',  // white/20
    stepperButtonColor: '#a1a1aa',               // zinc-400
    submitBg: '#6366f1',                         // indigo-500
    submitHoverBg: '#4f46e5',                    // indigo-600
    submitShadow: 'rgba(99, 102, 241, 0.25)',
    footerBg: 'rgba(255, 255, 255, 0.03)',
    footerBorder: 'rgba(255, 255, 255, 0.1)',   // white/10
    footerColor: '#a1a1aa',                      // zinc-400
    footerLinkColor: '#818cf8',                  // indigo-400
    deleteHoverColor: '#f87171',                 // red-400
    deleteHoverBg: 'rgba(248, 113, 113, 0.1)',
  } : {
    // Light mode colors - Matching Filament's bg-white ring-gray-950/5
    cardBg: '#ffffff',                           // white (Filament section)
    cardBorder: 'rgba(3, 7, 18, 0.05)',         // gray-950/5 (Filament ring)
    cardShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
    headerBg: '#ffffff',                         // white
    headerBorder: '#e5e7eb',                     // gray-200 (Filament border)
    iconWrapperBg: '#eef2ff',                    // indigo-50
    iconWrapperColor: '#4f46e5',                // indigo-600
    titleColor: '#030712',                       // gray-950 (Filament heading)
    badgeBg: '#f1f5f9',                          // slate-100
    badgeColor: '#475569',                       // slate-600
    totalColor: '#4f46e5',                       // indigo-600
    chevronColor: '#9ca3af',                     // gray-400 (Filament icon)
    itemsListBg: '#f9fafb',                      // gray-50
    emptyStateColor: '#9ca3af',                  // gray-400
    listItemBg: '#f9fafb',                       // gray-50
    listItemHoverBg: '#f3f4f6',                  // gray-100
    listItemBorder: '#e5e7eb',                   // gray-200
    dragHandleColor: '#818cf8',                  // indigo-400
    itemNameColor: '#030712',                    // gray-950
    itemDescColor: '#6b7280',                    // gray-500 (Filament description)
    itemTotalColor: '#030712',                   // gray-950
    itemBreakdownColor: '#6b7280',               // gray-500
    formBg: '#ffffff',                           // white
    formBorder: '#e5e7eb',                       // gray-200
    labelColor: '#6b7280',                       // gray-500 (Filament label)
    inputBg: '#ffffff',                          // white (Filament input wrapper)
    inputBorder: 'rgba(3, 7, 18, 0.1)',         // gray-950/10 (Filament input ring)
    inputColor: '#030712',                       // gray-950 (Filament input text)
    inputPlaceholder: '#9ca3af',                 // gray-400 (Filament placeholder)
    stepperBg: '#ffffff',                        // white
    stepperBorder: 'rgba(3, 7, 18, 0.1)',       // gray-950/10
    stepperButtonColor: '#6b7280',               // gray-500
    submitBg: '#4f46e5',                         // indigo-600
    submitHoverBg: '#4338ca',                    // indigo-700
    submitShadow: 'rgba(79, 70, 229, 0.15)',
    footerBg: '#f9fafb',                         // gray-50
    footerBorder: '#e5e7eb',                     // gray-200
    footerColor: '#6b7280',                      // gray-500
    footerLinkColor: '#4f46e5',                  // indigo-600
    deleteHoverColor: '#ef4444',                 // red-500
    deleteHoverBg: '#fef2f2',                    // red-50
  };

  return {
    colors,
    container: {
      width: '100%',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    },
    card: {
      width: '100%',
      backgroundColor: colors.cardBg,
      borderRadius: '0.75rem',                    // rounded-xl (Filament section)
      overflow: 'hidden',
      // Filament uses shadow-sm + ring-1 (ring as inset box-shadow)
      boxShadow: `${colors.cardShadow}, 0 0 0 1px ${colors.cardBorder}`,
    },
    header: {
      backgroundColor: colors.headerBg,
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.headerBorder}`,
      cursor: 'pointer',
      userSelect: 'none',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    iconWrapper: {
      padding: '0.5rem',
      backgroundColor: colors.iconWrapperBg,
      color: colors.iconWrapperColor,
      borderRadius: '0.5rem',
    },
    title: {
      fontWeight: '600',
      fontSize: '1.125rem',
      color: colors.titleColor,
      margin: 0,
    },
    badge: {
      backgroundColor: colors.badgeBg,
      color: colors.badgeColor,
      fontSize: '0.75rem',
      fontWeight: '500',
      padding: '0.125rem 0.5rem',
      borderRadius: '9999px',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    total: {
      fontWeight: '700',
      color: colors.totalColor,
      fontSize: '1.125rem',
    },
    chevron: {
      color: colors.chevronColor,
    },
    content: {
      transition: 'all 0.3s ease-in-out',
    },
    contentExpanded: {
      maxHeight: '800px',
      opacity: 1,
    },
    contentCollapsed: {
      maxHeight: 0,
      opacity: 0,
      overflow: 'hidden',
    },
    itemsList: {
      backgroundColor: colors.itemsListBg,
      maxHeight: '300px',
      overflowY: 'auto',
    },
    emptyState: {
      padding: '2rem',
      textAlign: 'center',
      color: colors.emptyStateColor,
      fontSize: '0.875rem',
    },
    listItem: {
      position: 'relative',
      padding: '1rem',
      backgroundColor: colors.listItemBg,
      borderBottom: `1px solid ${colors.listItemBorder}`,
      transition: 'background-color 0.2s',
    },
    listItemHover: {
      backgroundColor: colors.listItemHoverBg,
    },
    deleteButton: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      padding: '0.375rem',
      color: colors.chevronColor,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '9999px',
      cursor: 'pointer',
      opacity: 0,
      transition: 'all 0.2s',
    },
    deleteButtonVisible: {
      opacity: 1,
    },
    itemContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingRight: '1.5rem',
    },
    itemHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    dragHandle: {
      fontSize: '0.75rem',
      fontWeight: '700',
      color: colors.dragHandleColor,
    },
    itemName: {
      fontWeight: '600',
      color: colors.itemNameColor,
      margin: 0,
      fontSize: '1rem',
    },
    itemDescription: {
      fontSize: '0.875rem',
      color: colors.itemDescColor,
      marginTop: '0.125rem',
      paddingLeft: '1.25rem',
      margin: '0.125rem 0 0 0',
    },
    itemPrice: {
      textAlign: 'right',
    },
    itemTotal: {
      fontWeight: '700',
      color: colors.itemTotalColor,
    },
    itemBreakdown: {
      fontSize: '0.75rem',
      color: colors.itemBreakdownColor,
      fontWeight: '500',
      marginTop: '0.125rem',
    },
    form: {
      padding: '1rem',
      backgroundColor: colors.formBg,
      borderTop: `1px solid ${colors.formBorder}`,
    },
    formRow: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '0.75rem',
    },
    quantityWrapper: {
      width: '6rem',
      flexShrink: 0,
    },
    label: {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: colors.labelColor,
      marginBottom: '0.375rem',
      marginLeft: '0.25rem',
    },
    stepper: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colors.stepperBg,
      borderRadius: '0.5rem',                     // rounded-lg (Filament input)
      overflow: 'hidden',
      height: '2.75rem',
      // Filament uses shadow-sm + ring-1
      boxShadow: `0 1px 2px 0 rgb(0 0 0 / 0.05), 0 0 0 1px ${colors.stepperBorder}`,
    },
    stepperButton: {
      width: '2rem',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.stepperButtonColor,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    stepperInput: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      color: colors.inputColor,
      fontWeight: '600',
      padding: 0,
      fontSize: '0.875rem',
    },
    inputWrapper: {
      flex: 1,
    },
    inputWithIcon: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      top: '50%',
      left: '0.75rem',
      transform: 'translateY(-50%)',
      color: colors.chevronColor,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      height: '2.75rem',
      paddingLeft: '2.25rem',
      paddingRight: '0.75rem',
      backgroundColor: colors.inputBg,
      border: 'none',
      borderRadius: '0.5rem',                     // rounded-lg (Filament input)
      fontSize: '0.875rem',
      color: colors.inputColor,
      outline: 'none',
      boxSizing: 'border-box',
      // Filament uses shadow-sm + ring-1
      boxShadow: `0 1px 2px 0 rgb(0 0 0 / 0.05), 0 0 0 1px ${colors.inputBorder}`,
    },
    submitButton: {
      width: '100%',
      marginTop: '0.5rem',
      height: '3rem',
      backgroundColor: colors.submitBg,
      color: '#ffffff',
      fontWeight: '600',
      borderRadius: '0.5rem',                     // rounded-lg (Filament button)
      boxShadow: `0 1px 2px 0 rgb(0 0 0 / 0.05), 0 4px 6px -1px ${colors.submitShadow}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '1rem',
    },
    footer: {
      padding: '0.75rem 1rem',
      backgroundColor: colors.footerBg,
      borderTop: `1px solid ${colors.footerBorder}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: colors.footerColor,
    },
    footerLink: {
      color: colors.footerLinkColor,
      fontWeight: '500',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
    },
  };
}

function InvoiceItemsComponent({ wire, mingleData }) {
  const isDark = useFilamentDarkMode();
  const styles = useMemo(() => getStyles(isDark), [isDark]);

  const [items, setItems] = useState(mingleData.items || []);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [formData, setFormData] = useState({
    quantity: 1,
    name: '',
    description: '',
    price: '',
    weight: ''
  });

  useEffect(() => {
    wire.updateItems(items);
  }, [items]);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (change) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: formData.quantity,
      price: parseFloat(formData.price),
      description: formData.description,
      weight: formData.weight
    };

    setItems([...items, newItem]);

    setFormData({
      quantity: 1,
      name: '',
      description: '',
      price: '',
      weight: ''
    });
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <header
          style={styles.header}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div style={styles.headerLeft}>
            <div style={styles.iconWrapper}>
              <LayoutGrid size={20} />
            </div>
            <h1 style={styles.title}>Artículos</h1>
            <span style={styles.badge}>
              {items.length}
            </span>
          </div>

          <div style={styles.headerRight}>
            <span style={styles.total}>
              ${totalAmount.toFixed(2)}
            </span>
            {isExpanded ? (
              <ChevronUp size={20} style={styles.chevron} />
            ) : (
              <ChevronDown size={20} style={styles.chevron} />
            )}
          </div>
        </header>

        {/* Content Area */}
        <div style={{
          ...styles.content,
          ...(isExpanded ? styles.contentExpanded : styles.contentCollapsed)
        }}>
          {/* Items List */}
          <div style={styles.itemsList}>
            {items.length === 0 ? (
              <div style={styles.emptyState}>
                No hay artículos agregados aún.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {items.map(item => (
                  <li
                    key={item.id}
                    style={{
                      ...styles.listItem,
                      ...(hoveredItem === item.id ? styles.listItemHover : {}),
                    }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        ...styles.deleteButton,
                        ...(hoveredItem === item.id ? styles.deleteButtonVisible : {}),
                      }}
                      aria-label="Eliminar artículo"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = styles.colors.deleteHoverColor;
                        e.currentTarget.style.backgroundColor = styles.colors.deleteHoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = styles.colors.chevronColor;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <X size={16} />
                    </button>

                    <div style={styles.itemContent}>
                      <div>
                        <div style={styles.itemHeader}>
                          <span style={styles.dragHandle}>
                            ⋮⋮
                          </span>
                          <h3 style={styles.itemName}>
                            {item.name}
                          </h3>
                        </div>
                        {item.description && (
                          <p style={styles.itemDescription}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div style={styles.itemPrice}>
                        <div style={styles.itemTotal}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div style={styles.itemBreakdown}>
                          {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Item Form */}
          <div style={styles.form}>
            <form onSubmit={handleSubmit}>
              {/* Row 1: Quantity & Name */}
              <div style={styles.formRow}>
                {/* Quantity Stepper */}
                <div style={styles.quantityWrapper}>
                  <label style={styles.label}>
                    Cant.
                  </label>
                  <div style={styles.stepper}>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      style={styles.stepperButton}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      style={styles.stepperInput}
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      style={styles.stepperButton}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Name Input */}
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>
                    Nombre del artículo
                  </label>
                  <div style={styles.inputWithIcon}>
                    <div style={styles.inputIcon}>
                      <Package size={16} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej. Caja de herramientas"
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Description */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={styles.inputWithIcon}>
                  <div style={styles.inputIcon}>
                    <AlignLeft size={16} />
                  </div>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción (opcional)"
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Row 3: Price & Weight */}
              <div style={styles.formRow}>
                <div style={styles.inputWrapper}>
                  <div style={styles.inputWithIcon}>
                    <div style={styles.inputIcon}>
                      <DollarSign size={16} />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Precio unitario"
                      style={styles.input}
                      required
                      step="0.01"
                    />
                  </div>
                </div>
                <div style={styles.inputWrapper}>
                  <div style={styles.inputWithIcon}>
                    <div style={styles.inputIcon}>
                      <Scale size={16} />
                    </div>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Peso (opcional)"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.colors.submitHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.colors.submitBg;
                }}
              >
                <Plus size={20} strokeWidth={3} />
                <span>Añadir Artículo</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Summary (Always visible when collapsed) */}
        {!isExpanded && (
          <div style={styles.footer}>
            <span>{items.length} artículos en la lista</span>
            <button
              onClick={() => setIsExpanded(true)}
              style={styles.footerLink}
            >
              Ver detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Mingle boot function
window.Mingle = window.Mingle || { Elements: {} };

window.Mingle.Elements['resources/js/Mingles/InvoiceItemsReact.jsx'] = {
  boot: function(mingleId, livewireId) {
    const container = document.getElementById(mingleId);
    const mingleData = JSON.parse(container.dataset.mingleData || '{}');
    const wire = Livewire.find(livewireId);

    const root = createRoot(container);
    root.render(<InvoiceItemsComponent wire={wire} mingleData={mingleData} />);
  }
};

export default InvoiceItemsComponent;
