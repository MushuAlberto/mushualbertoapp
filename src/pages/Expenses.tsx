import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinanceDashboard from '@/components/finances/FinanceDashboard';
import IntelligentFinancePanel from '@/components/finances/IntelligentFinancePanel';

const Expenses: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <Tabs defaultValue="intelligence" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="intelligence">Inteligencia Financiera</TabsTrigger>
          <TabsTrigger value="management">Gestión de Gastos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="intelligence">
          <IntelligentFinancePanel />
        </TabsContent>
        
        <TabsContent value="management">
          <FinanceDashboard transactions={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;