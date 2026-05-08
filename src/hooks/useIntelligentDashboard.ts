import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'pattern';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'productivity' | 'wellbeing' | 'finances' | 'habits' | 'general';
  actionable: boolean;
  action?: {
    type: string;
    label: string;
    data?: any;
  };
  confidence: number;
  timestamp: string;
  dismissed?: boolean;
}

interface UserMetrics {
  productivity: {
    tasksCompleted: number;
    habitsCompleted: number;
    streakDays: number;
    efficiency: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  wellbeing: {
    averageMood: number;
    stressLevel: number;
    sleepQuality: number;
    exerciseFrequency: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  finances: {
    totalExpenses: number;
    budgetAdherence: number;
    savingsRate: number;
    categoryTrends: Record<string, number>;
  };
  engagement: {
    chatMessages: number;
    appUsage: number;
    featureUsage: Record<string, number>;
  };
}

interface PredictiveAnalysis {
  burnoutRisk: number;
  productivityTrend: number;
  budgetOverrun: number;
  habitFailure: number;
  moodDecline: number;
}

export const useIntelligentDashboard = () => {
  const [insights, setInsights] = useLocalStorage<DashboardInsight[]>('mushu_dashboard_insights', []);
  const [userMetrics, setUserMetrics] = useLocalStorage<UserMetrics>('mushu_user_metrics', {
    productivity: {
      tasksCompleted: 0,
      habitsCompleted: 0,
      streakDays: 0,
      efficiency: 0,
      trend: 'stable'
    },
    wellbeing: {
      averageMood: 5,
      stressLevel: 5,
      sleepQuality: 5,
      exerciseFrequency: 0,
      trend: 'stable'
    },
    finances: {
      totalExpenses: 0,
      budgetAdherence: 100,
      savingsRate: 0,
      categoryTrends: {}
    },
    engagement: {
      chatMessages: 0,
      appUsage: 0,
      featureUsage: {}
    }
  });

  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictiveAnalysis>({
    burnoutRisk: 0,
    productivityTrend: 0,
    budgetOverrun: 0,
    habitFailure: 0,
    moodDecline: 0
  });

  // Generar insights inteligentes usando IA
  const generateIntelligentInsights = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-insights', {
        body: {
          userMetrics,
          historicalData: getHistoricalData(),
          currentInsights: insights.filter(i => !i.dismissed)
        }
      });

      if (error) throw error;

      if (data?.insights) {
        const newInsights = data.insights.map((insight: any) => ({
          ...insight,
          id: (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
          timestamp: new Date().toISOString()
        }));

        // Combinar con insights existentes, evitando duplicados
        setInsights(prev => {
          const existing = prev.filter(i => !i.dismissed);
          const combined = [...existing, ...newInsights];
          
          // Mantener solo los insights más recientes y relevantes
          return combined
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 15);
        });

        // Actualizar predicciones
        if (data.predictions) {
          setPredictions(data.predictions);
        }

        // Mostrar alertas críticas
        newInsights
          .filter((insight: DashboardInsight) => insight.priority === 'critical')
          .forEach((insight: DashboardInsight) => {
            toast.error(`🚨 ${insight.title}`, {
              description: insight.description,
              duration: 10000
            });
          });
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      // Generar insights básicos como fallback
      generateBasicInsights();
    } finally {
      setLoading(false);
    }
  }, [userMetrics, insights, setInsights]);

  // Generar insights básicos sin IA como fallback
  const generateBasicInsights = useCallback(() => {
    const basicInsights: DashboardInsight[] = [];

    // Análisis de productividad
    if (userMetrics.productivity.efficiency < 50) {
      basicInsights.push({
        id: (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
        type: 'recommendation',
        title: 'Mejora tu Eficiencia',
        description: 'Tu eficiencia está por debajo del 50%. Considera reorganizar tus tareas por prioridad.',
        priority: 'medium',
        category: 'productivity',
        actionable: true,
        action: {
          type: 'navigate',
          label: 'Ir a Productividad',
          data: '/productivity'
        },
        confidence: 0.8,
        timestamp: new Date().toISOString()
      });
    }

    // Análisis de bienestar
    if (userMetrics.wellbeing.averageMood < 4) {
      basicInsights.push({
        id: (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
        type: 'alert',
        title: 'Estado Emocional Bajo',
        description: 'Tu estado de ánimo promedio ha bajado. Te sugiero hacer ejercicios de bienestar.',
        priority: 'high',
        category: 'wellbeing',
        actionable: true,
        action: {
          type: 'navigate',
          label: 'Ejercicios de Bienestar',
          data: '/wellbeing'
        },
        confidence: 0.9,
        timestamp: new Date().toISOString()
      });
    }

    // Análisis financiero
    if (userMetrics.finances.budgetAdherence < 80) {
      basicInsights.push({
        id: (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
        type: 'prediction',
        title: 'Riesgo de Sobrepasar Presupuesto',
        description: 'Estás gastando más de lo planificado. Revisa tus gastos recientes.',
        priority: 'medium',
        category: 'finances',
        actionable: true,
        action: {
          type: 'navigate',
          label: 'Ver Gastos',
          data: '/expenses'
        },
        confidence: 0.75,
        timestamp: new Date().toISOString()
      });
    }

    setInsights(prev => [...prev.filter(i => !i.dismissed), ...basicInsights]);
  }, [userMetrics, setInsights]);

  // Obtener datos históricos simulados
  const getHistoricalData = () => {
    // En una implementación real, esto vendría de la base de datos
    return {
      last7Days: generateMockHistoricalData(7),
      last30Days: generateMockHistoricalData(30)
    };
  };

  const generateMockHistoricalData = (days: number) => {
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      productivity: Math.random() * 100,
      mood: Math.random() * 10,
      expenses: Math.random() * 200,
      habits: Math.floor(Math.random() * 5)
    }));
  };

  // Actualizar métricas del usuario
  const updateUserMetrics = useCallback((category: keyof UserMetrics, data: any) => {
    setUserMetrics(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...data
      }
    }));
  }, [setUserMetrics]);

  // Descartar insight
  const dismissInsight = useCallback((insightId: string) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === insightId ? { ...insight, dismissed: true } : insight
      )
    );
  }, [setInsights]);

  // Ejecutar acción de insight
  const executeInsightAction = useCallback((insight: DashboardInsight) => {
    if (!insight.action) return;

    switch (insight.action.type) {
      case 'navigate':
        // Aquí se navegaría a la ruta especificada
        toast.success(`Navegando a ${insight.action.label}`);
        break;
      case 'start_exercise':
        toast.info('Iniciando ejercicio de bienestar...');
        break;
      case 'create_task':
        toast.info('Creando nueva tarea...');
        break;
      default:
        toast.info(`Ejecutando: ${insight.action.label}`);
    }

    // Marcar como ejecutado
    dismissInsight(insight.id);
  }, [dismissInsight]);

  // Obtener insights por categoría
  const getInsightsByCategory = useCallback((category: string) => {
    return insights.filter(i => !i.dismissed && i.category === category);
  }, [insights]);

  // Obtener insights de alta prioridad
  const getHighPriorityInsights = useCallback(() => {
    return insights.filter(i => !i.dismissed && ['high', 'critical'].includes(i.priority));
  }, [insights]);

  // Calcular score general de bienestar
  const getWellbeingScore = useCallback(() => {
    const { productivity, wellbeing, finances } = userMetrics;
    
    const productivityScore = (productivity.efficiency + productivity.streakDays * 10) / 2;
    const wellbeingScore = (wellbeing.averageMood * 10 + (10 - wellbeing.stressLevel) * 10) / 2;
    const financeScore = finances.budgetAdherence;
    
    return Math.round((productivityScore + wellbeingScore + financeScore) / 3);
  }, [userMetrics]);

  // Auto-generar insights cada hora
  useEffect(() => {
    const interval = setInterval(() => {
      generateIntelligentInsights();
    }, 60 * 60 * 1000); // Cada hora

    // Generar insights iniciales si no hay
    if (insights.length === 0) {
      generateIntelligentInsights();
    }

    return () => clearInterval(interval);
  }, [generateIntelligentInsights, insights.length]);

  return {
    insights: insights.filter(i => !i.dismissed),
    userMetrics,
    predictions,
    loading,
    updateUserMetrics,
    generateIntelligentInsights,
    dismissInsight,
    executeInsightAction,
    getInsightsByCategory,
    getHighPriorityInsights,
    getWellbeingScore
  };
};