
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface NewHabitFormProps {
  onAdd: (name: string, description?: string) => void;
}

const NewHabitForm: React.FC<NewHabitFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="space-y-4">
      <Input
        placeholder="Nombre del hábito"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        onClick={() => {
          if (name.trim()) {
            onAdd(name, description);
            setName('');
            setDescription('');
          }
        }}
        className="w-full"
      >
        <Plus className="mr-2 h-5 w-5" />
        Añadir Hábito
      </Button>
    </div>
  );
};

export default NewHabitForm;
