import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JournalAnalysis } from '@/hooks/useIntelligentJournal';
import { Heart, Brain, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';

interface JournalAnalysisDisplayProps {
  analysis: JournalAnalysis;
}

const JournalAnalysisDisplay: React.FC<JournalAnalysisDisplayProps> = ({ analysis }) => {
  const getSentimentColor = (sentiment: string) => {
    const colors: Record<string, string> = {
      positive: 'hsl(var(--chart-1))',
      negative: 'hsl(var(--chart-2))',
      neutral: 'hsl(var(--chart-3))',
      mixed: 'hsl(var(--chart-4))'
    };
    return colors[sentiment] || 'hsl(var(--muted-foreground))';
  };

  const getSentimentEmoji = (sentiment: string) => {
    const emojis: Record<string, string> = {
      positive: '😊',
      negative: '😔',
      neutral: '😐',
      mixed: '🤔'
    };
    return emojis[sentiment] || '😐';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'hsl(var(--destructive))';
    if (intensity >= 6) return 'hsl(var(--chart-3))';
    if (intensity >= 4) return 'hsl(var(--chart-4))';
    return 'hsl(var(--chart-1))';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Análisis Emocional</CardTitle>
          </div>
          {analysis.flagsForConcern && (
            <div className="flex items-center gap-1 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">Requiere atención</span>
            </div>
          )}
        </div>
        <CardDescription>
          Análisis profundo de tu estado emocional y bienestar
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Support Response */}
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary mb-2">Respuesta de Mushu</p>
          <p className="text-sm">{analysis.supportResponse}</p>
        </div>

        {/* Emotional Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-red-500" />
              <h4 className="text-sm font-medium">Estado Emocional</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Emoción principal:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analysis.emotionalAnalysis.primaryEmotion}</span>
                  <span>{getSentimentEmoji(analysis.emotionalAnalysis.sentiment)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">Intensidad:</span>
                  <span className="text-xs">{analysis.emotionalAnalysis.emotionIntensity}/10</span>
                </div>
                <Progress 
                  value={analysis.emotionalAnalysis.emotionIntensity * 10} 
                  className="h-2"
                  style={{ 
                    '--progress-foreground': getIntensityColor(analysis.emotionalAnalysis.emotionIntensity) 
                  } as React.CSSProperties}
                />
              </div>

              <div>
                <span className="text-xs text-muted-foreground">Emociones secundarias:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.emotionalAnalysis.secondaryEmotions.map((emotion, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs">Confianza del análisis:</span>
                <span className="text-xs">{Math.round(analysis.emotionalAnalysis.confidence * 100)}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-medium">Puntuación de Ánimo</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">
                {analysis.moodScore >= 7 ? '😊' : 
                 analysis.moodScore >= 4 ? '😌' : 
                 analysis.moodScore >= 1 ? '😐' : 
                 analysis.moodScore >= -3 ? '😔' : '😢'}
              </div>
              <div className="text-2xl font-bold mb-2">{analysis.moodScore}/10</div>
              <Progress 
                value={(analysis.moodScore + 10) * 5} 
                className="mb-2"
                style={{ 
                  '--progress-foreground': analysis.moodScore >= 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))' 
                } as React.CSSProperties}
              />
              <p className="text-xs text-muted-foreground">
                {analysis.moodScore >= 7 ? 'Excelente estado de ánimo' :
                 analysis.moodScore >= 4 ? 'Estado de ánimo positivo' :
                 analysis.moodScore >= 1 ? 'Estado de ánimo neutral' :
                 analysis.moodScore >= -3 ? 'Estado de ánimo bajo' : 'Necesitas apoyo'}
              </p>
            </div>
          </Card>
        </div>

        {/* Insights */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <h4 className="text-sm font-medium">Insights y Patrones</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-medium mb-2">Temas principales:</h5>
              <div className="flex flex-wrap gap-1">
                {analysis.insights.mainThemes.map((theme, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-medium mb-2">Aspectos positivos:</h5>
              <div className="flex flex-wrap gap-1">
                {analysis.insights.positiveAspects.map((aspect, index) => (
                  <Badge key={index} variant="default" className="text-xs bg-green-100 text-green-800">
                    {aspect}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {analysis.insights.stressIndicators.length > 0 && (
            <div className="mt-3">
              <h5 className="text-xs font-medium mb-2 text-orange-600">Indicadores de estrés:</h5>
              <div className="flex flex-wrap gap-1">
                {analysis.insights.stressIndicators.map((indicator, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Recommendations */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Recomendaciones Personalizadas</h4>
          <div className="space-y-3">
            {analysis.recommendations.immediate.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-2 text-blue-600">Acciones inmediatas:</h5>
                <ScrollArea className="h-20">
                  <ul className="text-xs space-y-1">
                    {analysis.recommendations.immediate.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
            
            {analysis.recommendations.longTerm.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-2 text-green-600">Estrategias a largo plazo:</h5>
                <ScrollArea className="h-20">
                  <ul className="text-xs space-y-1">
                    {analysis.recommendations.longTerm.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default JournalAnalysisDisplay;