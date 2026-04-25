
import React from "react";
import { Habit } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";

interface HabitListProps {
  habits: (Habit & { completedToday: boolean })[];
  onComplete: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onComplete }) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <Circle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">¡No tienes hábitos aún!</p>
        <p className="text-gray-500 text-sm">Añade tu primer hábito para comenzar a construir rutinas positivas</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div key={habit.id} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">{habit.name}</h3>
              {habit.description && (
                <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline">
                  Racha: {habit.streak} días
                </Badge>
                <Badge variant={habit.completedToday ? 'default' : 'secondary'}>
                  {habit.completedToday ? 'Completado hoy' : 'Pendiente'}
                </Badge>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onComplete(habit.id)}
              disabled={habit.completedToday}
              className={habit.completedToday ? 'bg-green-600' : ''}
            >
              {habit.completedToday
                ? <CheckCircle className="h-4 w-4" />
                : <Circle className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default HabitList;
