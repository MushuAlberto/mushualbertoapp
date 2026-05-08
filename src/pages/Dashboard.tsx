import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CheckSquare,
  BookOpen,
  Heart,
  Trophy,
  Sparkles,
  TrendingUp,
  Brain,
  ArrowRight,
  Zap,
  Sun,
  Moon,
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

  const [tasks] = useLocalStorage<Task[]>('mushu_adhd_tasks', []);
  const [sparkles] = useLocalStorage<number>('mushu_sparkles', 0);
  const [journalEntries] = useLocalStorage<JournalEntry[]>('mushu_journal_entries', []);
  const [transactions] = useLocalStorage<any[]>('mushu_transactions', []);

  // Metrics
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart Data: Weekly Activity (Simulated from real count)
  const activityData = [
    { day: 'Lun', value: Math.floor(Math.random() * 10) + 2 },
    { day: 'Mar', value: Math.floor(Math.random() * 10) + 5 },
    { day: 'Mié', value: Math.floor(Math.random() * 10) + 3 },
    { day: 'Jue', value: Math.floor(Math.random() * 10) + 8 },
    { day: 'Vie', value: Math.floor(Math.random() * 10) + 6 },
    { day: 'Sáb', value: Math.floor(Math.random() * 10) + 4 },
    { day: 'Dom', value: completedTasks },
  ];

  // Chart Data: Expense Categories
  const financeData = [
    { name: 'Fijos', value: 400, color: '#8B5CF6' },
    { name: 'Ocio', value: 300, color: '#EC4899' },
    { name: 'Comida', value: 300, color: '#10B981' },
    { name: 'Otros', value: 200, color: '#F59E0B' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const greetingIcon = hour < 12 ? <Sun className="w-5 h-5 text-amber-500" /> : hour < 18 ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-indigo-400" />;
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'amigo';

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-8 md:p-10 text-white shadow-xl shadow-purple-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {greetingIcon}
              <span className="text-white/90 text-sm font-medium tracking-wide uppercase">{greeting}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">
              Hola, {userName}
            </h1>
            <p className="text-white/80 text-base max-w-md font-medium">
              {pendingTasks > 0
                ? `Hoy tienes ${pendingTasks} desafíos pendientes. ¡Vamos a por ellos!`
                : 'Todo está bajo control. Es un gran momento para un respiro.'}
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2 border border-white/10">
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span className="font-bold">{sparkles}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2 border border-white/10">
                <Zap className="w-5 h-5 text-emerald-300 fill-emerald-300" />
                <span className="font-bold">{taskCompletionRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block w-48 h-48 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 rotate-3">
             <div className="h-full w-full flex flex-col justify-center items-center gap-2">
                <Trophy className="w-12 h-12 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Nivel Pro</span>
                <Progress value={taskCompletionRate} className="h-2 w-full bg-white/20" />
             </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 border-none bg-card/50 backdrop-blur shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              Tu Actividad Semanal
            </CardTitle>
            <Badge variant="secondary" className="rounded-lg">Últimos 7 días</Badge>
          </CardHeader>
          <CardContent className="h-[250px] pt-4 flex items-center justify-center bg-muted/20 rounded-2xl m-4">
            <p className="text-muted-foreground">Gráfico de Actividad Semanal (Temporalmente desactivado)</p>
            {/* 
            <ResponsiveContainer width="100%" height="100%">
              ...
            </ResponsiveContainer>
            */}
          </CardContent>
        </Card>

        {/* Finance Pie */}
        <Card className="border-none bg-card/50 backdrop-blur shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Tus Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center bg-muted/10 rounded-2xl m-4">
            <p className="text-muted-foreground text-xs text-center">Gráfico de Gastos (Desactivado)</p>
          </CardContent>
          <div className="px-6 pb-6 grid grid-cols-2 gap-2">
            {financeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Access Icons */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {[
          { icon: CheckSquare, path: '/productivity', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: BookOpen, path: '/diary', color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { icon: DollarSign, path: '/expenses', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: Heart, path: '/wellbeing', color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { icon: Trophy, path: '/rewards', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { icon: Brain, path: '/wellbeing', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { icon: Sun, path: '/profile', color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { icon: Moon, path: '/quick-notes', color: 'text-slate-500', bg: 'bg-slate-500/10' },
        ].map((item, i) => (
          <Link key={i} to={item.path} className="group">
            <div className={`aspect-square rounded-3xl ${item.bg} flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md`}>
              <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
            </div>
          </Link>
        ))}
      </div>

      {/* Visual Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-none bg-card/50 shadow-sm rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Tareas de Hoy</CardTitle>
              <Link to="/productivity"><Button variant="ghost" size="sm" className="rounded-full"><ArrowRight className="w-4 h-4" /></Button></Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.filter(t => t.status !== 'done').slice(0,3).map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 group hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{task.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pendiente</p>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">¡Todo despejado! 🌈</p>}
            </CardContent>
         </Card>

         <Card className="border-none bg-card/50 shadow-sm rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Inspiración</CardTitle>
              <Brain className="w-5 h-5 text-violet-500" />
            </CardHeader>
            <CardContent>
               <div className="p-6 rounded-[2rem] bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 text-center space-y-3">
                  <span className="text-4xl">✨</span>
                  <p className="text-sm font-medium italic text-violet-700 dark:text-violet-300">
                    "La mejor forma de predecir el futuro es creándolo."
                  </p>
                  <p className="text-[10px] uppercase font-black text-violet-400 tracking-tighter">Mushu Wisdom</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default Dashboard;
