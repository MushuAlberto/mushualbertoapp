
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface NewTaskFormProps {
  onAdd: (title: string, description?: string, dueDate?: string) => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string>('');

  return (
    <div className="space-y-4">
      <Input
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <label className="block mb-1 text-sm text-gray-600">Fecha y hora límite (opcional)</label>
        <Input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full"
        />
      </div>
      <Button
        onClick={() => {
          if (title.trim()) {
            onAdd(title, description, dueDate ? new Date(dueDate).toISOString() : undefined);
            setTitle('');
            setDescription('');
            setDueDate('');
          }
        }}
        className="w-full"
      >
        <Plus className="mr-2 h-5 w-5" />
        Añadir Tarea
      </Button>
    </div>
  );
};

export default NewTaskForm;

