
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Flame, Timer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task, Habit } from "@/types";

// Nueva lógica: max streak usando solo la propiedad 'streak'
function countHabitStreak(habits: Habit[]): number {
  return habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
}

const AchievementsPanel: React.FC = () => {
  const [tasks] = useLocalStorage<Task[]>("mushu_tasks", []);
  const [habits] = useLocalStorage<Habit[]>("mushu_habits", []);
  const [pomodoros] = useLocalStorage<any[]>("mushu_pomodoro_logs", []);
  
  // Calcula totals
  const tasksDone = tasks.filter(t => t.status === "done").length;
  const pomodorosTotal = pomodoros.reduce((a, b) => a + (b.completed || 0), 0);
  const maxStreak = countHabitStreak(habits);

  // Define logros
  const achievements = [
    {
      title: "Tareas: Novato",
      description: "Completa 5 tareas.",
      unlocked: tasksDone >= 5,
      icon: <CheckCircle className={tasksDone >= 5 ? "text-green-500" : "text-gray-300"} size={32} />,
    },
    {
      title: "Pomodoros: Constante",
      description: "Termina 10 pomodoros.",
      unlocked: pomodorosTotal >= 10,
      icon: <Timer className={pomodorosTotal >= 10 ? "text-amber-400" : "text-gray-300"} size={32} />,
    },
    {
      title: "Hábito: Racha",
      description: "Logra 3 días consecutivos de hábitos.",
      unlocked: maxStreak >= 3,
      icon: <Flame className={maxStreak >= 3 ? "text-red-500" : "text-gray-300"} size={32} />,
    },
    {
      title: "Productivo total",
      description: "¡Desbloquea todos los logros anteriores!",
      unlocked: tasksDone >= 5 && pomodorosTotal >= 10 && maxStreak >= 3,
      icon: <Award className={tasksDone >= 5 && pomodorosTotal >= 10 && maxStreak >= 3 ? "text-blue-600" : "text-gray-300"} size={32} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Logros y medallas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {achievements.map((a, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                {a.icon}
                <span className={`text-base font-semibold ${a.unlocked ? "" : "text-gray-400"}`}>{a.title}</span>
                <span className={`text-xs text-center ${a.unlocked ? "text-gray-500" : "text-gray-300"}`}>{a.description}</span>
                <Badge variant={a.unlocked ? "default" : "outline"}>
                  {a.unlocked ? "¡Desbloqueado!" : "Bloqueado"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsPanel;

