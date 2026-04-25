import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useEmotionAnalysis } from './useEmotionAnalysis';
import { useLocalStorage } from './useLocalStorage';
import { toast } from 'sonner';

interface UserContext {
  pendingTasks: number;
  habitsToday: number;
  productivityLevel: string;
  wellbeingScore: string;
  totalConversations: number;
  frequentTopics: string[];
  recentAchievements: string[];
}

interface EmotionalState {
  current: string;
  trend: string;
  history: { emotion: string; timestamp: string; confidence: number }[];
}

interface ProactiveAction {
  actionType: string;
  message: string;
  urgency: string;
  timestamp: string;
}

export const useAdvancedChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useLocalStorage<UserContext>('mushu_user_context', {
    pendingTasks: 0,
    habitsToday: 0,
    productivityLevel: 'normal',
    wellbeingScore: 'no evaluado',
    totalConversations: 0,
    frequentTopics: [],
    recentAchievements: []
  });
  const [emotionalState, setEmotionalState] = useLocalStorage<EmotionalState>('mushu_emotional_state', {
    current: 'neutral',
    trend: 'stable',
    history: []
  });
  const [preferences, setPreferences] = useLocalStorage('mushu_preferences', {
    communicationStyle: 'empático',
    motivationLevel: 'moderado',
    interests: ['productividad', 'bienestar'],
    activeHours: '9:00-22:00'
  });
  const [proactiveActions, setProactiveActions] = useState<ProactiveAction[]>([]);

  const { analyzeEmotion } = useEmotionAnalysis();

  // Actualizar contexto del usuario desde otras áreas de la app
  const updateUserContext = useCallback((updates: Partial<UserContext>) => {
    setUserContext(prev => ({ ...prev, ...updates }));
  }, [setUserContext]);

  // Analizar emoción y actualizar estado emocional
  const updateEmotionalState = useCallback(async (message: string) => {
    try {
      const emotionAnalysis = await analyzeEmotion(message);
      if (emotionAnalysis) {
        const newEmotionalEntry = {
          emotion: emotionAnalysis.emotion,
          timestamp: new Date().toISOString(),
          confidence: emotionAnalysis.confidence
        };

        setEmotionalState(prev => {
          const newHistory = [...prev.history, newEmotionalEntry].slice(-10); // Mantener solo últimas 10
          const trend = calculateEmotionalTrend(newHistory);
          
          return {
            current: emotionAnalysis.emotion,
            trend,
            history: newHistory
          };
        });

        return emotionAnalysis.emotion;
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    }
    return 'neutral';
  }, [analyzeEmotion, setEmotionalState]);

  // Calcular tendencia emocional
  const calculateEmotionalTrend = (history: any[]): string => {
    if (history.length < 3) return 'stable';
    
    const recent = history.slice(-3);
    const positiveEmotions = ['joy', 'happiness', 'excited', 'grateful', 'confident'];
    const negativeEmotions = ['sadness', 'anxiety', 'stress', 'anger', 'frustrated'];
    
    const recentPositive = recent.filter(e => positiveEmotions.includes(e.emotion)).length;
    const recentNegative = recent.filter(e => negativeEmotions.includes(e.emotion)).length;
    
    if (recentPositive > recentNegative) return 'improving';
    if (recentNegative > recentPositive) return 'declining';
    return 'stable';
  };

  // Enviar mensaje con análisis avanzado
  const sendAdvancedMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    
    try {
      // Crear mensaje del usuario
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        userId: 'current-user',
        role: 'user',
        content: message.trim(),
        timestamp: new Date().toISOString()
      };

      // Analizar emoción del mensaje
      const detectedEmotion = await updateEmotionalState(message);
      userMessage.emotionalContext = detectedEmotion;

      setMessages(prev => [...prev, userMessage]);

      // Actualizar contexto de conversación
      setUserContext(prev => ({
        ...prev,
        totalConversations: prev.totalConversations + 1,
        frequentTopics: updateFrequentTopics(prev.frequentTopics, message)
      }));

      // Obtener última actividad del usuario
      const lastActivity = getLastUserActivity();

      // Llamar a la función edge mejorada
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          message: message.trim(),
          conversationHistory: messages.slice(-5), // Últimas 5 interacciones para contexto
          userContext,
          emotionalState,
          lastActivity,
          preferences
        }
      });

      if (error) throw error;

      if (data) {
        // Crear respuesta de Mushu
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          userId: 'current-user',
          role: 'assistant',
          content: data.message || data.fallback,
          timestamp: new Date().toISOString(),
          emotionalAnalysis: data.emotionalAnalysis,
          functionCall: data.functionCall
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Procesar acciones proactivas
        if (data.proactiveAction) {
          handleProactiveAction(data.proactiveAction);
        }

        // Actualizar análisis emocional si está disponible
        if (data.emotionalAnalysis) {
          handleEmotionalAnalysis(data.emotionalAnalysis);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje. Usando respuesta local.');
      
      // Fallback a respuesta local
      const fallbackMessage: ChatMessage = {
        id: crypto.randomUUID(),
        userId: 'current-user',
        role: 'assistant',
        content: generateFallbackResponse(message, emotionalState.current),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  }, [messages, userContext, emotionalState, preferences, updateEmotionalState, setUserContext]);

  // Manejar acciones proactivas
  const handleProactiveAction = useCallback((action: ProactiveAction) => {
    const actionWithTimestamp = {
      ...action,
      timestamp: new Date().toISOString()
    };

    setProactiveActions(prev => [actionWithTimestamp, ...prev.slice(0, 4)]); // Mantener últimas 5

    // Mostrar toast según la urgencia
    const toastOptions = {
      description: action.message,
      duration: action.urgency === 'high' ? 10000 : 5000
    };

    switch (action.urgency) {
      case 'high':
        toast.error(`🚨 ${action.message}`, toastOptions);
        break;
      case 'medium':
        toast.warning(`⚠️ ${action.message}`, toastOptions);
        break;
      default:
        toast.info(`💡 ${action.message}`, toastOptions);
    }
  }, []);

  // Manejar análisis emocional
  const handleEmotionalAnalysis = useCallback((analysis: any) => {
    console.log('Análisis emocional recibido:', analysis);
    
    // Actualizar recomendaciones basadas en el análisis
    if (analysis.supportLevel === 'intensive') {
      handleProactiveAction({
        actionType: 'wellness_check',
        message: `Detecté que podrías necesitar apoyo adicional. ${analysis.recommendation}`,
        urgency: 'high',
        timestamp: new Date().toISOString()
      });
    }
  }, [handleProactiveAction]);

  // Obtener última actividad del usuario
  const getLastUserActivity = (): any => {
    // Aquí puedes integrar con otros hooks/stores para obtener la última actividad
    // Por ejemplo, desde tareas, hábitos, ejercicios de bienestar, etc.
    return {
      type: 'chat',
      timestamp: new Date().toISOString()
    };
  };

  // Actualizar temas frecuentes
  const updateFrequentTopics = (currentTopics: string[], message: string): string[] => {
    const keywords = ['trabajo', 'productividad', 'bienestar', 'ejercicio', 'finanzas', 'salud', 'estrés', 'ansiedad'];
    const detectedTopics = keywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    const updated = [...currentTopics, ...detectedTopics];
    const frequency = updated.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  };

  // Generar respuesta de fallback local
  const generateFallbackResponse = (message: string, emotion: string): string => {
    const responses = {
      sadness: [
        "Entiendo que te sientes triste. Estoy aquí para acompañarte.",
        "Es normal sentirse así a veces. ¿Quieres hablar sobre lo que te preocupa?"
      ],
      anxiety: [
        "Percibo algo de ansiedad en tu mensaje. Respira profundo conmigo.",
        "La ansiedad es temporal. Estás haciendo lo mejor que puedes."
      ],
      neutral: [
        "Gracias por compartir eso conmigo. ¿Cómo puedo ayudarte mejor?",
        "Estoy aquí para apoyarte en lo que necesites."
      ]
    };

    const emotionResponses = responses[emotion as keyof typeof responses] || responses.neutral;
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  };

  // Limpiar mensajes
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Inicialización proactiva
  useEffect(() => {
    // Verificar si es momento de una iniciativa proactiva
    const checkForProactiveInitiatives = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Ejemplo: recordatorio matutino
      if (hour === 9 && userContext.totalConversations === 0) {
        handleProactiveAction({
          actionType: 'motivation_boost',
          message: '¡Buenos días! ¿Cómo te sientes hoy? Estoy aquí para ayudarte a que sea un gran día.',
          urgency: 'low',
          timestamp: now.toISOString()
        });
      }
    };

    // Verificar cada 30 minutos
    const interval = setInterval(checkForProactiveInitiatives, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userContext, handleProactiveAction]);

  return {
    messages,
    loading,
    sendMessage: sendAdvancedMessage,
    clearMessages,
    userContext,
    updateUserContext,
    emotionalState,
    proactiveActions,
    preferences,
    setPreferences
  };
};