
import React, { useEffect, useRef, useState } from "react";
import { generateLeftRightChallenge, MAX_LEVEL, LeftRightChallenge } from "./utils/leftRightUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, AlarmClock } from "lucide-react";

const ARROW_SIZE = 70;

function getArrowIcon(direction: "left" | "right") {
  return direction === "left" ? ArrowLeft : ArrowRight;
}

const LeftRightGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [challenge, setChallenge] = useState<LeftRightChallenge>(() => generateLeftRightChallenge(1));
  const [status, setStatus] = useState<"playing" | "correct" | "fail" | "timeout" | "completed">("playing");
  const [tries, setTries] = useState(0);
  const [timeLeft, setTimeLeft] = useState(challenge.maxTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle challenge update
  useEffect(() => {
    const newChallenge = generateLeftRightChallenge(level);
    setChallenge(newChallenge);
    setStatus("playing");
    setTries(0);
    setTimeLeft(newChallenge.maxTime);
  }, [level]);

  // Timer for fast reaction on high levels
  useEffect(() => {
    if (challenge.maxTime <= 0) return;
    if (status !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(challenge.maxTime);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus("timeout");
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => timerRef.current && clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, status]);

  const handlePick = (dir: "left" | "right") => {
    if (status !== "playing") return;
    setTries(t => t + 1);
    if (dir === challenge.direction) {
      if (level === MAX_LEVEL) {
        setStatus("completed");
      } else {
        setStatus("correct");
      }
    } else {
      setStatus("fail");
    }
  };

  const handleNext = () => setLevel(lvl => lvl + 1);
  const handleRestart = () => setLevel(1);

  // Icono real que se renderiza
  const ArrowIcon = getArrowIcon(challenge.direction);

  return (
    <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto px-2 py-6 animate-fade-in w-full">
      <h2 className="text-xl font-bold mb-2 text-orange-800 flex items-center gap-2">
        Izquierda o Derecha
        <Badge variant="secondary" className="ml-2 bg-orange-300 text-orange-900 border-orange-500">
          {level}/{MAX_LEVEL}
        </Badge>
      </h2>
      <div className="text-orange-700 mb-1 font-medium">
        Categoría: Atención
      </div>
      <div className="mb-2 text-base text-center">
        ¿Hacia dónde apunta la flecha?
        <br className="sm:hidden"/>
        <span className="text-xs text-gray-400">(Cuidado con las distracciones)</span>
      </div>
      {/* Info: tiempo */}
      <div className="flex items-center gap-2 mb-4 text-gray-500">
        <AlarmClock className="w-4 h-4" /><span>Tiempo: {Math.round((timeLeft ?? challenge.maxTime)/100)/10}s</span>
      </div>
      {/* Zona visual principal */}
      <div className={`my-4 flex flex-col items-center rounded-lg px-4 py-2 shadow-md border ${challenge.backgroundColor}`}>
        <div className={`flex items-center justify-center`}>
          <span
            className={
              "inline-flex items-center justify-center " +
              challenge.arrowColor +
              (challenge.flipped ? " scale-x-[-1]" : "") +
              " transition-transform duration-200"
            }
          >
            <ArrowIcon size={ARROW_SIZE} strokeWidth={3} />
          </span>
        </div>
        {challenge.text && (
          <div className="mt-2 text-lg sm:text-xl font-semibold select-none tracking-wide text-gray-700">
            {challenge.text}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6 w-full mb-4 mt-2">
        <Button
          key="left"
          className="w-full bg-gray-50 border shadow text-lg font-bold py-4"
          variant="outline"
          onClick={() => handlePick("left")}
          disabled={status !== "playing"}
        >Izquierda</Button>
        <Button
          key="right"
          className="w-full bg-gray-50 border shadow text-lg font-bold py-4"
          variant="outline"
          onClick={() => handlePick("right")}
          disabled={status !== "playing"}
        >Derecha</Button>
      </div>
      {/* Feedback */}
      {status === "fail" && (
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <XCircle className="w-5 h-5" /> ¡Intenta de nuevo!
        </div>
      )}
      {status === "timeout" && (
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <AlarmClock className="w-5 h-5" /> ¡Se acabó el tiempo!
        </div>
      )}
      {status === "correct" && (
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <CheckCircle className="w-5 h-5" /> ¡Correcto!
        </div>
      )}
      {status === "completed" && (
        <div className="flex items-center gap-2 text-blue-700 mb-2 font-bold animate-pulse">
          🎉 ¡Completaste todos los niveles!
        </div>
      )}
      <div className="flex gap-3 mt-2 w-full">
        {(status === "correct" || status === "playing") && level < MAX_LEVEL && (
          <Button className="bg-orange-400 text-orange-900 font-bold hover:bg-orange-500 flex-1" onClick={handleNext} disabled={status === "playing"}>
            Siguiente
          </Button>
        )}
        {status === "completed" && (
          <Button className="bg-blue-500 text-blue-50 font-bold animate-pulse flex-1" onClick={handleRestart}>
            ¡Jugar de nuevo!
          </Button>
        )}
        {(status === "fail" || status === "timeout") && (
          <Button
            className="bg-red-400 text-red-900 font-bold hover:bg-red-500 flex-1"
            onClick={() => setStatus("playing")}
          >
            Reintentar
          </Button>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Indica si la flecha apunta a la izquierda o derecha.<br />
        Los niveles incluyen trucos visuales y menos tiempo para responder. ¡Atención!
      </div>
      <div className="mt-2 text-xs text-gray-400">Intentos: {tries}</div>
    </div>
  );
};

export default LeftRightGame;

