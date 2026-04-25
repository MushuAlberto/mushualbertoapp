
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task, Habit } from "@/types";

// Helpers
const getLast7Days = () => {
  const dates = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

interface PomodoroLog {
  date: string;
  completed: number;
}

// Permite el tracking de pomodoros completados diarios si decides guardar logs
const usePomodoroStats = (): PomodoroLog[] => {
  try {
    const [pomodoros] = useLocalStorage<any[]>("mushu_pomodoro_logs", []);
    return pomodoros;
  } catch {
    return [];
  }
};

const WeeklySummary: React.FC = () => {
  const [tasks] = useLocalStorage<Task[]>("mushu_tasks", []);
  const [habits] = useLocalStorage<Habit[]>("mushu_habits", []);
  const pomodoroLogs = usePomodoroStats();

  const last7Days = getLast7Days();

  // Cuenta tareas completadas cada día
  const taskStats = last7Days.map(day => ({
    date: day.slice(5), // MM-DD
    completadas: tasks.filter(
      t =>
        t.status === "done" &&
        t.updatedAt.slice(0, 10) === day
    ).length
  }));

  // Cuenta hábitos marcados ese día
  const habitStats = last7Days.map(day => ({
    date: day.slice(5),
    habitos: habits.filter(
      h => h.lastCompleted === new Date(day).toDateString()
    ).length
  }));

  // Cuenta pomodoros (si existe tracking)
  const pomodoroStats = last7Days.map(day => ({
    date: day.slice(5),
    pomodoros: (pomodoroLogs?.find(p => p.date === day)?.completed) || 0
  }));

  // Crea datos para la gráfica combinada
  const chartData = last7Days.map((day, idx) => ({
    date: day.slice(5),
    "T. Completadas": taskStats[idx].completadas,
    "Hábitos": habitStats[idx].habitos,
    "Pomodoros": pomodoroStats[idx].pomodoros
  }));

  // Cantidades totales semanales
  const tareasTotales = chartData.reduce((a, b) => a + b["T. Completadas"], 0);
  const habitosTotales = chartData.reduce((a, b) => a + b["Hábitos"], 0);
  const pomodorosTotales = chartData.reduce((a, b) => a + b["Pomodoros"], 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumen semanal de productividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 items-end mb-4">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-green-600">{tareasTotales}</div>
              <div className="text-xs text-gray-600">Tareas cumplidas</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-blue-600">{habitosTotales}</div>
              <div className="text-xs text-gray-600">Hábitos cumplidos</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-amber-500">{pomodorosTotales}</div>
              <div className="text-xs text-gray-600">Pomodoros</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="T. Completadas" fill="#22C55E" />
              <Bar dataKey="Hábitos" fill="#3B82F6" />
              <Bar dataKey="Pomodoros" fill="#F59E42" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySummary;
