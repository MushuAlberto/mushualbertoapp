import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  recurring?: boolean;
  tags?: string[];
}

export interface FinancialInsight {
  type: 'pattern' | 'alert' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  category: 'spending' | 'budget' | 'saving' | 'income';
  priority: 'low' | 'medium' | 'high' | 'critical';
  amount?: number;
  actionable: boolean;
  action?: {
    type: string;
    label: string;
    data: any;
  };
  confidence: number;
}

export interface SpendingPatterns {
  impulsiveSpending: {
    frequency: 'bajo' | 'medio' | 'alto';
    totalAmount: number;
    commonTriggers: string[];
    peakTimes: string[];
  };
  categoryBreakdown: Record<string, {
    spent: number;
    budgeted: number;
    variance: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
  monthlyProjection: {
    estimatedSpending: number;
    budgetOverrun: number;
    savingsPotential: number;
  };
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface BudgetRecommendation {
  title: string;
  description: string;
  expectedSaving: number;
  difficulty: 'fácil' | 'medio' | 'difícil';
  timeToImplement: 'inmediato' | '1-7días' | '1mes';
  adhdFriendly: boolean;
}

export const useIntelligentFinance = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('mushu_transactions', []);
  const [categories, setCategories] = useLocalStorage<Record<string, string>>('mushu_categories', {
    'Alimentación': '#ef4444',
    'Transporte': '#3b82f6',
    'Entretenimiento': '#8b5cf6',
    'Salud': '#10b981',
    'Educación': '#f59e0b',
    'Ropa': '#ec4899',
    'Hogar': '#6b7280',
    'Otros': '#64748b'
  });
  
  const [budget, setBudget] = useLocalStorage<Record<string, number>>('mushu_budget', {});
  const [financialGoals, setFinancialGoals] = useLocalStorage<FinancialGoal[]>('mushu_financial_goals', []);
  const [monthlyIncome, setMonthlyIncome] = useLocalStorage<number>('mushu_monthly_income', 0);
  
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPatterns | null>(null);
  const [recommendations, setRecommendations] = useState<BudgetRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [healthScore, setHealthScore] = useState<number>(0);

  // Calcular balance actual
  const currentBalance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  // Generar análisis de gastos inteligente
  const generateSpendingAnalysis = useCallback(async (timeRange = '30') => {
    setLoading(true);
    
    try {
      const recentTransactions = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
          return transactionDate >= cutoffDate;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      console.log('Generating spending analysis...');
      
      const { data, error } = await supabase.functions.invoke('financial-ai-insights', {
        body: {
          transactions: recentTransactions,
          categories,
          budget,
          currentBalance,
          monthlyIncome,
          financialGoals,
          requestType: 'spending_analysis',
          timeRange
        }
      });

      if (error) {
        console.error('Error generating analysis:', error);
        throw error;
      }

      console.log('Spending analysis generated successfully');
      
      if (data.insights) setInsights(data.insights);
      if (data.spendingPatterns) setSpendingPatterns(data.spendingPatterns);
      if (data.recommendations) setRecommendations(data.recommendations);
      
      // Mostrar alertas críticas
      data.alerts?.forEach((alert: any) => {
        if (alert.severity === 'critical') {
          toast.error(`🚨 ${alert.message}`, {
            duration: 8000
          });
        } else if (alert.severity === 'warning') {
          toast.warning(`⚠️ ${alert.message}`, {
            duration: 6000
          });
        }
      });

      return data;
      
    } catch (error) {
      console.error('Error in generateSpendingAnalysis:', error);
      
      // Generar análisis básico como fallback
      generateBasicAnalysis();
      
      toast.error('Error al generar análisis. Usando análisis básico.');
    } finally {
      setLoading(false);
    }
  }, [transactions, categories, budget, currentBalance, monthlyIncome, financialGoals]);

  // Análisis básico como fallback
  const generateBasicAnalysis = useCallback(() => {
    const last30Days = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return transactionDate >= thirtyDaysAgo;
    });

    const totalExpenses = last30Days
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBudget = Object.values(budget).reduce((sum, amount) => sum + amount, 0);

    const basicInsights: FinancialInsight[] = [];

    // Insight de presupuesto
    if (totalBudget > 0 && totalExpenses > totalBudget * 0.8) {
      basicInsights.push({
        type: 'alert',
        title: 'Acercándose al Límite del Presupuesto',
        description: `Has gastado $${totalExpenses.toFixed(2)} de tu presupuesto de $${totalBudget.toFixed(2)}`,
        category: 'budget',
        priority: totalExpenses > totalBudget ? 'critical' : 'high',
        amount: totalExpenses - totalBudget,
        actionable: true,
        action: {
          type: 'review_budget',
          label: 'Revisar Presupuesto',
          data: {}
        },
        confidence: 0.9
      });
    }

    // Insight de categoría más gastada
    const categorySpending = last30Days
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory) {
      basicInsights.push({
        type: 'pattern',
        title: `Mayor Gasto: ${topCategory[0]}`,
        description: `Has gastado $${topCategory[1].toFixed(2)} en ${topCategory[0]} este mes`,
        category: 'spending',
        priority: 'medium',
        amount: topCategory[1],
        actionable: true,
        action: {
          type: 'review_category',
          label: 'Revisar Categoría',
          data: { category: topCategory[0] }
        },
        confidence: 0.8
      });
    }

    setInsights(basicInsights);

    // Patrones básicos
    const basicPatterns: SpendingPatterns = {
      impulsiveSpending: {
        frequency: totalExpenses > totalBudget * 1.2 ? 'alto' : 'medio',
        totalAmount: totalExpenses * 0.1, // Estimación
        commonTriggers: ['Fin de semana', 'Estrés'],
        peakTimes: ['Sábados', 'Domingos']
      },
      categoryBreakdown: Object.entries(categorySpending).reduce((acc, [cat, amount]) => {
        const budgeted = budget[cat] || 0;
        acc[cat] = {
          spent: amount,
          budgeted,
          variance: budgeted > 0 ? ((amount - budgeted) / budgeted) * 100 : 0,
          trend: 'stable'
        };
        return acc;
      }, {} as any),
      monthlyProjection: {
        estimatedSpending: totalExpenses * 1.05,
        budgetOverrun: Math.max(0, totalExpenses - totalBudget),
        savingsPotential: Math.max(0, monthlyIncome - totalExpenses) * 0.2
      }
    };

    setSpendingPatterns(basicPatterns);

    const basicRecommendations: BudgetRecommendation[] = [
      {
        title: 'Establece Alertas de Gasto',
        description: 'Configura notificaciones cuando te acerques al límite de cada categoría',
        expectedSaving: totalExpenses * 0.15,
        difficulty: 'fácil',
        timeToImplement: 'inmediato',
        adhdFriendly: true
      },
      {
        title: 'Revisa Gastos Semanalmente',
        description: 'Dedica 10 minutos cada domingo a revisar tus gastos de la semana',
        expectedSaving: totalExpenses * 0.1,
        difficulty: 'medio',
        timeToImplement: '1-7días',
        adhdFriendly: true
      }
    ];

    setRecommendations(basicRecommendations);
  }, [transactions, budget, monthlyIncome]);

  // Optimizar presupuesto
  const optimizeBudget = useCallback(async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('financial-ai-insights', {
        body: {
          transactions: transactions.slice(-50), // Últimas 50 transacciones
          budget,
          monthlyIncome,
          requestType: 'budget_optimization'
        }
      });

      if (error) throw error;

      console.log('Budget optimization completed');
      return data;
      
    } catch (error) {
      console.error('Error optimizing budget:', error);
      toast.error('Error al optimizar presupuesto');
      return null;
    } finally {
      setLoading(false);
    }
  }, [transactions, budget, monthlyIncome]);

  // Seguimiento de metas
  const trackGoals = useCallback(async () => {
    if (financialGoals.length === 0) return null;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('financial-ai-insights', {
        body: {
          financialGoals,
          transactions: transactions.slice(-30),
          currentBalance,
          requestType: 'goal_tracking'
        }
      });

      if (error) throw error;

      console.log('Goal tracking completed');
      return data;
      
    } catch (error) {
      console.error('Error tracking goals:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [financialGoals, transactions, currentBalance]);

  // Chequeo de salud financiera
  const checkFinancialHealth = useCallback(async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('financial-ai-insights', {
        body: {
          currentBalance,
          monthlyIncome,
          transactions: transactions.slice(-20),
          requestType: 'health_check'
        }
      });

      if (error) throw error;

      console.log('Financial health check completed');
      
      if (data.healthScore) {
        setHealthScore(data.healthScore);
      }
      
      return data;
      
    } catch (error) {
      console.error('Error checking financial health:', error);
      
      // Cálculo básico de salud financiera
      const expenseRatio = monthlyIncome > 0 ? 
        (transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) / monthlyIncome) : 0;
      
      const basicHealthScore = Math.max(0, Math.min(100, 100 - (expenseRatio * 100)));
      setHealthScore(Math.round(basicHealthScore));
      
      return {
        healthScore: Math.round(basicHealthScore),
        summary: 'Análisis básico de salud financiera'
      };
    } finally {
      setLoading(false);
    }
  }, [currentBalance, monthlyIncome, transactions]);

  // Agregar transacción
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Re-generar análisis si hay suficientes transacciones
    if (transactions.length > 5) {
      setTimeout(() => generateSpendingAnalysis(), 1000);
    }
  }, [transactions.length, generateSpendingAnalysis, setTransactions]);

  // Agregar meta financiera
  const addFinancialGoal = useCallback((goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString()
    };
    
    setFinancialGoals(prev => [...prev, newGoal]);
  }, [setFinancialGoals]);

  // Auto-generar análisis periódicamente
  useEffect(() => {
    if (transactions.length > 0) {
      checkFinancialHealth();
    }
  }, [transactions.length]);

  // Auto-análisis cuando se agregan transacciones
  useEffect(() => {
    if (transactions.length > 0 && transactions.length % 5 === 0) {
      generateSpendingAnalysis();
    }
  }, [transactions.length, generateSpendingAnalysis]);

  return {
    // Data
    transactions,
    categories,
    budget,
    financialGoals,
    monthlyIncome,
    currentBalance,
    
    // Analysis results
    insights,
    spendingPatterns,
    recommendations,
    healthScore,
    loading,
    
    // Actions
    addTransaction,
    addFinancialGoal,
    setBudget,
    setCategories,
    setMonthlyIncome,
    
    // AI functions
    generateSpendingAnalysis,
    optimizeBudget,
    trackGoals,
    checkFinancialHealth
  };
};