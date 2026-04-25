
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateSum, MAX_LEVEL } from "./utils/sumNumbersUtils";

const SumNumbersGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState(generateSum(1));
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "failed" | "completed">("playing");
  const [message, setMessage] = useState("Resuelve la suma para avanzar de nivel.");
  const [tries, setTries] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cuando cambia el nivel o se reinicia, generamos nueva suma/estado
  useEffect(() => {
    setProblem(generateSum(level));
    setStatus("playing");
    setInput("");
    setTries(0);
    setMessage("Resuelve la suma para avanzar de nivel.");
    setTimeout(() => inputRef.current?.focus(), 150);
  }, [level]);

  useEffect(() => {
    if (status === "completed") setMessage("¡Completaste todos los niveles! 🎉");
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo números positivos
    if (/^\d*$/.test(e.target.value)) setInput(e.target.value);
  };

  const checkAnswer = () => {
    setTries((t) => t + 1);
    if (Number(input) === problem.answer) {
      if (level === MAX_LEVEL) {
        setStatus("completed");
        setMessage("¡Completaste todos los niveles! 🎉");
      } else {
        setStatus("won");
        setMessage("¡Correcto! Pulsa para ir al siguiente nivel.");
      }
    } else {
      setStatus("failed");
      setMessage("Incorrecto, inténtalo de nuevo.");
    }
  };

  const handleNext = () => setLevel((lvl) => lvl + 1);
  const handleRestart = () => setLevel(1);

  // Ejemplo de suma visual: 5 + 11 + 2 = ?
  const renderSum = () => (
    <span className="text-2xl md:text-3xl font-bold tracking-wider text-blue-800">
      {problem.numbers.map((n, i) => (
        <span key={i}>
          {i > 0 && " + "}
          {n}
        </span>
      ))}
      {" = "}
      <Input
        ref={inputRef}
        className={`inline-block w-20 text-lg border-b-2 border-blue-400 mx-2 bg-white ${
          status === "failed" ? "border-red-400 text-red-600 animate-shake" : ""
        }`}
        value={input}
        onChange={handleChange}
        onKeyDown={e => e.key === "Enter" && status === "playing" && checkAnswer()}
        disabled={status !== "playing"}
        aria-label="Respuesta"
        inputMode="numeric"
        autoFocus
      />
    </span>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-60 max-w-md mx-auto px-2 py-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-2 text-blue-800 flex items-center gap-2">
        Suma Números
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
      <div className="my-5 mb-6">{renderSum()}</div>
      <div className="flex flex-col gap-2 mt-2 w-full items-center">
        {status === "playing" && (
          <Button
            className="w-full bg-blue-400 text-blue-900 font-bold hover:bg-blue-500"
            onClick={checkAnswer}
            disabled={!input}
          >
            Comprobar
          </Button>
        )}
        {status === "won" && (
          <Button
            className="w-full bg-green-400 text-green-900 font-bold hover:bg-green-500"
            onClick={handleNext}
          >
            Siguiente nivel
          </Button>
        )}
        {status === "completed" && (
          <Button
            className="w-full bg-blue-500 text-blue-50 font-bold animate-pulse"
            onClick={handleRestart}
          >
            ¡Jugar de nuevo!
          </Button>
        )}
        {status === "failed" && (
          <Button
            className="w-full bg-red-400 text-red-900 font-bold hover:bg-red-500"
            onClick={() => {
              setStatus("playing");
              setInput("");
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            Intentar otra vez
          </Button>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Escribe el resultado de la suma y presiona Enter o Comprobar.<br />
        La dificultad aumenta con cada nivel (más números, sumas más grandes).
        ¡Llega al nivel 50!
      </div>
    </div>
  );
};

export default SumNumbersGame;
