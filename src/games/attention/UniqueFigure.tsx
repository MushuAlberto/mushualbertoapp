
import React, { useEffect, useState } from "react";
import { generateUniqueFigureChallenge, MAX_LEVEL } from "./utils/uniqueFigureUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

// Dibuja la figura dependiendo de tipo y color
function ShapeBlock({ shape, color }: { shape: string; color: string }) {
  if (shape === "circle") {
    return <div className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 ${color} border-2 border-white`} />;
  }
  if (shape === "square") {
    return <div className={`rounded-md w-10 h-10 sm:w-12 sm:h-12 ${color} border-2 border-white`} />;
  }
  if (shape === "triangle") {
    // Triángulo CSS
    return (
      <div
        className="w-0 h-0"
        style={{
          borderLeft: "22px solid transparent",
          borderRight: "22px solid transparent",
          borderBottom: `38px solid var(--tw-bg-opacity, 1)`,
          filter: "drop-shadow(0 0 1px #fff)",
        }}
      >
        <div
          className={`${color}`}
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderBottom: "38px solid",
            borderBottomColor: "inherit",
            top: 0
          }}
        />
      </div>
    );
  }
  if (shape === "diamond") {
    return (
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 ${color} border-2 border-white`}
        style={{
          transform: "rotate(45deg)",
          borderRadius: "10%"
        }}
      />
    );
  }
  return null;
}

const UniqueFigureGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<"playing" | "correct" | "fail" | "completed">("playing");
  const [challenge, setChallenge] = useState(() => generateUniqueFigureChallenge(1));
  const [tries, setTries] = useState(0);

  useEffect(() => {
    setChallenge(generateUniqueFigureChallenge(level));
    setStatus("playing");
    setTries(0);
  }, [level]);

  const handlePick = (idx: number) => {
    if (status !== "playing") return;
    setTries(t => t + 1);
    if (idx === challenge.oddIdx) {
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
        Figura Única
        <Badge variant="secondary" className="ml-2 bg-orange-300 text-orange-900 border-orange-500">
          {level}/{MAX_LEVEL}
        </Badge>
      </h2>
      <div className="text-orange-700 mb-1 font-medium">
        Categoría: Atención
      </div>
      <div className="mb-2 text-base">
        ¿Cuál figura es diferente a las demás?
      </div>
      {/* Grid de figuras */}
      <div className="grid gap-3 mb-5"
        style={{
          gridTemplateColumns: `repeat(${challenge.gridSize}, minmax(0, 1fr))`,
          maxWidth: 300
        }}>
        {challenge.grid.map((item, idx) => (
          <button
            key={idx}
            className={
              `flex items-center justify-center sm:m-1 aspect-square transition-transform ` +
              (status === "playing" ? "hover:scale-110" : "") +
              (item.isOdd && status === "correct"
                ? " ring-4 ring-green-400 z-10 scale-110"
                : "")
            }
            onClick={() => handlePick(idx)}
            disabled={status !== "playing"}
            aria-label={item.isOdd ? "¡Figura Única!" : "Figura"}
          >
            <ShapeBlock shape={item.shape} color={item.color} />
          </button>
        ))}
      </div>
      {/* Feedback */}
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
        Encuentra la figura "única" que es diferente por color o forma.<br />
        Cada vez habrá más y serán más parecidas. ¡Ojo!
      </div>
      <div className="mt-2 text-xs text-gray-400">Intentos: {tries}</div>
    </div>
  );
};

export default UniqueFigureGame;
