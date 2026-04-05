import type { Item } from '@/types/finance';
import { getTotalIncome, getTotalExpenses, getSavingsRate } from '@/utils/calculations';

export interface SpendingPattern {
  category: string;
  frequency: number;
  avgAmount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface FinancialScore {
  total: number;
  savingsRate: number;
  consistency: number;
  diversification: number;
  breakdown: string[];
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'food-supermarket': [
    'supermercado', 'mercado', 'carrefour', 'walmart', 'lidl', 'dia', 'jumbo',
    'disco', 'coto', 'vea', 'fravega', 'super',
  ],
  'food-restaurant': [
    'restaurant', 'restaurante', 'comida', 'almuerzo', 'cena', 'desayuno',
    'sushi', 'pizza', 'burger', 'hamburguer', 'parrilla', 'bar',
  ],
  'food-cafe': ['cafe', 'café', 'starbucks', 'cafetería', 'cafeteria', 'expreso', 'latte'],
  'food-fastfood': ['mcdonalds', 'mc donalds', 'burger king', 'kfc', 'subway', 'rappi', 'pedidos ya'],
  'transport-gas': ['gasolina', 'nafta', 'combustible', 'shell', 'axion', 'ypf', 'bp', 'petrol'],
  'transport-public': ['subte', 'bus', 'colectivo', 'metro', 'tren', 'transporte', 'sube', 'tarjeta'],
  'transport-taxi': ['uber', 'cabify', 'didi', 'taxi', 'remis', 'viaje'],
  'housing-rent': ['alquiler', 'arriendo', 'renta', 'inquilino'],
  'housing-utilities': ['luz', 'agua', 'gas', 'edesur', 'edenor', 'aysa', 'metrogas', 'servicio'],
  'housing-internet': ['internet', 'wifi', 'fibra', 'cable', 'fibertel', 'claro', 'telecentro'],
  'health-pharmacy': ['farmacia', 'droguería', 'farmacias del ahorro', 'farmacity', 'medicamento', 'remedio'],
  'health-doctor': ['médico', 'medico', 'doctor', 'clínica', 'clinica', 'hospital', 'consulta', 'turno'],
  'health-gym': ['gym', 'gimnasio', 'fitness', 'sport club'],
  'education-courses': ['curso', 'udemy', 'coursera', 'platzi', 'capacitación', 'taller', 'clase'],
  'education-books': ['libro', 'librería', 'libreria', 'amazon', 'ebook', 'editorial'],
  'shopping-clothes': ['ropa', 'zara', 'h&m', 'indumentaria', 'zapatillas', 'calzado', 'vestido', 'pantalón'],
  'shopping-electronics': ['celular', 'computadora', 'notebook', 'iphone', 'samsung', 'electrónica', 'apple'],
  'entertainment-streaming': ['netflix', 'spotify', 'disney', 'hbo', 'prime', 'youtube', 'streaming'],
  'entertainment-games': ['steam', 'playstation', 'xbox', 'nintendo', 'juego', 'videojuego'],
  'services-phone': ['teléfono', 'telefono', 'movistar', 'personal', 'tuenti', 'celular', 'datos'],
  'services-bank': ['banco', 'cuota', 'préstamo', 'prestamo', 'tarjeta', 'crédito', 'débito', 'comisión'],
  'investments-savings': ['ahorro', 'plazo fijo', 'inversión', 'inversion', 'fondo'],
  'income-salary': ['sueldo', 'salario', 'haberes', 'remuneración', 'remuneracion', 'liquidación'],
  'income-freelance': ['freelance', 'honorarios', 'consultoría', 'proyecto', 'factura'],
};

class AIService {
  suggestCategory(description: string): string {
    const lower = description.toLowerCase();
    let bestMatch = '';
    let bestScore = 0;

    for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          if (keyword.length > bestScore) {
            bestScore = keyword.length;
            bestMatch = categoryId;
          }
        }
      }
    }

    return bestMatch || 'services-subscriptions';
  }

  detectPatterns(items: Item[]): SpendingPattern[] {
    const expenses = items.filter((i) => i.type === 'expense');
    const byCategory = new Map<string, Item[]>();

    for (const item of expenses) {
      const existing = byCategory.get(item.category) ?? [];
      byCategory.set(item.category, [...existing, item]);
    }

    const patterns: SpendingPattern[] = [];
    const now = new Date();
    const halfwayMark = new Date(now);
    halfwayMark.setMonth(halfwayMark.getMonth() - 3);

    for (const [category, catItems] of byCategory.entries()) {
      if (catItems.length < 2) continue;

      const avgAmount =
        catItems.reduce((s, i) => s + i.amount, 0) / catItems.length;

      const sorted = [...catItems].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const oldItems = sorted.filter((i) => new Date(i.date) < halfwayMark);
      const recentItems = sorted.filter((i) => new Date(i.date) >= halfwayMark);

      const oldAvg =
        oldItems.length > 0
          ? oldItems.reduce((s, i) => s + i.amount, 0) / oldItems.length
          : 0;
      const recentAvg =
        recentItems.length > 0
          ? recentItems.reduce((s, i) => s + i.amount, 0) / recentItems.length
          : 0;

      let trend: SpendingPattern['trend'] = 'stable';
      if (recentAvg > oldAvg * 1.1) trend = 'increasing';
      else if (recentAvg < oldAvg * 0.9) trend = 'decreasing';

      patterns.push({
        category,
        frequency: catItems.length,
        avgAmount,
        trend,
      });
    }

    return patterns.sort((a, b) => b.frequency - a.frequency);
  }

  getFinancialTips(items: Item[]): string[] {
    const tips: string[] = [];
    const income = getTotalIncome(items);
    const expenses = getTotalExpenses(items);
    const savingsRate = getSavingsRate(items);
    const patterns = this.detectPatterns(items);

    if (income === 0) {
      tips.push('Registra tus ingresos para obtener un análisis completo de tus finanzas.');
      return tips;
    }

    if (savingsRate < 5) {
      tips.push(
        'Tu tasa de ahorro es muy baja. Intenta ahorrar al menos el 10% de tus ingresos.'
      );
    } else if (savingsRate >= 20) {
      tips.push(
        `¡Excelente! Tu tasa de ahorro del ${savingsRate.toFixed(1)}% está por encima del promedio recomendado.`
      );
    }

    const increasingCategories = patterns
      .filter((p) => p.trend === 'increasing')
      .slice(0, 2);
    for (const p of increasingCategories) {
      tips.push(
        `Tus gastos en "${p.category}" han aumentado recientemente. Considera revisar este presupuesto.`
      );
    }

    if (expenses > income * 0.9) {
      tips.push(
        'Tus gastos representan más del 90% de tus ingresos. Identifica áreas donde puedas recortar.'
      );
    }

    const categoryCount = new Set(items.map((i) => i.category)).size;
    if (categoryCount < 3) {
      tips.push(
        'Categoriza mejor tus transacciones para obtener un análisis financiero más preciso.'
      );
    }

    if (tips.length === 0) {
      tips.push('Tus finanzas parecen equilibradas. ¡Sigue así!');
    }

    return tips;
  }

  calculateFinancialScore(items: Item[]): FinancialScore {
    if (items.length === 0) {
      return {
        total: 0,
        savingsRate: 0,
        consistency: 0,
        diversification: 0,
        breakdown: ['Sin datos suficientes para calcular el puntaje.'],
      };
    }

    const income = getTotalIncome(items);
    const expenses = getTotalExpenses(items);
    const savingsRate = getSavingsRate(items);
    const breakdown: string[] = [];

    // Savings rate: 0–40 points
    const savingsScore = Math.min(40, (savingsRate / 20) * 40);
    if (savingsRate >= 20) {
      breakdown.push(`Ahorro excelente: ${savingsRate.toFixed(1)}% (+${savingsScore.toFixed(0)} pts)`);
    } else {
      breakdown.push(`Ahorro mejorable: ${savingsRate.toFixed(1)}% (${savingsScore.toFixed(0)} pts de 40)`);
    }

    // Consistency: income vs expenses ratio, 0–30 points
    const ratio = income > 0 ? Math.min(2, income / Math.max(expenses, 1)) : 0;
    const consistencyScore = Math.min(30, ratio * 15);
    breakdown.push(
      `Relación ingresos/gastos: ${ratio.toFixed(2)} (${consistencyScore.toFixed(0)} pts de 30)`
    );

    // Diversification: category variety, 0–30 points
    const uniqueCategories = new Set(items.map((i) => i.category)).size;
    const diversificationScore = Math.min(30, uniqueCategories * 3);
    breakdown.push(
      `Diversificación de categorías: ${uniqueCategories} (${diversificationScore.toFixed(0)} pts de 30)`
    );

    const total = Math.round(Math.min(100, savingsScore + consistencyScore + diversificationScore));

    return {
      total,
      savingsRate: Math.round(savingsScore),
      consistency: Math.round(consistencyScore),
      diversification: Math.round(diversificationScore),
      breakdown,
    };
  }
}

export const aiService = new AIService();
