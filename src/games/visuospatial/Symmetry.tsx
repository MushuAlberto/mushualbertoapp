
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlipHorizontal } from "lucide-react";

const MAX_LEVEL = 100;

const SymmetryGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<"playing" | "completed">("playing");

  const handleNext = () => {
    if (level < MAX_LEVEL) setLevel(lvl => lvl + 1);
    else setStatus("completed");
  };
  
  const handleRestart = () => {
    setStatus("playing");
    setLevel(1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto p-6 animate-fade-in w-full">
      <div className="flex items-center gap-2 mb-2">
        <FlipHorizontal className="w-8 h-8 text-pink-700" />
        <h2 className="text-xl font-bold text-pink-800">Simetría</h2>
        <Badge variant="secondary" className="ml-2 bg-pink-200 text-pink-900 border-pink-500">{level}/{MAX_LEVEL}</Badge>
      </div>
      <div className="text-pink-700 mb-1 font-semibold">Categoría: Visuoespacial</div>
      <div className="mb-2 text-base text-center">
        Pronto deberás identificar patrones simétricos.<br />
        <span className="text-xs text-gray-400">(¿Es simétrico?)</span>
      </div>
      <div className="bg-pink-50 rounded-xl p-5 mt-3 mb-4 shadow border border-pink-200 flex flex-col items-center w-full">
        {/* Representación visual de simetría */}
        <div className="flex items-center justify-center gap-2 mb-2 min-h-[100px]">
          <div className="flex flex-col gap-1">
            <div className="w-4 h-4 bg-pink-500 rounded" />
            <div className="w-6 h-4 bg-pink-400 rounded" />
            <div className="w-4 h-4 bg-pink-300 rounded" />
          </div>
          <div className="w-px h-16 bg-gray-400" />
          <div className="flex flex-col gap-1">
            <div className="w-4 h-4 bg-pink-500 rounded" />
            <div className="w-6 h-4 bg-pink-400 rounded" />
            <div className="w-4 h-4 bg-pink-300 rounded" />
          </div>
        </div>
        <div className="text-gray-600 text-sm">¡Encuentra la simetría más adelante!</div>
      </div>
      <div className="flex gap-3 mt-2 w-full">
        {status === "playing" && level < MAX_LEVEL && (
          <Button className="bg-pink-400 text-pink-900 font-bold hover:bg-pink-500 flex-1" onClick={handleNext}>
            Siguiente
          </Button>
        )}
        {status === "playing" && level === MAX_LEVEL && (
          <Button className="bg-pink-600 text-pink-50 animate-pulse flex-1" onClick={() => setStatus("completed")}>
            Finalizar
          </Button>
        )}
        {status === "completed" && (
          <Button className="bg-blue-500 text-blue-50 font-bold animate-pulse flex-1" onClick={handleRestart}>
            ¡Jugar de nuevo!
          </Button>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        ¡Muy pronto podrás desafiar tu mente con patrones simétricos cada vez más complejos! (Nivel {level}/100)
      </div>
    </div>
  );
};

export default SymmetryGame;
