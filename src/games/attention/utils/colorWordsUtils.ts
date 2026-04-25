
export const MAX_LEVEL = 8;

const COLORS = [
  { name: "Rojo", class: "text-red-500" },
  { name: "Azul", class: "text-blue-500" },
  { name: "Verde", class: "text-green-500" },
  { name: "Amarillo", class: "text-yellow-500" },
  { name: "Morado", class: "text-purple-500" },
  { name: "Rosa", class: "text-pink-500" },
  { name: "Naranja", class: "text-orange-500" },
  { name: "Gris", class: "text-gray-500" },
];

export interface ColorWordChallenge {
  word: string;
  colorClass: string;
  answer: string;
  options: string[];
}

export function generateColorWordChallenge(level: number): ColorWordChallenge {
  // Aumentar dificultad con el nivel
  const numOptions = Math.min(4, 2 + Math.floor(level / 2));
  
  // Seleccionar color para mostrar la palabra
  const displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  // Seleccionar palabra (puede ser diferente al color mostrado)
  const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  // En niveles altos, hacer más confuso
  const shouldConfuse = level > 3 && Math.random() < 0.7;
  const word = shouldConfuse ? wordColor.name : displayColor.name;
  
  // La respuesta correcta es siempre el color en que está escrita
  const answer = displayColor.name;
  
  // Generar opciones
  const wrongOptions = COLORS
    .filter(c => c.name !== answer)
    .sort(() => Math.random() - 0.5)
    .slice(0, numOptions - 1)
    .map(c => c.name);
  
  const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
  
  return {
    word,
    colorClass: displayColor.class,
    answer,
    options
  };
}
