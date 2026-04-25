import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Circle, CheckCircle, Download, Brain, Sparkles, RefreshCw, Target } from "lucide-react";
import { useADHDProductivity } from "@/hooks/useADHDProductivity";
import { Task } from "@/types";
import NewTaskForm from "./NewTaskForm";
import { exportToCSV } from "@/utils/exportToCSV";
import { exportToICS } from "@/utils/exportToICS";
import EnablePushNotifications from "./EnablePushNotifications";
import TaskFilters from "./TaskFilters";
import BrainDump from "./BrainDump";
import AtomicTaskItem from "./AtomicTaskItem";
import FocusMode from "./FocusMode";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TasksPanel: React.FC = () => {
  const {
    tasks,
    points,
    loading,
    decomposeTask,
    parseBrainDump,
    handleGuiltFreeReset,
    completeTask,
    setTasks
  } = useADHDProductivity();

  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [showBrainDump, setShowBrainDump] = useState(false);

  // Estados para búsqueda y filtros
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDueDate, setFilterDueDate] = useState("");

  const addTask = (title: string, description?: string, dueDate?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      userId: 'current',
      title,
      description,
      status: 'todo',
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: []
    };
    setTasks([newTask, ...tasks]);
  };

  const filteredTasks = tasks.filter((task) => {
    const kw = keyword.toLowerCase();
    const matchesKeyword =
      kw === "" ||
      task.title.toLowerCase().includes(kw) ||
      (task.description && task.description.toLowerCase().includes(kw));
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesDueDate =
      !filterDueDate ||
      (task.dueDate && task.dueDate.startsWith(filterDueDate));
    return matchesKeyword && matchesStatus && matchesDueDate;
  });

  const pendingTasks = filteredTasks.filter(task => task.status !== 'done');
  const completedTasks = filteredTasks.filter(task => task.status === 'done');

  return (
    <TabsContent value="tasks" className="space-y-6">
      {/* ADHD Dashboard Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-full text-white shadow-lg shadow-primary/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Panel de Enfoque</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                <Sparkles className="w-3 h-3 mr-1" />
                {points} Sparkles
              </Badge>
              <span className="text-xs text-muted-foreground">Logros de hoy</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowBrainDump(!showBrainDump)}
            className="gap-2"
          >
            <Brain className="w-4 h-4" />
            {showBrainDump ? 'Cerrar Notas' : 'Vaciado Rápido'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGuiltFreeReset}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reinicio sin Culpa
          </Button>
        </div>
      </div>

      {showBrainDump && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <BrainDump onParse={parseBrainDump} loading={loading} />
        </div>
      )}

      {/* Filtros y acciones */}
      <div className="flex flex-col md:flex-row md:justify-between gap-2">
        <EnablePushNotifications />
        <div className="flex flex-col md:flex-row md:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(filteredTasks, "tareas.csv")}
            className="gap-2"
          >
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToICS(filteredTasks, "tareas.ics")}
            className="gap-2"
          >
            <Download className="h-4 w-4" /> Calendar (.ics)
          </Button>
        </div>
      </div>

      <TaskFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        status={filterStatus}
        onStatusChange={setFilterStatus}
        dueDate={filterDueDate}
        onDueDateChange={setFilterDueDate}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nueva Tarea</CardTitle>
            </CardHeader>
            <CardContent>
              <NewTaskForm onAdd={addTask} />
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-700">
                <Circle className="mr-2 h-5 w-5 fill-amber-500 text-amber-500" />
                Pendientes ({pendingTasks.length})
              </CardTitle>
              <CardDescription>
                Toma una tarea y entra en modo enfoque.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.length > 0 ? (
                pendingTasks.map(task => (
                  <AtomicTaskItem 
                    key={task.id}
                    task={task}
                    onDecompose={decomposeTask}
                    onComplete={completeTask}
                    onFocus={setFocusTask}
                    loading={loading}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground italic">
                  No hay tareas pendientes. ¡Buen trabajo!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Completadas ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedTasks.slice(0, 5).map(task => (
                <AtomicTaskItem 
                  key={task.id}
                  task={task}
                  onDecompose={decomposeTask}
                  onComplete={completeTask}
                  onFocus={setFocusTask}
                  loading={loading}
                />
              ))}
              {completedTasks.length > 5 && (
                <p className="text-center text-xs text-muted-foreground">
                  Y {completedTasks.length - 5} más...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {focusTask && (
        <FocusMode 
          task={focusTask}
          onClose={() => setFocusTask(null)}
          onComplete={completeTask}
        />
      )}
    </TabsContent>
  );
};

export default TasksPanel;
