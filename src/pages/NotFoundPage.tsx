import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '24px', background: isDark ? '#0F172A' : '#F8FAFC', textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(80px,15vw,140px)', fontWeight: 900, background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>Página no encontrada</div>
      <div style={{ fontSize: '14px', color: isDark ? '#6B7280' : '#9CA3AF', maxWidth: '320px' }}>La página que buscas no existe o fue movida a otra dirección.</div>
      <Button variant="primary" size="md" onClick={() => navigate('/')}>← Volver al inicio</Button>
    </div>
  );
}
