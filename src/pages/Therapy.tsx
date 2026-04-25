import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiaryLocal from '@/components/therapy/DiaryLocal';
import DiaryHistory from '@/components/therapy/DiaryHistory';
import IntelligentTherapyPanel from '@/components/therapy/IntelligentTherapyPanel';

const Therapy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <Tabs defaultValue="intelligent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="intelligent">Terapia Inteligente</TabsTrigger>
          <TabsTrigger value="diary">Diario Emocional</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="intelligent">
          <IntelligentTherapyPanel />
        </TabsContent>
        
        <TabsContent value="diary">
          <DiaryLocal />
        </TabsContent>
        
        <TabsContent value="history">
          <DiaryHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Therapy;