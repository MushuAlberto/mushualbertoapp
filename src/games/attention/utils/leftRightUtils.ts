
export const MAX_LEVEL = 12;

const BACKGROUNDS = [
  "bg-white",
  "bg-gray-50", 
  "bg-blue-50",
  "bg-green-50",
  "bg-yellow-50",
  "bg-red-50"
];

const ARROW_COLORS = [
  "text-black",
  "text-blue-600",
  "text-green-600", 
  "text-red-600",
  "text-purple-600"
];

const DISTRACTION_TEXTS = [
  "IZQUIERDA",
  "DERECHA", 
  "LEFT",
  "RIGHT",
  "←",
  "→"
];

export interface LeftRightChallenge {
  direction: "left" | "right";
  backgroundColor: string;
  arrowColor: string;
  flipped: boolean;
  text: string | null;
  maxTime: number; // en ms
}

export function generateLeftRightChallenge(level: number): LeftRightChallenge {
  const direction: "left" | "right" = Math.random() < 0.5 ? "left" : "right";
  
  // Tiempo disminuye con el nivel
  const maxTime = Math.max(1000, 5000 - (level * 300));
  
  // Añadir distracciones progresivamente
  let flipped = false;
  let text: string | null = null;
  
  if (level > 3) {
    // Voltear la flecha (confundir visualmente)
    flipped = Math.random() < 0.3;
  }
  
  if (level > 6) {
    // Añadir texto distractor
    if (Math.random() < 0.5) {
      const wrongDirection = direction === "left" ? "right" : "left";
      const distractionTexts = DISTRACTION_TEXTS.filter(t => 
        t.toLowerCase().includes(wrongDirection) || 
        (wrongDirection === "left" && t === "→") ||
        (wrongDirection === "right" && t === "←")
      );
      
      if (distractionTexts.length > 0) {
        text = distractionTexts[Math.floor(Math.random() * distractionTexts.length)];
      }
    }
  }
  
  const backgroundColor = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  const arrowColor = ARROW_COLORS[Math.floor(Math.random() * ARROW_COLORS.length)];
  
  return {
    direction,
    backgroundColor,
    arrowColor,
    flipped,
    text,
    maxTime
  };
}
