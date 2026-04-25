
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TaskFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  dueDate: string;
  onDueDateChange: (date: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  dueDate,
  onDueDateChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-3 w-full">
      {/* Palabra clave */}
      <div className="flex flex-col w-full md:w-1/3">
        <Label htmlFor="task-search">Buscar</Label>
        <Input
          id="task-search"
          placeholder="Busca por título o descripción"
          value={keyword}
          onChange={e => onKeywordChange(e.target.value)}
          className="w-full"
        />
      </div>
      {/* Estado */}
      <div className="flex flex-col w-full md:w-1/4">
        <Label htmlFor="task-status">Estado</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="task-status" className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="todo">Por hacer</SelectItem>
            <SelectItem value="inprogress">En progreso</SelectItem>
            <SelectItem value="done">Completadas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Fecha de vencimiento */}
      <div className="flex flex-col w-full md:w-1/4">
        <Label htmlFor="task-due">Vence en</Label>
        <Input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={e => onDueDateChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TaskFilters;
