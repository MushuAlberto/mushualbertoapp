
import React from "react";

interface FindNewGridProps {
  items: string[];
  useEmoji: boolean;
  gridSize: number;
  baseValue: string;
  diffValue: string;
  differentIdx: number;
  status: "playing" | "won" | "completed" | "fail";
  onCellClick: (idx: number) => void;
}

const FindNewGrid: React.FC<FindNewGridProps> = ({
  items,
  useEmoji,
  gridSize,
  baseValue,
  diffValue,
  differentIdx,
  status,
  onCellClick
}) => {
  return (
    <div 
      className="grid gap-2 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        maxWidth: 300
      }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          className={`
            aspect-square rounded-lg border-2 transition-all duration-200
            bg-gray-100 border-gray-300 text-2xl font-bold
            flex items-center justify-center
            ${status === "playing" ? 'hover:scale-105 hover:shadow-md cursor-pointer' : 'cursor-not-allowed opacity-50'}
            ${status === "won" && idx === differentIdx ? 'ring-4 ring-green-400 bg-green-200' : ''}
            ${status === "fail" && idx === differentIdx ? 'ring-4 ring-red-400 bg-red-200' : ''}
          `}
          onClick={() => status === "playing" && onCellClick(idx)}
          disabled={status !== "playing"}
          aria-label={idx === differentIdx ? "Elemento diferente" : "Elemento normal"}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FindNewGrid;
