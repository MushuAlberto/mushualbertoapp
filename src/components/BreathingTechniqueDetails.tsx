
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Timer } from "lucide-react";

interface BreathingTechnique {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  pattern: string;
  benefits: string[];
  duration: string;
}

interface BreathingTechniqueDetailsProps {
  technique: BreathingTechnique;
  onStart: () => void;
}

const BreathingTechniqueDetails: React.FC<BreathingTechniqueDetailsProps> = ({
  technique,
  onStart,
}) => (
  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl">
    <div className="p-6">
      <div className="flex items-center gap-2">
        {technique.icon}
        <span className="font-bold text-lg">{technique.name}</span>
      </div>
      <div className="mt-1 mb-4 text-gray-600">{technique.description}</div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-1">
          Patrón de respiración:
        </h4>
        <div className="text-gray-700 bg-white p-3 rounded-lg border mb-3">
          {technique.pattern}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-1">Beneficios:</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {technique.benefits.map((benefit, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {benefit}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={onStart} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Comenzar ejercicio guiado
        </Button>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Timer className="h-4 w-4" />
          {technique.duration}
        </span>
      </div>
      <div className="bg-white p-3 rounded-lg border">
        <div className="text-center">
          <div className="text-lg mb-1">🌟</div>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Nuevo:</span> Animación visual y
            vibración para seguir el ritmo
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tu teléfono vibrará para guiarte en cada fase de la respiración.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default BreathingTechniqueDetails;
