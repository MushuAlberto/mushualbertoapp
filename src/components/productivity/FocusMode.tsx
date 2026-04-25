import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Brain, 
  Zap,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { Task } from '@/types';
import { toast } from 'sonner';

interface FocusModeProps {
  task: Task;
  onClose: () => void;
  onComplete: (taskId: string) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ task, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min default
  const [isActive, setIsActive] = useState(false);
  const [mushuMessage, setMushuMessage] = useState("¡Aquí estoy contigo! Vamos a enfocarnos en esta única tarea.");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast.success("¡Tiempo cumplido!", {
        description: "Mushu está orgulloso de tu enfoque."
      });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const mushuTips = [
    "Recuerda respirar profundo. Solo existe esta tarea ahora.",
    "Si te distraes, no te preocupes, vuelve suavemente aquí.",
    "¡Lo estás haciendo genial! Yo te acompaño.",
    "¿Necesitas un trago de agua? Aquí te espero.",
    "Un paso a la vez, no hay prisa."
  ];

  useEffect(() => {
    if (isActive) {
      const tipInterval = setInterval(() => {
        setMushuMessage(mushuTips[Math.floor(Math.random() * mushuTips.length)]);
      }, 60000); // Cambio cada minuto
      return () => clearInterval(tipInterval);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-primary/30 shadow-2xl overflow-hidden">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <CardHeader className="text-center pt-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">Modo Enfoque</CardTitle>
          <p className="text-muted-foreground italic">"Body Doubling" con Mushu Alberto</p>
        </CardHeader>

        <CardContent className="space-y-8 pb-12">
          {/* Mushu Presence */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 relative">
            <div className="absolute -top-3 left-6 px-2 bg-background text-primary font-bold text-sm">
              Mushu dice:
            </div>
            <p className="text-lg text-center font-medium animate-in fade-in slide-in-from-bottom-2">
              "{mushuMessage}"
            </p>
          </div>

          {/* Current Task */}
          <div className="text-center space-y-2">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Tarea Actual</h3>
            <p className="text-2xl font-bold">{task.title}</p>
          </div>

          {/* Timer */}
          <div className="space-y-4">
            <div className="text-7xl font-mono font-bold text-center">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="h-3" />
            
            <div className="flex justify-center gap-4">
              <Button 
                size="lg" 
                variant={isActive ? "outline" : "default"} 
                onClick={() => setIsActive(!isActive)}
                className="w-32 h-16 text-xl"
              >
                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setTimeLeft(25 * 60)}
                className="w-16 h-16"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 gap-2 px-8 py-6 text-xl"
              onClick={() => {
                onComplete(task.id);
                onClose();
              }}
            >
              <CheckCircle2 className="w-6 h-6" />
              ¡Terminé!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusMode;
