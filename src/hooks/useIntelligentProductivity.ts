import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductivityAnalysis {
  overallScore: number;
  efficiency: number;
  consistency: number;
  timeManagement: number;
  focusQuality: number;
}

export interface ProductivityPatterns {
  peakProductivityHours: string[];
  mostProductiveDays: string[];
  commonDistractors: string[];
  workPatterns: string[];
  energyLevels: string;
}

export interface ProductivityInsights {
  strengths: string[];
  improvementAreas: string[];
  timeWasters: string[];
  optimizationOpportunities: string[];
}

export interface ProductivityRecommendations {
  immediate: string[];
  weekly: string[];
  habits: string[];
  timeBlocking: string[];
}

export interface ProductivityAnalysisResult {
  productivityAnalysis: ProductivityAnalysis;
  patterns: ProductivityPatterns;
  insights: ProductivityInsights;
  recommendations: ProductivityRecommendations;
  motivationalMessage: string;
  nextGoals: string[];
  warningFlags: string[];
}

export interface OptimizationSuggestion {
  type: 'time_blocking' | 'habit_formation' | 'task_prioritization' | 'energy_management';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: string;
  expectedBenefit: string;
  steps: string[];
}

export interface ProductivityOptimizations {
  optimizations: OptimizationSuggestion[];
  priorityOrder: string[];
  personalizedAdvice: string;
  quickWins: string[];
  longTermGoals: string[];
}

export interface TimeBlock {
  startTime: string;
  endTime: string;
  activity: string;
  type: 'work' | 'break' | 'exercise' | 'meal' | 'personal' | 'learning';
  priority: 'high' | 'medium' | 'low';
  energyLevel: 'high' | 'medium' | 'low';
  description: string;
}

export interface BreakSuggestion {
  time: string;
  duration: number;
  type: 'micro' | 'short' | 'long';
  activity: string;
}

export interface ScheduleSuggestion {
  schedule: {
    timeBlocks: TimeBlock[];
    breaks: BreakSuggestion[];
  };
  rationale: string;
  adaptations: string[];
  energyOptimization: string;
  flexibilityTips: string[];
  wellnessIntegration: string[];
}

export interface HabitAnalysis {
  currentStreak: number;
  consistency: number;
  difficultyCurve: 'too_easy' | 'just_right' | 'too_hard';
  motivationLevel: number;
  barriers: string[];
}

export interface HabitCoaching {
  encouragement: string;
  adjustments: string[];
  stacking: string[];
  rewards: string[];
  accountability: string[];
}

export interface HabitProgression {
  progression: string;
  newHabits: string[];
  milestones: string[];
}

export interface HabitTroubleshooting {
  commonProblems: string[];
  solutions: string[];
  resetStrategy: string;
}

export interface HabitCoachingResult {
  habitAnalysis: HabitAnalysis;
  coaching: HabitCoaching;
  nextLevel: HabitProgression;
  troubleshooting: HabitTroubleshooting;
}

export const useIntelligentProductivity = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductivityAnalysisResult | null>(null);
  const [optimizations, setOptimizations] = useState<ProductivityOptimizations | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSuggestion | null>(null);
  const [habitCoaching, setHabitCoaching] = useState<HabitCoachingResult | null>(null);
  const { toast } = useToast();

  const analyzeProductivity = async (
    tasks: any[] = [],
    habits: any[] = [],
    timeBlocks: any[] = [],
    context: any = {}
  ): Promise<ProductivityAnalysisResult | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('productivity-insights', {
        body: {
          action: 'analyze_productivity',
          tasks,
          habits,
          timeBlocks,
          context
        }
      });

      if (error) {
        console.error('Error analyzing productivity:', error);
        toast({
          title: "Error en análisis",
          description: "No se pudo analizar tu productividad",
          variant: "destructive"
        });
        return null;
      }

      setAnalysisResult(data);
      return data;
    } catch (error) {
      console.error('Error in analyzeProductivity:', error);
      toast({
        title: "Error",
        description: "Error al conectar con el servicio de análisis",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const suggestOptimizations = async (
    tasks: any[] = [],
    habits: any[] = [],
    context: any = {}
  ): Promise<ProductivityOptimizations | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('productivity-insights', {
        body: {
          action: 'suggest_optimizations',
          tasks,
          habits,
          context
        }
      });

      if (error) {
        console.error('Error suggesting optimizations:', error);
        toast({
          title: "Error en sugerencias",
          description: "No se pudieron generar optimizaciones",
          variant: "destructive"
        });
        return null;
      }

      setOptimizations(data);
      return data;
    } catch (error) {
      console.error('Error in suggestOptimizations:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async (
    tasks: any[] = [],
    context: any = {}
  ): Promise<ScheduleSuggestion | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('productivity-insights', {
        body: {
          action: 'generate_schedule',
          tasks,
          context
        }
      });

      if (error) {
        console.error('Error generating schedule:', error);
        toast({
          title: "Error en horario",
          description: "No se pudo generar el horario optimizado",
          variant: "destructive"
        });
        return null;
      }

      setSchedule(data);
      return data;
    } catch (error) {
      console.error('Error in generateSchedule:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHabitCoaching = async (
    habits: any[] = [],
    context: any = {}
  ): Promise<HabitCoachingResult | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('productivity-insights', {
        body: {
          action: 'habit_coaching',
          habits,
          context
        }
      });

      if (error) {
        console.error('Error getting habit coaching:', error);
        toast({
          title: "Error en coaching",
          description: "No se pudo obtener coaching de hábitos",
          variant: "destructive"
        });
        return null;
      }

      setHabitCoaching(data);
      return data;
    } catch (error) {
      console.error('Error in getHabitCoaching:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getProductivityColor = (score: number): string => {
    if (score >= 80) return 'hsl(var(--chart-1))'; // Verde - Excelente
    if (score >= 60) return 'hsl(var(--chart-3))'; // Amarillo - Bueno
    if (score >= 40) return 'hsl(var(--chart-4))'; // Naranja - Regular
    return 'hsl(var(--chart-2))'; // Rojo - Necesita mejora
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high': return 'hsl(var(--chart-1))';
      case 'medium': return 'hsl(var(--chart-3))';
      case 'low': return 'hsl(var(--chart-5))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'hsl(var(--chart-1))';
      case 'medium': return 'hsl(var(--chart-3))';
      case 'hard': return 'hsl(var(--chart-2))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return {
    loading,
    analysisResult,
    optimizations,
    schedule,
    habitCoaching,
    analyzeProductivity,
    suggestOptimizations,
    generateSchedule,
    getHabitCoaching,
    getProductivityColor,
    getImpactColor,
    getDifficultyColor
  };
};