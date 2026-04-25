
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Utilizamos 8 colores distintos para las cartas (opcionalmente se pueden cambiar por emojis o icons)
const CARD_PAIRS = [
  { id: "red", color: "bg-red-400" },
  { id: "blue", color: "bg-blue-400" },
  { id: "yellow", color: "bg-yellow-400" },
  { id: "green", color: "bg-green-500" },
  { id: "pink", color: "bg-pink-400" },
  { id: "purple", color: "bg-purple-400" },
  { id: "orange", color: "bg-orange-400" },
  { id: "lime", color: "bg-lime-400" },
  { id: "indigo", color: "bg-indigo-400" },
  { id: "teal", color: "bg-teal-400" },
  { id: "amber", color: "bg-amber-400" },
  { id: "cyan", color: "bg-cyan-400" },
  { id: "gray", color: "bg-gray-400" },
  { id: "sky", color: "bg-sky-400" },
  { id: "rose", color: "bg-rose-400" },
];

// El máximo nivel tendrá 15 pares (30 cartas), el resto va creciendo progresivamente
const MAX_LEVEL = 30;
function getPairsForLevel(level: number) {
  // Aumenta un par cada dos niveles hasta 15 pares
  const pairs = Math.min(3 + Math.floor((level-1)/2), CARD_PAIRS.length);
  return pairs;
}

// Baraja y duplica las cartas para el grid
function createShuffledCards(numPairs: number) {
  const selected = CARD_PAIRS.slice(0, numPairs);
  const cardsBase = [...selected, ...selected].map((card, idx) => ({
    ...card,
    unique: idx + Math.random(),
    // se usa unique (key) para que cada carta gemela tenga un ID único
  }));
  // Shuffle
  for (let i = cardsBase.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardsBase[i], cardsBase[j]] = [cardsBase[j], cardsBase[i]];
  }
  return cardsBase;
}

type CardType = {
  id: string;
  color: string;
  unique: number;
};

const PairCardsGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [status, setStatus] = useState<"playing"|"won"|"completed">("playing");
  const [message, setMessage] = useState("Encuentra todas las parejas de cartas.");

  // Reinicia el juego para el nivel actual
  useEffect(() => {
    const numPairs = getPairsForLevel(level);
    setCards(createShuffledCards(numPairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWaiting(false);
    setStatus("playing");
    setMessage("Encuentra todas las parejas de cartas.");
  }, [level]);

  // Lógica: revisar pares girados
  useEffect(() => {
    if (flipped.length === 2) {
      setWaiting(true);
      setTimeout(() => {
        const [idx1, idx2] = flipped;
        if (cards[idx1].id === cards[idx2].id) {
          setMatched((m) => [...m, cards[idx1].id]);
          setMessage("¡Encontraste una pareja!");
        } else {
          setMessage("¡No coinciden!");
        }
        setFlipped([]);
        setMoves((m) => m + 1);
        setWaiting(false);
      }, 800);
    }
    // eslint-disable-next-line
  }, [flipped]);

  // Comprobar si ganaste el nivel
  useEffect(() => {
    const numPairs = getPairsForLevel(level);
    if (matched.length === numPairs) {
      if (level === MAX_LEVEL) {
        setStatus("completed");
        setMessage("¡Completaste todos los niveles! 🎉");
      } else {
        setStatus("won");
        setMessage("¡Nivel superado! Pulsa para avanzar.");
      }
    }
    // eslint-disable-next-line
  }, [matched, level]);

  const handleFlip = (idx: number) => {
    if (waiting || flipped.includes(idx) || matched.includes(cards[idx].id) || flipped.length === 2) return;
    setFlipped((f) => [...f, idx]);
  };

  const handleNextLevel = () => {
    setLevel((lvl) => lvl + 1);
  };
  const handleRestart = () => {
    setLevel(1);
  };

  // Diseño para el grid (responsive)
  const numPairs = getPairsForLevel(level);
  const gridCols = numPairs <= 4 ? 4 : numPairs <= 6 ? 4 : numPairs <= 8 ? 5 : 6;

  return (
    <div className="w-full flex flex-col items-center justify-center px-1 py-2 animate-fade-in">
      <h2 className="text-xl font-bold mb-1 text-yellow-800 flex items-center gap-2">
        Par de Cartas
        <Badge variant="secondary" className="ml-2 bg-yellow-300 text-yellow-900 border-yellow-500">{level}/{MAX_LEVEL}</Badge>
      </h2>
      <div className="text-yellow-700 mb-1 font-medium">Categoría: Memoria</div>
      <div className="mb-2 text-base text-gray-700">{message}</div>
      <div className="mb-1 text-xs text-gray-500">
        Movimientos: {moves}
      </div>
      {/* Tablero */}
      <div
        className={`grid gap-2 w-full justify-center`}
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(52px, 1fr))`,
          maxWidth: 370,
        }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.id) || status === "completed";
          return (
            <button
              key={card.unique}
              className={`relative aspect-square w-full rounded-lg shadow border transition-all duration-200 outline-none
                ${isFlipped ? card.color + " border-yellow-400 scale-105" : "bg-white border-gray-200"}
                ${
                  flipped.includes(idx) && !matched.includes(card.id)
                    ? "ring-2 ring-yellow-400"
                    : ""
                }
                ${waiting || isFlipped ? "cursor-default" : "hover:scale-105 active:scale-90"}
              `}
              style={{
                minWidth: 52,
                minHeight: 52,
                pointerEvents: waiting || isFlipped ? "none" : undefined,
              }}
              aria-label={isFlipped ? `color ${card.id}` : "carta oculta"}
              onClick={() => handleFlip(idx)}
              tabIndex={isFlipped || waiting ? -1 : 0}
            >
              {/* Contenido carta */}
              <span className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white transition-colors">
                {isFlipped ? "★" : "?"}
              </span>
            </button>
          );
        })}
      </div>
      {/* Control de nivel */}
      <div className="flex flex-col gap-2 mt-4 w-full items-center">
        {status === "won" && (
          <Button onClick={handleNextLevel} className="w-full bg-green-400 text-green-900 font-bold hover:bg-green-500">
            Siguiente nivel
          </Button>
        )}
        {status === "completed" && (
          <Button onClick={handleRestart} className="w-full bg-yellow-500 text-yellow-900 font-bold animate-pulse">
            ¡Jugar de nuevo!
          </Button>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Encuentra todas las parejas de cartas para avanzar al siguiente nivel.<br />
        ¡Hay hasta 30 niveles en total!
      </div>
    </div>
  );
};

export default PairCardsGame;
