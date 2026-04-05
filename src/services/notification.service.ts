import type { Budget } from '@/types/budget';
import type { SavingsGoal } from '@/types/goals';

class NotificationService {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  sendBrowserNotification(title: string, options?: NotificationOptions): void {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    } catch {
      // Notifications not supported in this context
    }
  }

  scheduleBudgetAlert(budget: Budget, percentUsed: number): void {
    if (percentUsed >= 100) {
      this.sendBrowserNotification('Presupuesto superado', {
        body: `El presupuesto "${budget.name}" ha sido superado (${percentUsed.toFixed(0)}%)`,
        tag: `budget-exceeded-${budget.id}`,
      });
    } else if (percentUsed >= budget.alertAt) {
      this.sendBrowserNotification('Alerta de presupuesto', {
        body: `Has usado el ${percentUsed.toFixed(0)}% del presupuesto "${budget.name}"`,
        tag: `budget-warning-${budget.id}`,
      });
    }
  }

  scheduleGoalReminder(goal: SavingsGoal): void {
    if (!goal.deadline) return;
    const deadline = new Date(goal.deadline);
    const daysLeft = Math.ceil(
      (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 30 && daysLeft > 0) {
      const progress =
        goal.targetAmount > 0
          ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)
          : '0';
      this.sendBrowserNotification('Recordatorio de meta', {
        body: `La meta "${goal.name}" vence en ${daysLeft} días. Progreso: ${progress}%`,
        tag: `goal-reminder-${goal.id}`,
      });
    }
  }
}

export const notificationService = new NotificationService();
