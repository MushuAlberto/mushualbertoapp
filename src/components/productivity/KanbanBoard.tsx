
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

const STATUSES = [
  { key: "todo", label: "Por hacer", color: "bg-amber-100" },
  { key: "inprogress", label: "En progreso", color: "bg-blue-100" },
  { key: "done", label: "Hecho", color: "bg-green-100" },
];

interface DraggedTask {
  id: string;
  from: "todo" | "inprogress" | "done";
}

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("mushu_tasks", []);
  const [dragged, setDragged] = React.useState<DraggedTask | null>(null);

  // Agrupar tareas por estado
  const grouped = React.useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === "todo"),
      inprogress: tasks.filter((t) => t.status === "inprogress"),
      done: tasks.filter((t) => t.status === "done"),
    }),
    [tasks]
  );

  // Cambiar status al soltar
  const onDrop = (status: "todo" | "inprogress" | "done") => {
    if (dragged) {
      setTasks(
        tasks.map((task) =>
          task.id === dragged.id
            ? { ...task, status, updatedAt: new Date().toISOString() }
            : task
        )
      );
      setDragged(null);
    }
  };

  // Arrastrar y soltar handlers
  const handleDragStart = (taskId: string, from: "todo" | "inprogress" | "done") => {
    setDragged({ id: taskId, from });
  };
  const handleDragEnd = () => setDragged(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        {STATUSES.map((col) => (
          <Card
            key={col.key}
            className={`min-h-[350px] ${col.color} transition-all`}
            // Permitir soltar
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col.key as "todo" | "inprogress" | "done")}
          >
            <CardHeader>
              <CardTitle>{col.label} ({grouped[col.key as keyof typeof grouped].length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 min-h-[200px]">
                {grouped[col.key as keyof typeof grouped].length === 0 && (
                  <div className="text-center text-gray-400 italic">Sin tareas</div>
                )}
                {grouped[col.key as keyof typeof grouped].map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-3 rounded bg-white border shadow-sm cursor-grab hover-scale"
                    draggable
                    onDragStart={() => handleDragStart(task.id, task.status as any)}
                    onDragEnd={handleDragEnd}
                  >
                    <span>
                      <GripVertical className="text-gray-300" />
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-gray-500">{task.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500 text-right">
        Arrastra tareas para avanzar en tu flujo ✨
      </div>
    </div>
  );
};

export default KanbanBoard;
