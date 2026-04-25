export const MAX_LEVEL = 15;

const COLORS = [
  "bg-red-400",
  "bg-blue-400", 
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-orange-400",
  "bg-indigo-400",
  "bg-teal-400",
  "bg-cyan-400"
];

const EMOJIS = ["🎯", "🚀", "⭐", "🎨", "🎪", "🎭", "🎪", "🎨", "🎯", "⚡"];
const SHAPES = ["■", "●", "▲", "♦", "★", "♠", "♥", "♣", "♪", "♫"];

export interface GridItem {
  id: string;
  color: string;
  isNew: boolean;
}

export interface FindNewGrid {
  items: string[];
  differentIdx: number;
  useEmoji: boolean;
  gridSize: number;
  baseValue: string;
  diffValue: string;
}

export function generateGrid(level: number): FindNewGrid {
  const gridSize = Math.min(6, 3 + Math.floor((level - 1) / 3));
  const totalItems = gridSize * gridSize;
  
  const useEmoji = Math.random() > 0.5;
  const sourceArray = useEmoji ? EMOJIS : SHAPES;
  
  // Pick base value
  const baseValue = sourceArray[Math.floor(Math.random() * sourceArray.length)];
  let diffValue = sourceArray[Math.floor(Math.random() * sourceArray.length)];
  
  // Ensure different value
  while (diffValue === baseValue) {
    diffValue = sourceArray[Math.floor(Math.random() * sourceArray.length)];
  }
  
  // Create grid with mostly base values
  const items = Array(totalItems).fill(baseValue);
  
  // Pick random position for different item
  const differentIdx = Math.floor(Math.random() * totalItems);
  items[differentIdx] = diffValue;
  
  return {
    items,
    differentIdx,
    useEmoji,
    gridSize,
    baseValue,
    diffValue
  };
}

export function generateFindNewChallenge(level: number, previousItems: GridItem[] = []): FindNewChallenge {
  // Tamaño aumenta progresivamente
  const gridSize = Math.min(6, 3 + Math.floor((level - 1) / 3));
  const totalItems = gridSize * gridSize;
  
  // Número de elementos nuevos (siempre 1 para simplicidad)
  const numNewItems = 1;
  const numOldItems = Math.min(totalItems - numNewItems, previousItems.length);
  
  // Seleccionar elementos antiguos
  const oldItems = previousItems
    .sort(() => Math.random() - 0.5)
    .slice(0, numOldItems)
    .map(item => ({ ...item, isNew: false }));
  
  // Crear elementos nuevos
  const usedColors = oldItems.map(item => item.color);
  const availableColors = COLORS.filter(color => !usedColors.includes(color));
  
  const newItems: GridItem[] = [];
  for (let i = 0; i < numNewItems; i++) {
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    newItems.push({
      id: `new-${Date.now()}-${i}`,
      color,
      isNew: true
    });
    availableColors.splice(availableColors.indexOf(color), 1);
  }
  
  // Completar con elementos aleatorios si no hay suficientes antiguos
  const remainingSlots = totalItems - oldItems.length - newItems.length;
  for (let i = 0; i < remainingSlots; i++) {
    const availableColorsForFiller = COLORS.filter(color => 
      !oldItems.some(item => item.color === color) &&
      !newItems.some(item => item.color === color)
    );
    
    if (availableColorsForFiller.length > 0) {
      const color = availableColorsForFiller[Math.floor(Math.random() * availableColorsForFiller.length)];
      oldItems.push({
        id: `filler-${Date.now()}-${i}`,
        color,
        isNew: false
      });
    }
  }
  
  // Mezclar todos los elementos
  const grid = [...oldItems, ...newItems].sort(() => Math.random() - 0.5);
  
  return {
    grid,
    gridSize,
    newItemId: newItems[0]?.id || ""
  };
}

export interface FindNewChallenge {
  grid: GridItem[];
  gridSize: number;
  newItemId: string;
}
