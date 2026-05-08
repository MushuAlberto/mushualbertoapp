import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinanceDashboard from '@/components/finances/FinanceDashboard';
import IntelligentFinancePanel from '@/components/finances/IntelligentFinancePanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Transaction } from '@/types';
import { DollarSign, Brain, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

const Expenses: React.FC = () => {
  const [transactions] = useLocalStorage<Transaction[]>('mushu_transactions', []);

  // Visual summary data
  const totalBalance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  const monthSavings = 1250; // Mock

  const trendData = [
    { day: '1', value: 1200 },
    { day: '5', value: 1400 },
    { day: '10', value: 1100 },
    { day: '15', value: 1500 },
    { day: '20', value: 1300 },
    { day: '25', value: 1600 },
    { day: '30', value: 1800 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Visual Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <DollarSign className="w-40 h-40" />
         </div>
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
               <DollarSign className="w-5 h-5 text-emerald-300" />
               <span className="text-xs font-black uppercase tracking-widest text-emerald-100">Estado Financiero</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
               <div>
                  <p className="text-sm font-medium text-emerald-100/80">Balance Actual</p>
                  <h1 className="text-4xl md:text-5xl font-black">${totalBalance.toLocaleString()}</h1>
               </div>
               <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[120px]">
                     <p className="text-[10px] font-black uppercase tracking-tighter text-emerald-100/60 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-300" /> Ahorro
                     </p>
                     <p className="text-xl font-bold">${monthSavings}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[120px]">
                     <p className="text-[10px] font-black uppercase tracking-tighter text-emerald-100/60 flex items-center gap-1">
                        <ArrowDownRight className="w-3 h-3 text-rose-300" /> Gastos
                     </p>
                     <p className="text-xl font-bold">$840</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Mini Trend Chart */}
      <Card className="border-none bg-card/50 shadow-sm rounded-[2rem] overflow-hidden">
         <CardContent className="h-[120px] p-6 flex items-center justify-between gap-6">
            <div className="space-y-1">
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tendencia 30 días</p>
               <p className="text-xl font-bold flex items-center gap-2">
                  +12.5% <TrendingUp className="w-4 h-4 text-emerald-500" />
               </p>
            </div>
            <div className="flex-1 h-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                     <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={false} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </CardContent>
      </Card>

      <Tabs defaultValue="intelligence" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-[2rem] h-14">
          <TabsTrigger value="intelligence" className="rounded-[1.5rem] data-[state=active]:bg-background font-bold flex items-center gap-2">
            <Brain className="h-4 w-4 text-emerald-500" />
            IA Financiera
          </TabsTrigger>
          <TabsTrigger value="management" className="rounded-[1.5rem] data-[state=active]:bg-background font-bold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            Movimientos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence" className="animate-fade-in">
          <IntelligentFinancePanel />
        </TabsContent>

        <TabsContent value="management" className="animate-fade-in">
          <FinanceDashboard transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;