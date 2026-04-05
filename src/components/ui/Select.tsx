import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  renderOption?: (option: SelectOption) => React.ReactNode;
  id?: string;
}

export const Select = React.memo(function Select({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  label,
  error,
  disabled = false,
  searchable = false,
  renderOption,
  id,
}: SelectProps) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = id ?? (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  // Group options
  const groups = filteredOptions.reduce<Record<string, SelectOption[]>>((acc, opt) => {
    const key = opt.group ?? '__default__';
    if (!acc[key]) acc[key] = [];
    acc[key].push(opt);
    return acc;
  }, {});

  const flatFiltered = filteredOptions;

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) {
        setSearch('');
        setFocusedIndex(-1);
      }
      return !prev;
    });
  }, [disabled]);

  const handleSelect = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled) return;
      onChange?.(opt.value);
      setOpen(false);
      setSearch('');
    },
    [onChange]
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus search input when opened
  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open, searchable]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && flatFiltered[focusedIndex]) {
            handleSelect(flatFiltered[focusedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [open, flatFiltered, focusedIndex, handleSelect]
  );

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[focusedIndex] as HTMLElement | undefined;
    item?.scrollIntoView?.({ block: 'nearest' });
  }, [focusedIndex]);

  const hasError = !!error;

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
    border: hasError
      ? '1.5px solid #EF4444'
      : open
      ? '1.5px solid #6366F1'
      : `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    fontSize: '14px',
    color: selectedOption ? (isDark ? '#F1F5F9' : '#1E293B') : isDark ? '#6B7280' : '#9CA3AF',
    boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    background: isDark ? '#1E1E2E' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
    borderRadius: '12px',
    boxShadow: isDark
      ? '0 20px 40px rgba(0,0,0,0.5)'
      : '0 20px 40px rgba(0,0,0,0.15)',
    zIndex: 1000,
    maxHeight: '280px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'fp-dropdown-in 0.15s ease',
  };

  const renderOptionItem = (opt: SelectOption, idx: number) => {
    const isFocused = idx === focusedIndex;
    const isSelected = opt.value === value;
    return (
      <li
        key={opt.value}
        role="option"
        aria-selected={isSelected}
        aria-disabled={opt.disabled}
        onClick={() => handleSelect(opt)}
        onMouseEnter={() => setFocusedIndex(idx)}
        style={{
          padding: '9px 14px',
          cursor: opt.disabled ? 'not-allowed' : 'pointer',
          opacity: opt.disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: isSelected ? 600 : 400,
          background: isFocused
            ? isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'
            : isSelected
            ? isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)'
            : 'transparent',
          color: isSelected ? '#6366F1' : isDark ? '#F1F5F9' : '#1E293B',
          transition: 'background 0.15s ease',
        }}
      >
        {opt.icon && <span>{opt.icon}</span>}
        {renderOption ? renderOption(opt) : opt.label}
        {isSelected && (
          <svg style={{ marginLeft: 'auto' }} width="14" height="14" fill="#6366F1" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
        )}
      </li>
    );
  };

  return (
    <>
      <style>{`@keyframes fp-dropdown-in { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label
            htmlFor={selectId}
            style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#374151', userSelect: 'none' }}
          >
            {label}
          </label>
        )}
        <div ref={containerRef} style={{ position: 'relative' }}>
          <div
            id={selectId}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={hasError}
            tabIndex={disabled ? -1 : 0}
            style={triggerStyle}
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              {selectedOption?.icon && <span>{selectedOption.icon}</span>}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedOption?.label ?? placeholder}
              </span>
            </span>
            <svg
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
            >
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </div>

          {open && (
            <div style={dropdownStyle}>
              {searchable && (
                <div style={{ padding: '8px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6'}` }}>
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      background: isDark ? 'rgba(255,255,255,0.06)' : '#F9FAFB',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: isDark ? '#F1F5F9' : '#1E293B',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
              <ul
                ref={listRef}
                role="listbox"
                style={{ margin: 0, padding: '6px 0', listStyle: 'none', overflowY: 'auto', flex: 1 }}
              >
                {Object.entries(groups).map(([grp, opts]) => (
                  <React.Fragment key={grp}>
                    {grp !== '__default__' && (
                      <li
                        style={{
                          padding: '5px 14px 3px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: isDark ? '#6B7280' : '#9CA3AF',
                        }}
                      >
                        {grp}
                      </li>
                    )}
                    {opts.map((opt) => renderOptionItem(opt, flatFiltered.indexOf(opt)))}
                  </React.Fragment>
                ))}
                {flatFiltered.length === 0 && (
                  <li style={{ padding: '12px 14px', color: isDark ? '#6B7280' : '#9CA3AF', fontSize: '14px', textAlign: 'center' }}>
                    Sin resultados
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        {error && (
          <span style={{ fontSize: '12px', color: '#EF4444' }} role="alert">{error}</span>
        )}
      </div>
    </>
  );
});
