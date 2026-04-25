
import React from "react";
import BreathingTechniqueCard from "./BreathingTechniqueCard";

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  color: string;
  suitable: string[];
}

interface BreathingTechniqueListProps {
  techniques: BreathingTechnique[];
  selectedTechnique: string | null;
  onSelect: (id: string) => void;
}

const BreathingTechniqueList: React.FC<BreathingTechniqueListProps> = ({
  techniques,
  selectedTechnique,
  onSelect,
}) => (
  <div className="grid gap-4">
    {techniques.map((technique) => (
      <BreathingTechniqueCard
        key={technique.id}
        technique={technique}
        selected={selectedTechnique === technique.id}
        onClick={onSelect}
      />
    ))}
  </div>
);

export default BreathingTechniqueList;
