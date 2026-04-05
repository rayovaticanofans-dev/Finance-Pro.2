import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { CategoryTree } from './CategoryTree';
import type { CategoryNode } from '@/types/category';
import { generateId } from '@/utils/id';

const EMOJI_LIST = [
  '🍔','🚗','🏠','🎬','💊','📚','🛍️','📱','📈','💰','✈️','🎮','🎵','⚽','🍷',
  '☕','🐶','🌿','💻','📸','🎓','🏋️','🎁','🔧','🍕','🏦','💡','🌙','❤️','⭐',
  '🎯','🚀','🎪','🌊','🏔️','🎭','🎨','🎲','🔑','💎','🌺','🦋','🍀','🎸','🥑',
  '🧘','🚴','🏊','🧠','🗺️',
];

const COLORS = [
  '#3B82F6','#22C55E','#F59E0B','#EF4444','#8B5CF6','#EC4899',
  '#14B8A6','#F97316','#06B6D4','#84CC16',
];

interface CustomCategory extends CategoryNode {
  isCustom: true;
}

const STORAGE_KEY = 'fp-v3:customCategories';

function loadCustom(): CustomCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CustomCategory[];
  } catch { /* ignore */ }
  return [];
}

function saveCustom(cats: CustomCategory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  } catch { /* ignore */ }
}

export function CategoryManager() {
  const { isDark } = useTheme();
  const [customCats, setCustomCats] = useState<CustomCategory[]>(loadCustom);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<CustomCategory | null>(null);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📁');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isDark ? '#94A3B8' : '#6B7280',
    marginBottom: '6px',
    display: 'block',
  };

  const openCreateForm = useCallback(() => {
    setEditTarget(null);
    setName('');
    setSelectedEmoji('📁');
    setSelectedColor('#3B82F6');
    setParentId(undefined);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((node: CategoryNode) => {
    if (!node.isCustom) return;
    setEditTarget(node as CustomCategory);
    setName(node.label);
    setSelectedEmoji(node.emoji);
    setSelectedColor(node.color);
    setParentId(node.parentId);
    setShowForm(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    if (editTarget) {
      const updated = customCats.map((c) =>
        c.id === editTarget.id
          ? { ...c, label: name.trim(), emoji: selectedEmoji, color: selectedColor }
          : c
      );
      setCustomCats(updated);
      saveCustom(updated);
    } else {
      const newCat: CustomCategory = {
        id: generateId(),
        label: name.trim(),
        emoji: selectedEmoji,
        color: selectedColor,
        parentId,
        isCustom: true,
      };
      const updated = [...customCats, newCat];
      setCustomCats(updated);
      saveCustom(updated);
    }
    setShowForm(false);
  }, [name, selectedEmoji, selectedColor, parentId, editTarget, customCats]);

  const handleDelete = useCallback((id: string) => {
    if (deleteConfirmId === id) {
      const updated = customCats.filter((c) => c.id !== id);
      setCustomCats(updated);
      saveCustom(updated);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  }, [deleteConfirmId, customCats]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
          Categorías
        </h3>
        <Button variant="primary" size="sm" onClick={openCreateForm}>+ Nueva</Button>
      </div>

      {/* Default categories tree */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#6B7280' : '#9CA3AF', marginBottom: '8px' }}>
          Categorías predeterminadas
        </div>
        <CategoryTree />
      </div>

      {/* Custom categories list */}
      {customCats.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#6B7280' : '#9CA3AF', marginBottom: '8px' }}>
            Mis categorías
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {customCats.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B' }}>
                  {cat.label}
                </span>
                <button onClick={() => openEditForm(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: isDark ? '#94A3B8' : '#6B7280' }}>✏️</button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: deleteConfirmId === cat.id ? '#EF4444' : isDark ? '#94A3B8' : '#6B7280' }}
                >
                  {deleteConfirmId === cat.id ? '¿Confirmar?' : '🗑️'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '480px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
              {editTarget ? 'Editar categoría' : 'Nueva categoría'}
            </h3>

            <div>
              <label style={labelStyle}>Nombre</label>
              <input type="text" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de categoría" />
            </div>

            <div>
              <label style={labelStyle}>Emoji</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', maxHeight: '160px', overflowY: 'auto', padding: '4px' }}>
                {EMOJI_LIST.map((e) => (
                  <button
                    key={e}
                    onClick={() => setSelectedEmoji(e)}
                    style={{
                      fontSize: '20px',
                      padding: '6px',
                      border: e === selectedEmoji ? '2px solid #3B82F6' : '2px solid transparent',
                      borderRadius: '8px',
                      background: e === selectedEmoji ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)') : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Color</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: c,
                      border: c === selectedColor ? '3px solid white' : '3px solid transparent',
                      outline: c === selectedColor ? `2px solid ${c}` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="ghost" size="md" onClick={() => setShowForm(false)} fullWidth>Cancelar</Button>
              <Button variant="primary" size="md" onClick={handleSave} fullWidth disabled={!name.trim()}>
                {editTarget ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
