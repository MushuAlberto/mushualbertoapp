import React, { useState } from 'react';
import { useIntelligentGamification } from '@/hooks/useIntelligentGamification';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Award,
  Zap,
  Brain,
  Gift,
  Loader2
} from 'lucide-react';

export const IntelligentGamificationPanel: React.FC = () => {
  const {
    gamificationData,
    isLoading,
    currentSparkles,
    getProfileAnalysis,
    getRewardRecommendations,
    getAchievementSuggestions,
    getMotivationStrategy,
  } = useIntelligentGamification();

  const [activeTab, setActiveTab] = useState<'profile' | 'rewards' | 'achievements' | 'motivation'>('profile');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-600" />
            Sistema de Gamificación Inteligente
          </CardTitle>
          <CardDescription>
            Recompensas y logros personalizados con IA para tu perfil ADHD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 p-4 bg-white/60 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold text-amber-700">{currentSparkles}</span>
            <span className="text-muted-foreground">Sparkles disponibles</span>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              onClick={() => setActiveTab('profile')}
              className="w-full"
            >
              <Brain className="w-4 h-4 mr-2" />
              Perfil
            </Button>
            <Button
              variant={activeTab === 'rewards' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rewards')}
              className="w-full"
            >
              <Gift className="w-4 h-4 mr-2" />
              Recompensas
            </Button>
            <Button
              variant={activeTab === 'achievements' ? 'default' : 'outline'}
              onClick={() => setActiveTab('achievements')}
              className="w-full"
            >
              <Award className="w-4 h-4 mr-2" />
              Logros
            </Button>
            <Button
              variant={activeTab === 'motivation' ? 'default' : 'outline'}
              onClick={() => setActiveTab('motivation')}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Motivación
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Analysis */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Análisis de Perfil ADHD
            </CardTitle>
            <CardDescription>
              IA analiza tu estilo de trabajo y motivación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={getProfileAnalysis}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analizando perfil...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analizar mi perfil ADHD
                </>
              )}
            </Button>

            {gamificationData.profileAnalysis && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Tu Perfil
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {gamificationData.profileAnalysis}
                </p>
                {gamificationData.lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Actualizado: {new Date(gamificationData.lastUpdated).toLocaleString('es-ES')}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reward Recommendations */}
      {activeTab === 'rewards' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Recompensas Recomendadas IA
            </CardTitle>
            <CardDescription>
              Recompensas personalizadas para tu perfil ADHD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={getRewardRecommendations}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando recomendaciones...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Obtener recomendaciones personalizadas
                </>
              )}
            </Button>

            {gamificationData.rewardRecommendations.length > 0 && (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {gamificationData.rewardRecommendations.map((reward, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{reward.icon}</span>
                              <div>
                                <h4 className="font-semibold">{reward.name}</h4>
                                <Badge variant="outline" className="mt-1">
                                  {reward.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                              ✨ {reward.cost}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {reward.description}
                          </p>
                          
                          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                            <p className="text-xs text-blue-800">
                              <strong>Por qué es ideal para ti:</strong> {reward.reason}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Achievement Suggestions */}
      {activeTab === 'achievements' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Logros Personalizados IA
            </CardTitle>
            <CardDescription>
              Desafíos adaptativos para tu nivel y estilo ADHD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={getAchievementSuggestions}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando logros...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Obtener logros personalizados
                </>
              )}
            </Button>

            {gamificationData.achievementSuggestions.length > 0 && (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {gamificationData.achievementSuggestions.map((achievement, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{achievement.icon}</span>
                              <div>
                                <h4 className="font-semibold">{achievement.title}</h4>
                                <div className="flex gap-2 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={getDifficultyColor(achievement.difficulty)}
                                  >
                                    {achievement.difficulty === 'easy' ? 'Fácil' : 
                                     achievement.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                                  </Badge>
                                  <Badge variant="outline">
                                    {achievement.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              +{achievement.reward} ✨
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Motivation Strategy */}
      {activeTab === 'motivation' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Estrategia de Motivación IA
            </CardTitle>
            <CardDescription>
              Coaching personalizado para tu perfil ADHD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => getMotivationStrategy()}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando estrategia...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Obtener estrategia de motivación
                </>
              )}
            </Button>

            {gamificationData.motivationStrategy && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
                  <Zap className="w-4 h-4" />
                  Tu Estrategia Personalizada
                </h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {gamificationData.motivationStrategy}
                </div>
                {gamificationData.lastUpdated && (
                  <Separator className="my-3" />
                )}
                {gamificationData.lastUpdated && (
                  <p className="text-xs text-muted-foreground">
                    Generado: {new Date(gamificationData.lastUpdated).toLocaleString('es-ES')}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Footer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 El sistema de gamificación IA adapta recompensas, logros y motivación 
            según tu perfil ADHD único, patrones de actividad y necesidades actuales.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
