
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReorderBlocksGrid from "./components/ReorderBlocksGrid";
import { generateSequence, MAX_LEVEL } from "./utils/reorderBlocksUtils";

const ReorderBlocksGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState(() => generateSequence(1));
  const [blocks, setBlocks] = useState(sequence.blocks);
  const [status, setStatus] = useState<"playing"|"won"|"completed"|"fail">("playing");
  const [message, setMessage] = useState("Reordena los bloques al orden correcto.");
  const [tries, setTries] = useState(0);

  useEffect(() => {
    const seq = generateSequence(level);
    setSequence(seq);
    setBlocks(seq.blocks);
    setStatus("playing");
    setTries(0);
    setMessage("Reordena los bloques al orden correcto.");
    // eslint-disable-next-line
  }, [level]);

  useEffect(() => {
    if (status === "completed") setMessage("¡Completaste todos los niveles! 🎉");
  }, [status]);

  const isCorrect = () =>
    blocks.every((b, i) => b.label === sequence.correct[i].label);

  const checkOrder = () => {
    setTries(t => t + 1);
    if (isCorrect()) {
      if (level === MAX_LEVEL) {
        setStatus("completed");
        setMessage("¡Completaste todos los niveles! 🎉");
      } else {
        setStatus("won");
        setMessage("¡Correcto! Pulsa para ir al siguiente nivel.");
      }
    } else {
      setStatus("fail");
      setMessage("¡El orden no es correcto! Inténtalo de nuevo.");
    }
  };

  const handleNext = () => setLevel(lvl => lvl + 1);
  const handleRestart = () => setLevel(1);

  const handleBlockClick = (blockId: string) => {
    console.log(`Block clicked: ${blockId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto px-2 py-6 animate-fade-in w-full">
      <h2 className="text-xl font-bold mb-2 text-blue-800 flex items-center gap-2">
        Reordenar Bloques
        <Badge
          variant="secondary"
          className="ml-2 bg-blue-300 text-blue-900 border-blue-500"
        >
          {level}/{MAX_LEVEL}
        </Badge>
      </h2>
      <div className="text-blue-700 mb-1 font-medium">
        Categoría: Razonamiento
      </div>
      <div className="mb-2 text-base text-gray-700 text-center">
        {message}
      </div>
      <div className="mb-1 text-xs text-gray-500">Intentos: {tries}</div>
      <div className="w-full my-5">
        <ReorderBlocksGrid
          blocks={blocks}
          onBlockClick={handleBlockClick}
          onChange={b => {
            setBlocks(b);
            if (status === "fail") setStatus("playing");
          }}
          locked={status !== "playing"}
        />
      </div>
      <div className="flex flex-col gap-2 mt-2 w-full items-center">
        {status === "playing" && (
          <Button className="w-full bg-blue-400 text-blue-900 font-bold hover:bg-blue-500" onClick={checkOrder}>
            Comprobar orden
          </Button>
        )}
        {status === "won" && (
          <Button className="w-full bg-green-400 text-green-900 font-bold hover:bg-green-500" onClick={handleNext}>
            Siguiente nivel
          </Button>
        )}
        {status === "completed" && (
          <Button className="w-full bg-blue-500 text-blue-50 font-bold animate-pulse" onClick={handleRestart}>
            ¡Jugar de nuevo!
          </Button>
        )}
        {status === "fail" && (
          <Button
            className="w-full bg-red-400 text-red-900 font-bold hover:bg-red-500"
            onClick={() => setStatus("playing")}
          >
            Intentar otra vez
          </Button>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Arrastra y suelta, o pulsa dos bloques para intercambiar.<br />
        Debes lograr el orden correcto de izquierda a derecha.<br />
        La dificultad aumenta con más bloques, colores menos distintos y menos pistas.
        <br />
        ¡Llega hasta el nivel {MAX_LEVEL}!
      </div>
    </div>
  );
};

export default ReorderBlocksGame;
