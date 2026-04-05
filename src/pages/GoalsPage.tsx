import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { GoalsList } from '@/components/goals/GoalsList';
import { GoalForm } from '@/components/goals/GoalForm';
import { GoalContribute } from '@/components/goals/GoalContribute';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useGoals } from '@/hooks/useGoals';
import type { SavingsGoal } from '@/types/goals';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addContribution } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<SavingsGoal | undefined>(undefined);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | undefined>(undefined);

  return (
    <PageContainer title="Metas" actions={<Button variant="primary" size="sm" onClick={() => { setEditGoal(undefined); setShowForm(true); }}>+ Nueva meta</Button>}>
      <GoalsList goals={goals} onAdd={() => setShowForm(true)} onContribute={g => setContributeGoal(g)} onEdit={g => { setEditGoal(g); setShowForm(true); }} onDelete={deleteGoal} />
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditGoal(undefined); }} title={editGoal ? 'Editar meta' : 'Nueva meta'} size="md">
        <GoalForm editGoal={editGoal} onSave={data => { editGoal ? updateGoal({ ...editGoal, ...data }) : addGoal(data); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      </Modal>
      <Modal isOpen={!!contributeGoal} onClose={() => setContributeGoal(undefined)} title="Agregar contribución" size="sm">
        {contributeGoal && <GoalContribute goal={contributeGoal} onSave={(id, amt, note) => { addContribution(id, amt, note); setContributeGoal(undefined); }} onCancel={() => setContributeGoal(undefined)} />}
      </Modal>
    </PageContainer>
  );
}
