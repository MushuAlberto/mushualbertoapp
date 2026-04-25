import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Brain,
  Heart,
  Shield,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  BookOpen,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Smile,
  Frown,
  Award,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { useIntelligentTherapy } from '@/hooks/useIntelligentTherapy';
import { useToast } from '@/hooks/use-toast';

const IntelligentTherapyPanel: React.FC = () => {
  const {
    emotionalAnalysis,
    therapeuticInsights,
    cognitiveDistortions,
    personalizedInterventions,
    progressTracking,
    currentCBTSession,
    wellnessScore,
    loading,
    generateEmotionalAnalysis,
    createCBTSession,
    performWellnessCheck,
    addEmotionalEntry
  } = useIntelligentTherapy();

  const { toast } = useToast();

  // Estado para nueva entrada emocional
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: [5],
    stress: [5],
    emotions: [] as string[],
    content: '',
    triggers: [] as string[],
    coping: [] as string[]
  });

  // Estado para sesión CBT
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);

  const handleGenerateAnalysis = async () => {
    try {
      await generateEmotionalAnalysis();
      toast({
        title: "Análisis completado",
        description: "Se ha generado tu análisis terapéutico inteligente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el análisis.",
        variant: "destructive"
      });
    }
  };

  const handleCreateCBTSession = async (focus?: string) => {
    try {
      await createCBTSession(focus);
      toast({
        title: "Sesión CBT creada",
        description: "Tu sesión de terapia personalizada está lista.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la sesión CBT.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitEntry = () => {
    if (!newEntry.content.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor escribe algo sobre cómo te sientes.",
        variant: "destructive"
      });
      return;
    }

    addEmotionalEntry({
      date: new Date().toISOString(),
      mood: newEntry.mood[0],
      stress: newEntry.stress[0],
      emotions: newEntry.emotions,
      content: newEntry.content,
      triggers: newEntry.triggers,
      coping: newEntry.coping
    });

    // Reset form
    setNewEntry({
      mood: [5],
      stress: [5],
      emotions: [],
      content: '',
      triggers: [],
      coping: []
    });
    setShowEntryForm(false);

    toast({
      title: "Entrada guardada",
      description: "Tu registro emocional ha sido guardado exitosamente.",
    });
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'estable':
        return 'text-green-600 bg-green-100';
      case 'mejorando':
        return 'text-blue-600 bg-blue-100';
      case 'en_riesgo':
        return 'text-yellow-600 bg-yellow-100';
      case 'crisis':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'crítica':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'alta':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const commonEmotions = [
    'Feliz', 'Triste', 'Ansioso', 'Enojado', 'Calmado', 'Frustrado',
    'Esperanzado', 'Confundido', 'Agradecido', 'Abrumado', 'Motivado', 'Cansado'
  ];

  const commonTriggers = [
    'Trabajo', 'Relaciones', 'Salud', 'Dinero', 'Familia', 'Cambios',
    'Decisiones', 'Críticas', 'Responsabilidades', 'Incertidumbre'
  ];

  if (loading && !emotionalAnalysis) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Terapia Inteligente
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
      {/* Header con Score de Bienestar */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">Terapia Inteligente</h1>
                <p className="text-muted-foreground">Análisis emocional y terapia personalizada</p>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-3xl font-bold ${getWellnessColor(wellnessScore)}`}>
                {wellnessScore}/100
              </div>
              <p className="text-sm text-muted-foreground">Bienestar Mental</p>
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
                  onClick={() => setShowEntryForm(true)}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Registro
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estado Emocional Actual */}
      {emotionalAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Estado Emocional Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-lg font-medium px-3 py-1 rounded-full ${getStateColor(emotionalAnalysis.overallState)}`}>
                  {emotionalAnalysis.overallState.replace('_', ' ').toUpperCase()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Estado General</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{emotionalAnalysis.emotionalStability}/10</div>
                <p className="text-sm text-muted-foreground">Estabilidad Emocional</p>
                <Progress value={emotionalAnalysis.emotionalStability * 10} className="mt-1" />
              </div>
              
              <div className="text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {emotionalAnalysis.dominantEmotions.slice(0, 3).map((emotion, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {emotion}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Emociones Dominantes</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl">
                  {emotionalAnalysis.strengthFactors.length > emotionalAnalysis.riskFactors.length ? (
                    <Smile className="w-8 h-8 text-green-600 mx-auto" />
                  ) : (
                    <Frown className="w-8 h-8 text-yellow-600 mx-auto" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Estado de Ánimo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de Nueva Entrada */}
      {showEntryForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Nuevo Registro Emocional
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEntryForm(false)}
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Estado de ánimo (1 = muy bajo, 10 = excelente)
                </label>
                <Slider
                  value={newEntry.mood}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: value }))}
                  max={10}
                  min={1}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Muy bajo</span>
                  <span className="font-medium">{newEntry.mood[0]}</span>
                  <span>Excelente</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Nivel de estrés (1 = muy relajado, 10 = muy estresado)
                </label>
                <Slider
                  value={newEntry.stress}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, stress: value }))}
                  max={10}
                  min={1}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Muy relajado</span>
                  <span className="font-medium">{newEntry.stress[0]}</span>
                  <span>Muy estresado</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">
                ¿Cómo te sientes? (selecciona todas las que apliquen)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {commonEmotions.map((emotion) => (
                  <Button
                    key={emotion}
                    variant={newEntry.emotions.includes(emotion) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const emotions = newEntry.emotions.includes(emotion)
                        ? newEntry.emotions.filter(e => e !== emotion)
                        : [...newEntry.emotions, emotion];
                      setNewEntry(prev => ({ ...prev, emotions }));
                    }}
                    className="text-xs"
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">
                ¿Qué está pasando? Describe tu experiencia emocional
              </label>
              <Textarea
                placeholder="Escribe sobre lo que sientes, qué te está afectando, o cualquier cosa que quieras registrar..."
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">
                Posibles desencadenantes (opcional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {commonTriggers.map((trigger) => (
                  <Button
                    key={trigger}
                    variant={newEntry.triggers.includes(trigger) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const triggers = newEntry.triggers.includes(trigger)
                        ? newEntry.triggers.filter(t => t !== trigger)
                        : [...newEntry.triggers, trigger];
                      setNewEntry(prev => ({ ...prev, triggers }));
                    }}
                    className="text-xs"
                  >
                    {trigger}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleSubmitEntry} className="w-full">
              <Heart className="mr-2 h-4 w-4" />
              Guardar Registro Emocional
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs Principal */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="distortions">Patrones</TabsTrigger>
          <TabsTrigger value="interventions">Técnicas</TabsTrigger>
          <TabsTrigger value="cbt">Sesión CBT</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {/* Insights Terapéuticos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights Terapéuticos ({therapeuticInsights.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {therapeuticInsights.length > 0 ? (
                  therapeuticInsights.map((insight, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mt-1">
                        <Brain className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{insight.insight}</h4>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Nivel de evidencia: {insight.evidenceLevel}</span>
                          {insight.actionable && (
                            <Badge variant="secondary" className="text-xs">
                              Accionable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No hay insights disponibles. Haz clic en "Analizar" para generar análisis terapéuticos.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seguimiento del Progreso */}
          {progressTracking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Seguimiento del Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Áreas de Mejora
                    </h4>
                    <ul className="space-y-1">
                      {progressTracking.improvementAreas.map((area, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      Áreas de Atención
                    </h4>
                    <ul className="space-y-1">
                      {progressTracking.concernAreas.map((area, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Próximos Pasos</h4>
                  <ul className="space-y-1">
                    {progressTracking.nextSteps.map((step, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <Target className="w-3 h-3 text-blue-600" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="distortions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Patrones Cognitivos ({cognitiveDistortions.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {cognitiveDistortions.length > 0 ? (
                  cognitiveDistortions.map((distortion, index) => (
                    <div 
                      key={index}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{distortion.type.replace('_', ' ')}</h4>
                        <div className="flex gap-2">
                          <Badge variant={distortion.frequency === 'alta' ? 'destructive' : 'secondary'}>
                            {distortion.frequency} frecuencia
                          </Badge>
                          <Badge variant={distortion.impact === 'alto' ? 'destructive' : 'outline'}>
                            {distortion.impact} impacto
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {distortion.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No se han identificado patrones cognitivos. Esto puede ser una buena señal.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Técnicas Terapéuticas Personalizadas ({personalizedInterventions.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {personalizedInterventions.length > 0 ? (
                  personalizedInterventions.map((intervention, index) => (
                    <div 
                      key={index}
                      className="p-4 border rounded-lg space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{intervention.technique}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {intervention.description}
                          </p>
                        </div>
                        
                        <div className="text-right text-sm space-y-1">
                          <Badge variant="outline">{intervention.category}</Badge>
                          <div className="text-muted-foreground">{intervention.duration}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={intervention.difficulty === 'principiante' ? 'default' : 'secondary'}>
                          {intervention.difficulty}
                        </Badge>
                        {intervention.adhdFriendly && (
                          <Badge className="bg-purple-100 text-purple-800">
                            ADHD-friendly
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Pasos a seguir:</h5>
                        <ol className="text-sm space-y-1">
                          {intervention.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary font-medium">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <strong>Resultado esperado:</strong> {intervention.expectedOutcome}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No hay técnicas disponibles. Genera un análisis para recibir técnicas personalizadas.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cbt" className="space-y-4">
          {currentCBTSession ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" />
                      {currentCBTSession.sessionPlan.title}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {currentCBTSession.sessionPlan.duration}min
                      </Badge>
                      <Button
                        variant={sessionInProgress ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setSessionInProgress(!sessionInProgress)}
                      >
                        {sessionInProgress ? (
                          <>
                            <PauseCircle className="w-4 h-4 mr-1" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Iniciar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Objetivos de la sesión:</h4>
                      <ul className="text-sm space-y-1">
                        {currentCBTSession.sessionPlan.objectives.map((objective, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Target className="w-3 h-3 text-blue-600" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Técnicas incluidas:</h4>
                      <div className="flex gap-2">
                        {currentCBTSession.sessionPlan.techniques.map((technique, i) => (
                          <Badge key={i} variant="outline">{technique}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ejercicios Guiados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Ejercicios Guiados
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {currentCBTSession.guidedExercises.map((exercise, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg mb-4 ${
                        currentExercise === index ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <Badge variant="outline">{exercise.duration}min</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Instrucciones:</h5>
                          <ol className="text-sm space-y-1">
                            {exercise.instructions.map((instruction, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary font-medium">{i + 1}.</span>
                                {instruction}
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        {exercise.materials.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium mb-1">Materiales necesarios:</h5>
                            <div className="flex gap-2">
                              {exercise.materials.map((material, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h5 className="text-sm font-medium mb-1">Preguntas de reflexión:</h5>
                          <ul className="text-sm space-y-1">
                            {exercise.reflectionQuestions.map((question, i) => (
                              <li key={i} className="text-muted-foreground">• {question}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Adaptaciones para ADHD */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Adaptaciones Personalizadas
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Adaptaciones para ADHD:</h4>
                      <ul className="text-sm space-y-1">
                        {currentCBTSession.adaptations.forADHD.map((adaptation, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {adaptation}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Adaptaciones por personalidad:</h4>
                      <ul className="text-sm space-y-1">
                        {currentCBTSession.adaptations.personalityBased.map((adaptation, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-blue-600" />
                            {adaptation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Crear Sesión CBT Personalizada
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    No hay ninguna sesión CBT activa. Crea una sesión personalizada basada en tu estado actual.
                  </p>
                  
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => handleCreateCBTSession('ansiedad')}>
                      Sesión para Ansiedad
                    </Button>
                    <Button onClick={() => handleCreateCBTSession('depresion')} variant="outline">
                      Sesión para Depresión
                    </Button>
                    <Button onClick={() => handleCreateCBTSession('estres')} variant="outline">
                      Sesión para Estrés
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentTherapyPanel;