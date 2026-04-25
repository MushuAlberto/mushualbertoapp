import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  Wind, 
  Target, 
  TrendingUp, 
  Play, 
  Pause, 
  RotateCcw,
  Heart,
  Award,
  Timer,
  Lightbulb,
  Activity,
  Smile,
  AlertCircle
} from 'lucide-react';
import { useBreathingAI } from '@/hooks/useBreathingAI';
import { useToast } from '@/hooks/use-toast';

const IntelligentBreathingCoach: React.FC = () => {
  const { 
    currentSession, 
    progress, 
    loading, 
    sessionHistory, 
    generatePersonalizedSession, 
    analyzeProgress, 
    saveSession,
    getRecommendations,
    getSessionStats
  } = useBreathingAI();
  
  const { toast } = useToast();
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Assessment state
  const [showAssessment, setShowAssessment] = useState(true);
  const [stressLevel, setStressLevel] = useState([5]);
  const [moodLevel, setMoodLevel] = useState([5]);
  const [emotionalState, setEmotionalState] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  
  // Post-session state
  const [postSessionMood, setPostSessionMood] = useState([5]);
  const [postSessionStress, setPostSessionStress] = useState([5]);
  const [showPostSession, setShowPostSession] = useState(false);

  const stats = getSessionStats();

  const handleStartAssessment = async () => {
    const emotionalStateMap: Record<string, string> = {
      'ansioso': 'anxious',
      'estresado': 'stressed',
      'triste': 'sad',
      'enojado': 'angry',
      'calmado': 'calm',
      'feliz': 'happy',
      'neutral': 'neutral'
    };
    
    const mappedState = emotionalStateMap[emotionalState.toLowerCase()] || 'neutral';
    
    try {
      await generatePersonalizedSession(mappedState, stressLevel[0], emotionalState);
      setShowAssessment(false);
      toast({
        title: "Sesión personalizada creada",
        description: "Tu programa de respiración ha sido adaptado a tu estado actual.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la sesión. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const startBreathingSession = () => {
    if (!currentSession || !currentSession.techniques[0]) return;
    
    const technique = currentSession.techniques[0];
    setIsSessionActive(true);
    setCurrentPhase('inhale');
    setCurrentCycle(0);
    setTimeLeft(technique.pattern.inhale);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next phase
          setCurrentPhase(currentPhase => {
            const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
            const currentIndex = phases.indexOf(currentPhase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            
            if (nextPhase === 'inhale') {
              setCurrentCycle(cycle => cycle + 1);
            }
            
            const nextDuration = technique.pattern[nextPhase];
            return nextPhase;
          });
          
          return technique.pattern[currentPhase];
        }
        return prev - 1;
      });
    }, 1000);
    
    setSessionTimer(timer);
  };

  const pauseBreathingSession = () => {
    if (sessionTimer) {
      clearInterval(sessionTimer);
      setSessionTimer(null);
    }
    setIsSessionActive(false);
  };

  const resetBreathingSession = () => {
    if (sessionTimer) {
      clearInterval(sessionTimer);
      setSessionTimer(null);
    }
    setIsSessionActive(false);
    setCurrentPhase('inhale');
    setCurrentCycle(0);
    setTimeLeft(0);
  };

  const completeSession = () => {
    const sessionData = {
      technique: currentSession?.techniques[0]?.name || 'Unknown',
      duration: currentSession?.duration || 0,
      cycles: currentCycle,
      beforeMood: moodLevel[0],
      afterMood: postSessionMood[0],
      stressLevelBefore: stressLevel[0],
      stressLevelAfter: postSessionStress[0],
      notes: sessionNotes
    };

    saveSession(sessionData);
    setShowPostSession(false);
    setShowAssessment(true);
    resetBreathingSession();
    
    toast({
      title: "¡Sesión completada!",
      description: `Has mejorado tu bienestar. Diferencia de estrés: ${stressLevel[0] - postSessionStress[0]} puntos.`,
    });
  };

  const getPhaseInstruction = () => {
    const phaseMap = {
      inhale: 'Inhala profundamente',
      hold: 'Mantén el aire',
      exhale: 'Exhala lentamente',
      pause: 'Pausa suavemente'
    };
    return phaseMap[currentPhase];
  };

  const getPhaseColor = () => {
    const colorMap = {
      inhale: 'text-blue-600',
      hold: 'text-yellow-600',
      exhale: 'text-green-600',
      pause: 'text-purple-600'
    };
    return colorMap[currentPhase];
  };

  if (loading && !currentSession) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Coach Inteligente de Respiración
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

  // Assessment Phase
  if (showAssessment) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Coach Inteligente de Respiración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">¿Cómo te sientes ahora?</h3>
              <p className="text-muted-foreground">
                Ayúdame a crear una sesión perfecta para ti
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Nivel de estrés (1 = muy relajado, 10 = muy estresado)
                </label>
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Muy relajado</span>
                  <span className="font-medium">{stressLevel[0]}</span>
                  <span>Muy estresado</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Estado de ánimo (1 = muy bajo, 10 = excelente)
                </label>
                <Slider
                  value={moodLevel}
                  onValueChange={setMoodLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Muy bajo</span>
                  <span className="font-medium">{moodLevel[0]}</span>
                  <span>Excelente</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  ¿Cómo describirías tu estado emocional actual?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {['Ansioso', 'Estresado', 'Triste', 'Enojado', 'Calmado', 'Feliz', 'Neutral', 'Confundido'].map((state) => (
                    <Button
                      key={state}
                      variant={emotionalState === state.toLowerCase() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEmotionalState(state.toLowerCase())}
                      className="text-xs"
                    >
                      {state}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="O describe con tus propias palabras..."
                  value={emotionalState}
                  onChange={(e) => setEmotionalState(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <Button 
              onClick={handleStartAssessment} 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              <Brain className="mr-2 h-5 w-5" />
              {loading ? 'Creando sesión personalizada...' : 'Crear Mi Sesión Personalizada'}
            </Button>
          </CardContent>
        </Card>

        {/* Stats Preview */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tu Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
                  <div className="text-sm text-muted-foreground">Sesiones</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.totalMinutes}m</div>
                  <div className="text-sm text-muted-foreground">Minutos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">+{stats.avgMoodImprovement}</div>
                  <div className="text-sm text-muted-foreground">Mejora Ánimo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">-{stats.avgStressReduction}</div>
                  <div className="text-sm text-muted-foreground">Reducción Estrés</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Post-session assessment
  if (showPostSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            ¿Cómo te sientes después de la sesión?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">
              Estado de ánimo ahora (1-10)
            </label>
            <Slider
              value={postSessionMood}
              onValueChange={setPostSessionMood}
              max={10}
              min={1}
              step={1}
            />
            <div className="text-center mt-2">
              <span className="font-medium">{postSessionMood[0]}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">
              Nivel de estrés ahora (1-10)
            </label>
            <Slider
              value={postSessionStress}
              onValueChange={setPostSessionStress}
              max={10}
              min={1}
              step={1}
            />
            <div className="text-center mt-2">
              <span className="font-medium">{postSessionStress[0]}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">
              Notas (opcional)
            </label>
            <Textarea
              placeholder="¿Cómo fue la experiencia? ¿Qué notaste?"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
            />
          </div>

          <Button onClick={completeSession} className="w-full">
            <Award className="mr-2 h-4 w-4" />
            Completar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active Session
  if (!currentSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error al cargar la sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            No se pudo cargar tu sesión personalizada. Inténtalo de nuevo.
          </p>
          <Button onClick={() => setShowAssessment(true)}>
            Crear Nueva Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  const technique = currentSession.techniques[0];
  const isCompleted = currentCycle >= technique.cycles;

  if (isCompleted && !showPostSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            ¡Sesión Completada!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <p className="text-lg">
            Has completado {technique.cycles} ciclos de <strong>{technique.name}</strong>
          </p>
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{technique.cycles}</div>
              <div className="text-sm text-muted-foreground">Ciclos completados</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentSession.duration}m</div>
              <div className="text-sm text-muted-foreground">Tiempo de práctica</div>
            </div>
          </div>
          
          {currentSession.postSessionReflection && (
            <div className="text-left space-y-2">
              <h4 className="font-semibold">Reflexión:</h4>
              {currentSession.postSessionReflection.map((reflection, index) => (
                <p key={index} className="text-sm text-muted-foreground">• {reflection}</p>
              ))}
            </div>
          )}

          <Button onClick={() => setShowPostSession(true)} className="w-full">
            Evaluar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              {currentSession.sessionName}
            </CardTitle>
            <Badge variant="outline">
              {currentSession.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {currentSession.duration}min
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {technique.name}
              </div>
            </div>
            
            <p className="text-sm">{technique.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Animation */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ciclo {currentCycle + 1} de {technique.cycles}</span>
                <span>{Math.round(((currentCycle) / technique.cycles) * 100)}%</span>
              </div>
              <Progress value={(currentCycle / technique.cycles) * 100} />
            </div>

            {/* Breathing Circle */}
            <div className="relative">
              <div 
                className={`mx-auto w-32 h-32 rounded-full border-4 transition-all duration-1000 ${
                  currentPhase === 'inhale' ? 'scale-125 border-blue-400 bg-blue-50' :
                  currentPhase === 'hold' ? 'scale-125 border-yellow-400 bg-yellow-50' :
                  currentPhase === 'exhale' ? 'scale-75 border-green-400 bg-green-50' :
                  'scale-75 border-purple-400 bg-purple-50'
                }`}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getPhaseColor()}`}>
                    {timeLeft}
                  </div>
                  <div className={`text-sm ${getPhaseColor()}`}>
                    {getPhaseInstruction()}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              {!isSessionActive ? (
                <Button onClick={startBreathingSession} size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Comenzar
                </Button>
              ) : (
                <Button onClick={pauseBreathingSession} variant="outline" size="lg">
                  <Pause className="mr-2 h-5 w-5" />
                  Pausar
                </Button>
              )}
              
              <Button onClick={resetBreathingSession} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Reiniciar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions and Benefits */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Instrucciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              {technique.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {instruction}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Beneficios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {technique.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mindfulness Prompts */}
      {technique.mindfulnessPrompts && technique.mindfulnessPrompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Enfoque Mental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {technique.mindfulnessPrompts.map((prompt, index) => (
                <p key={index} className="text-sm italic bg-primary/5 p-3 rounded-lg">
                  "{prompt}"
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntelligentBreathingCoach;