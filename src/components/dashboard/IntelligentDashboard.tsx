import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  RefreshCw,
  X,
  ChevronRight,
  Heart,
  DollarSign,
  CheckSquare,
  Activity
} from 'lucide-react';
import { useIntelligentDashboard } from '@/hooks/useIntelligentDashboard';

const IntelligentDashboard: React.FC = () => {
  const {
    insights,
    userMetrics,
    predictions,
    loading,
    generateIntelligentInsights,
    dismissInsight,
    executeInsightAction,
    getInsightsByCategory,
    getHighPriorityInsights,
    getWellbeingScore
  } = useIntelligentDashboard();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <TrendingUp className="w-4 h-4" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pattern':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity':
        return <CheckSquare className="w-4 h-4" />;
      case 'wellbeing':
        return <Heart className="w-4 h-4" />;
      case 'finances':
        return <DollarSign className="w-4 h-4" />;
      case 'habits':
        return <Target className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return 'text-red-600';
    if (risk > 0.4) return 'text-orange-600';
    return 'text-green-600';
  };

  const wellbeingScore = getWellbeingScore();
  const highPriorityInsights = getHighPriorityInsights();

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : getInsightsByCategory(selectedCategory);

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header con Score General */}
      <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
                  <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard Inteligente</h1>
                <p className="text-sm text-muted-foreground line-clamp-1">Análisis superinteligente de tu progreso</p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:text-right gap-6 border-t md:border-0 pt-4 md:pt-0">
              <div className="flex flex-col md:items-end">
                <div className="text-2xl md:text-3xl font-bold text-primary">{wellbeingScore}/100</div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">Score de Bienestar</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateIntelligentInsights}
                disabled={loading}
                className="shrink-0"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Analizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alertas de Alta Prioridad */}
      {highPriorityInsights.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Alertas Importantes ({highPriorityInsights.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {highPriorityInsights.slice(0, 3).map((insight) => (
              <div 
                key={insight.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-orange-200 gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-orange-600 mt-1 shrink-0">
                    {getTypeIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 leading-tight">{insight.title}</h4>
                    <p className="text-sm text-orange-700 mt-1">{insight.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-2 sm:pt-0">
                  {insight.actionable && insight.action && (
                    <Button 
                      size="sm" 
                      onClick={() => executeInsightAction(insight)}
                      className="bg-orange-600 hover:bg-orange-700 text-white flex-1 sm:flex-initial"
                    >
                      {insight.action.label}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => dismissInsight(insight.id)}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CheckSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Productividad</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{userMetrics.productivity.efficiency}%</span>
                  {userMetrics.productivity.trend === 'improving' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : userMetrics.productivity.trend === 'declining' ? (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  ) : (
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <Progress value={userMetrics.productivity.efficiency} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Bienestar</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{userMetrics.wellbeing.averageMood}/10</span>
                  {userMetrics.wellbeing.trend === 'improving' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : userMetrics.wellbeing.trend === 'declining' ? (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  ) : (
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <Progress value={userMetrics.wellbeing.averageMood * 10} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Finanzas</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{userMetrics.finances.budgetAdherence}%</span>
                </div>
                <Progress value={userMetrics.finances.budgetAdherence} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Racha de Hábitos</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{userMetrics.productivity.streakDays}</span>
                  <span className="text-sm text-muted-foreground">días</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {userMetrics.productivity.habitsCompleted} hábitos completados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis Predictivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Análisis Predictivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Riesgo de Burnout</p>
              <div className={`text-2xl font-bold ${getRiskColor(predictions.burnoutRisk)}`}>
                {Math.round(predictions.burnoutRisk * 100)}%
              </div>
              <Progress value={predictions.burnoutRisk * 100} className="mt-1" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tendencia Productividad</p>
              <div className={`text-2xl font-bold ${getRiskColor(1 - predictions.productivityTrend)}`}>
                {Math.round(predictions.productivityTrend * 100)}%
              </div>
              <Progress value={predictions.productivityTrend * 100} className="mt-1" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Sobrepaso Presupuesto</p>
              <div className={`text-2xl font-bold ${getRiskColor(predictions.budgetOverrun)}`}>
                {Math.round(predictions.budgetOverrun * 100)}%
              </div>
              <Progress value={predictions.budgetOverrun * 100} className="mt-1" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Falla de Hábitos</p>
              <div className={`text-2xl font-bold ${getRiskColor(predictions.habitFailure)}`}>
                {Math.round(predictions.habitFailure * 100)}%
              </div>
              <Progress value={predictions.habitFailure * 100} className="mt-1" />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Declive de Ánimo</p>
              <div className={`text-2xl font-bold ${getRiskColor(predictions.moodDecline)}`}>
                {Math.round(predictions.moodDecline * 100)}%
              </div>
              <Progress value={predictions.moodDecline * 100} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Inteligentes */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Insights Inteligentes ({filteredInsights.length})
            </CardTitle>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-3 md:flex md:w-auto">
                <TabsTrigger value="all" className="text-xs md:text-sm">Todos</TabsTrigger>
                <TabsTrigger value="productivity" className="text-xs md:text-sm">Productividad</TabsTrigger>
                <TabsTrigger value="wellbeing" className="text-xs md:text-sm">Bienestar</TabsTrigger>
                <TabsTrigger value="finances" className="text-xs md:text-sm">Finanzas</TabsTrigger>
                <TabsTrigger value="habits" className="text-xs md:text-sm">Hábitos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredInsights.length > 0 ? (
              filteredInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeIcon(insight.type)}
                    {getCategoryIcon(insight.category)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confianza
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && insight.action && (
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => executeInsightAction(insight)}
                        >
                          {insight.action.label}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => dismissInsight(insight.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {selectedCategory === 'all' 
                    ? 'No hay insights disponibles. Haz clic en "Actualizar" para generar análisis.'
                    : `No hay insights para la categoría "${selectedCategory}".`
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentDashboard;