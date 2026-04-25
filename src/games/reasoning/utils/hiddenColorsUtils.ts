
export const MAX_LEVEL = 10;

const COLORS = [
  { name: "Rojo", bg: "bg-red-400", text: "text-red-800" },
  { name: "Azul", bg: "bg-blue-400", text: "text-blue-800" },
  { name: "Verde", bg: "bg-green-400", text: "text-green-800" },
  { name: "Amarillo", bg: "bg-yellow-400", text: "text-yellow-800" },
  { name: "Morado", bg: "bg-purple-400", text: "text-purple-800" },
  { name: "Rosa", bg: "bg-pink-400", text: "text-pink-800" },
  { name: "Naranja", bg: "bg-orange-400", text: "text-orange-800" }
];

export interface ColorCell {
  id: string;
  colorName: string;
  bgClass: string;
  textClass: string;
  isHidden: boolean;
  isRevealed: boolean;
}

export interface HiddenColorsGrid {
  items: ColorCell[];
  gridSize: number;
  differentIdx: number;
}

export function generateHiddenColorsGrid(level: number): HiddenColorsGrid {
  const gridSize = Math.min(5, 3 + Math.floor((level - 1) / 2));
  const totalCells = gridSize * gridSize;
  
  // Create grid with random colors
  const items: ColorCell[] = [];
  const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  for (let i = 0; i < totalCells; i++) {
    items.push({
      id: `cell-${i}`,
      colorName: baseColor.name,
      bgClass: baseColor.bg,
      textClass: baseColor.text,
      isHidden: false,
      isRevealed: false
    });
  }
  
  // Pick one cell to be different
  const differentIdx = Math.floor(Math.random() * totalCells);
  let differentColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  while (differentColor.name === baseColor.name) {
    differentColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  
  items[differentIdx] = {
    id: `cell-${differentIdx}`,
    colorName: differentColor.name,
    bgClass: differentColor.bg,
    textClass: differentColor.text,
    isHidden: false,
    isRevealed: false
  };
  
  return {
    items,
    gridSize,
    differentIdx
  };
}

export interface HiddenColorsChallenge {
  grid: ColorCell[];
  gridSize: number;
  pattern: string;
  hiddenCount: number;
}

export function generateHiddenColorsChallenge(level: number): HiddenColorsChallenge {
  const gridSize = Math.min(5, 3 + Math.floor((level - 1) / 2));
  const totalCells = gridSize * gridSize;
  
  // Número de colores ocultos aumenta con el nivel
  const hiddenCount = Math.min(Math.floor(totalCells / 2), 2 + Math.floor(level / 2));
  
  // Generar patrón
  const patterns = ["diagonal", "esquinas", "centro", "bordes", "aleatorio"];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // Crear grid
  const grid: ColorCell[] = [];
  const usedColors = new Set<string>();
  
  for (let i = 0; i < totalCells; i++) {
    let color;
    do {
      color = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (usedColors.has(color.name) && usedColors.size < COLORS.length);
    
    usedColors.add(color.name);
    
    grid.push({
      id: `cell-${i}`,
      colorName: color.name,
      bgClass: color.bg,
      textClass: color.text,
      isHidden: false,
      isRevealed: false
    });
  }
  
  // Aplicar patrón para ocultar colores
  const hiddenIndices = getHiddenIndices(pattern, gridSize, hiddenCount);
  hiddenIndices.forEach(index => {
    if (grid[index]) {
      grid[index].isHidden = true;
    }
  });
  
  return {
    grid,
    gridSize,
    pattern,
    hiddenCount
  };
}

function getHiddenIndices(pattern: string, gridSize: number, hiddenCount: number): number[] {
  const totalCells = gridSize * gridSize;
  const indices: number[] = [];
  
  switch (pattern) {
    case "diagonal":
      for (let i = 0; i < Math.min(hiddenCount, gridSize); i++) {
        indices.push(i * gridSize + i);
      }
      break;
    case "esquinas":
      indices.push(0, gridSize - 1, totalCells - gridSize, totalCells - 1);
      break;
    case "centro":
      const center = Math.floor(gridSize / 2);
      indices.push(center * gridSize + center);
      break;
    case "bordes":
      // Primera y última fila
      for (let i = 0; i < gridSize && indices.length < hiddenCount; i++) {
        indices.push(i, totalCells - gridSize + i);
      }
      break;
    default: // aleatorio
      const availableIndices = Array.from({ length: totalCells }, (_, i) => i);
      for (let i = 0; i < hiddenCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        indices.push(availableIndices.splice(randomIndex, 1)[0]);
      }
  }
  
  return indices.slice(0, hiddenCount);
}
