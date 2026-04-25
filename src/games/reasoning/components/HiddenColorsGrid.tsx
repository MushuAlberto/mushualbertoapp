
import React from "react";
import { ColorCell } from "../utils/hiddenColorsUtils";

interface HiddenColorsGridProps {
  items: ColorCell[];
  gridSize: number;
  differentIdx: number;
  status: "playing" | "won" | "failed";
  onCellClick: (idx: number) => void;
}

const HiddenColorsGrid: React.FC<HiddenColorsGridProps> = ({
  items,
  gridSize,
  differentIdx,
  status,
  onCellClick
}) => {
  return (
    <div 
      className="grid gap-2 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        maxWidth: 350
      }}
    >
      {items.map((cell, idx) => (
        <button
          key={cell.id}
          className={`
            aspect-square rounded-lg border-2 border-white transition-all duration-200
            flex items-center justify-center text-sm font-bold
            ${cell.bgClass} ${cell.textClass}
            ${status === "playing" ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
            ${status === "won" && idx === differentIdx ? 'ring-2 ring-blue-400' : ''}
          `}
          onClick={() => status === "playing" && onCellClick(idx)}
          disabled={status !== "playing"}
        >
          {cell.colorName.slice(0, 3)}
        </button>
      ))}
    </div>
  );
};

export default HiddenColorsGrid;
