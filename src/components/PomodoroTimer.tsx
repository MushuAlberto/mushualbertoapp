import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock, RotateCcw } from "lucide-react";
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

  let mascotIdx = 1;
  if (isRunning && secondsLeft < POMODORO_SECONDS) mascotIdx = 2;
  if (!isRunning && secondsLeft === POMODORO_SECONDS && sessionCount > 0) mascotIdx = 3;
  if (!isRunning && secondsLeft === POMODORO_SECONDS && sessionCount === 0) mascotIdx = 1;

  const progress = ((POMODORO_SECONDS - secondsLeft) / POMODORO_SECONDS) * 100;

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-violet-500/10 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-violet-500/5 border border-border flex flex-col sm:flex-row gap-4 items-center p-5">
      <div className="text-center flex-1 flex items-center gap-4 sm:flex-col sm:gap-1">
        <div className="text-5xl sm:text-6xl" aria-label={mascotStates[mascotIdx].label}>{mascotStates[mascotIdx].emoji}</div>
        <div>
          <div className="font-semibold text-foreground text-sm">{mascotStates[mascotIdx].label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Sesiones: <span className="font-bold">{sessionCount}</span></div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 flex-1">
        <Clock className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        <div className="text-4xl font-mono font-bold text-foreground tracking-wider">{formatTime(secondsLeft)}</div>

        {/* Progress bar */}
        <div className="w-full max-w-[200px] h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant={isRunning ? "secondary" : "default"} onClick={startPause} className="gap-1.5">
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pausar" : "Iniciar"}
          </Button>
          <Button size="sm" variant="outline" onClick={reset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
        <div className="text-[11px] text-muted-foreground">25 min foco → pausa → repite 🕑</div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
