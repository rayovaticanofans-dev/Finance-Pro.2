import React, { useEffect, useState } from 'react';

const TIPS = ['Registra cada gasto', 'Ahorra para el futuro', 'Controla tu presupuesto', 'Alcanza tus metas'];

export function SplashScreen() {
  const [tipIdx, setTipIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(95, p + 5)), 100);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E293B)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', color: '#F1F5F9' }}>
      <div style={{ fontSize: '64px', animation: 'pulse 2s ease-in-out infinite' }}>💰</div>
      <div style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FinancePro</div>
      <div style={{ width: '200px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#3B82F6,#8B5CF6)', borderRadius: '2px', transition: 'width 0.1s linear' }} />
      </div>
      <div style={{ fontSize: '13px', color: '#64748B', fontStyle: 'italic', transition: 'opacity 0.3s' }}>{TIPS[tipIdx]}</div>
      <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>
    </div>
  );
}
