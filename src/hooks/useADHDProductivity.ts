import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from './useLocalStorage';
import { Task, Subtask } from '@/types';

export const useADHDProductivity = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [tasks, setTasks] = useLocalStorage<Task[]>('mushu_tasks', []);
  const [points, setPoints] = useLocalStorage<number>('mushu_dopamine_points', 0);

  // 1. Descomposición Atómica (AI)
  const decomposeTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('productivity-insights', {
        body: {
          action: 'decompose_task',
          context: { taskTitle: task.title }
        }
      });

      if (error) throw error;

      const subtasks: Subtask[] = data.subTasks.map((st: any) => ({
        id: (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
        taskId: taskId,
        title: st.title,
        completed: false,
        createdAt: new Date().toISOString()
      }));

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, subtasks, updatedAt: new Date().toISOString() } : t
      ));

      toast({
        title: "¡Tarea desglosada!",
        description: "Mushu ha dividido tu tarea en pasos pequeños y manejables.",
      });
    } catch (error) {
      console.error('Error decomposing task:', error);
      toast({
        title: "Error",
        description: "No pude desglosar la tarea. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [tasks, setTasks, toast]);

  // 2. Vaciado de Cerebro (Brain Dump)
  const parseBrainDump = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('productivity-insights', {
        body: {
          action: 'parse_brain_dump',
          context: { text }
        }
      });

      if (error) throw error;

      const newTasks: Task[] = data.tasks.map((t: any) => ({
        id: (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)),
        userId: 'current',
        title: t.title,
        description: t.description,
        status: 'todo' as const,
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: t.dueDate
      }));

      setTasks(prev => [...newTasks, ...prev]);

      toast({
        title: "¡Cerebro vaciado!",
        description: `He extraído ${newTasks.length} tareas de tu nota.`,
      });
    } catch (error) {
      console.error('Error parsing brain dump:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu nota.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [setTasks, toast]);

  // 3. Gestión de la Culpa (Reset)
  const handleGuiltFreeReset = useCallback(() => {
    const now = new Date();
    let count = 0;

    setTasks(prev => prev.map(t => {
      if (t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now) {
        count++;
        return { ...t, dueDate: undefined, updatedAt: new Date().toISOString() };
      }
      return t;
    }));

    if (count > 0) {
      toast({
        title: "Reinicio sin Culpa ❤️",
        description: `He limpiado ${count} tareas atrasadas. No pasa nada, hoy es un nuevo comienzo.`,
      });
    } else {
      toast({
        title: "Todo al día",
        description: "No tienes tareas atrasadas por ahora.",
      });
    }
  }, [setTasks, toast]);

  // 4. Completar Tarea con Dopamina
  const completeTask = useCallback((taskId: string, subTaskId?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (subTaskId) {
          const newSubtasks = t.subtasks.map(st => 
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          );
          
          const allDone = newSubtasks.every(st => st.completed);
          if (allDone && t.status !== 'done') {
            setPoints(p => p + 15);
            toast({
              title: "¡Espectacular!",
              description: `Completaste todos los pasos de: ${t.title}. +15 puntos.`,
            });
          } else if (newSubtasks.find(st => st.id === subTaskId)?.completed) {
            setPoints(p => p + 2);
          }

          return { ...t, subtasks: newSubtasks, status: allDone ? 'done' as const : t.status, updatedAt: new Date().toISOString() };
        } else {
          const newStatus = t.status === 'done' ? 'todo' as const : 'done' as const;
          if (newStatus === 'done') {
            setPoints(p => p + 10);
            toast({
              title: "¡Logrado!",
              description: `+10 puntos. Mushu está orgulloso.`,
            });
          }
          return { ...t, status: newStatus, updatedAt: new Date().toISOString() };
        }
      }
      return t;
    }));
  }, [setTasks, setPoints, toast]);

  return {
    tasks,
    points,
    loading,
    decomposeTask,
    parseBrainDump,
    handleGuiltFreeReset,
    completeTask,
    setTasks
  };
};

