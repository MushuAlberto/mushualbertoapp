import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Brain,
  Calendar,
  BarChart3
} from 'lucide-react';

interface EmotionalInsightsProps {
  emotionalState: {
    current: string;
    trend: string;
    history: { emotion: string; timestamp: string; confidence: number }[];
  };
  className?: string;
}

const EmotionalInsights: React.FC<EmotionalInsightsProps> = ({ 
  emotionalState, 
  className = '' 
}) => {
  const getEmotionStats = () => {
    const { history } = emotionalState;
    if (history.length === 0) return null;

    const emotionCounts = history.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = history.length;
    const topEmotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return topEmotions;
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: 'bg-yellow-500',
      happiness: 'bg-green-500',
      sadness: 'bg-blue-500',
      anxiety: 'bg-orange-500',
      anger: 'bg-red-500',
      fear: 'bg-purple-500',
      neutral: 'bg-gray-500',
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      joy: '😊',
      happiness: '😄',
      sadness: '😢',
      anxiety: '😰',
      anger: '😠',
      fear: '😨',
      neutral: '😐',
    };
    return emojis[emotion as keyof typeof emojis] || '😐';
  };

  const getTrendIcon = () => {
    switch (emotionalState.trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendMessage = () => {
    switch (emotionalState.trend) {
      case 'improving':
        return 'Tu estado emocional está mejorando ✨';
      case 'declining':
        return 'Tu estado emocional necesita atención 💙';
      default:
        return 'Tu estado emocional está estable 🌟';
    }
  };

  const emotionStats = getEmotionStats();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Insights Emocionales
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado Actual */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {getEmotionEmoji(emotionalState.current)}
            </div>
            <div>
              <p className="font-medium capitalize">{emotionalState.current}</p>
              <p className="text-sm text-muted-foreground">Estado actual</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {emotionalState.trend}
            </span>
          </div>
        </div>

        {/* Mensaje de Tendencia */}
        <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
          <p className="text-sm font-medium">{getTrendMessage()}</p>
        </div>

        {/* Estadísticas de Emociones */}
        {emotionStats && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Emociones Recientes
            </h4>
            
            {emotionStats.map((stat, index) => (
              <div key={stat.emotion} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{getEmotionEmoji(stat.emotion)}</span>
                    <span className="capitalize">{stat.emotion}</span>
                  </div>
                  <span className="font-medium">{stat.percentage}%</span>
                </div>
                <Progress 
                  value={stat.percentage} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        )}

        {/* Historial */}
        {emotionalState.history.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Historial Reciente
            </h4>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {emotionalState.history.slice(-5).reverse().map((entry, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{getEmotionEmoji(entry.emotion)}</span>
                    <span className="capitalize">{entry.emotion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(entry.confidence * 100)}%
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones basadas en el estado */}
        <div className="p-3 bg-secondary/10 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Recomendación Personalizada
          </h4>
          <p className="text-sm text-muted-foreground">
            {emotionalState.current === 'sadness' && 
              "Considera hacer un ejercicio de respiración o escribir en tu diario para procesar estos sentimientos."}
            {emotionalState.current === 'anxiety' && 
              "Te sugiero probar una técnica de relajación o dividir tus tareas en pasos más pequeños."}
            {emotionalState.current === 'joy' && 
              "¡Genial! Aprovecha esta energía positiva para avanzar en tus objetivos importantes."}
            {emotionalState.current === 'neutral' && 
              "Un buen momento para reflexionar sobre tus metas o planificar actividades que te motiven."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalInsights;