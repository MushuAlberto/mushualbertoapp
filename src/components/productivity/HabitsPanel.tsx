import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Target, Download } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "@/types";
import NewHabitForm from "./NewHabitForm";
import HabitList from "./HabitList";
import { exportToCSV } from "@/utils/exportToCSV";
import EnablePushNotifications from "./EnablePushNotifications";

const HabitsPanel: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('mushu_habits', []);
  const { toast } = useToast();

  const addHabit = (name: string, description?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      userId: 'current',
      name,
      description,
      frequency: 'daily',
      streak: 0,
      createdAt: new Date().toISOString()
    };
    setHabits([...habits, newHabit]);
    toast({
      title: "¡Hábito creado!",
      description: "Tu nuevo hábito ha sido añadido con éxito",
    });
  };

  const completeHabit = (habitId: string) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === habitId && habit.lastCompleted !== today) {
        const newStreak = habit.streak + 1;
        let sparklesEarned = 5;
        if (newStreak % 7 === 0) {
          sparklesEarned += 10;
        }
        toast({
          title: `¡Hábito completado! ✨`,
          description: `Racha: ${newStreak} días. Has ganado ${sparklesEarned} Sparkles!`,
        });
        return {
          ...habit,
          streak: newStreak,
          lastCompleted: today
        };
      }
      return habit;
    }));
  };

  const today = new Date().toDateString();
  const todaysHabits = habits.map(habit => ({
    ...habit,
    completedToday: habit.lastCompleted === today
  }));

  return (
    <TabsContent value="habits" className="space-y-6">
      <div className="flex flex-row justify-between">
        {/* Notificaciones */}
        <EnablePushNotifications />
        <div>
          <button
            className="inline-flex items-center px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm mb-2 gap-1"
            onClick={() => exportToCSV(habits, "habitos.csv")}
          >
            <Download className="h-4 w-4 mr-1" /> Exportar CSV
          </button>
        </div>
      </div>
      {/* Add New Habit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Nuevo Hábito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewHabitForm onAdd={addHabit} />
        </CardContent>
      </Card>
      {/* Habit List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Mis Hábitos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HabitList habits={todaysHabits} onComplete={completeHabit} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default HabitsPanel;
