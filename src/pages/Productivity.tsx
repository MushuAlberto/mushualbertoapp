import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PomodoroTimer from "@/components/PomodoroTimer";
import TasksPanel from "@/components/productivity/TasksPanel";
import HabitsPanel from "@/components/productivity/HabitsPanel";
import KanbanBoard from "@/components/productivity/KanbanBoard";
import WeeklySummary from "@/components/productivity/WeeklySummary";
import IntelligentProductivityPanel from "@/components/productivity/IntelligentProductivityPanel";
import { IntelligentNotificationsPanel } from "@/components/productivity/IntelligentNotificationsPanel";
import { useToast } from '@/hooks/use-toast';
import { CheckSquare } from 'lucide-react';

const Productivity: React.FC = () => {
  const { toast } = useToast();
  const [tab, setTab] = React.useState("intelligent");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Enfoque</h1>
          <p className="text-muted-foreground text-sm">Organiza tus tareas y mantén el ritmo</p>
        </div>
      </div>

      <PomodoroTimer
        onComplete={() =>
          toast({
            title: "¡Completaste un Pomodoro!",
            description: "¿Listo para otra tarea o un breve descanso?",
          })
        }
      />

      <Tabs value={tab} defaultValue="intelligent" onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="intelligent" className="text-xs sm:text-sm">IA</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tareas</TabsTrigger>
          <TabsTrigger value="habits" className="text-xs sm:text-sm">Hábitos</TabsTrigger>
          <TabsTrigger value="kanban" className="text-xs sm:text-sm">Tablero</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Alertas</TabsTrigger>
          <TabsTrigger value="summary" className="text-xs sm:text-sm">Resumen</TabsTrigger>
        </TabsList>

        <TabsContent value="intelligent" className="space-y-6">
          <IntelligentProductivityPanel />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TasksPanel />
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <HabitsPanel />
        </TabsContent>
        <TabsContent value="kanban" className="space-y-6">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <IntelligentNotificationsPanel />
        </TabsContent>
        <TabsContent value="summary" className="space-y-6">
          <WeeklySummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Productivity;
