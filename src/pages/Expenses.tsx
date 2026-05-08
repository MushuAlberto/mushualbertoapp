import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinanceDashboard from '@/components/finances/FinanceDashboard';
import IntelligentFinancePanel from '@/components/finances/IntelligentFinancePanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Transaction } from '@/types';
import { DollarSign, Brain, BarChart3 } from 'lucide-react';

const Expenses: React.FC = () => {
  const [transactions] = useLocalStorage<Transaction[]>('mushu_transactions', []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finanzas</h1>
          <p className="text-muted-foreground text-sm">Controla tus gastos e ingresos</p>
        </div>
      </div>

      <Tabs defaultValue="intelligence" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="intelligence" className="flex items-center gap-1.5">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Inteligencia</span> Financiera
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            Gestión de Gastos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence">
          <IntelligentFinancePanel />
        </TabsContent>

        <TabsContent value="management">
          <FinanceDashboard transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;