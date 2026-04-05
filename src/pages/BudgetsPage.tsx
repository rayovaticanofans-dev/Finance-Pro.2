import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { BudgetList } from '@/components/budgets/BudgetList';
import { BudgetAlerts } from '@/components/budgets/BudgetAlerts';
import { BudgetForm } from '@/components/budgets/BudgetForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useBudget } from '@/hooks/useBudget';
import { useFinance } from '@/hooks/useFinance';
import type { Budget } from '@/types/budget';

export default function BudgetsPage() {
  const { budgets, addBudget, updateBudget, deleteBudget, getAlertsForBudgets } = useBudget();
  const { items } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | undefined>(undefined);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const alerts = getAlertsForBudgets(budgets, items).filter(a => !dismissedAlerts.includes(a.budgetId));

  return (
    <PageContainer title="Presupuestos" actions={<Button variant="primary" size="sm" onClick={() => { setEditBudget(undefined); setShowForm(true); }}>+ Nuevo</Button>}>
      {alerts.length > 0 && <div style={{ marginBottom: '16px' }}><BudgetAlerts alerts={alerts} onDismiss={id => setDismissedAlerts(p => [...p, id])} /></div>}
      <BudgetList budgets={budgets} items={items} onAdd={() => setShowForm(true)} onEdit={b => { setEditBudget(b); setShowForm(true); }} onDelete={deleteBudget} />
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditBudget(undefined); }} title={editBudget ? 'Editar presupuesto' : 'Nuevo presupuesto'} size="sm">
        <BudgetForm editBudget={editBudget} onSave={data => { editBudget ? updateBudget({ ...editBudget, ...data }) : addBudget(data); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      </Modal>
    </PageContainer>
  );
}
