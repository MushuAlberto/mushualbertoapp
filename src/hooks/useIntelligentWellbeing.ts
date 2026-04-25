import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GameResult {
  gameType: string;
  category: 'attention' | 'memory' | 'reasoning' | 'coordination' | 'visuospatial';
  score: number;
  accuracy: number;
  timeSpent: number;
  difficulty: number;
  completedAt: string;
  userId?: string;
}

interface CognitiveMetrics {
  performanceScore: number;
  gamesCompleted: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
}

interface WellbeingAnalysis {
  analysis: string;
  analysisType: string;
  timestamp: string;
  cognitiveMetrics: CognitiveMetrics;
}

export const useIntelligentWellbeing = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [performanceAnalysis, setPerformanceAnalysis] = useState<string>('');
  const [difficultyRecommendations, setDifficultyRecommendations] = useState<string>('');
  const [cognitiveInsights, setCognitiveInsights] = useState<string>('');
  const [wellnessRecommendations, setWellnessRecommendations] = useState<string>('');
  const [cognitiveMetrics, setCognitiveMetrics] = useState<CognitiveMetrics | null>(null);
  const { toast } = useToast();

  const analyzeWellbeing = useCallback(async (
    gameResults: GameResult[],
    userProfile: any = {},
    cognitiveHistory: GameResult[] = [],
    analysisType: 'performance_analysis' | 'difficulty_adjustment' | 'cognitive_insights' | 'wellness_recommendations' = 'performance_analysis'
  ): Promise<WellbeingAnalysis | null> => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('cognitive-wellbeing-ai', {
        body: {
          gameResults,
          userProfile,
          cognitiveHistory,
          analysisType
        }
      });

      if (error) {
        console.error('Error invoking cognitive-wellbeing-ai function:', error);
        throw error;
      }

      const analysis = data as WellbeingAnalysis;
      
      // Store the analysis based on type
      switch (analysisType) {
        case 'performance_analysis':
          setPerformanceAnalysis(analysis.analysis);
          break;
        case 'difficulty_adjustment':
          setDifficultyRecommendations(analysis.analysis);
          break;
        case 'cognitive_insights':
          setCognitiveInsights(analysis.analysis);
          break;
        case 'wellness_recommendations':
          setWellnessRecommendations(analysis.analysis);
          break;
      }

      setCognitiveMetrics(analysis.cognitiveMetrics);
      return analysis;
    } catch (error) {
      console.error('Error analyzing wellbeing:', error);
      toast({
        title: "Error de Análisis",
        description: "No se pudo analizar el bienestar cognitivo. Inténtalo de nuevo.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const analyzePerformance = useCallback(async (
    gameResults: GameResult[],
    userProfile: any = {},
    cognitiveHistory: GameResult[] = []
  ): Promise<string> => {
    const analysis = await analyzeWellbeing(
      gameResults,
      userProfile,
      cognitiveHistory,
      'performance_analysis'
    );
    return analysis?.analysis || '';
  }, [analyzeWellbeing]);

  const getDifficultyAdjustments = useCallback(async (
    gameResults: GameResult[],
    userProfile: any = {}
  ): Promise<string> => {
    const analysis = await analyzeWellbeing(
      gameResults,
      userProfile,
      [],
      'difficulty_adjustment'
    );
    return analysis?.analysis || '';
  }, [analyzeWellbeing]);

  const generateCognitiveInsights = useCallback(async (
    gameResults: GameResult[],
    userProfile: any = {},
    cognitiveHistory: GameResult[] = []
  ): Promise<string> => {
    const analysis = await analyzeWellbeing(
      gameResults,
      userProfile,
      cognitiveHistory,
      'cognitive_insights'
    );
    return analysis?.analysis || '';
  }, [analyzeWellbeing]);

  const getWellnessRecommendations = useCallback(async (
    gameResults: GameResult[],
    userProfile: any = {}
  ): Promise<string> => {
    const analysis = await analyzeWellbeing(
      gameResults,
      userProfile,
      [],
      'wellness_recommendations'
    );
    return analysis?.analysis || '';
  }, [analyzeWellbeing]);

  const calculateOptimalDifficulty = useCallback((
    gameType: string,
    recentResults: GameResult[]
  ): number => {
    if (!recentResults.length) return 1;

    const gameResults = recentResults.filter(result => result.gameType === gameType);
    if (!gameResults.length) return 1;

    const averageAccuracy = gameResults.reduce((acc, result) => acc + result.accuracy, 0) / gameResults.length;
    const averageScore = gameResults.reduce((acc, result) => acc + result.score, 0) / gameResults.length;

    // ADHD-friendly difficulty adjustment logic
    if (averageAccuracy > 85 && averageScore > 80) {
      return Math.min(5, Math.max(1, Math.ceil(averageAccuracy / 20))); // Increase difficulty
    } else if (averageAccuracy < 60 || averageScore < 50) {
      return Math.max(1, Math.floor(averageAccuracy / 25)); // Decrease difficulty
    }
    
    return Math.max(1, Math.min(5, Math.round(averageAccuracy / 20))); // Maintain current level
  }, []);

  const clearAnalysis = useCallback(() => {
    setPerformanceAnalysis('');
    setDifficultyRecommendations('');
    setCognitiveInsights('');
    setWellnessRecommendations('');
    setCognitiveMetrics(null);
  }, []);

  return {
    // States
    isAnalyzing,
    performanceAnalysis,
    difficultyRecommendations,
    cognitiveInsights,
    wellnessRecommendations,
    cognitiveMetrics,

    // Methods
    analyzeWellbeing,
    analyzePerformance,
    getDifficultyAdjustments,
    generateCognitiveInsights,
    getWellnessRecommendations,
    calculateOptimalDifficulty,
    clearAnalysis
  };
};