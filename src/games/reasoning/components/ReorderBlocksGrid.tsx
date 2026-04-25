
import React, { useState } from "react";
import { Block } from "../utils/reorderBlocksUtils";

interface ReorderBlocksGridProps {
  blocks: Block[];
  onBlockClick: (blockId: string) => void;
  selectedBlockId?: string;
  disabled?: boolean;
  onChange?: (blocks: Block[]) => void;
  locked?: boolean;
}

const ReorderBlocksGrid: React.FC<ReorderBlocksGridProps> = ({
  blocks,
  onBlockClick,
  selectedBlockId,
  disabled = false,
  onChange,
  locked = false
}) => {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [selectedForSwap, setSelectedForSwap] = useState<string | null>(null);

  const handleBlockClick = (blockId: string) => {
    if (locked || disabled) return;
    
    if (selectedForSwap && selectedForSwap !== blockId) {
      // Swap the two blocks
      const newBlocks = [...blocks];
      const index1 = newBlocks.findIndex(b => b.id === selectedForSwap);
      const index2 = newBlocks.findIndex(b => b.id === blockId);
      
      if (index1 !== -1 && index2 !== -1) {
        [newBlocks[index1], newBlocks[index2]] = [newBlocks[index2], newBlocks[index1]];
        onChange?.(newBlocks);
      }
      setSelectedForSwap(null);
    } else {
      setSelectedForSwap(blockId);
    }
    
    onBlockClick(blockId);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
      {blocks.map((block, index) => (
        <button
          key={block.id}
          className={`
            w-16 h-16 rounded-lg border-2 transition-all duration-200
            flex flex-col items-center justify-center text-white font-bold
            ${block.bgClass} ${block.borderClass}
            ${locked || disabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 cursor-pointer'}
            ${selectedBlockId === block.id || selectedForSwap === block.id ? 'ring-4 ring-yellow-400 scale-110' : ''}
          `}
          onClick={() => handleBlockClick(block.id)}
          disabled={locked || disabled}
        >
          <span className="text-xs">{block.color.slice(0, 3)}</span>
          <span className="text-lg">{block.number}</span>
        </button>
      ))}
    </div>
  );
};

export default ReorderBlocksGrid;
