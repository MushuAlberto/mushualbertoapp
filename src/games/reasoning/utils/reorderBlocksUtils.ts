
export const MAX_LEVEL = 10;

const COLORS = [
  { name: "Rojo", bg: "bg-red-400", border: "border-red-500" },
  { name: "Azul", bg: "bg-blue-400", border: "border-blue-500" },
  { name: "Verde", bg: "bg-green-400", border: "border-green-500" },
  { name: "Amarillo", bg: "bg-yellow-400", border: "border-yellow-500" },
  { name: "Morado", bg: "bg-purple-400", border: "border-purple-500" },
  { name: "Rosa", bg: "bg-pink-400", border: "border-pink-500" }
];

export interface Block {
  id: string;
  color: string;
  bgClass: string;
  borderClass: string;
  number: number;
  label: string;
}

export interface ReorderSequence {
  blocks: Block[];
  correct: Block[];
}

export function generateSequence(level: number): ReorderSequence {
  const blockCount = Math.min(8, 4 + Math.floor(level / 2));
  
  // Generate blocks
  const blocks: Block[] = [];
  for (let i = 0; i < blockCount; i++) {
    const color = COLORS[i % COLORS.length];
    blocks.push({
      id: `block-${i}`,
      color: color.name,
      bgClass: color.bg,
      borderClass: color.border,
      number: i + 1,
      label: `${color.name}-${i + 1}`
    });
  }
  
  // Create correct order (sorted by number)
  const correct = [...blocks].sort((a, b) => a.number - b.number);
  
  // Shuffle blocks for the challenge
  const shuffledBlocks = [...blocks].sort(() => Math.random() - 0.5);
  
  return {
    blocks: shuffledBlocks,
    correct
  };
}

export interface ReorderBlocksChallenge {
  blocks: Block[];
  targetOrder: string[];
  rule: string;
  difficulty: number;
}

export function generateReorderBlocksChallenge(level: number): ReorderBlocksChallenge {
  const difficulty = Math.min(4, Math.floor((level - 1) / 2) + 1);
  const blockCount = Math.min(8, 4 + difficulty);
  
  // Generar bloques
  const blocks: Block[] = [];
  for (let i = 0; i < blockCount; i++) {
    const color = COLORS[i % COLORS.length];
    blocks.push({
      id: `block-${i}`,
      color: color.name,
      bgClass: color.bg,
      borderClass: color.border,
      number: i + 1,
      label: `${color.name}-${i + 1}`
    });
  }
  
  // Mezclar bloques
  const shuffledBlocks = [...blocks].sort(() => Math.random() - 0.5);
  
  // Definir regla y orden objetivo
  const rules = [
    "Ordenar por número (menor a mayor)",
    "Ordenar por color (alfabético)",
    "Ordenar números pares primero",
    "Ordenar por color (inverso)"
  ];
  
  const rule = rules[Math.min(difficulty - 1, rules.length - 1)];
  let targetOrder: string[];
  
  switch (rule) {
    case "Ordenar por número (menor a mayor)":
      targetOrder = blocks.sort((a, b) => a.number - b.number).map(b => b.id);
      break;
    case "Ordenar por color (alfabético)":
      targetOrder = blocks.sort((a, b) => a.color.localeCompare(b.color)).map(b => b.id);
      break;
    case "Ordenar números pares primero":
      targetOrder = blocks
        .sort((a, b) => {
          if (a.number % 2 === 0 && b.number % 2 !== 0) return -1;
          if (a.number % 2 !== 0 && b.number % 2 === 0) return 1;
          return a.number - b.number;
        })
        .map(b => b.id);
      break;
    case "Ordenar por color (inverso)":
      targetOrder = blocks.sort((a, b) => b.color.localeCompare(a.color)).map(b => b.id);
      break;
    default:
      targetOrder = blocks.map(b => b.id);
  }
  
  return {
    blocks: shuffledBlocks,
    targetOrder,
    rule,
    difficulty
  };
}

export function checkOrder(currentOrder: string[], targetOrder: string[]): boolean {
  if (currentOrder.length !== targetOrder.length) return false;
  return currentOrder.every((id, index) => id === targetOrder[index]);
}
