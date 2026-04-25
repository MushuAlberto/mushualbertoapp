
export const MAX_LEVEL = 12;

export interface SumProblem {
  numbers: number[];
  answer: number;
}

export function generateSum(level: number): SumProblem {
  const difficulty = Math.min(5, Math.floor((level - 1) / 2) + 1);
  
  // Number of numbers increases with difficulty
  const numberCount = Math.min(6, 3 + Math.floor(difficulty / 2));
  
  // Range of numbers increases with difficulty  
  const maxNumber = 10 + (difficulty * 5);
  
  // Generate random numbers
  const numbers: number[] = [];
  for (let i = 0; i < numberCount; i++) {
    numbers.push(Math.floor(Math.random() * maxNumber) + 1);
  }
  
  // Calculate answer (simple sum for now)
  const answer = numbers.reduce((sum, num) => sum + num, 0);
  
  return {
    numbers,
    answer
  };
}

export interface SumNumbersChallenge {
  numbers: number[];
  target: number;
  operations: string[];
  difficulty: number;
}

export function generateSumNumbersChallenge(level: number): SumNumbersChallenge {
  const difficulty = Math.min(5, Math.floor((level - 1) / 2) + 1);
  
  // Número de números aumenta con dificultad
  const numberCount = Math.min(6, 3 + difficulty);
  
  // Rango de números aumenta con dificultad  
  const maxNumber = 10 + (difficulty * 10);
  
  // Generar números aleatorios
  const numbers: number[] = [];
  for (let i = 0; i < numberCount; i++) {
    numbers.push(Math.floor(Math.random() * maxNumber) + 1);
  }
  
  // Calcular target basado en algunas operaciones
  let target: number;
  const operations: string[] = [];
  
  if (difficulty <= 2) {
    // Solo sumas
    const selectedNumbers = numbers.slice(0, Math.min(3, numbers.length));
    target = selectedNumbers.reduce((sum, num) => sum + num, 0);
    operations.push(selectedNumbers.join(" + "));
  } else if (difficulty <= 4) {
    // Sumas y restas
    const a = numbers[0];
    const b = numbers[1];
    const c = numbers[2] || 0;
    
    if (Math.random() < 0.5) {
      target = a + b - c;
      operations.push(`${a} + ${b} - ${c}`);
    } else {
      target = a - b + c;
      operations.push(`${a} - ${b} + ${c}`);
    }
  } else {
    // Incluir multiplicación simple
    const a = numbers[0];
    const b = Math.min(numbers[1], 5); // Mantener multiplicaciones simples
    const c = numbers[2] || 0;
    
    target = a * b + c;
    operations.push(`${a} × ${b} + ${c}`);
  }
  
  // Asegurar que target sea positivo
  target = Math.max(1, target);
  
  return {
    numbers,
    target,
    operations,
    difficulty
  };
}

export function validateSolution(numbers: number[], target: number, selectedIndices: number[], operation: string): boolean {
  if (selectedIndices.length === 0) return false;
  
  const selectedNumbers = selectedIndices.map(i => numbers[i]);
  let result: number;
  
  switch (operation) {
    case "+":
      result = selectedNumbers.reduce((sum, num) => sum + num, 0);
      break;
    case "-":
      result = selectedNumbers.reduce((diff, num, index) => index === 0 ? num : diff - num);
      break;
    case "×":
      result = selectedNumbers.reduce((prod, num) => prod * num, 1);
      break;
    default:
      return false;
  }
  
  return result === target;
}
