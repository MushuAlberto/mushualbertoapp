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

const Productivity: React.FC = () => {
  const { toast } = useToast();
  const [tab, setTab] = React.useState("intelligent");

  return (
    <div className="space-y-6">
      <PomodoroTimer
        onComplete={() =>
          toast({
            title: "¡Completaste un Pomodoro!",
            description: "¿Listo para atacar otra tarea o tomar un descanso corto?",
          })
        }
      />

      <Tabs value={tab} defaultValue="intelligent" onValueChange={setTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="intelligent">IA</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="habits">Hábitos</TabsTrigger>
          <TabsTrigger value="kanban">Tablero</TabsTrigger>
          <TabsTrigger value="notifications">Alertas</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
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
