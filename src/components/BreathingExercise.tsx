
import React from "react";
import { LucideProps, Smile, Frown, Meh, Heart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BreathingExerciseProps {
  mood: string | null;
}

const EXERCISES: Record<
  string,
  {
    title: string;
    description: string;
    steps: string[];
    icon?: React.ReactNode;
  }
> = {
  Feliz: {
    title: "Respiración consciente para disfrutar tu alegría",
    description: "Disfruta y potencia tu buen ánimo con un minuto de respiración plena.",
    steps: [
      "1. Inhala profundo por la nariz durante 4 segundos.",
      "2. Sostén la respiración cuenta 2.",
      "3. Exhala suavemente por la boca durante 6 segundos.",
      "4. Repite 4 veces y sonríe mientras lo haces.",
    ],
    icon: <Smile className="h-6 w-6 text-yellow-500" />,
  },
  Motivado: {
    title: "Respiración Energizante",
    description: "Impulsa tu energía y enfoque con esta técnica rápida.",
    steps: [
      "1. Siéntate derecho y relaja hombros.",
      "2. Inhala fuerte por la nariz en 2 segundos.",
      "3. Exhala rápido por la boca en 2 segundos (hazlo 3 veces seguidas).",
      "4. Descansa respirando normal 10 segundos. Repite el ciclo 2 veces.",
    ],
    icon: <Activity className="h-6 w-6 text-green-500" />,
  },
  Cansado: {
    title: "Respiración Renovadora",
    description: "Recupera vitalidad con respiración profunda.",
    steps: [
      "1. Pon una mano en el abdomen.",
      "2. Inhala lento y profundo por la nariz contando hasta 5.",
      "3. Siente tu abdomen expandirse.",
      "4. Exhala despacio por la boca contando hasta 7.",
      "5. Hazlo 4 veces, soltando la tensión en cada exhalación.",
    ],
    icon: <Meh className="h-6 w-6 text-blue-400" />,
  },
  Ansioso: {
    title: "Respiración para Calmar Ansiedad",
    description: "Regula tu cuerpo y mente con respiración cuadrada.",
    steps: [
      "1. Inhala por la nariz contando hasta 4.",
      "2. Mantén el aire en tus pulmones contando hasta 4.",
      "3. Exhala por la boca en 4 segundos.",
      "4. Espera 4 segundos antes de volver a inhalar.",
      "5. Repite el ciclo 4 veces.",
    ],
    icon: <Frown className="h-6 w-6 text-red-400" />,
  },
  Tranquilo: {
    title: "Respiración de Gratitud",
    description: "Aumenta paz interior con respiración serena.",
    steps: [
      "1. Inhala profundo y piensa en algo que agradeces.",
      "2. Exhala suavemente con una pequeña sonrisa.",
      "3. Hazlo 5 veces despacio y con intención.",
    ],
    icon: <Heart className="h-6 w-6 text-purple-500" />,
  },
  Desanimado: {
    title: "Respiración para Reconectar",
    description: "Reconoce tu sentir y dale espacio con respiración suave.",
    steps: [
      "1. Cierra los ojos y coloca una mano en el pecho.",
      "2. Inhala profundo por la nariz durante 4 segundos.",
      "3. Exhala lento por la boca contando hasta 6.",
      "4. Dite algo amable mentalmente al exhalar.",
      "5. Repite 5 veces.",
    ],
    icon: <Frown className="h-6 w-6 text-gray-500" />,
  },
};

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ mood }) => {
  if (!mood) {
    return (
      <Card className="bg-blue-50 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-blue-700">¿Quieres un ejercicio de respiración?</CardTitle>
          <CardDescription>
            Selecciona tu estado de ánimo para recibir una recomendación personalizada.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const exercise = EXERCISES[mood.trim()];

  if (!exercise) {
    return (
      <Card className="bg-blue-50 animate-fade-in">
        <CardHeader>
          <CardTitle>¡Buen momento para respirar!</CardTitle>
          <CardDescription>
            Prueba este ejercicio: Inhala profundo por 4 segundos, sostén 2 segundos y exhala suave por 6 segundos. Repite 4 veces.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-2">
        {exercise.icon}
        <div>
          <CardTitle>{exercise.title}</CardTitle>
          <CardDescription>{exercise.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="list-decimal pl-5 text-base space-y-1 mt-2">
          {exercise.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
