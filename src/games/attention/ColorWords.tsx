
import React, { useState, useEffect } from "react";
import { generateColorWordChallenge, MAX_LEVEL } from "./utils/colorWordsUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

const ColorWordsGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<"playing" | "correct" | "fail" | "completed">("playing");
  const [challenge, setChallenge] = useState(() => generateColorWordChallenge(1));
  const [tries, setTries] = useState(0);

  useEffect(() => {
    setChallenge(generateColorWordChallenge(level));
    setStatus("playing");
    setTries(0);
  }, [level]);

  const handleOption = (option: string) => {
    if (status !== "playing") return;
    setTries(t => t + 1);
    if (option === challenge.answer) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto px-2 py-6 animate-fade-in w-full">
      <h2 className="text-xl font-bold mb-2 text-orange-800 flex items-center gap-2">
        Palabras de Colores
        <Badge variant="secondary" className="ml-2 bg-orange-300 text-orange-900 border-orange-500">
          {level}/{MAX_LEVEL}
        </Badge>
      </h2>
      <div className="text-orange-700 mb-1 font-medium">
        Categoría: Atención
      </div>
      <div className="mb-2 text-base text-center">
        ¿En qué color está escrita la palabra? <br className="sm:hidden"/><span className="text-xs text-gray-400">(No el texto que dice)</span>
      </div>
      <div className="my-6 flex justify-center">
        <span
          className={`text-4xl sm:text-5xl font-bold px-8 py-2 border-b-4 border-orange-200 rounded ${challenge.colorClass} transition-colors`}
        >
          {challenge.word}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        {challenge.options.map(option => (
          <Button
            key={option}
            className="w-full bg-white border shadow hover:scale-105 text-lg font-bold py-4"
            variant="outline"
            onClick={() => handleOption(option)}
            disabled={status !== "playing"}
          >{option}</Button>
        ))}
      </div>
      {status === "fail" && (
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <XCircle className="w-5 h-5" /> ¡Intenta de nuevo!
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
        {status === "fail" && (
          <Button
            className="bg-red-400 text-red-900 font-bold hover:bg-red-500 flex-1"
            onClick={() => setStatus("playing")}
          >
            Reintentar
          </Button>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Debes escoger el color en el que está escrita la palabra, no el texto.
        La dificultad aumentará añadiendo más colores y confundiendo más.
      </div>
      <div className="mt-2 text-xs text-gray-400">Intentos: {tries}</div>
    </div>
  );
};

export default ColorWordsGame;
