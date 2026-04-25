import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FindNewGrid from "./components/FindNewGrid";
import { generateGrid, MAX_LEVEL } from "./utils/findNewUtils";

const FindNewGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState(() => generateGrid(1));
  const [status, setStatus] = useState<"playing"|"won"|"completed"|"fail">("playing");
  const [message, setMessage] = useState("Encuentra la figura/celda diferente.");
  const [clicks, setClicks] = useState(0);

  // Inicializar/reiniciar grid
  useEffect(() => {
    setGrid(generateGrid(level));
    setStatus("playing");
    setClicks(0);
    setMessage("Encuentra la figura/celda diferente.");
  }, [level]);

  // Cuando se gana el nivel
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
      setStatus("fail");
      setMessage("¡Esa no era! Intenta de nuevo el nivel.");
    }
  };

  const handleNextLevel = () => {
    setLevel((lvl) => lvl + 1);
  };
  const handleRestart = () => {
    setLevel(1);
  };
  const handleRetry = () => {
    setGrid(generateGrid(level));
    setStatus("playing");
    setClicks(0);
    setMessage("Encuentra la figura/celda diferente.");
  };

  const { items, differentIdx, useEmoji, gridSize, baseValue, diffValue } = grid;

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in px-2 py-2 w-full">
      <h2 className="text-xl font-bold mb-1 text-yellow-800 flex items-center gap-2">
        Encuentra el Nuevo
        <Badge variant="secondary" className="ml-2 bg-yellow-300 text-yellow-900 border-yellow-500">
          {level}/{MAX_LEVEL}
        </Badge>
      </h2>
      <div className="text-yellow-700 mb-1 font-medium">
        Categoría: Memoria
      </div>
      <div className="mb-2 text-base text-gray-700">{message}</div>
      <div className="mb-1 text-xs text-gray-500">Intentos: {clicks}</div>
      {/* Grid refactorizado */}
      <FindNewGrid
        items={items}
        useEmoji={useEmoji}
        gridSize={gridSize}
        baseValue={baseValue}
        diffValue={diffValue}
        differentIdx={differentIdx}
        status={status}
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
            className="w-full bg-yellow-500 text-yellow-900 font-bold animate-pulse"
          >
            ¡Jugar de nuevo!
          </Button>
        )}
        {(status === "fail" && level < MAX_LEVEL) && (
          <Button
            onClick={handleRetry}
            className="w-full bg-red-400 text-red-900 font-bold hover:bg-red-500"
          >
            Reintentar nivel
          </Button>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Encuentra la figura, color o emoji diferente para avanzar.<br />
        ¡Hay hasta 100 niveles en total!
      </div>
    </div>
  );
};

export default FindNewGame;
