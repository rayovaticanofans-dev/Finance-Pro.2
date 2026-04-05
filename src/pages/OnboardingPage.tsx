import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/contexts/SettingsContext';
import { useProfiles } from '@/contexts/ProfilesContext';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { CURRENCIES } from '@/constants/currencies';
import type { Currency } from '@/types/currency';

const STEPS = ['Bienvenida', 'Perfil', 'Moneda', 'Transacción', 'Presupuesto'];

const TIPS = ['Registra tus gastos diariamente', 'El ahorro constante crea riqueza', 'Controla tus presupuestos', 'Fija metas y alcánzalas'];

export default function OnboardingPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { updateSettings } = useSettings();
  const { addProfile } = useProfiles();
  const { setCurrency } = useCurrencyContext();
  const [step, setStep] = useState(0);
  const [profileName, setProfileName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [tipIdx] = useState(0);

  const finish = () => { updateSettings({ firstRun: false }); navigate('/'); };
  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); else finish(); };
  const prev = () => setStep(s => s - 1);

  const inp: React.CSSProperties = { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', padding: '12px 16px', color: isDark ? '#F1F5F9' : '#1E293B', fontSize: '16px', fontFamily: 'inherit', outline: 'none', width: '100%', textAlign: 'center' as const };

  const handleStep1Next = () => {
    if (profileName.trim()) addProfile(profileName.trim());
    next();
  };

  const handleStep2Next = () => {
    setCurrency(selectedCurrency);
    next();
  };

  const slide: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0', textAlign: 'center', animation: 'fadeIn 0.3s ease' };

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#0F172A' : '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ width: '100%', maxWidth: '480px', background: isDark ? '#1E293B' : '#fff', borderRadius: '24px', padding: '32px 28px', boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= step ? 'linear-gradient(90deg,#3B82F6,#6366F1)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), transition: 'background 0.3s' }} />
          ))}
        </div>

        {step === 0 && (
          <div style={slide}>
            <div style={{ fontSize: '64px' }}>💰</div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: isDark ? '#F1F5F9' : '#1E293B', margin: 0 }}>Bienvenido a FinancePro</h1>
            <p style={{ fontSize: '15px', color: isDark ? '#94A3B8' : '#6B7280', margin: 0, lineHeight: 1.6 }}>Tu app de finanzas personales. Controla gastos, crea presupuestos y alcanza tus metas financieras.</p>
            <div style={{ padding: '14px', borderRadius: '12px', background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)', color: isDark ? '#93C5FD' : '#3B82F6', fontSize: '13px', fontStyle: 'italic' }}>
              💡 {TIPS[tipIdx]}
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={slide}>
            <div style={{ fontSize: '48px' }}>👤</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B', margin: 0 }}>¿Cómo te llamas?</h2>
            <p style={{ fontSize: '14px', color: isDark ? '#6B7280' : '#9CA3AF', margin: 0 }}>Crea tu primer perfil personal</p>
            <input style={inp} placeholder="Tu nombre" value={profileName} onChange={e => setProfileName(e.target.value)} autoFocus />
          </div>
        )}

        {step === 2 && (
          <div style={slide}>
            <div style={{ fontSize: '48px' }}>💱</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B', margin: 0 }}>¿Cuál es tu moneda?</h2>
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(Object.keys(CURRENCIES) as Currency[]).slice(0, 6).map(c => (
                <button key={c} onClick={() => setSelectedCurrency(c)} style={{ padding: '10px', borderRadius: '10px', border: `2px solid ${selectedCurrency === c ? '#3B82F6' : 'transparent'}`, background: selectedCurrency === c ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'), cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', fontSize: '13px' }}>
                  {CURRENCIES[c].symbol} {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={slide}>
            <div style={{ fontSize: '48px' }}>📝</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B', margin: 0 }}>Registra transacciones</h2>
            <p style={{ fontSize: '14px', color: isDark ? '#6B7280' : '#9CA3AF', margin: 0, lineHeight: 1.6 }}>Agrega ingresos y gastos fácilmente. Filtra por categoría, fecha y más para entender tus finanzas.</p>
            <div style={{ width: '100%', padding: '14px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', textAlign: 'left' }}>
              {['💰 Registra ingresos y gastos', '🏷️ Organiza por categorías', '🔄 Configura pagos recurrentes', '📊 Divide gastos compartidos'].map(t => (
                <div key={t} style={{ fontSize: '13px', color: isDark ? '#CBD5E1' : '#374151', padding: '6px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>{t}</div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={slide}>
            <div style={{ fontSize: '48px' }}>🎯</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B', margin: 0 }}>¡Todo listo!</h2>
            <p style={{ fontSize: '14px', color: isDark ? '#6B7280' : '#9CA3AF', margin: 0, lineHeight: 1.6 }}>Ya puedes empezar a gestionar tus finanzas. Crea presupuestos, define metas y toma control de tu dinero.</p>
            <div style={{ fontSize: '48px' }}>🚀</div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
          {step > 0 && <Button variant="ghost" size="md" onClick={prev} fullWidth>← Atrás</Button>}
          <Button variant="primary" size="md" onClick={step === 1 ? handleStep1Next : step === 2 ? handleStep2Next : next} fullWidth>
            {step === STEPS.length - 1 ? '🚀 Comenzar' : 'Siguiente →'}
          </Button>
        </div>
        <button onClick={finish} style={{ display: 'block', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#6B7280' : '#9CA3AF', fontSize: '12px', marginTop: '12px', fontFamily: 'inherit' }}>Omitir introducción</button>
      </div>
    </div>
  );
}
