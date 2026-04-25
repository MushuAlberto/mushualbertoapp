import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GAME_CATEGORIES } from "@/constants/games";

// Static imports of all game components by key
import ColorSequenceGame from "../../games/memory/ColorSequence";
import FindNewGame from "../../games/memory/FindNew";
import PairCardsGame from "../../games/memory/PairCards";
import RandomMemoryGame from "../../games/memory/RandomGame";

import HiddenColorsGame from "../../games/reasoning/HiddenColors";
import SumNumbersGame from "../../games/reasoning/SumNumbers";
import ReorderBlocksGame from "../../games/reasoning/ReorderBlocks";
import RandomReasoningGame from "../../games/reasoning/RandomGame";

import ColorWordsGame from "../../games/attention/ColorWords";
import UniqueFigureGame from "../../games/attention/UniqueFigure";
import LeftRightGame from "../../games/attention/LeftRight";
import RandomAttentionGame from "../../games/attention/RandomGame";

import RoadCarsGame from "../../games/coordination/RoadCars";
import JumpingCircleGame from "../../games/coordination/JumpingCircle";
import CutFruitsGame from "../../games/coordination/CutFruits";
import RandomCoordinationGame from "../../games/coordination/RandomGame";

import ScaleGame from "../../games/visuospatial/Scale";
import SymmetryGame from "../../games/visuospatial/Symmetry";
import BlockTowerGame from "../../games/visuospatial/BlockTower";
import RandomVisuospatialGame from "../../games/visuospatial/RandomGame";

// Map of game keys to components
const gameComponents: Record<string, React.FC> = {
  // Memoria
  "memory-color-sequence": ColorSequenceGame,
  "memory-find-new": FindNewGame,
  "memory-pair-cards": PairCardsGame,
  "memory-random": RandomMemoryGame,
  // Razonamiento
  "reasoning-hidden-colors": HiddenColorsGame,
  "reasoning-sum-numbers": SumNumbersGame,
  "reasoning-reorder-blocks": ReorderBlocksGame,
  "reasoning-random": RandomReasoningGame,
  // Atención
  "attention-color-words": ColorWordsGame,
  "attention-unique-figure": UniqueFigureGame,
  "attention-left-right": LeftRightGame,
  "attention-random": RandomAttentionGame,
  // Coordinación
  "coordination-road-cars": RoadCarsGame,
  "coordination-jumping-circle": JumpingCircleGame,
  "coordination-cut-fruits": CutFruitsGame,
  "coordination-random": RandomCoordinationGame,
  // Visuoespacial
  "visuospatial-scale": ScaleGame,
  "visuospatial-symmetry": SymmetryGame,
  "visuospatial-block-tower": BlockTowerGame,
  "visuospatial-random": RandomVisuospatialGame,
};

const colorClasses = {
  yellow: {
    border: "border-yellow-400",
    bg: "bg-yellow-200",
    text: "text-yellow-800",
    gameBg: "bg-yellow-100",
    badgeText: "text-yellow-900",
  },
  blue: {
    border: "border-blue-400",
    bg: "bg-blue-200",
    text: "text-blue-800",
    gameBg: "bg-blue-100",
    badgeText: "text-blue-900",
  },
  orange: {
    border: "border-orange-400",
    bg: "bg-orange-200",
    text: "text-orange-800",
    gameBg: "bg-orange-100",
    badgeText: "text-orange-900",
  },
  green: {
    border: "border-green-400",
    bg: "bg-green-200",
    text: "text-green-800",
    gameBg: "bg-green-100",
    badgeText: "text-green-900",
  },
  pink: {
    border: "border-pink-400",
    bg: "bg-pink-200",
    text: "text-pink-800",
    gameBg: "bg-pink-100",
    badgeText: "text-pink-900",
  },
};

const MindGamesSection: React.FC = () => {
  const [openGameKey, setOpenGameKey] = useState<string | null>(null);

  const handleGameClick = (gameKey: string) => {
    console.log("Opening game:", gameKey);
    setOpenGameKey(gameKey);
  };

  const closeModal = () => {
    console.log("Closing game modal");
    setOpenGameKey(null);
  };

  // Obtener componente según key
  const GameComponent = openGameKey ? gameComponents[openGameKey] : null;

  return (
    <section className="w-full space-y-8">
      {/* Modal de juego */}
      <Dialog open={!!openGameKey} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {openGameKey && (
              <DialogTitle>
                {(GAME_CATEGORIES.flatMap(cat => cat.games).find(g => g.key === openGameKey)?.name) || "Juego"}
              </DialogTitle>
            )}
            <DialogDescription>
              ¡Disfruta el minijuego! (Próximamente versión completa)
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-[200px] flex items-center justify-center">
            {GameComponent ? <GameComponent /> : (
              <div className="text-center text-gray-500">
                <p>Cargando juego...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Listado de categorías y juegos */}
      {GAME_CATEGORIES.map((category) => {
        const colors = colorClasses[category.color as keyof typeof colorClasses];
        const CategoryIcon = category.icon;

        return (
          <div key={category.key}>
            <div className="flex items-center gap-3 mb-4 mt-2">
              <span className={`inline-block ${colors.bg} rounded-full p-2`}>
                <CategoryIcon className={`w-6 h-6 ${colors.text}`} />
              </span>
              <span className={`text-xl font-semibold text-gray-700`}>{category.name}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {category.games.map((game) => {
                const GameIcon = game.icon;
                return (
                  <button
                    key={game.key}
                    className={`flex flex-col items-center justify-center rounded-2xl shadow-md transition hover:scale-105 p-3 pb-2 border-2 ${colors.border} bg-white relative`}
                    style={{ minHeight: 124, minWidth: 110 }}
                    onClick={() => handleGameClick(game.key)}
                    type="button"
                  >
                    <div className={`w-16 h-16 flex items-center justify-center rounded-xl mb-1 ${colors.gameBg} shadow-inner border`}>
                      <GameIcon className={`w-10 h-10 ${colors.text}`} />
                    </div>
                    <span className="mt-1 text-base font-bold text-gray-800 text-center leading-tight">
                      {game.name}
                    </span>
                    <Badge variant="secondary" className={`absolute top-2 right-2 text-xs px-2 py-0.5 ${colors.bg} ${colors.badgeText} border ${colors.border} shadow`}>
                      Próximamente
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default MindGamesSection;
