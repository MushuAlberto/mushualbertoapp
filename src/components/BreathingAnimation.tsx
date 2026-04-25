
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathingTechnique {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause?: number;
  cycles: number;
  pattern: string;
}

interface BreathingAnimationProps {
  technique: BreathingTechnique;
  onComplete?: () => void;
}

const BreathingAnimation: React.FC<BreathingAnimationProps> = ({ technique, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(technique.inhale);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para vibrar el teléfono
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Obtener el texto de la fase actual
  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inhala...';
      case 'hold': return 'Mantén...';
      case 'exhale': return 'Exhala...';
      case 'pause': return 'Pausa...';
      default: return '';
    }
  };

  // Obtener la duración de la fase actual
  const getPhaseDuration = () => {
    switch (currentPhase) {
      case 'inhale': return technique.inhale;
      case 'hold': return technique.hold;
      case 'exhale': return technique.exhale;
      case 'pause': return technique.pause || 0;
      default: return 0;
    }
  };

  // Manejar transición a la siguiente fase
  const nextPhase = () => {
    switch (currentPhase) {
      case 'inhale':
        if (technique.hold > 0) {
          setCurrentPhase('hold');
          vibrate([100, 50, 100]); // Vibración doble para "mantener"
        } else {
          setCurrentPhase('exhale');
          vibrate(200); // Vibración larga para exhalar
        }
        break;
      case 'hold':
        setCurrentPhase('exhale');
        vibrate(200); // Vibración larga para exhalar
        break;
      case 'exhale':
        if (technique.pause && technique.pause > 0) {
          setCurrentPhase('pause');
          vibrate(50); // Vibración corta para pausa
        } else {
          // Nuevo ciclo
          if (currentCycle < technique.cycles) {
            setCurrentCycle(prev => prev + 1);
            setCurrentPhase('inhale');
            vibrate(100); // Vibración corta para inhalar
          } else {
            // Ejercicio completado
            setIsActive(false);
            vibrate([200, 100, 200, 100, 200]); // Vibración de finalización
            onComplete?.();
            return;
          }
        }
        break;
      case 'pause':
        // Nuevo ciclo
        if (currentCycle < technique.cycles) {
          setCurrentCycle(prev => prev + 1);
          setCurrentPhase('inhale');
          vibrate(100); // Vibración corta para inhalar
        } else {
          // Ejercicio completado
          setIsActive(false);
          vibrate([200, 100, 200, 100, 200]); // Vibración de finalización
          onComplete?.();
          return;
        }
        break;
    }
    
    setTimeLeft(getPhaseDuration());
    setProgress(0);
  };

  // Effect para manejar el timer
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 0.1;
          const phaseDuration = getPhaseDuration();
          setProgress(((phaseDuration - newTime) / phaseDuration) * 100);
          
          if (newTime <= 0) {
            nextPhase();
            return getPhaseDuration();
          }
          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, currentCycle]);

  // Funciones de control
  const startExercise = () => {
    setIsActive(true);
    vibrate(100); // Vibración de inicio
  };

  const pauseExercise = () => {
    setIsActive(false);
    vibrate(50); // Vibración de pausa
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCurrentCycle(1);
    setTimeLeft(technique.inhale);
    setProgress(0);
    vibrate([50, 50, 50]); // Vibración de reset
  };

  // Calcular el tamaño del círculo para la animación
  const getCircleScale = () => {
    if (currentPhase === 'inhale') {
      return 0.6 + (progress / 100) * 0.4; // Crece de 0.6 a 1.0
    } else if (currentPhase === 'exhale') {
      return 1.0 - (progress / 100) * 0.4; // Decrece de 1.0 a 0.6
    }
    return 1.0; // Mantiene el tamaño en hold y pause
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
      <CardContent className="p-8">
        <div className="text-center space-y-8">
          {/* Información del ejercicio */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{technique.name}</h3>
            <p className="text-gray-600">{technique.pattern}</p>
          </div>

          {/* Círculo de animación */}
          <div className="relative flex items-center justify-center h-80">
            <div
              className={`absolute w-64 h-64 rounded-full transition-all duration-300 ${
                currentPhase === 'inhale' 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400' 
                  : currentPhase === 'exhale'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400'
              } opacity-30`}
              style={{
                transform: `scale(${getCircleScale()})`,
                transition: isActive ? 'transform 0.1s ease-in-out' : 'transform 0.3s ease-in-out'
              }}
            />
            
            <div
              className={`absolute w-48 h-48 rounded-full transition-all duration-200 ${
                currentPhase === 'inhale' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : currentPhase === 'exhale'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              } opacity-60`}
              style={{
                transform: `scale(${getCircleScale() * 0.75})`,
                transition: isActive ? 'transform 0.1s ease-in-out' : 'transform 0.3s ease-in-out'
              }}
            />
            
            <div
              className={`w-32 h-32 rounded-full transition-all duration-100 ${
                currentPhase === 'inhale' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                  : currentPhase === 'exhale'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              } shadow-lg flex items-center justify-center`}
              style={{
                transform: `scale(${getCircleScale() * 0.5})`,
                transition: isActive ? 'transform 0.1s ease-in-out' : 'transform 0.3s ease-in-out'
              }}
            >
              <div className="text-white font-bold text-lg">
                {Math.ceil(timeLeft)}
              </div>
            </div>
          </div>

          {/* Texto de la fase actual */}
          <div className="space-y-2">
            <h4 className="text-3xl font-bold text-gray-800">
              {getPhaseText()}
            </h4>
            <p className="text-lg text-gray-600">
              Ciclo {currentCycle} de {technique.cycles}
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-100 ${
                currentPhase === 'inhale' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : currentPhase === 'exhale'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controles */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={isActive ? pauseExercise : startExercise}
              size="lg"
              className="flex items-center gap-2"
            >
              {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isActive ? 'Pausar' : 'Comenzar'}
            </Button>
            
            <Button
              onClick={resetExercise}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Reiniciar
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-sm text-gray-500 bg-white/50 rounded-lg p-3">
            <p>💡 <span className="font-medium">Tip:</span> Tu teléfono vibrará para guiarte en cada fase</p>
            <p className="mt-1">🧘‍♀️ Encuentra una posición cómoda y sigue el ritmo visual</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingAnimation;
