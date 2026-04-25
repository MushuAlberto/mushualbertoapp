import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain,
  Activity,
  Target,
  Zap
} from 'lucide-react';

interface PredictiveData {
  burnoutRisk: number;
  productivityTrend: number;
  budgetOverrun: number;
  habitFailure: number;
  moodDecline: number;
}

interface PredictiveWidgetsProps {
  predictions: PredictiveData;
  className?: string;
}

const PredictiveWidgets: React.FC<PredictiveWidgetsProps> = ({ 
  predictions, 
  className = '' 
}) => {
  const getRiskLevel = (value: number): { level: string; color: string; icon: React.ReactNode } => {
    if (value > 0.7) {
      return { 
        level: 'Alto', 
        color: 'text-red-600 bg-red-100', 
        icon: <AlertTriangle className="w-4 h-4" />
      };
    } else if (value > 0.4) {
      return { 
        level: 'Medio', 
        color: 'text-orange-600 bg-orange-100', 
        icon: <TrendingUp className="w-4 h-4" />
      };
    } else {
      return { 
        level: 'Bajo', 
        color: 'text-green-600 bg-green-100', 
        icon: <Target className="w-4 h-4" />
      };
    }
  };

  const getTrendDirection = (value: number) => {
    if (value > 0.6) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (value < 0.4) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const predictiveMetrics = [
    {
      title: 'Riesgo de Burnout',
      value: predictions.burnoutRisk,
      description: 'Probabilidad de agotamiento basada en patrones de trabajo',
      category: 'bienestar'
    },
    {
      title: 'Tendencia de Productividad',
      value: predictions.productivityTrend,
      description: 'Proyección de eficiencia en los próximos días',
      category: 'productividad'
    },
    {
      title: 'Sobrepaso de Presupuesto',
      value: predictions.budgetOverrun,
      description: 'Riesgo de exceder límites financieros establecidos',
      category: 'finanzas'
    },
    {
      title: 'Falla de Hábitos',
      value: predictions.habitFailure,
      description: 'Probabilidad de romper rachas de hábitos actuales',
      category: 'hábitos'
    },
    {
      title: 'Declive del Estado de Ánimo',
      value: predictions.moodDecline,
      description: 'Riesgo de deterioro emocional basado en patrones',
      category: 'bienestar'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Análisis Predictivo Avanzado
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictiveMetrics.map((metric, index) => {
              const risk = getRiskLevel(metric.value);
              
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {risk.icon}
                        <h4 className="font-medium text-sm">{metric.title}</h4>
                      </div>
                      <Badge className={`text-xs ${risk.color}`}>
                        {risk.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {Math.round(metric.value * 100)}%
                        </span>
                        <div className="flex items-center gap-1">
                          {getTrendDirection(metric.value)}
                          <Zap className="w-3 h-3 text-yellow-500" />
                        </div>
                      </div>
                      
                      <Progress 
                        value={metric.value * 100} 
                        className="h-2"
                      />
                      
                      <p className="text-xs text-muted-foreground">
                        {metric.description}
                      </p>
                      
                      <Badge variant="outline" className="text-xs">
                        {metric.category}
                      </Badge>
                    </div>

                    {/* Indicador visual de riesgo */}
                    <div 
                      className={`absolute top-0 right-0 w-1 h-full ${
                        metric.value > 0.7 ? 'bg-red-500' :
                        metric.value > 0.4 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen Predictivo */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="w-5 h-5" />
            Resumen Inteligente
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {/* Área más crítica */}
            {(() => {
              const criticalMetric = predictiveMetrics.reduce((max, current) => 
                current.value > max.value ? current : max
              );
              
              const criticalRisk = getRiskLevel(criticalMetric.value);
              
              return (
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-sm">Área de Mayor Atención</span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{criticalMetric.title}</span> presenta el mayor riesgo 
                    ({Math.round(criticalMetric.value * 100)}%). {criticalMetric.description}
                  </p>
                </div>
              );
            })()}
            
            {/* Área más estable */}
            {(() => {
              const stableMetric = predictiveMetrics.reduce((min, current) => 
                current.value < min.value ? current : min
              );
              
              return (
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm">Área Más Estable</span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{stableMetric.title}</span> está en buen estado 
                    ({Math.round(stableMetric.value * 100)}%). ¡Mantén este patrón!
                  </p>
                </div>
              );
            })()}
            
            {/* Recomendación general */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">Recomendación IA</span>
              </div>
              <p className="text-sm">
                {(() => {
                  const avgRisk = predictiveMetrics.reduce((sum, m) => sum + m.value, 0) / predictiveMetrics.length;
                  
                  if (avgRisk > 0.6) {
                    return 'Considera tomar un descanso y revisar tus prioridades. El análisis indica varios riesgos elevados.';
                  } else if (avgRisk > 0.4) {
                    return 'Estás en un punto equilibrado. Mantén la atención en las áreas de riesgo medio.';
                  } else {
                    return '¡Excelente! Tus patrones son muy saludables. Continúa con tu rutina actual.';
                  }
                })()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveWidgets;