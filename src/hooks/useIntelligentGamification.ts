import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface RewardRecommendation {
  name: string;
  description: string;
  cost: number;
  category: string;
  reason: string;
  icon: string;
}

interface Achievement {
  title: string;
  description: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: string;
}

interface GamificationData {
  profileAnalysis: string | null;
  rewardRecommendations: RewardRecommendation[];
  achievementSuggestions: Achievement[];
  motivationStrategy: string | null;
  lastUpdated: string | null;
}

export const useIntelligentGamification = () => {
  const { toast } = useToast();
  const [sparkles] = useLocalStorage<number>('mushu_sparkles', 0);
  const [purchasedRewards] = useLocalStorage('mushu_purchased_rewards', []);
  const [tasks] = useLocalStorage('mushu_tasks', []);
  const [habits] = useLocalStorage('mushu_habits', []);
  
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    profileAnalysis: null,
    rewardRecommendations: [],
    achievementSuggestions: [],
    motivationStrategy: null,
    lastUpdated: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate recent activity
  const getRecentActivity = useCallback(() => {
    const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
    const activeHabits = habits.filter((h: any) => h.streak > 0).length;
    
    return {
      completedTasks,
      activeHabits,
      activityLevel: completedTasks > 5 ? 'alto' : completedTasks > 2 ? 'medio' : 'bajo',
      lastActivity: 'hoy',
      challenges: completedTasks < 2 ? 'procrastinación, inicio de tareas' : 'mantener momentum',
    };
  }, [tasks, habits]);

  // Get profile analysis
  const getProfileAnalysis = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gamification-ai', {
        body: {
          type: 'profile-analysis',
          currentSparkles: sparkles,
          recentActivity: getRecentActivity(),
          purchasedRewards: purchasedRewards,
        }
      });

      if (error) throw error;

      const analysis = data.data;
      setGamificationData(prev => ({
        ...prev,
        profileAnalysis: analysis,
        lastUpdated: new Date().toISOString(),
      }));

      return analysis;
    } catch (error) {
      console.error('Error getting profile analysis:', error);
      toast({
        title: "Error",
        description: "No se pudo analizar tu perfil. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sparkles, purchasedRewards, getRecentActivity, toast]);

  // Get reward recommendations
  const getRewardRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gamification-ai', {
        body: {
          type: 'reward-recommendations',
          currentSparkles: sparkles,
          recentActivity: getRecentActivity(),
          purchasedRewards: purchasedRewards,
        }
      });

      if (error) throw error;

      const recommendations = data.data?.recommendations || [];
      setGamificationData(prev => ({
        ...prev,
        rewardRecommendations: recommendations,
        lastUpdated: new Date().toISOString(),
      }));

      return recommendations;
    } catch (error) {
      console.error('Error getting reward recommendations:', error);
      toast({
        title: "Error",
        description: "No se pudieron generar recomendaciones. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [sparkles, purchasedRewards, getRecentActivity, toast]);

  // Get achievement suggestions
  const getAchievementSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
      const maxStreak = Math.max(...habits.map((h: any) => h.streak || 0), 0);

      const { data, error } = await supabase.functions.invoke('gamification-ai', {
        body: {
          type: 'achievement-suggestions',
          userData: {
            level: sparkles > 500 ? 'avanzado' : sparkles > 200 ? 'intermedio' : 'principiante',
            streak: maxStreak,
            strengths: completedTasks > 10 ? 'productividad, seguimiento' : 'motivación inicial',
            improvements: maxStreak < 3 ? 'consistencia diaria' : 'gestión de múltiples hábitos',
          },
          currentSparkles: sparkles,
        }
      });

      if (error) throw error;

      const suggestions = data.data?.achievements || [];
      setGamificationData(prev => ({
        ...prev,
        achievementSuggestions: suggestions,
        lastUpdated: new Date().toISOString(),
      }));

      return suggestions;
    } catch (error) {
      console.error('Error getting achievement suggestions:', error);
      toast({
        title: "Error",
        description: "No se pudieron generar sugerencias de logros. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [sparkles, tasks, habits, toast]);

  // Get motivation strategy
  const getMotivationStrategy = useCallback(async (context?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gamification-ai', {
        body: {
          type: 'motivation-strategy',
          userData: {
            currentState: context || 'buscando motivación',
            currentChallenges: 'iniciar tareas, mantener enfoque',
            context: new Date().getHours() < 12 ? 'mañana' : new Date().getHours() < 18 ? 'tarde' : 'noche',
          },
          currentSparkles: sparkles,
        }
      });

      if (error) throw error;

      const strategy = data.data;
      setGamificationData(prev => ({
        ...prev,
        motivationStrategy: strategy,
        lastUpdated: new Date().toISOString(),
      }));

      return strategy;
    } catch (error) {
      console.error('Error getting motivation strategy:', error);
      toast({
        title: "Error",
        description: "No se pudo generar estrategia de motivación. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sparkles, toast]);

  return {
    gamificationData,
    isLoading,
    currentSparkles: sparkles,
    getProfileAnalysis,
    getRewardRecommendations,
    getAchievementSuggestions,
    getMotivationStrategy,
  };
};
