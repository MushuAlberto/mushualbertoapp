import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const POMODORO_SECONDS = 25 * 60;

const mascotStates = [
  { emoji: "😴", label: "Descansando" },
  { emoji: "🌱", label: "Comienza tu enfoque" },
  { emoji: "🔥", label: "¡Enfocado!" },
  { emoji: "🎉", label: "¡Racha Pomodoro!" },
];

interface PomodoroTimerProps {
  onComplete?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setSessionCount((cnt) => cnt + 1);
      setSecondsLeft(POMODORO_SECONDS);
      toast({
        title: "¡Sesión Pomodoro completada!",
        description: "Tómate un breve descanso y sigue sumando éxitos.",
      });
      if (onComplete) onComplete();
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft, onComplete, toast]);

  const startPause = () => setIsRunning((run) => !run);
  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(POMODORO_SECONDS);
  };

  // Mascot visual logic
  let mascotIdx = 1;
  if (isRunning && secondsLeft < POMODORO_SECONDS) mascotIdx = 2;
  if (!isRunning && secondsLeft === POMODORO_SECONDS && sessionCount > 0) mascotIdx = 3;
  if (!isRunning && secondsLeft === POMODORO_SECONDS && sessionCount === 0) mascotIdx = 1;

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  return (
    <div className="w-full rounded-lg shadow bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col md:flex-row gap-6 items-center p-6 mb-6">
      <div className="text-center flex-1">
        <div className="text-6xl mb-0" aria-label={mascotStates[mascotIdx].label}>{mascotStates[mascotIdx].emoji}</div>
        <div className="font-semibold text-indigo-700 mb-2">{mascotStates[mascotIdx].label}</div>
        <div className="text-gray-700">Sesiones Pomodoro: <span className="font-bold">{sessionCount}</span></div>
      </div>
      <div className="flex flex-col items-center gap-2 flex-1">
        <Clock className="h-8 w-8 text-indigo-500 mb-2" />
        <div className="text-4xl font-mono mb-2">{formatTime(secondsLeft)}</div>
        <div className="flex gap-2">
          <Button size="sm" variant={isRunning ? "secondary" : "default"} onClick={startPause}>
            {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isRunning ? "Pausar" : "Iniciar"}
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>Reiniciar</Button>
        </div>
        <div className="text-xs mt-4 text-gray-500">Método Pomodoro: 25 min foco, pausa y repite 🕑</div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
