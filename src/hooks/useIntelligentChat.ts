import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface UserContext {
  recentJournalEntries?: any[];
  currentMood?: string;
  recentTasks?: any[];
  habitProgress?: any[];
  breathingPractice?: any[];
  financialData?: any[];
}

interface IntelligentChatAnalysis {
  analysis: string;
  analysisType: string;
  timestamp: string;
}

export const useIntelligentChat = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contextualResponse, setContextualResponse] = useState<string>('');
  const [conversationSummary, setConversationSummary] = useState<string>('');
  const [emotionalInsights, setEmotionalInsights] = useState<string>('');
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string>('');
  const { toast } = useToast();

  const analyzeConversation = useCallback(async (
    message: string,
    conversationHistory: ChatMessage[],
    userContext: UserContext = {},
    emotionalState?: string,
    analysisType: 'contextual_response' | 'conversation_summary' | 'emotional_check' | 'personalized_suggestions' = 'contextual_response'
  ): Promise<IntelligentChatAnalysis | null> => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-chat', {
        body: {
          message,
          conversationHistory,
          userContext,
          emotionalState,
          analysisType
        }
      });

      if (error) {
        console.error('Error invoking intelligent-chat function:', error);
        throw error;
      }

      const analysis = data as IntelligentChatAnalysis;
      
      // Store the analysis based on type
      switch (analysisType) {
        case 'contextual_response':
          setContextualResponse(analysis.analysis);
          break;
        case 'conversation_summary':
          setConversationSummary(analysis.analysis);
          break;
        case 'emotional_check':
          setEmotionalInsights(analysis.analysis);
          break;
        case 'personalized_suggestions':
          setPersonalizedSuggestions(analysis.analysis);
          break;
      }

      return analysis;
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      toast({
        title: "Error de Análisis",
        description: "No se pudo analizar la conversación. Inténtalo de nuevo.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const getContextualResponse = useCallback(async (
    message: string,
    conversationHistory: ChatMessage[],
    userContext: UserContext = {},
    emotionalState?: string
  ): Promise<string> => {
    const analysis = await analyzeConversation(
      message,
      conversationHistory,
      userContext,
      emotionalState,
      'contextual_response'
    );
    return analysis?.analysis || '';
  }, [analyzeConversation]);

  const generateConversationSummary = useCallback(async (
    conversationHistory: ChatMessage[],
    userContext: UserContext = {}
  ): Promise<string> => {
    const analysis = await analyzeConversation(
      '',
      conversationHistory,
      userContext,
      undefined,
      'conversation_summary'
    );
    return analysis?.analysis || '';
  }, [analyzeConversation]);

  const performEmotionalCheck = useCallback(async (
    conversationHistory: ChatMessage[],
    userContext: UserContext = {}
  ): Promise<string> => {
    const analysis = await analyzeConversation(
      '',
      conversationHistory,
      userContext,
      undefined,
      'emotional_check'
    );
    return analysis?.analysis || '';
  }, [analyzeConversation]);

  const getPersonalizedSuggestions = useCallback(async (
    conversationHistory: ChatMessage[],
    userContext: UserContext = {},
    emotionalState?: string
  ): Promise<string> => {
    const analysis = await analyzeConversation(
      '',
      conversationHistory,
      userContext,
      emotionalState,
      'personalized_suggestions'
    );
    return analysis?.analysis || '';
  }, [analyzeConversation]);

  const clearAnalysis = useCallback(() => {
    setContextualResponse('');
    setConversationSummary('');
    setEmotionalInsights('');
    setPersonalizedSuggestions('');
  }, []);

  return {
    // States
    isAnalyzing,
    contextualResponse,
    conversationSummary,
    emotionalInsights,
    personalizedSuggestions,

    // Methods
    analyzeConversation,
    getContextualResponse,
    generateConversationSummary,
    performEmotionalCheck,
    getPersonalizedSuggestions,
    clearAnalysis
  };
};