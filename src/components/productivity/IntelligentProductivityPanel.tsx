import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Calendar,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Timer,
  Award,
  ArrowRight,
  Star,
  Flame
} from 'lucide-react';
import { useIntelligentProductivity } from '@/hooks/useIntelligentProductivity';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface IntelligentProductivityPanelProps {
  className?: string;
}

export const IntelligentProductivityPanel = ({ className }: IntelligentProductivityPanelProps) => {
  const {
    loading,
    analysisResult,
    optimizations,
    schedule,
    habitCoaching,
    analyzeProductivity,
    suggestOptimizations,
    generateSchedule,
    getHabitCoaching,
    getProductivityColor,
    getImpactColor,
    getDifficultyColor
  } = useIntelligentProductivity();

  const [tasks] = useLocalStorage('tasks', []);
  const [habits] = useLocalStorage('habits', []);
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    // Auto-analyze when component loads
    handleAnalyzeProductivity();
  }, []);

  const handleAnalyzeProductivity = async () => {
    const context = {
      currentTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferences: {}
    };

    await analyzeProductivity(tasks, habits, [], context);
  };

  const handleGetOptimizations = async () => {
    const context = {
      currentTime: new Date().toISOString(),
      userPreferences: {},
      workStyle: 'hybrid'
    };

    await suggestOptimizations(tasks, habits, context);
  };

  const handleGenerateSchedule = async () => {
    const context = {
      workingHours: { start: '09:00', end: '17:00' },
      breakPreferences: { frequency: 90, duration: 15 },
      energyProfile: 'morning_person'
    };

    await generateSchedule(tasks, context);
  };

  const handleHabitCoaching = async () => {
    const context = {
      currentStreak: habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0,
      motivation: 'high',
      availableTime: 30
    };

    await getHabitCoaching(habits, context);
  };

  const renderAnalysisTab = () => {
    if (!analysisResult) return null;

    const { productivityAnalysis, patterns, insights, recommendations } = analysisResult;

    return (
      <div className="space-y-6">
        {/* Score Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análisis de Productividad
            </CardTitle>
            <CardDescription>
              Tu puntuación general: {productivityAnalysis.overallScore}/100
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getProductivityColor(productivityAnalysis.efficiency * 10) }}>
                  {productivityAnalysis.efficiency}/10
                </div>
                <div className="text-sm text-muted-foreground">Eficiencia</div>
                <Progress value={productivityAnalysis.efficiency * 10} className="mt-1" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getProductivityColor(productivityAnalysis.consistency * 10) }}>
                  {productivityAnalysis.consistency}/10
                </div>
                <div className="text-sm text-muted-foreground">Consistencia</div>
                <Progress value={productivityAnalysis.consistency * 10} className="mt-1" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getProductivityColor(productivityAnalysis.timeManagement * 10) }}>
                  {productivityAnalysis.timeManagement}/10
                </div>
                <div className="text-sm text-muted-foreground">Gestión del Tiempo</div>
                <Progress value={productivityAnalysis.timeManagement * 10} className="mt-1" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getProductivityColor(productivityAnalysis.focusQuality * 10) }}>
                  {productivityAnalysis.focusQuality}/10
                </div>
                <div className="text-sm text-muted-foreground">Calidad de Foco</div>
                <Progress value={productivityAnalysis.focusQuality * 10} className="mt-1" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Patrones Identificados
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Horas más productivas:</strong>
                    <div className="flex gap-1 mt-1">
                      {patterns.peakProductivityHours.map((hour, idx) => (
                        <Badge key={idx} variant="secondary">{hour}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Días más productivos:</strong>
                    <div className="flex gap-1 mt-1">
                      {patterns.mostProductiveDays.map((day, idx) => (
                        <Badge key={idx} variant="secondary">{day}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{patterns.energyLevels}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                    <Star className="w-4 h-4" />
                    Fortalezas
                  </h4>
                  <ul className="space-y-1">
                    {insights.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
                    <Target className="w-4 h-4" />
                    Áreas de Mejora
                  </h4>
                  <ul className="space-y-1">
                    {insights.improvementAreas.map((area, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                🤖
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Mushu Alberto dice:</p>
                <p className="text-sm mt-1">{analysisResult.motivationalMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Flags */}
        {analysisResult.warningFlags.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="w-5 h-5" />
                Señales de Alerta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResult.warningFlags.map((flag, idx) => (
                  <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderOptimizationsTab = () => {
    if (!optimizations) return null;

    return (
      <div className="space-y-6">
        {/* Quick Wins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Victorias Rápidas
            </CardTitle>
            <CardDescription>
              Mejoras que puedes implementar hoy mismo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {optimizations.quickWins.map((win, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{win}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Optimizations */}
        <div className="space-y-4">
          {optimizations.optimizations.map((opt, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {opt.title}
                  </span>
                  <div className="flex gap-2">
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: getImpactColor(opt.impact), color: getImpactColor(opt.impact) }}
                    >
                      {opt.impact} impacto
                    </Badge>
                    <Badge 
                      variant="outline"
                      style={{ borderColor: getDifficultyColor(opt.difficulty), color: getDifficultyColor(opt.difficulty) }}
                    >
                      {opt.difficulty}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>{opt.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tiempo para implementar:</strong> {opt.timeToImplement}
                  </div>
                  <div>
                    <strong>Beneficio esperado:</strong> {opt.expectedBenefit}
                  </div>
                </div>
                
                <div>
                  <strong className="text-sm">Pasos para implementar:</strong>
                  <ol className="list-decimal list-inside space-y-1 mt-2">
                    {opt.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personalized Advice */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700">Consejo Personalizado:</p>
                <p className="text-sm mt-1 text-blue-600">{optimizations.personalizedAdvice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderScheduleTab = () => {
    if (!schedule) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Horario Optimizado
            </CardTitle>
            <CardDescription>{schedule.rationale}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {schedule.schedule.timeBlocks.map((block, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="text-sm font-mono font-medium min-w-[100px]">
                      {block.startTime} - {block.endTime}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{block.activity}</div>
                      <div className="text-xs text-muted-foreground">{block.description}</div>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant={block.priority === 'high' ? 'destructive' : block.priority === 'medium' ? 'default' : 'secondary'}>
                        {block.priority}
                      </Badge>
                      <Badge variant="outline">{block.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Descansos Sugeridos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schedule.schedule.breaks.map((breakItem, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      {breakItem.time} - {breakItem.activity} ({breakItem.duration}min)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Optimización de Energía
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{schedule.energyOptimization}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderHabitsTab = () => {
    if (!habitCoaching) return null;

    const { habitAnalysis, coaching, nextLevel, troubleshooting } = habitCoaching;

    return (
      <div className="space-y-6">
        {/* Habit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Análisis de Hábitos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {habitAnalysis.currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">Racha Actual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getProductivityColor(habitAnalysis.consistency) }}>
                  {habitAnalysis.consistency}%
                </div>
                <div className="text-sm text-muted-foreground">Consistencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {habitAnalysis.motivationLevel}/10
                </div>
                <div className="text-sm text-muted-foreground">Motivación</div>
              </div>
              <div className="text-center">
                <Badge variant={
                  habitAnalysis.difficultyCurve === 'just_right' ? 'default' :
                  habitAnalysis.difficultyCurve === 'too_easy' ? 'secondary' : 'destructive'
                }>
                  {habitAnalysis.difficultyCurve}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">Dificultad</div>
              </div>
            </div>

            {habitAnalysis.barriers.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Barreras Identificadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {habitAnalysis.barriers.map((barrier, idx) => (
                      <Badge key={idx} variant="outline" className="text-red-600 border-red-200">
                        {barrier}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Coaching Message */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                🏆
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700">Coach Mushu:</p>
                <p className="text-sm mt-1 text-green-600">{coaching.encouragement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coaching Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ajustes Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {coaching.adjustments.map((adjustment, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                    {adjustment}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Estrategias de Recompensa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {coaching.rewards.map((reward, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <Star className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                    {reward}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Next Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Siguiente Nivel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Progresión:</h4>
              <p className="text-sm">{nextLevel.progression}</p>
            </div>
            
            {nextLevel.newHabits.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Nuevos Hábitos Sugeridos:</h4>
                <div className="flex flex-wrap gap-2">
                  {nextLevel.newHabits.map((habit, idx) => (
                    <Badge key={idx} variant="secondary">{habit}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Productividad Inteligente
          </CardTitle>
          <CardDescription>
            Análisis avanzado y optimización de tu productividad con IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="analysis">Análisis</TabsTrigger>
              <TabsTrigger value="optimizations">Optimización</TabsTrigger>
              <TabsTrigger value="schedule">Horario</TabsTrigger>
              <TabsTrigger value="habits">Hábitos</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="analysis">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAnalyzeProductivity} 
                      disabled={loading}
                      size="sm"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {loading ? 'Analizando...' : 'Analizar Productividad'}
                    </Button>
                  </div>
                  {renderAnalysisTab()}
                </div>
              </TabsContent>

              <TabsContent value="optimizations">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGetOptimizations} 
                      disabled={loading}
                      size="sm"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {loading ? 'Generando...' : 'Obtener Sugerencias'}
                    </Button>
                  </div>
                  {renderOptimizationsTab()}
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGenerateSchedule} 
                      disabled={loading}
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {loading ? 'Generando...' : 'Generar Horario'}
                    </Button>
                  </div>
                  {renderScheduleTab()}
                </div>
              </TabsContent>

              <TabsContent value="habits">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleHabitCoaching} 
                      disabled={loading}
                      size="sm"
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      {loading ? 'Analizando...' : 'Coaching de Hábitos'}
                    </Button>
                  </div>
                  {renderHabitsTab()}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentProductivityPanel;