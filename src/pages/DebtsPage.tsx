import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { generateId } from '@/utils/id';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface Debt {
  id: string;
  name: string;
  amount: number;
  creditor: string;
  type: 'owed' | 'collect';
  dueDate?: string;
  paid: boolean;
  createdAt: string;
}

function loadDebts(): Debt[] {
  try { const r = localStorage.getItem('fp-v3:debts'); return r ? JSON.parse(r) as Debt[] : []; } catch { return []; }
}
function saveDebts(d: Debt[]): void { try { localStorage.setItem('fp-v3:debts', JSON.stringify(d)); } catch {} }

export default function DebtsPage() {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const [debts, setDebts] = useState<Debt[]>(loadDebts);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [creditor, setCreditor] = useState('');
  const [type, setType] = useState<'owed' | 'collect'>('owed');
  const [dueDate, setDueDate] = useState('');

  const updateDebts = (d: Debt[]) => { setDebts(d); saveDebts(d); };
  const totalOwed = debts.filter(d => !d.paid && d.type === 'owed').reduce((s, d) => s + d.amount, 0);
  const totalCollect = debts.filter(d => !d.paid && d.type === 'collect').reduce((s, d) => s + d.amount, 0);

  const inp: React.CSSProperties = { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '8px', padding: '8px 12px', color: isDark ? '#F1F5F9' : '#1E293B', fontSize: '14px', fontFamily: 'inherit', outline: 'none', width: '100%' };

  const handleAdd = () => {
    if (!name.trim() || !amount) return;
    const d: Debt = { id: generateId(), name: name.trim(), amount: parseFloat(amount), creditor: creditor.trim(), type, dueDate: dueDate || undefined, paid: false, createdAt: new Date().toISOString() };
    updateDebts([...debts, d]);
    setShowForm(false); setName(''); setAmount(''); setCreditor(''); setDueDate('');
  };

  return (
    <PageContainer title="Deudas" actions={<Button variant="primary" size="sm" onClick={() => setShowForm(true)}>+ Nueva</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[['Debo', totalOwed, '#EF4444'], ['Me deben', totalCollect, '#22C55E']].map(([l, v, c]) => (
          <div key={l as string} style={{ padding: '16px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
            <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600 }}>{l as string}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: c as string, marginTop: '4px' }}>{formatAmount(v as number)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {debts.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#6B7280' : '#9CA3AF' }}>No hay deudas registradas</div>}
        {debts.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`, opacity: d.paid ? 0.5 : 1 }}>
            <span style={{ fontSize: '20px' }}>{d.type === 'owed' ? '📤' : '📥'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', textDecoration: d.paid ? 'line-through' : 'none' }}>{d.name}</div>
              <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>{d.creditor}{d.dueDate ? ` · ${d.dueDate}` : ''}</div>
            </div>
            <span style={{ fontWeight: 700, color: d.type === 'owed' ? '#EF4444' : '#22C55E', fontSize: '15px' }}>{formatAmount(d.amount)}</span>
            {!d.paid && <button onClick={() => updateDebts(debts.map(x => x.id === d.id ? { ...x, paid: true } : x))} style={{ background: 'rgba(34,197,94,0.15)', border: 'none', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', color: '#22C55E', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>✓ Pagado</button>}
            <button onClick={() => updateDebts(debts.filter(x => x.id !== d.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '16px' }}>×</button>
          </div>
        ))}
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nueva deuda" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['owed', 'collect'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontFamily: 'inherit', fontWeight: 600, fontSize: '13px', cursor: 'pointer', background: type === t ? (t === 'owed' ? '#EF4444' : '#22C55E') : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'), color: type === t ? '#fff' : isDark ? '#CBD5E1' : '#374151' }}>{t === 'owed' ? '📤 Debo' : '📥 Me deben'}</button>
            ))}
          </div>
          <input style={inp} placeholder="Concepto" value={name} onChange={e => setName(e.target.value)} />
          <input style={inp} type="number" placeholder="Monto" value={amount} onChange={e => setAmount(e.target.value)} />
          <input style={inp} placeholder="Persona/Entidad" value={creditor} onChange={e => setCreditor(e.target.value)} />
          <input style={inp} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" size="md" onClick={() => setShowForm(false)} fullWidth>Cancelar</Button>
            <Button variant="primary" size="md" onClick={handleAdd} fullWidth>Agregar</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
