
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  { name: "rojo", value: "#ef4444", class: "bg-red-500", shadow: "shadow-red-200" },
  { name: "azul", value: "#3b82f6", class: "bg-blue-500", shadow: "shadow-blue-200" },
  { name: "verde", value: "#22c55e", class: "bg-green-500", shadow: "shadow-green-200" },
  { name: "amarillo", value: "#eab308", class: "bg-yellow-400", shadow: "shadow-yellow-100" },
];

// Función para generar una secuencia aleatoria
function generateSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * COLORS.length));
}

const MAX_LEVEL = 20;

const ColorSequenceGame: React.FC = () => {
  // Estados principales
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [showStep, setShowStep] = useState(0);
  const [status, setStatus] = useState<"init" | "show" | "user" | "success" | "fail" | "won">("init");
  const [message, setMessage] = useState<string>("¡Prepárate para jugar!");
  const [flashIndex, setFlashIndex] = useState<number | null>(null);

  // Iniciar un nuevo nivel
  const startLevel = () => {
    setSequence(generateSequence(level));
    setUserInput([]);
    setShowStep(0);
    setShowSequence(true);
    setStatus("show");
    setMessage(`Memoriza la secuencia`);
  };

  // Mostrar la secuencia de colores animadamente
  useEffect(() => {
    if (showSequence && status === "show") {
      if (showStep < level) {
        setFlashIndex(sequence[showStep]);
        const timer = setTimeout(() => {
          setFlashIndex(null);
          setTimeout(() => {
            setShowStep((prev) => prev + 1);
          }, 250);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setShowSequence(false);
          setShowStep(0);
          setStatus("user");
          setMessage("Repite la secuencia pulsando los colores");
        }, 500);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line
  }, [showStep, showSequence, status, sequence, level]);

  // Cuando cambia el nivel
  useEffect(() => {
    if (status === "init") {
      startLevel();
    }
    // eslint-disable-next-line
  }, [level, status]);

  // Comprobar la respuesta del usuario
  useEffect(() => {
    if (status === "user" && userInput.length > 0) {
      const idx = userInput.length - 1;
      if (userInput[idx] !== sequence[idx]) {
        setStatus("fail");
        setMessage("¡Incorrecto! Inténtalo de nuevo desde el nivel 1.");
        return;
      }
      // Si terminó la secuencia correctamente
      if (userInput.length === sequence.length) {
        if (level === MAX_LEVEL) {
          setStatus("won");
          setMessage("¡GANASTE! Has completado todos los niveles 🎉");
        } else {
          setStatus("success");
          setMessage("¡Bien hecho! Pulsa para continuar al siguiente nivel.");
        }
      }
    }
    // eslint-disable-next-line
  }, [userInput, status, sequence, level]);

  // Reiniciar el juego
  const restartGame = () => {
    setLevel(1);
    setStatus("init");
    setMessage("¡Juego reiniciado! Memoriza la nueva secuencia.");
  };

  // Pasar al siguiente nivel
  const nextLevel = () => {
    setLevel((lvl) => lvl + 1);
    setStatus("init");
  };

  // Pulsar color
  const handleColorClick = (idx: number) => {
    if (status !== "user") return;
    setUserInput((prev) => [...prev, idx]);
    setFlashIndex(idx);
    setTimeout(() => setFlashIndex(null), 200);
  };

  // Iniciar juego al pulsar "Empezar"
  const handleStart = () => {
    setLevel(1);
    setStatus("init");
    setMessage("Memoriza la secuencia");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-72 w-full px-2 animate-fade-in">
      <h2 className="text-xl font-bold mb-1 text-yellow-800 flex items-center gap-2">
        Secuencia de Colores
        <Badge variant="secondary" className="ml-2 bg-yellow-300 text-yellow-900 border-yellow-500">{level}/{MAX_LEVEL}</Badge>
      </h2>
      <div className="text-yellow-700 mb-1 font-medium">Categoría: Memoria</div>
      <div className="mb-3 text-base text-gray-700">{message}</div>
      
      {/* Secuencia animada */}
      <div className="flex justify-center gap-3 my-4 min-h-14">
        {status === "show" && showSequence && sequence.map((colorIdx, i) => (
          <span 
            key={i} 
            className={`inline-block w-9 h-9 rounded-lg mx-1 border-2 ${COLORS[colorIdx].class} ${
              i === showStep && flashIndex !== null ? "ring-4 ring-yellow-400 flash shadow-lg" : "shadow"
            } transition-all`}
            style={{
              opacity: i > showStep ? 0.5 : 1,
              filter: i === showStep && flashIndex !== null ? 'brightness(1.4)' : 'brightness(1)',
              borderColor: "#facc15"
            }}
          ></span>
        ))}
      </div>
      
      {/* Botones de colores para elegir */}
      {(status === "user" || status === "fail" || status === "success" || status === "won") && (
        <div className="flex justify-center gap-4 my-4">
          {COLORS.map((color, idx) => (
            <Button
              key={color.name}
              className={`w-14 h-14 rounded-full ${color.class} shadow-md border-2 border-gray-300 hover:scale-110 focus:scale-95 transition-transform duration-150 outline-none`}
              style={{
                opacity: status === "user" ? 1 : 0.7,
                boxShadow: flashIndex === idx ? `0 0 0 6px ${color.value}66` : undefined,
              }}
              aria-label={color.name}
              tabIndex={status === "user" ? 0 : -1}
              disabled={status !== "user"}
              onClick={() => handleColorClick(idx)}
            />
          ))}
        </div>
      )}
      
      {/* Mostrar la secuencia que el usuario va marcando */}
      <div className="flex gap-2 mt-2 min-h-10">
        {status === "user" && userInput.map((colorIdx, i) => (
          <span
            key={i}
            className={`w-8 h-8 rounded-md border-2 ${COLORS[colorIdx].class} shadow`}
            style={{ borderColor: "#a3a3a3" }}
          ></span>
        ))}
      </div>

      {/* Botones de control */}
      <div className="flex flex-col gap-2 mt-4 w-full items-center">
        {status === "init" && (
          <Button onClick={handleStart} className="w-full bg-yellow-400 text-yellow-900 font-bold">
            Empezar
          </Button>
        )}
        {status === "success" && (
          <Button onClick={nextLevel} className="w-full bg-green-400 text-green-900 font-bold hover:bg-green-500 mt-1">
            Siguiente nivel
          </Button>
        )}
        {status === "fail" && (
          <Button onClick={restartGame} className="w-full bg-red-400 text-red-900 font-bold hover:bg-red-500 mt-1">
            Reintentar
          </Button>
        )}
        {status === "won" && (
          <Button onClick={restartGame} className="w-full bg-yellow-500 text-yellow-900 font-bold mt-1 animate-pulse">
            ¡Jugar de nuevo!
          </Button>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Memoriza y repite la secuencia para avanzar <br />
        ¡Sube de nivel hasta llegar al 20!
      </div>
    </div>
  );
};

export default ColorSequenceGame;
