import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmotionalEntry {
  id: string;
  date: string;
  mood: number;
  stress: number;
  emotions: string[];
  content: string;
  triggers?: string[];
  coping?: string[];
}

export interface TherapeuticInsight {
  insight: string;
  category: 'cognitivo' | 'emocional' | 'conductual' | 'social';
  priority: 'baja' | 'media' | 'alta' | 'crítica';
  evidenceLevel: 'observacional' | 'fuerte' | 'muy_fuerte';
  actionable: boolean;
}

export interface CognitiveDistortion {
  type: string;
  description: string;
  frequency: 'baja' | 'media' | 'alta';
  impact: 'bajo' | 'medio' | 'alto';
}

export interface TherapeuticIntervention {
  technique: string;
  description: string;
  category: 'CBT' | 'mindfulness' | 'exposure' | 'behavioral';
  duration: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  adhdFriendly: boolean;
  steps: string[];
  expectedOutcome: string;
}

export interface CBTSession {
  sessionPlan: {
    title: string;
    duration: number;
    objectives: string[];
    techniques: string[];
  };
  guidedExercises: Array<{
    name: string;
    type: 'thought_record' | 'behavioral_experiment' | 'mindfulness' | 'exposure';
    instructions: string[];
    duration: number;
    materials: string[];
    reflectionQuestions: string[];
  }>;
  homeworkAssignments: Array<{
    task: string;
    duration: string;
    frequency: string;
    trackingMethod: string;
  }>;
  adaptations: {
    forADHD: string[];
    personalityBased: string[];
  };
}

export interface EmotionalAnalysis {
  overallState: 'estable' | 'en_riesgo' | 'crisis' | 'mejorando';
  dominantEmotions: string[];
  emotionalStability: number;
  riskFactors: string[];
  strengthFactors: string[];
}

export interface ProgressTracking {
  improvementAreas: string[];
  concernAreas: string[];
  nextSteps: string[];
  milestones: string[];
}

export const useIntelligentTherapy = () => {
  const [emotionalEntries, setEmotionalEntries] = useLocalStorage<EmotionalEntry[]>('mushu_emotional_entries', []);
  const [therapyGoals, setTherapyGoals] = useLocalStorage<string[]>('mushu_therapy_goals', []);
  const [currentSymptoms, setCurrentSymptoms] = useLocalStorage<string[]>('mushu_current_symptoms', []);
  const [identifiedTriggers, setIdentifiedTriggers] = useLocalStorage<string[]>('mushu_triggers', []);
  
  const [loading, setLoading] = useState(false);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [therapeuticInsights, setTherapeuticInsights] = useState<TherapeuticInsight[]>([]);
  const [cognitiveDistortions, setCognitiveDistortions] = useState<CognitiveDistortion[]>([]);
  const [personalizedInterventions, setPersonalizedInterventions] = useState<TherapeuticIntervention[]>([]);
  const [progressTracking, setProgressTracking] = useState<ProgressTracking | null>(null);
  const [currentCBTSession, setCurrentCBTSession] = useState<CBTSession | null>(null);
  const [wellnessScore, setWellnessScore] = useState<number>(70);

  // Generar análisis emocional profundo
  const generateEmotionalAnalysis = useCallback(async () => {
    setLoading(true);
    
    try {
      console.log('Generating emotional analysis...');
      
      const moodHistory = emotionalEntries.map(entry => ({
        date: entry.date,
        mood: entry.mood,
        stress: entry.stress,
        emotions: entry.emotions
      }));

      const stressLevels = emotionalEntries.map(entry => ({
        date: entry.date,
        level: entry.stress
      }));

      const { data, error } = await supabase.functions.invoke('therapy-ai-insights', {
        body: {
          emotionalEntries: emotionalEntries.slice(0, 20), // Últimas 20 entradas
          moodHistory: moodHistory.slice(0, 30),
          stressLevels: stressLevels.slice(0, 30),
          triggers: identifiedTriggers,
          currentSymptoms,
          therapyGoals,
          requestType: 'emotion_analysis',
          adhdTraits: ['impulsividad', 'distractibilidad', 'hiperactividad']
        }
      });

      if (error) {
        console.error('Error generating analysis:', error);
        throw error;
      }

      console.log('Emotional analysis generated successfully');
      
      if (data.emotionalAnalysis) setEmotionalAnalysis(data.emotionalAnalysis);
      if (data.therapeuticInsights) setTherapeuticInsights(data.therapeuticInsights);
      if (data.cognitivePatterns?.identifiedDistortions) setCognitiveDistortions(data.cognitivePatterns.identifiedDistortions);
      if (data.personalizedInterventions) setPersonalizedInterventions(data.personalizedInterventions);
      if (data.progressTracking) setProgressTracking(data.progressTracking);

      // Calcular score de bienestar basado en el análisis
      const newWellnessScore = Math.round(
        (data.emotionalAnalysis?.emotionalStability * 10 || 70) +
        (data.therapeuticInsights?.filter((i: any) => i.priority !== 'crítica').length * 2 || 0) -
        (data.cognitivePatterns?.identifiedDistortions?.length * 5 || 0)
      );
      setWellnessScore(Math.max(0, Math.min(100, newWellnessScore)));

      // Mostrar alertas críticas
      data.therapeuticInsights
        ?.filter((insight: TherapeuticInsight) => insight.priority === 'crítica')
        .forEach((insight: TherapeuticInsight) => {
          toast.error(`🚨 ${insight.insight}`, {
            duration: 10000
          });
        });

      return data;
      
    } catch (error) {
      console.error('Error in generateEmotionalAnalysis:', error);
      
      // Análisis básico como fallback
      generateBasicAnalysis();
      
      toast.error('Error al generar análisis. Usando análisis básico.');
    } finally {
      setLoading(false);
    }
  }, [emotionalEntries, identifiedTriggers, currentSymptoms, therapyGoals]);

  // Análisis básico como fallback
  const generateBasicAnalysis = useCallback(() => {
    if (emotionalEntries.length === 0) return;

    const recentEntries = emotionalEntries.slice(0, 10);
    const avgMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const avgStress = recentEntries.reduce((sum, entry) => sum + entry.stress, 0) / recentEntries.length;

    const basicAnalysis: EmotionalAnalysis = {
      overallState: avgMood > 6 ? 'estable' : avgMood < 4 ? 'en_riesgo' : 'mejorando',
      dominantEmotions: recentEntries.flatMap(e => e.emotions).slice(0, 3),
      emotionalStability: Math.round(avgMood),
      riskFactors: avgStress > 7 ? ['Alto estrés', 'Fatiga emocional'] : ['Estrés moderado'],
      strengthFactors: ['Autoconciencia', 'Compromiso con el bienestar']
    };

    const basicInsights: TherapeuticInsight[] = [
      {
        insight: avgMood < 5 ? 'Tu estado de ánimo requiere atención' : 'Mantienes un buen equilibrio emocional',
        category: 'emocional',
        priority: avgMood < 4 ? 'alta' : 'media',
        evidenceLevel: 'observacional',
        actionable: true
      }
    ];

    const basicInterventions: TherapeuticIntervention[] = [
      {
        technique: 'Registro de Estado de Ánimo',
        description: 'Monitorea tu estado emocional diariamente',
        category: 'CBT',
        duration: '5-10min',
        difficulty: 'principiante',
        adhdFriendly: true,
        steps: ['Evalúa tu ánimo', 'Identifica factores', 'Anota observaciones'],
        expectedOutcome: 'Mayor autoconciencia emocional'
      }
    ];

    setEmotionalAnalysis(basicAnalysis);
    setTherapeuticInsights(basicInsights);
    setPersonalizedInterventions(basicInterventions);
    setWellnessScore(Math.round(avgMood * 10));
  }, [emotionalEntries]);

  // Crear sesión CBT personalizada
  const createCBTSession = useCallback(async (focus?: string) => {
    setLoading(true);
    
    try {
      console.log('Creating CBT session...');
      
      const { data, error } = await supabase.functions.invoke('therapy-ai-insights', {
        body: {
          currentSymptoms,
          triggers: identifiedTriggers,
          therapyGoals,
          requestType: 'cbt_session',
          userPersonality: { focus: focus || 'general' }
        }
      });

      if (error) throw error;

      console.log('CBT session created successfully');
      setCurrentCBTSession(data);
      
      toast.success('Sesión de terapia personalizada creada');
      return data;
      
    } catch (error) {
      console.error('Error creating CBT session:', error);
      
      // Sesión CBT básica como fallback
      const basicSession: CBTSession = {
        sessionPlan: {
          title: 'Sesión de Autoconocimiento',
          duration: 30,
          objectives: ['Identificar patrones de pensamiento', 'Desarrollar estrategias de afrontamiento'],
          techniques: ['CBT', 'Mindfulness']
        },
        guidedExercises: [{
          name: 'Registro de Pensamientos',
          type: 'thought_record',
          instructions: [
            'Identifica un pensamiento que te causa malestar',
            'Evalúa qué evidencia tienes a favor y en contra',
            'Desarrolla un pensamiento más equilibrado'
          ],
          duration: 15,
          materials: ['Libreta', 'Bolígrafo'],
          reflectionQuestions: [
            '¿Es este pensamiento completamente cierto?',
            '¿Qué le dirías a un amigo en esta situación?'
          ]
        }],
        homeworkAssignments: [{
          task: 'Practicar registro de pensamientos diariamente',
          duration: '10-15 minutos',
          frequency: 'diario',
          trackingMethod: 'Aplicación de terapia'
        }],
        adaptations: {
          forADHD: ['Sesiones más cortas', 'Recordatorios visuales', 'Pausas frecuentes'],
          personalityBased: ['Enfoque práctico y directo']
        }
      };
      
      setCurrentCBTSession(basicSession);
      toast.success('Sesión básica de terapia creada');
      return basicSession;
    } finally {
      setLoading(false);
    }
  }, [currentSymptoms, identifiedTriggers, therapyGoals]);

  // Evaluación de crisis
  const assessCrisis = useCallback(async () => {
    if (emotionalEntries.length === 0) return null;
    
    const latestEntry = emotionalEntries[0];
    
    // Evaluación rápida de crisis
    if (latestEntry.mood <= 2 || latestEntry.stress >= 9) {
      try {
        const { data, error } = await supabase.functions.invoke('therapy-ai-insights', {
          body: {
            currentSymptoms,
            moodHistory: [latestEntry],
            emotionalEntries: [latestEntry],
            requestType: 'crisis_intervention'
          }
        });

        if (error) throw error;
        
        // Mostrar alerta de crisis si es necesario
        if (data.crisisAssessment?.severity === 'crítica') {
          toast.error('🚨 Se detecta una situación de crisis. Considera buscar ayuda profesional inmediata.', {
            duration: 15000
          });
        }
        
        return data;
      } catch (error) {
        console.error('Error in crisis assessment:', error);
        return null;
      }
    }
    
    return null;
  }, [emotionalEntries, currentSymptoms]);

  // Agregar entrada emocional
  const addEmotionalEntry = useCallback((entry: Omit<EmotionalEntry, 'id'>) => {
    const newEntry: EmotionalEntry = {
      ...entry,
      id: Date.now().toString()
    };
    
    setEmotionalEntries(prev => [newEntry, ...prev]);
    
    // Auto-evaluar crisis si el estado es muy bajo
    if (entry.mood <= 3 || entry.stress >= 8) {
      setTimeout(() => assessCrisis(), 1000);
    }
    
    // Re-generar análisis si hay suficientes entradas
    if (emotionalEntries.length > 3) {
      setTimeout(() => generateEmotionalAnalysis(), 2000);
    }
  }, [emotionalEntries.length, generateEmotionalAnalysis, assessCrisis, setEmotionalEntries]);

  // Chequeo de bienestar general
  const performWellnessCheck = useCallback(async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('therapy-ai-insights', {
        body: {
          emotionalEntries: emotionalEntries.slice(0, 5),
          moodHistory: emotionalEntries.slice(0, 7).map(e => ({ mood: e.mood, date: e.date })),
          requestType: 'wellness_check'
        }
      });

      if (error) throw error;
      
      if (data.wellnessScore) setWellnessScore(data.wellnessScore);
      
      return data;
    } catch (error) {
      console.error('Error in wellness check:', error);
      
      // Cálculo básico de bienestar
      if (emotionalEntries.length > 0) {
        const avgMood = emotionalEntries.slice(0, 7).reduce((sum, e) => sum + e.mood, 0) / Math.min(7, emotionalEntries.length);
        setWellnessScore(Math.round(avgMood * 10));
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [emotionalEntries]);

  // Auto-análisis periódico
  useEffect(() => {
    if (emotionalEntries.length > 0) {
      performWellnessCheck();
    }
  }, [emotionalEntries.length]);

  // Auto-generar análisis cuando se agreguen entradas
  useEffect(() => {
    if (emotionalEntries.length > 0 && emotionalEntries.length % 5 === 0) {
      generateEmotionalAnalysis();
    }
  }, [emotionalEntries.length, generateEmotionalAnalysis]);

  return {
    // Data
    emotionalEntries,
    therapyGoals,
    currentSymptoms,
    identifiedTriggers,
    
    // Analysis results
    emotionalAnalysis,
    therapeuticInsights,
    cognitiveDistortions,
    personalizedInterventions,
    progressTracking,
    currentCBTSession,
    wellnessScore,
    loading,
    
    // Actions
    addEmotionalEntry,
    setTherapyGoals,
    setCurrentSymptoms,
    setIdentifiedTriggers,
    
    // AI functions
    generateEmotionalAnalysis,
    createCBTSession,
    assessCrisis,
    performWellnessCheck
  };
};