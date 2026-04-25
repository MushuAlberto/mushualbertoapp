import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIntelligentWellbeing } from '@/hooks/useIntelligentWellbeing';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  Activity, 
  Zap,
  Award,
  Settings
} from 'lucide-react';

interface GameResult {
  gameType: string;
  category: 'attention' | 'memory' | 'reasoning' | 'coordination' | 'visuospatial';
  score: number;
  accuracy: number;
  timeSpent: number;
  difficulty: number;
  completedAt: string;
}

interface IntelligentWellbeingPanelProps {
  gameResults?: GameResult[];
  userProfile?: any;
  onDifficultyUpdate?: (gameType: string, difficulty: number) => void;
}

export const IntelligentWellbeingPanel: React.FC<IntelligentWellbeingPanelProps> = ({
  gameResults = [],
  userProfile = {},
  onDifficultyUpdate
}) => {
  const {
    isAnalyzing,
    performanceAnalysis,
    difficultyRecommendations,
    cognitiveInsights,
    wellnessRecommendations,
    cognitiveMetrics,
    analyzePerformance,
    getDifficultyAdjustments,
    generateCognitiveInsights,
    getWellnessRecommendations,
    calculateOptimalDifficulty
  } = useIntelligentWellbeing();

  const [activeTab, setActiveTab] = useState<'performance' | 'difficulty' | 'insights' | 'wellness'>('performance');

  const categoryStats = React.useMemo(() => {
    if (!gameResults.length) return {};

    const stats: Record<string, { games: number; avgScore: number; avgAccuracy: number }> = {};
    
    gameResults.forEach(result => {
      if (!stats[result.category]) {
        stats[result.category] = { games: 0, avgScore: 0, avgAccuracy: 0 };
      }
      stats[result.category].games += 1;
      stats[result.category].avgScore += result.score;
      stats[result.category].avgAccuracy += result.accuracy;
    });

    Object.keys(stats).forEach(category => {
      stats[category].avgScore = Math.round(stats[category].avgScore / stats[category].games);
      stats[category].avgAccuracy = Math.round(stats[category].avgAccuracy / stats[category].games);
    });

    return stats;
  }, [gameResults]);

  const handlePerformanceAnalysis = async () => {
    if (gameResults.length > 0) {
      await analyzePerformance(gameResults, userProfile, gameResults.slice(-20));
    }
  };

  const handleDifficultyAnalysis = async () => {
    if (gameResults.length > 0) {
      await getDifficultyAdjustments(gameResults, userProfile);
    }
  };

  const handleCognitiveInsights = async () => {
    if (gameResults.length > 0) {
      await generateCognitiveInsights(gameResults, userProfile, gameResults.slice(-50));
    }
  };

  const handleWellnessRecommendations = async () => {
    await getWellnessRecommendations(gameResults, userProfile);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'attention': return Target;
      case 'memory': return Brain;
      case 'reasoning': return Lightbulb;
      case 'coordination': return Activity;
      case 'visuospatial': return Settings;
      default: return Brain;
    }
  };

  const getCategoryColor = (avgScore: number) => {
    if (avgScore >= 80) return 'text-green-600';
    if (avgScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!gameResults.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Bienestar Inteligente
          </CardTitle>
          <CardDescription>
            Análisis cognitivo personalizado para ADHD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Juega algunos juegos mentales para ver análisis personalizados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Bienestar Inteligente
        </CardTitle>
        <CardDescription>
          Análisis cognitivo y recomendaciones para ADHD
        </CardDescription>
        
        {cognitiveMetrics && (
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">
              {cognitiveMetrics.gamesCompleted} juegos completados
            </Badge>
            <Badge variant="outline">
              Puntuación: {Math.round(cognitiveMetrics.performanceScore)}
            </Badge>
            <Badge variant={
              cognitiveMetrics.improvementTrend === 'improving' ? 'default' :
              cognitiveMetrics.improvementTrend === 'stable' ? 'secondary' : 'destructive'
            }>
              {cognitiveMetrics.improvementTrend === 'improving' ? '📈 Mejorando' :
               cognitiveMetrics.improvementTrend === 'stable' ? '➡️ Estable' : '📉 Necesita atención'}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Category Performance Overview */}
          <div className="grid grid-cols-1 gap-3">
            <h4 className="font-semibold text-sm">Rendimiento por Categoría</h4>
            {Object.entries(categoryStats).map(([category, stats]) => {
              const Icon = getCategoryIcon(category);
              return (
                <div key={category} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium capitalize">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {stats.games} juegos
                    </Badge>
                    <span className={`text-sm font-medium ${getCategoryColor(stats.avgScore)}`}>
                      {stats.avgScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeTab === 'performance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('performance');
                handlePerformanceAnalysis();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Rendimiento
            </Button>
            <Button
              variant={activeTab === 'difficulty' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('difficulty');
                handleDifficultyAnalysis();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Dificultad
            </Button>
            <Button
              variant={activeTab === 'insights' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('insights');
                handleCognitiveInsights();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Cognitivo
            </Button>
            <Button
              variant={activeTab === 'wellness' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('wellness');
                handleWellnessRecommendations();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Bienestar
            </Button>
          </div>

          <Separator />

          {/* Analysis Content */}
          <ScrollArea className="h-[300px]">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span>Analizando rendimiento cognitivo...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'performance' && performanceAnalysis && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Análisis de Rendimiento
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {performanceAnalysis}
                    </div>
                  </div>
                )}

                {activeTab === 'difficulty' && difficultyRecommendations && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Ajustes de Dificultad
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {difficultyRecommendations}
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && cognitiveInsights && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Insights Cognitivos
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {cognitiveInsights}
                    </div>
                  </div>
                )}

                {activeTab === 'wellness' && wellnessRecommendations && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Recomendaciones de Bienestar
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {wellnessRecommendations}
                    </div>
                  </div>
                )}

                {!performanceAnalysis && !difficultyRecommendations && !cognitiveInsights && !wellnessRecommendations && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un análisis para comenzar</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};