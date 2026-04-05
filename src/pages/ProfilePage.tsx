import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { useProfiles } from '@/hooks/useProfiles';
import { useFinance } from '@/hooks/useFinance';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { isDark } = useTheme();
  const { activeProfile, updateProfile, removeProfile, profiles } = useProfiles();
  const { items } = useFinance();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(activeProfile.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const totalTx = items.length;
  const balance = items.reduce((s, i) => s + (i.type === 'income' ? i.amount : -i.amount), 0);
  const color = activeProfile.color ?? '#3B82F6';

  const handleSave = () => {
    if (name.trim()) updateProfile({ ...activeProfile, name: name.trim() });
    setEditing(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    removeProfile(activeProfile.id);
    navigate('/');
  };

  const inp: React.CSSProperties = { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '10px', padding: '10px 14px', color: isDark ? '#F1F5F9' : '#1E293B', fontSize: '16px', fontFamily: 'inherit', outline: 'none', width: '100%', textAlign: 'center' as const };

  return (
    <PageContainer title="Perfil">
      <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center', padding: '32px 20px', borderRadius: '20px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 800, color: '#fff', margin: '0 auto 16px' }}>
            {activeProfile.name.charAt(0).toUpperCase()}
          </div>
          {editing ? (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input style={inp} value={name} onChange={e => setName(e.target.value)} autoFocus />
              <Button variant="primary" size="sm" onClick={handleSave}>✓</Button>
              <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setName(activeProfile.name); }}>×</Button>
            </div>
          ) : (
            <div style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B', marginBottom: '4px' }}>{activeProfile.name}</div>
          )}
          <div style={{ fontSize: '13px', color: isDark ? '#6B7280' : '#9CA3AF' }}>Desde {new Date(activeProfile.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</div>
          {!editing && <button onClick={() => setEditing(true)} style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', color: color, fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}>✏️ Editar nombre</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
          {[['Transacciones', totalTx, isDark ? '#CBD5E1' : '#374151'], ['Balance', balance.toFixed(0), balance >= 0 ? '#22C55E' : '#EF4444'], ['Perfiles', profiles.length, '#3B82F6']].map(([l, v, c]) => (
            <div key={l as string} style={{ padding: '14px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`, textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: c as string }}>{v}</div>
              <div style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', marginTop: '4px' }}>{l as string}</div>
            </div>
          ))}
        </div>

        {profiles.length > 1 && (
          <Button variant={confirmDelete ? 'danger' : 'ghost'} size="md" onClick={handleDelete} fullWidth>
            {confirmDelete ? '¿Confirmar eliminación?' : '🗑️ Eliminar perfil'}
          </Button>
        )}
        {confirmDelete && <button onClick={() => setConfirmDelete(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#6B7280' : '#9CA3AF', fontSize: '12px', fontFamily: 'inherit', textAlign: 'center' }}>Cancelar</button>}
      </div>
    </PageContainer>
  );
}
