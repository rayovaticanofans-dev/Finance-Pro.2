import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { generateId } from '@/utils/id';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface Investment {
  id: string;
  name: string;
  symbol: string;
  initialValue: number;
  currentValue: number;
  createdAt: string;
}

function load(): Investment[] { try { const r = localStorage.getItem('fp-v3:investments'); return r ? JSON.parse(r) as Investment[] : []; } catch { return []; } }
function save(d: Investment[]): void { try { localStorage.setItem('fp-v3:investments', JSON.stringify(d)); } catch {} }

export default function InvestmentsPage() {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const [investments, setInvestments] = useState<Investment[]>(load);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [initial, setInitial] = useState('');
  const [current, setCurrent] = useState('');

  const update = (d: Investment[]) => { setInvestments(d); save(d); };
  const totalInitial = investments.reduce((s, i) => s + i.initialValue, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalReturn = totalInitial > 0 ? ((totalCurrent - totalInitial) / totalInitial) * 100 : 0;

  const inp: React.CSSProperties = { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '8px', padding: '8px 12px', color: isDark ? '#F1F5F9' : '#1E293B', fontSize: '14px', fontFamily: 'inherit', outline: 'none', width: '100%' };

  const handleAdd = () => {
    if (!name.trim() || !initial) return;
    const inv: Investment = { id: generateId(), name: name.trim(), symbol: symbol.toUpperCase(), initialValue: parseFloat(initial), currentValue: parseFloat(current) || parseFloat(initial), createdAt: new Date().toISOString() };
    update([...investments, inv]);
    setShowForm(false); setName(''); setSymbol(''); setInitial(''); setCurrent('');
  };

  return (
    <PageContainer title="Inversiones" actions={<Button variant="primary" size="sm" onClick={() => setShowForm(true)}>+ Nueva</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[['Invertido', totalInitial, isDark ? '#CBD5E1' : '#374151'], ['Valor actual', totalCurrent, '#3B82F6'], ['Retorno', totalReturn, totalReturn >= 0 ? '#22C55E' : '#EF4444']].map(([l, v, c]) => (
          <div key={l as string} style={{ padding: '14px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
            <div style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600 }}>{l as string}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: c as string, marginTop: '4px' }}>{l === 'Retorno' ? `${(v as number).toFixed(1)}%` : formatAmount(v as number)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {investments.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#6B7280' : '#9CA3AF' }}>No hay inversiones registradas</div>}
        {investments.map(inv => {
          const ret = inv.initialValue > 0 ? ((inv.currentValue - inv.initialValue) / inv.initialValue) * 100 : 0;
          return (
            <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '12px' }}>{inv.symbol.slice(0,3) || '📈'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>{inv.name}</div>
                <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>Inicial: {formatAmount(inv.initialValue)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>{formatAmount(inv.currentValue)}</div>
                <div style={{ fontSize: '12px', color: ret >= 0 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{ret >= 0 ? '+' : ''}{ret.toFixed(1)}%</div>
              </div>
              <button onClick={() => update(investments.filter(x => x.id !== inv.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '16px' }}>×</button>
            </div>
          );
        })}
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nueva inversión" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input style={inp} placeholder="Nombre (ej. Apple)" value={name} onChange={e => setName(e.target.value)} />
          <input style={inp} placeholder="Símbolo (ej. AAPL)" value={symbol} onChange={e => setSymbol(e.target.value)} />
          <input style={inp} type="number" placeholder="Valor inicial" value={initial} onChange={e => setInitial(e.target.value)} />
          <input style={inp} type="number" placeholder="Valor actual" value={current} onChange={e => setCurrent(e.target.value)} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" size="md" onClick={() => setShowForm(false)} fullWidth>Cancelar</Button>
            <Button variant="primary" size="md" onClick={handleAdd} fullWidth>Agregar</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
