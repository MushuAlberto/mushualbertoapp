import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Wind, 
  Waves, 
  Sun, 
  Moon, 
  Zap, 
  Flower,
  Timer,
  Play,
  Pause
} from "lucide-react";
import BreathingAnimation from "./BreathingAnimation";
import BreathingTechniqueList from "./BreathingTechniqueList";
import BreathingTechniqueDetails from "./BreathingTechniqueDetails";

interface BreathingExerciseSelectorProps {
  mood: string | null;
}

const BREATHING_TECHNIQUES = [
  {
    id: "4-7-8",
    name: "4-7-8 Relajante",
    description: "Técnica para reducir ansiedad y ayudar a dormir",
    icon: <Moon className="h-5 w-5 text-blue-500" />,
    duration: "2-4 minutos",
    pattern: "Inhala 4 seg → Retén 7 seg → Exhala 8 seg",
    benefits: ["Reduce ansiedad", "Ayuda a dormir", "Calma la mente"],
    color: "bg-blue-50 border-blue-200",
    suitable: ["Ansioso", "Desanimado"],
    // Configuración para la animación
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 0,
    cycles: 4
  },
  {
    id: "box-breathing",
    name: "Respiración Cuadrada",
    description: "Equilibra el sistema nervioso y mejora la concentración",
    icon: <Wind className="h-5 w-5 text-green-500" />,
    duration: "3-5 minutos",
    pattern: "Inhala 4 seg → Retén 4 seg → Exhala 4 seg → Pausa 4 seg",
    benefits: ["Mejora concentración", "Reduce estrés", "Equilibra emociones"],
    color: "bg-green-50 border-green-200",
    suitable: ["Ansioso", "Motivado", "Tranquilo"],
    // Configuración para la animación
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    cycles: 5
  },
  {
    id: "energizing",
    name: "Respiración Energizante",
    description: "Activa tu energía y aumenta la vitalidad",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    duration: "1-3 minutos",
    pattern: "Inhala rápido 2 seg → Exhala rápido 2 seg (x3) → Pausa 10 seg",
    benefits: ["Aumenta energía", "Mejora el enfoque", "Revitaliza"],
    color: "bg-yellow-50 border-yellow-200",
    suitable: ["Cansado", "Motivado"],
    // Configuración para la animación
    inhale: 2,
    hold: 0,
    exhale: 2,
    pause: 10,
    cycles: 3
  },
  {
    id: "coherent",
    name: "Respiración Coherente",
    description: "Armoniza corazón y mente para mayor bienestar",
    icon: <Heart className="h-5 w-5 text-pink-500" />,
    duration: "5-10 minutos",
    pattern: "Inhala 5 seg → Exhala 5 seg (ritmo constante)",
    benefits: ["Armoniza emociones", "Reduce presión arterial", "Mejora bienestar"],
    color: "bg-pink-50 border-pink-200",
    suitable: ["Feliz", "Tranquilo"],
    // Configuración para la animación
    inhale: 5,
    hold: 0,
    exhale: 5,
    pause: 0,
    cycles: 10
  },
  {
    id: "ocean",
    name: "Respiración Oceánica",
    description: "Respiración profunda que calma como las olas del mar",
    icon: <Waves className="h-5 w-5 text-cyan-500" />,
    duration: "3-7 minutos",
    pattern: "Inhala profundo por nariz → Exhala lento con sonido suave",
    benefits: ["Calma profunda", "Reduce tensión", "Mejora la paciencia"],
    color: "bg-cyan-50 border-cyan-200",
    suitable: ["Ansioso", "Desanimado", "Tranquilo"],
    // Configuración para la animación
    inhale: 6,
    hold: 0,
    exhale: 8,
    pause: 0,
    cycles: 6
  },
  {
    id: "gratitude",
    name: "Respiración de Gratitud",
    description: "Combina respiración con pensamientos positivos",
    icon: <Flower className="h-5 w-5 text-purple-500" />,
    duration: "3-5 minutos",
    pattern: "Inhala pensando en gratitud → Exhala soltando tensión",
    benefits: ["Aumenta positividad", "Mejora el humor", "Fortalece resiliencia"],
    color: "bg-purple-50 border-purple-200",
    suitable: ["Feliz", "Tranquilo", "Desanimado"],
    // Configuración para la animación
    inhale: 4,
    hold: 2,
    exhale: 6,
    pause: 0,
    cycles: 5
  }
];

const BreathingExerciseSelector: React.FC<BreathingExerciseSelectorProps> = ({ mood }) => {
  const [selectedTechnique, setSelectedTechnique] = React.useState<string | null>(null);
  const [showAnimation, setShowAnimation] = React.useState(false);

  const recommendedTechniques = mood
    ? BREATHING_TECHNIQUES.filter((tech) => tech.suitable.includes(mood))
    : BREATHING_TECHNIQUES;

  const allTechniques = BREATHING_TECHNIQUES;

  const selectedTech = selectedTechnique
    ? BREATHING_TECHNIQUES.find((tech) => tech.id === selectedTechnique)
    : null;

  const handleStartExercise = () => {
    if (selectedTech) setShowAnimation(true);
  };

  const handleCompleteExercise = () => {
    setShowAnimation(false);
  };

  if (showAnimation && selectedTech) {
    return (
      <div className="space-y-6 animate-fade-in">
        <BreathingAnimation
          technique={{
            id: selectedTech.id,
            name: selectedTech.name,
            inhale: selectedTech.inhale,
            hold: selectedTech.hold,
            exhale: selectedTech.exhale,
            pause: selectedTech.pause,
            cycles: selectedTech.cycles,
            pattern: selectedTech.pattern,
          }}
          onComplete={handleCompleteExercise}
        />
        <div className="text-center">
          <Button
            onClick={() => setShowAnimation(false)}
            variant="outline"
            className="mt-4"
          >
            Volver a la selección
          </Button>
        </div>
      </div>
    );
  }

  if (!mood) {
    return (
      <Card className="bg-blue-50 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Wind className="h-6 w-6" />
            Ejercicios de Respiración
          </CardTitle>
          <CardDescription>
            Selecciona tu estado de ánimo para recibir técnicas personalizadas de respiración.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-blue-600" />
            Ejercicios de Respiración
          </CardTitle>
          <CardDescription>
            Elige una técnica de respiración que se adapte a tu estado actual: <Badge variant="secondary">{mood}</Badge>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Recommended Techniques */}
      {recommendedTechniques.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-500" />
              Recomendadas para ti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BreathingTechniqueList
              techniques={recommendedTechniques}
              selectedTechnique={selectedTechnique}
              onSelect={setSelectedTechnique}
            />
          </CardContent>
        </Card>
      )}

      {/* All Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Todas las técnicas disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {allTechniques.map((technique) => (
              <div
                key={technique.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  selectedTechnique === technique.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedTechnique(technique.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {technique.icon}
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {technique.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {technique.duration}
                      </p>
                    </div>
                  </div>
                  {selectedTechnique === technique.id && (
                    <Badge variant="outline" className="text-xs">
                      Seleccionada
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Technique Details */}
      {selectedTech && (
        <BreathingTechniqueDetails
          technique={selectedTech}
          onStart={handleStartExercise}
        />
      )}
    </div>
  );
};

export default BreathingExerciseSelector;
