
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  color: string;
  suitable: string[];
}

interface BreathingTechniqueCardProps {
  technique: BreathingTechnique;
  selected: boolean;
  onClick: (id: string) => void;
}

const BreathingTechniqueCard: React.FC<BreathingTechniqueCardProps> = ({
  technique,
  selected,
  onClick,
}) => (
  <div
    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
      selected ? "border-blue-400 bg-blue-50" : technique.color
    }`}
    onClick={() => onClick(technique.id)}
    data-testid={`technique-card-${technique.id}`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {technique.icon}
        <div>
          <h3 className="font-semibold text-gray-800">{technique.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{technique.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Timer className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{technique.duration}</span>
          </div>
        </div>
      </div>
      {selected && (
        <Badge variant="default">Seleccionada</Badge>
      )}
    </div>
  </div>
);

export default BreathingTechniqueCard;
