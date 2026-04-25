
export const MAX_LEVEL = 10;

const SHAPES = ["circle", "square", "triangle", "diamond"];
const COLORS = [
  "bg-red-400",
  "bg-blue-400", 
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-orange-400",
  "bg-indigo-400"
];

export interface GridItem {
  shape: string;
  color: string;
  isOdd: boolean;
}

export interface UniqueFigureChallenge {
  grid: GridItem[];
  gridSize: number;
  oddIdx: number;
}

export function generateUniqueFigureChallenge(level: number): UniqueFigureChallenge {
  // Tamaño de la grilla aumenta con el nivel
  const gridSize = Math.min(5, 3 + Math.floor((level - 1) / 3));
  const totalItems = gridSize * gridSize;
  
  // Seleccionar forma y color común
  const commonShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const commonColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  // Decidir qué será diferente en la figura única
  const differByShape = Math.random() < 0.5;
  
  let oddShape = commonShape;
  let oddColor = commonColor;
  
  if (differByShape) {
    const availableShapes = SHAPES.filter(s => s !== commonShape);
    oddShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
  } else {
    const availableColors = COLORS.filter(c => c !== commonColor);
    oddColor = availableColors[Math.floor(Math.random() * availableColors.length)];
  }
  
  // Generar grilla
  const grid: GridItem[] = [];
  const oddIdx = Math.floor(Math.random() * totalItems);
  
  for (let i = 0; i < totalItems; i++) {
    if (i === oddIdx) {
      grid.push({
        shape: oddShape,
        color: oddColor,
        isOdd: true
      });
    } else {
      grid.push({
        shape: commonShape,
        color: commonColor,
        isOdd: false
      });
    }
  }
  
  return {
    grid,
    gridSize,
    oddIdx
  };
}
