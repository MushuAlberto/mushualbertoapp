import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckSquare,
  BookOpen,
  DollarSign,
  Heart,
  Trophy,
  Sparkles,
  TrendingUp,
  Brain,
  ArrowRight,
  Zap,
  Target,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  title?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Read real data from localStorage
  const [tasks] = useLocalStorage<Task[]>('mushu_adhd_tasks', []);
  const [sparkles] = useLocalStorage<number>('mushu_sparkles', 0);
  const [journalEntries] = useLocalStorage<JournalEntry[]>('mushu_journal_entries', []);
  const [quickNotes] = useLocalStorage<any[]>('mushu_quick_notes', []);

  // Calculate real metrics
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayEntries = journalEntries.filter(e => {
    const entryDate = new Date(e.createdAt).toDateString();
    return entryDate === new Date().toDateString();
  });

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const greetingIcon = hour < 12 ? <Sun className="w-5 h-5 text-amber-500" /> : hour < 18 ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-indigo-400" />;
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'amigo';

  // Quick actions
  const quickActions = [
    { label: 'Nueva tarea', icon: CheckSquare, path: '/productivity', color: 'from-blue-500 to-cyan-500' },
    { label: 'Escribir', icon: BookOpen, path: '/diary', color: 'from-violet-500 to-pink-500' },
    { label: 'Respirar', icon: Heart, path: '/wellbeing', color: 'from-emerald-500 to-teal-500' },
    { label: 'Mis logros', icon: Trophy, path: '/rewards', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-6 md:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            {greetingIcon}
            <span className="text-white/80 text-sm font-medium">{greeting}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Hola, {userName} 👋
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-lg">
            {pendingTasks > 0
              ? `Tienes ${pendingTasks} tarea${pendingTasks > 1 ? 's' : ''} pendiente${pendingTasks > 1 ? 's' : ''}. ¡Tú puedes!`
              : todayEntries.length > 0
              ? '¡Excelente! Ya has escrito en tu diario hoy. Sigue así.'
              : 'Un nuevo día lleno de posibilidades. ¿Qué quieres lograr hoy?'}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">{sparkles} Sparkles</span>
            </div>
            {completedTasks > 0 && (
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1.5">
                <Zap className="w-4 h-4 text-emerald-300" />
                <span className="text-sm font-semibold">{completedTasks} completadas</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.path} to={action.path}>
            <Card className="group cursor-pointer border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tasks */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tareas</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{taskCompletionRate}%</span>
                  {taskCompletionRate > 50 && <TrendingUp className="w-4 h-4 text-green-500" />}
                </div>
                <Progress value={taskCompletionRate} className="mt-1.5 h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{completedTasks}/{totalTasks} completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 dark:bg-violet-500/20">
                <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Diario</p>
                <span className="text-xl font-bold">{journalEntries.filter(e => !e.title).length}</span>
                <p className="text-xs text-muted-foreground mt-1">reflexiones escritas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sparkles */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sparkles</p>
                <span className="text-xl font-bold">{sparkles}</span>
                <p className="text-xs text-muted-foreground mt-1">puntos acumulados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20">
                <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Notas</p>
                <span className="text-xl font-bold">{quickNotes.length}</span>
                <p className="text-xs text-muted-foreground mt-1">ideas capturadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckSquare className="w-4 h-4 text-blue-500" />
                Tareas Pendientes
              </CardTitle>
              <Link to="/productivity">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Ver todas <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingTasks > 0 ? (
              <div className="space-y-2">
                {tasks
                  .filter(t => t.status !== 'done')
                  .slice(0, 4)
                  .map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-sm truncate">{task.title}</span>
                    </div>
                  ))}
                {pendingTasks > 4 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{pendingTasks - 4} más...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  ¡Sin tareas pendientes! 🎉
                </p>
                <Link to="/productivity">
                  <Button variant="outline" size="sm" className="mt-3 text-xs">
                    Crear una tarea
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="w-4 h-4 text-violet-500" />
              Consejos del día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { icon: '🧘', text: 'Haz una pausa de 2 minutos para respirar profundo.' },
                { icon: '📝', text: 'Escribe 3 cosas por las que estés agradecido.' },
                { icon: '🎯', text: 'Elige UNA tarea importante y enfócate en ella.' },
                { icon: '💧', text: 'Recuerda tomar agua y estirarte.' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-lg shrink-0">{tip.icon}</span>
                  <p className="text-sm text-muted-foreground">{tip.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
