import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmotionalAnalysis {
  primaryEmotion: string;
  emotionIntensity: number;
  secondaryEmotions: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence: number;
}

export interface JournalInsights {
  mainThemes: string[];
  cognitivePatterns: string[];
  stressIndicators: string[];
  positiveAspects: string[];
}

export interface JournalRecommendations {
  immediate: string[];
  longTerm: string[];
  resources: string[];
}

export interface JournalAnalysis {
  emotionalAnalysis: EmotionalAnalysis;
  insights: JournalInsights;
  recommendations: JournalRecommendations;
  supportResponse: string;
  moodScore: number;
  flagsForConcern: boolean;
}

export interface JournalPrompt {
  text: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'emotions' | 'creativity' | 'relationships';
  emotionalFocus: string;
  difficulty: 'easy' | 'medium' | 'deep';
}

export interface EmotionalTrends {
  overall: 'improving' | 'stable' | 'declining' | 'mixed';
  dominantEmotions: string[];
  emotionalVariability: number;
  resilenceIndicators: string[];
}

export interface EmotionalPatterns {
  cyclicalPatterns: string[];
  triggers: string[];
  copingStrategies: string[];
  growthAreas: string[];
}

export interface EmotionalInsights {
  emotionalTrends: EmotionalTrends;
  patterns: EmotionalPatterns;
  recommendations: {
    priorityAreas: string[];
    actionPlan: string[];
    checkInFrequency: string;
    professionalSupport: boolean;
  };
  insights: string;
  encouragement: string;
  wellnessScore: number;
}

export const useIntelligentJournal = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JournalAnalysis | null>(null);
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [emotionalInsights, setEmotionalInsights] = useState<EmotionalInsights | null>(null);
  const { toast } = useToast();

  const analyzeJournalEntry = async (
    journalEntry: string,
    recentEntries: string[] = []
  ): Promise<JournalAnalysis | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('journal-ai-insights', {
        body: {
          action: 'analyze_entry',
          journalEntry,
          recentEntries
        }
      });

      if (error) {
        console.error('Error analyzing journal entry:', error);
        toast({
          title: "Error en el análisis",
          description: "No se pudo analizar la entrada del diario",
          variant: "destructive"
        });
        return null;
      }

      setAnalysis(data);
      return data;
    } catch (error) {
      console.error('Error in analyzeJournalEntry:', error);
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

  const generatePersonalizedPrompts = async (
    emotionalHistory: any[] = [],
    recentEntries: string[] = []
  ): Promise<JournalPrompt[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('journal-ai-insights', {
        body: {
          action: 'generate_prompts',
          emotionalHistory,
          recentEntries
        }
      });

      if (error) {
        console.error('Error generating prompts:', error);
        toast({
          title: "Error generando prompts",
          description: "No se pudieron generar prompts personalizados",
          variant: "destructive"
        });
        return [];
      }

      setPrompts(data.prompts || []);
      return data.prompts || [];
    } catch (error) {
      console.error('Error in generatePersonalizedPrompts:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getEmotionalInsights = async (
    emotionalHistory: any[] = [],
    recentEntries: string[] = []
  ): Promise<EmotionalInsights | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('journal-ai-insights', {
        body: {
          action: 'emotional_insights',
          emotionalHistory,
          recentEntries
        }
      });

      if (error) {
        console.error('Error getting emotional insights:', error);
        toast({
          title: "Error en insights",
          description: "No se pudieron obtener los insights emocionales",
          variant: "destructive"
        });
        return null;
      }

      setEmotionalInsights(data);
      return data;
    } catch (error) {
      console.error('Error in getEmotionalInsights:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getEmotionColor = (emotion: string): string => {
    const emotionColors: Record<string, string> = {
      'feliz': 'hsl(var(--chart-1))',
      'alegre': 'hsl(var(--chart-1))',
      'triste': 'hsl(var(--chart-2))',
      'melancólico': 'hsl(var(--chart-2))',
      'ansioso': 'hsl(var(--chart-3))',
      'nervioso': 'hsl(var(--chart-3))',
      'enojado': 'hsl(var(--chart-4))',
      'frustrado': 'hsl(var(--chart-4))',
      'calmado': 'hsl(var(--chart-5))',
      'tranquilo': 'hsl(var(--chart-5))',
      'reflexivo': 'hsl(var(--primary))',
      'contemplativo': 'hsl(var(--primary))',
    };
    
    return emotionColors[emotion.toLowerCase()] || 'hsl(var(--muted-foreground))';
  };

  const getMoodEmoji = (moodScore: number): string => {
    if (moodScore >= 7) return '😊';
    if (moodScore >= 4) return '😌';
    if (moodScore >= 1) return '😐';
    if (moodScore >= -3) return '😔';
    return '😢';
  };

  return {
    loading,
    analysis,
    prompts,
    emotionalInsights,
    analyzeJournalEntry,
    generatePersonalizedPrompts,
    getEmotionalInsights,
    getEmotionColor,
    getMoodEmoji
  };
};