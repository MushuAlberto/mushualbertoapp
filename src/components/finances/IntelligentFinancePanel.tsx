import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Brain,
  PieChart,
  Lightbulb,
  RefreshCw,
  Award,
  CreditCard,
  Wallet,
  BarChart3,
  Calendar,
  ShoppingCart
} from 'lucide-react';
import { useIntelligentFinance } from '@/hooks/useIntelligentFinance';
import { useToast } from '@/hooks/use-toast';

const IntelligentFinancePanel: React.FC = () => {
  const {
    insights,
    spendingPatterns,
    recommendations,
    healthScore,
    loading,
    currentBalance,
    monthlyIncome,
    transactions,
    generateSpendingAnalysis,
    optimizeBudget,
    checkFinancialHealth
  } = useIntelligentFinance();

  const { toast } = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');

  const handleGenerateAnalysis = async () => {
    try {
      await generateSpendingAnalysis(selectedTimeRange);
      toast({
        title: "Análisis completado",
        description: "Se ha generado tu análisis financiero inteligente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el análisis.",
        variant: "destructive"
      });
    }
  };

  const handleOptimizeBudget = async () => {
    const result = await optimizeBudget();
    if (result) {
      toast({
        title: "Presupuesto optimizado",
        description: "Se han generado recomendaciones para tu presupuesto.",
      });
    }
  };

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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <BarChart3 className="w-4 h-4" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4" />;
      case 'prediction':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading && !insights.length) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Inteligencia Financiera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con Score de Salud Financiera */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">Inteligencia Financiera</h1>
                <p className="text-muted-foreground">Análisis superinteligente de tus finanzas</p>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore}/100
              </div>
              <p className="text-sm text-muted-foreground">Salud Financiera</p>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateAnalysis}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Analizar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOptimizeBudget}
                  disabled={loading}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Optimizar
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Balance Actual</p>
                <div className="text-xl font-bold">{formatCurrency(currentBalance)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                <div className="text-xl font-bold">{formatCurrency(monthlyIncome)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <ShoppingCart className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Gastos del Mes</p>
                <div className="text-xl font-bold">
                  {formatCurrency(
                    transactions
                      .filter(t => t.type === 'expense' && 
                        new Date(t.date).getMonth() === new Date().getMonth())
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Transacciones</p>
                <div className="text-xl font-bold">{transactions.length}</div>
                <p className="text-xs text-muted-foreground">Total registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Alta Prioridad */}
      {insights.filter(i => ['critical', 'high'].includes(i.priority)).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Alertas Financieras ({insights.filter(i => ['critical', 'high'].includes(i.priority)).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights
              .filter(i => ['critical', 'high'].includes(i.priority))
              .slice(0, 3)
              .map((insight, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-orange-600">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-900">{insight.title}</h4>
                      <p className="text-sm text-orange-700">{insight.description}</p>
                      {insight.amount && (
                        <p className="text-xs text-orange-600 font-medium">
                          Impacto: {formatCurrency(insight.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Análisis Principal */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="patterns">Patrones</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Insights Financieros ({insights.length})
                </div>
                
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="7">Últimos 7 días</option>
                    <option value="30">Últimos 30 días</option>
                    <option value="90">Últimos 3 meses</option>
                  </select>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mt-1">
                        {getInsightIcon(insight.type)}
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
                        
                        {insight.amount && (
                          <p className="text-sm font-medium text-primary">
                            Impacto: {formatCurrency(insight.amount)}
                          </p>
                        )}
                        
                        {insight.actionable && insight.action && (
                          <Button size="sm" variant="outline" className="mt-2">
                            {insight.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No hay insights disponibles. Haz clic en "Analizar" para generar análisis inteligentes.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {spendingPatterns ? (
            <>
              {/* Gasto Impulsivo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Análisis de Gastos Impulsivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {spendingPatterns.impulsiveSpending.frequency}
                      </div>
                      <p className="text-sm text-muted-foreground">Frecuencia</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(spendingPatterns.impulsiveSpending.totalAmount)}
                      </div>
                      <p className="text-sm text-muted-foreground">Cantidad Total</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm space-y-1">
                        <p className="font-medium">Triggers Comunes:</p>
                        {spendingPatterns.impulsiveSpending.commonTriggers.map((trigger, i) => (
                          <Badge key={i} variant="outline" className="mr-1">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Proyección Mensual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Proyección del Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(spendingPatterns.monthlyProjection.estimatedSpending)}
                      </div>
                      <p className="text-sm text-muted-foreground">Gasto Estimado</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        spendingPatterns.monthlyProjection.budgetOverrun > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(spendingPatterns.monthlyProjection.budgetOverrun)}
                      </div>
                      <p className="text-sm text-muted-foreground">Sobrepaso Presupuesto</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(spendingPatterns.monthlyProjection.savingsPotential)}
                      </div>
                      <p className="text-sm text-muted-foreground">Potencial de Ahorro</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No hay patrones disponibles. Genera un análisis para ver patrones de gasto.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recomendaciones Personalizadas ({recommendations.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <div 
                      key={index}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {rec.description}
                          </p>
                        </div>
                        
                        <div className="text-right text-sm">
                          <div className="font-medium text-green-600">
                            +{formatCurrency(rec.expectedSaving)}
                          </div>
                          <div className="text-muted-foreground">ahorro potencial</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={rec.difficulty === 'fácil' ? 'default' : 'secondary'}>
                          {rec.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {rec.timeToImplement}
                        </Badge>
                        {rec.adhdFriendly && (
                          <Badge className="bg-purple-100 text-purple-800">
                            ADHD-friendly
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No hay recomendaciones disponibles. Genera un análisis para recibir consejos personalizados.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentFinancePanel;