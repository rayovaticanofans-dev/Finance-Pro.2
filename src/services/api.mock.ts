import type { Item, TransactionType, RecurringType } from '@/types/finance';
import type { Currency } from '@/types/currency';
import type { Budget, BudgetPeriod } from '@/types/budget';
import type { SavingsGoal, GoalStatus } from '@/types/goals';
import { generateId } from '@/utils/id';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'ARS', 'MXN', 'COP', 'BRL'];
const INCOME_CATEGORIES = [
  'income-salary',
  'income-freelance',
  'income-rentals',
  'income-dividends',
  'income-other',
];
const EXPENSE_CATEGORIES = [
  'food-supermarket',
  'food-restaurant',
  'food-cafe',
  'food-fastfood',
  'transport-gas',
  'transport-public',
  'transport-taxi',
  'housing-rent',
  'housing-utilities',
  'housing-internet',
  'health-pharmacy',
  'health-gym',
  'education-courses',
  'shopping-clothes',
  'shopping-electronics',
  'entertainment-streaming',
  'entertainment-games',
  'services-phone',
  'services-bank',
];

export const MOCK_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const INCOME_DESCRIPTIONS: Record<string, string[]> = {
  'income-salary': ['Sueldo mensual', 'Pago de salario', 'Haberes del mes'],
  'income-freelance': ['Proyecto web', 'Consultoría', 'Servicio de diseño', 'Desarrollo app'],
  'income-rentals': ['Alquiler departamento', 'Renta local comercial'],
  'income-dividends': ['Dividendos acciones', 'Rendimiento inversión'],
  'income-other': ['Transferencia recibida', 'Cobro pendiente', 'Pago extra'],
};

const EXPENSE_DESCRIPTIONS: Record<string, string[]> = {
  'food-supermarket': ['Compras semanales', 'Supermercado Carrefour', 'Mercado mayorista'],
  'food-restaurant': ['Almuerzo de trabajo', 'Cena familiar', 'Comida con amigos'],
  'food-cafe': ['Café de la mañana', 'Starbucks', 'Merienda'],
  'food-fastfood': ['McDonald\'s', 'Burger King', 'Pizza delivery'],
  'transport-gas': ['Carga nafta', 'Combustible Shell', 'Gasolina BP'],
  'transport-public': ['Recarga SUBE', 'Pasaje metro', 'Boleto bus mensual'],
  'transport-taxi': ['Uber al trabajo', 'Taxi aeropuerto', 'Cabify'],
  'housing-rent': ['Alquiler mensual', 'Pago renta', 'Cuota alquiler'],
  'housing-utilities': ['Factura eléctrica', 'Servicio de agua', 'Gas natural'],
  'housing-internet': ['Internet Fibertel', 'Claro hogar', 'Cable + internet'],
  'health-pharmacy': ['Farmacity', 'Medicamentos', 'Vitaminas y suplementos'],
  'health-gym': ['Cuota gym', 'Fitness club mensual', 'Personal trainer'],
  'education-courses': ['Curso Udemy', 'Platzi premium', 'Taller online'],
  'shopping-clothes': ['Ropa Zara', 'Zapatillas Nike', 'Indumentaria'],
  'shopping-electronics': ['Audífonos', 'Cargador celular', 'Teclado mecánico'],
  'entertainment-streaming': ['Netflix', 'Spotify premium', 'Disney+'],
  'entertainment-games': ['Steam juego', 'PlayStation Plus', 'App de juego'],
  'services-phone': ['Celular Movistar', 'Plan de datos', 'Recargas Personal'],
  'services-bank': ['Comisión tarjeta', 'Cuota préstamo', 'Seguro tarjeta'],
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat(min: number, max: number, decimals = 2): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randomDateInLastMonths(months: number): string {
  const now = new Date();
  const start = new Date(now);
  start.setMonth(start.getMonth() - months);
  const diff = now.getTime() - start.getTime();
  const randDate = new Date(start.getTime() + Math.random() * diff);
  return randDate.toISOString().slice(0, 10);
}

export function generateMockItems(count = 60): Item[] {
  const items: Item[] = [];

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() < 0.2;
    const type: TransactionType = isIncome ? 'income' : 'expense';
    const category = isIncome
      ? randomFrom(INCOME_CATEGORIES)
      : randomFrom(EXPENSE_CATEGORIES);

    const descriptions = isIncome
      ? (INCOME_DESCRIPTIONS[category] ?? ['Ingreso'])
      : (EXPENSE_DESCRIPTIONS[category] ?? ['Gasto']);
    const desc = randomFrom(descriptions);

    const amount = isIncome
      ? randomFloat(800, 5000)
      : randomFloat(10, 500);

    const currency = Math.random() < 0.7 ? 'USD' : randomFrom(CURRENCIES);
    const recurring: RecurringType =
      Math.random() < 0.15
        ? randomFrom<RecurringType>(['monthly', 'weekly'])
        : 'none';
    const date = randomDateInLastMonths(12);
    const now = new Date().toISOString();

    items.push({
      id: generateId(),
      desc,
      amount,
      type,
      currency,
      category,
      date,
      recurring,
      tags: Math.random() < 0.3 ? [category.split('-')[0]] : [],
      note: Math.random() < 0.2 ? 'Nota adicional' : undefined,
      createdAt: now,
      updatedAt: now,
    });
  }

  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export function getMockBudgets(): Budget[] {
  const now = new Date().toISOString();
  const periods: BudgetPeriod[] = ['monthly', 'weekly', 'yearly'];
  return [
    {
      id: generateId(),
      name: 'Alimentación',
      categoryId: 'food-supermarket',
      limit: 500,
      period: 'monthly',
      spent: 320,
      status: 'warning',
      alertAt: 60,
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Transporte',
      categoryId: 'transport-gas',
      limit: 200,
      period: randomFrom(periods),
      spent: 80,
      status: 'ok',
      alertAt: 80,
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Entretenimiento',
      categoryId: 'entertainment-streaming',
      limit: 100,
      period: 'monthly',
      spent: 110,
      status: 'exceeded',
      alertAt: 80,
      createdAt: now,
    },
  ];
}

export function getMockGoals(): SavingsGoal[] {
  const now = new Date().toISOString();
  const statuses: GoalStatus[] = ['active', 'active', 'completed'];
  return [
    {
      id: generateId(),
      name: 'Fondo de emergencia',
      targetAmount: 5000,
      currentAmount: 2300,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      monthlyContribution: 300,
      status: randomFrom(statuses),
      emoji: '🛡️',
      color: '#3B82F6',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Vacaciones',
      targetAmount: 2000,
      currentAmount: 800,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      monthlyContribution: 400,
      status: 'active',
      emoji: '✈️',
      color: '#10B981',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Nuevo laptop',
      targetAmount: 1500,
      currentAmount: 1500,
      monthlyContribution: 150,
      status: 'completed',
      emoji: '💻',
      color: '#8B5CF6',
      createdAt: now,
    },
  ];
}
