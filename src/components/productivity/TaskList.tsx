
import React from "react";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  toggleStatus: (id: string) => void;
  completed?: boolean;
  maxShow?: number; // For completed tasks (show top 5)
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleStatus, completed = false, maxShow }) => {
  const showTasks = maxShow ? tasks.slice(0, maxShow) : tasks;

  if (showTasks.length === 0) {
    return (
      <div className="text-center py-8">
        {completed ? (
          <>
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Aún no has completado tareas</p>
            <p className="text-gray-500 text-sm">¡Completa tu primera tarea para ganar Sparkles!</p>
          </>
        ) : (
          <>
            <Circle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">¡No tienes tareas pendientes!</p>
            <p className="text-gray-500 text-sm">Añade una nueva tarea para comenzar</p>
          </>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {showTasks.map(task => (
        <div
          key={task.id}
          className={`p-4 border rounded-lg ${completed ? "bg-green-50" : "hover:bg-gray-50 transition-colors"}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium ${completed ? "text-green-800" : ""}`}>{task.title}</h3>
              {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
              {completed ? (
                <Badge variant="default" className="mt-2 bg-green-600">
                  Completada
                </Badge>
              ) : (
                <Badge variant={task.status === 'inprogress' ? 'default' : 'secondary'} className="mt-2">
                  {task.status === 'inprogress' ? 'En progreso' : 'Por hacer'}
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant={completed ? "ghost" : "outline"}
              onClick={() => toggleStatus(task.id)}
            >
              {completed ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
