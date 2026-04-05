import type { Item } from '@/types/finance';
import type { Budget } from '@/types/budget';
import type { SavingsGoal } from '@/types/goals';

export function isValidAmount(amount: unknown): boolean {
  if (typeof amount !== 'number' && typeof amount !== 'string') return false;
  const n = Number(amount);
  return !isNaN(n) && isFinite(n) && n > 0;
}

export function isValidDate(date: unknown): boolean {
  if (!date) return false;
  const d = new Date(String(date));
  return !isNaN(d.getTime());
}

export function validateItem(item: Partial<Item>): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!item.desc || item.desc.trim().length === 0) {
    errors.desc = 'La descripción es requerida';
  } else if (item.desc.length > 200) {
    errors.desc = 'La descripción no puede superar 200 caracteres';
  }

  if (!isValidAmount(item.amount)) {
    errors.amount = 'El monto debe ser un número positivo válido';
  }

  if (!item.type || !['income', 'expense'].includes(item.type)) {
    errors.type = 'El tipo debe ser ingreso o gasto';
  }

  if (!item.currency) {
    errors.currency = 'La moneda es requerida';
  }

  if (!item.category || item.category.trim().length === 0) {
    errors.category = 'La categoría es requerida';
  }

  if (!isValidDate(item.date)) {
    errors.date = 'La fecha no es válida';
  }

  if (item.recurring && !['none', 'daily', 'weekly', 'monthly', 'yearly'].includes(item.recurring)) {
    errors.recurring = 'El tipo de recurrencia no es válido';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBudget(budget: Partial<Budget>): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!budget.name || budget.name.trim().length === 0) {
    errors.name = 'El nombre es requerido';
  } else if (budget.name.length > 100) {
    errors.name = 'El nombre no puede superar 100 caracteres';
  }

  if (!isValidAmount(budget.limit)) {
    errors.limit = 'El límite debe ser un número positivo válido';
  }

  if (!budget.categoryId || budget.categoryId.trim().length === 0) {
    errors.categoryId = 'La categoría es requerida';
  }

  if (!budget.period || !['weekly', 'monthly', 'yearly'].includes(budget.period)) {
    errors.period = 'El período no es válido';
  }

  if (budget.alertAt !== undefined) {
    const n = Number(budget.alertAt);
    if (isNaN(n) || n < 0 || n > 100) {
      errors.alertAt = 'El porcentaje de alerta debe estar entre 0 y 100';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateGoal(goal: Partial<SavingsGoal>): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!goal.name || goal.name.trim().length === 0) {
    errors.name = 'El nombre es requerido';
  } else if (goal.name.length > 100) {
    errors.name = 'El nombre no puede superar 100 caracteres';
  }

  if (!isValidAmount(goal.targetAmount)) {
    errors.targetAmount = 'El monto objetivo debe ser un número positivo válido';
  }

  if (goal.currentAmount !== undefined) {
    const n = Number(goal.currentAmount);
    if (isNaN(n) || n < 0) {
      errors.currentAmount = 'El monto actual no puede ser negativo';
    }
  }

  if (goal.deadline && !isValidDate(goal.deadline)) {
    errors.deadline = 'La fecha límite no es válida';
  }

  if (goal.monthlyContribution !== undefined) {
    const n = Number(goal.monthlyContribution);
    if (isNaN(n) || n < 0) {
      errors.monthlyContribution = 'La contribución mensual no puede ser negativa';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
