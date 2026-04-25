import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { supabase } from '@/integrations/supabase/client';

export interface BreathingTechnique {
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
  cycles: number;
  instructions: string[];
  benefits: string[];
  mindfulnessPrompts: string[];
}

export interface PersonalizedSession {
  sessionName: string;
  duration: number;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  techniques: BreathingTechnique[];
  progressionTips: string[];
  adaptation: {
    beginner: string;
    advanced: string;
  };
  emotionalGuidance: string[];
  postSessionReflection: string[];
}

export interface BreathingProgress {
  progressScore: number;
  improvements: string[];
  patterns: {
    mostEffectiveTechniques: string[];
    optimalTimes: string[];
    consistencyLevel: 'bajo' | 'medio' | 'alto';
  };
  recommendations: string[];
  nextGoals: string[];
  motivationalMessage: string;
}

export interface BreathingSession {
  id: string;
  date: string;
  technique: string;
  duration: number;
  cycles: number;
  beforeMood: number;
  afterMood: number;
  stressLevelBefore: number;
  stressLevelAfter: number;
  notes?: string;
}

export const useBreathingAI = () => {
  const [currentSession, setCurrentSession] = useState<PersonalizedSession | null>(null);
  const [progress, setProgress] = useState<BreathingProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useLocalStorage<BreathingSession[]>('breathing-sessions', []);
  const [userPreferences, setUserPreferences] = useLocalStorage('breathing-preferences', {
    preferredDuration: 10,
    difficulty: 'intermedio',
    favoriteTime: 'evening'
  });

  const generatePersonalizedSession = async (emotionalState: string, stressLevel: number, currentMood: string) => {
    setLoading(true);
    
    try {
      const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                       new Date().getHours() < 18 ? 'afternoon' : 'evening';

      console.log('Generating personalized breathing session...');
      
      const { data, error } = await supabase.functions.invoke('breathing-ai-coach', {
        body: {
          emotionalState,
          stressLevel,
          currentMood,
          breathingHistory: sessionHistory.slice(-10), // Last 10 sessions
          userPreferences,
          timeOfDay,
          requestType: 'personalized_session'
        }
      });

      if (error) {
        console.error('Error generating session:', error);
        throw error;
      }

      console.log('Personalized session generated successfully');
      setCurrentSession(data);
      return data;
      
    } catch (error) {
      console.error('Error in generatePersonalizedSession:', error);
      
      // Fallback session
      const fallbackSession: PersonalizedSession = {
        sessionName: "Sesión de Relajación",
        duration: 10,
        difficulty: 'intermedio',
        techniques: [{
          name: "Respiración 4-7-8",
          description: "Técnica clásica para la relajación profunda",
          pattern: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
          cycles: 4,
          instructions: [
            "Siéntate cómodamente con la espalda recta",
            "Coloca la punta de tu lengua detrás de los dientes superiores",
            "Exhala completamente por la boca",
            "Cierra la boca e inhala por la nariz contando hasta 4"
          ],
          benefits: ["Reduce la ansiedad", "Mejora la calidad del sueño", "Calma el sistema nervioso"],
          mindfulnessPrompts: [
            "Nota cómo se expande tu abdomen al inhalar",
            "Siente la pausa entre respiraciones",
            "Observa cómo se relaja tu cuerpo con cada exhalación"
          ]
        }],
        progressionTips: ["Practica en el mismo horario cada día", "Comienza con pocos ciclos y aumenta gradualmente"],
        adaptation: {
          beginner: "Comienza con 3 ciclos y respira más suavemente",
          advanced: "Aumenta a 8 ciclos y extiende las pausas"
        },
        emotionalGuidance: ["Es normal sentir emociones durante la práctica", "Permite que fluyan sin juzgar"],
        postSessionReflection: ["¿Cómo te sientes comparado con antes?", "¿Qué sensaciones notas en tu cuerpo?"]
      };
      
      setCurrentSession(fallbackSession);
      return fallbackSession;
    } finally {
      setLoading(false);
    }
  };

  const analyzeProgress = async () => {
    if (sessionHistory.length === 0) return null;
    
    setLoading(true);
    
    try {
      const avgStressLevel = sessionHistory.reduce((sum, session) => sum + session.stressLevelBefore, 0) / sessionHistory.length;
      const avgMood = sessionHistory.reduce((sum, session) => sum + session.beforeMood, 0) / sessionHistory.length;
      
      console.log('Analyzing breathing progress...');
      
      const { data, error } = await supabase.functions.invoke('breathing-ai-coach', {
        body: {
          breathingHistory: sessionHistory,
          emotionalState: avgMood > 6 ? 'positive' : avgMood < 4 ? 'negative' : 'neutral',
          stressLevel: avgStressLevel,
          requestType: 'analyze_progress'
        }
      });

      if (error) {
        console.error('Error analyzing progress:', error);
        throw error;
      }

      console.log('Progress analysis completed');
      setProgress(data);
      return data;
      
    } catch (error) {
      console.error('Error in analyzeProgress:', error);
      
      // Fallback progress
      const fallbackProgress: BreathingProgress = {
        progressScore: Math.min(sessionHistory.length * 10, 100),
        improvements: sessionHistory.length > 5 ? ["Mayor consistencia en la práctica"] : ["Comenzando el hábito"],
        patterns: {
          mostEffectiveTechniques: ["4-7-8", "Respiración profunda"],
          optimalTimes: ["Mañana", "Noche"],
          consistencyLevel: sessionHistory.length > 10 ? 'alto' : sessionHistory.length > 5 ? 'medio' : 'bajo'
        },
        recommendations: ["Mantén la práctica diaria", "Experimenta con diferentes técnicas"],
        nextGoals: sessionHistory.length < 5 ? ["Completar 5 sesiones"] : ["Aumentar duración de sesiones"],
        motivationalMessage: sessionHistory.length > 0 ? 
          "¡Excelente progreso! Cada respiración consciente cuenta." : 
          "¡Comienza tu viaje hacia el bienestar!"
      };
      
      setProgress(fallbackProgress);
      return fallbackProgress;
    } finally {
      setLoading(false);
    }
  };

  const saveSession = (session: Omit<BreathingSession, 'id' | 'date'>) => {
    const newSession: BreathingSession = {
      ...session,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    setSessionHistory(prev => [...prev, newSession]);
  };

  const getRecommendations = async (emotionalState: string, stressLevel: number, currentMood: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('breathing-ai-coach', {
        body: {
          emotionalState,
          stressLevel,
          currentMood,
          requestType: 'recommendations'
        }
      });

      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return {
        recommendations: [{
          name: "Respiración profunda",
          reason: "Técnica versátil para cualquier estado emocional",
          urgency: "media",
          expectedBenefit: "Equilibrio y calma"
        }],
        immediateAction: {
          technique: "Respiración 4-4-4",
          quickSteps: ["Inhala 4 segundos", "Retén 4 segundos", "Exhala 4 segundos"]
        }
      };
    }
  };

  const getSessionStats = () => {
    if (sessionHistory.length === 0) return null;
    
    const totalSessions = sessionHistory.length;
    const totalMinutes = sessionHistory.reduce((sum, session) => sum + session.duration, 0);
    const avgMoodImprovement = sessionHistory.reduce((sum, session) => 
      sum + (session.afterMood - session.beforeMood), 0) / totalSessions;
    const avgStressReduction = sessionHistory.reduce((sum, session) => 
      sum + (session.stressLevelBefore - session.stressLevelAfter), 0) / totalSessions;
    
    const last7Days = sessionHistory.filter(session => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    return {
      totalSessions,
      totalMinutes,
      avgMoodImprovement: Math.round(avgMoodImprovement * 10) / 10,
      avgStressReduction: Math.round(avgStressReduction * 10) / 10,
      weeklyStreak: last7Days.length,
      mostUsedTechnique: sessionHistory.reduce((acc, session) => {
        acc[session.technique] = (acc[session.technique] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  // Auto-analyze progress when sessions change
  useEffect(() => {
    if (sessionHistory.length > 0 && sessionHistory.length % 5 === 0) {
      analyzeProgress();
    }
  }, [sessionHistory.length]);

  return {
    currentSession,
    progress,
    loading,
    sessionHistory,
    userPreferences,
    generatePersonalizedSession,
    analyzeProgress,
    saveSession,
    getRecommendations,
    getSessionStats,
    setUserPreferences
  };
};