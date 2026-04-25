
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HiddenColorsGrid from "./components/HiddenColorsGrid";
import {
  generateHiddenColorsGrid,
  MAX_LEVEL,
} from "./utils/hiddenColorsUtils";

const HiddenColorsGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState(() => generateHiddenColorsGrid(1));
  const [status, setStatus] = useState<"playing" | "won" | "failed" | "completed">("playing");
  const [message, setMessage] = useState("Encuentra el color oculto o diferente.");
  const [clicks, setClicks] = useState(0);

  // Al cambiar el nivel, genera el grid nuevo
  useEffect(() => {
    setGrid(generateHiddenColorsGrid(level));
    setStatus("playing");
    setClicks(0);
    setMessage("Encuentra el color oculto o diferente.");
  }, [level]);

  // Si se gana el último nivel...
  useEffect(() => {
    if (status === "won" && level === MAX_LEVEL) {
      setStatus("completed");
      setMessage("¡Completaste todos los niveles! 🎉");
    }
  }, [status, level]);

  const handleCellClick = (idx: number) => {
    if (status !== "playing") return;
    setClicks((c) => c + 1);
    if (idx === grid.differentIdx) {
      if (level === MAX_LEVEL) {
        setStatus("completed");
        setMessage("¡Completaste todos los niveles! 🎉");
      } else {
        setStatus("won");
        setMessage("¡Correcto! Pulsa para ir al siguiente nivel.");
      }
    } else {
      setStatus("failed");
      setMessage("¡Te equivocaste! Intenta de nuevo.");
    }
  };

  const handleNextLevel = () => setLevel((lvl) => lvl + 1);
  const handleRestart = () => setLevel(1);
  const handleRetry = () => {
    setGrid(generateHiddenColorsGrid(level));
    setStatus("playing");
    setClicks(0);
    setMessage("Encuentra el color oculto o diferente.");
  };

  const { items, differentIdx, gridSize } = grid;

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in px-2 py-4 w-full">
      <h2 className="text-xl font-bold mb-2 text-blue-800 flex items-center gap-2">
        Colores Ocultos
        <Badge variant="secondary" className="ml-2 bg-blue-300 text-blue-900 border-blue-500">
          {level}/{MAX_LEVEL}
        </Badge>
      </h2>
      <div className="text-blue-700 mb-2 font-medium">Categoría: Razonamiento</div>
      <div className="mb-2 text-base text-gray-700 text-center">{message}</div>
      <div className="mb-1 text-xs text-gray-500">Intentos: {clicks}</div>
      <HiddenColorsGrid
        items={items}
        gridSize={gridSize}
        differentIdx={differentIdx}
        status={status === "failed" ? "failed" : status === "won" || status === "completed" ? "won" : "playing"}
        onCellClick={handleCellClick}
      />
      <div className="flex flex-col gap-2 mt-4 w-full items-center">
        {status === "won" && (
          <Button
            onClick={handleNextLevel}
            className="w-full bg-green-400 text-green-900 font-bold hover:bg-green-500"
          >
            Siguiente nivel
          </Button>
        )}
        {status === "completed" && (
          <Button
            onClick={handleRestart}
            className="w-full bg-blue-500 text-blue-50 font-bold animate-pulse"
          >
            ¡Jugar de nuevo!
          </Button>
        )}
        {status === "failed" && level < MAX_LEVEL && (
          <Button
            onClick={handleRetry}
            className="w-full bg-red-400 text-red-900 font-bold hover:bg-red-500"
          >
            Reintentar nivel
          </Button>
        )}
      </div>
      <div className="mt-3 text-xs text-gray-400 text-center">
        Toca el color que veas distinto o camuflado.<br />
        La dificultad aumenta en tamaño y en parecido de color.<br />
        ¡Logra llegar al nivel 50!
      </div>
    </div>
  );
};

export default HiddenColorsGame;
