import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useProfiles } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/Button';
import type { Profile } from '@/types/profile';

interface AvatarProps {
  profile: Profile;
  size?: number;
  isActive?: boolean;
}

function Avatar({ profile, size = 40, isActive }: AvatarProps) {
  const color = profile.color ?? '#3B82F6';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 800,
        color: '#fff',
        flexShrink: 0,
        border: isActive ? `3px solid ${color}` : '3px solid transparent',
        outline: isActive ? `2px solid ${color}` : 'none',
        boxShadow: isActive ? `0 0 0 2px ${color}44` : 'none',
      }}
    >
      {profile.name.charAt(0).toUpperCase()}
    </div>
  );
}

export function ProfileSwitcher() {
  const { isDark } = useTheme();
  const { profiles, activeProfile, addProfile, removeProfile, setActiveProfile } = useProfiles();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreate = useCallback(() => {
    if (!newName.trim()) return;
    addProfile(newName.trim());
    setNewName('');
    setShowCreate(false);
  }, [newName, addProfile]);

  const handleDelete = useCallback((id: string) => {
    if (deleteConfirmId === id) {
      removeProfile(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  }, [deleteConfirmId, removeProfile]);

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    flex: 1,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {profiles.map((profile) => {
        const isActive = profile.id === activeProfile.id;
        return (
          <div
            key={profile.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: isActive
                ? (isDark ? `${profile.color ?? '#3B82F6'}22` : `${profile.color ?? '#3B82F6'}11`)
                : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
              border: `2px solid ${isActive ? (profile.color ?? '#3B82F6') : 'transparent'}`,
              transition: 'all 0.15s',
            }}
          >
            <Avatar profile={profile} size={44} isActive={isActive} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
                {profile.name}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
                {new Date(profile.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
            {isActive ? (
              <span style={{ fontSize: '12px', fontWeight: 700, color: profile.color ?? '#3B82F6', padding: '4px 10px', borderRadius: '20px', background: `${profile.color ?? '#3B82F6'}22` }}>
                Activo
              </span>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button variant="secondary" size="sm" onClick={() => setActiveProfile(profile.id)}>
                  Cambiar
                </Button>
                {profiles.length > 1 && (
                  <button
                    onClick={() => handleDelete(profile.id)}
                    style={{
                      padding: '5px 8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: deleteConfirmId === profile.id ? '#EF4444' : (isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)'),
                      color: deleteConfirmId === profile.id ? '#fff' : '#EF4444',
                      fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                    }}
                  >
                    {deleteConfirmId === profile.id ? '¿Sí?' : '🗑️'}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {showCreate ? (
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <input
            type="text"
            style={inputStyle}
            value={newName}
            placeholder="Nombre del perfil"
            maxLength={30}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowCreate(false); }}
            autoFocus
          />
          <Button variant="primary" size="sm" onClick={handleCreate} disabled={!newName.trim()}>
            Crear
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
            ×
          </Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShowCreate(true)}>
          + Nuevo perfil
        </Button>
      )}
    </div>
  );
}
