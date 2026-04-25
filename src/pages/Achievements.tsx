import React, { useState } from "react";
import AchievementsPanel from "@/components/productivity/AchievementsPanel";
import { IntelligentGamificationPanel } from "@/components/productivity/IntelligentGamificationPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Sparkles } from "lucide-react";

const Achievements: React.FC = () => {
  const [tab, setTab] = useState('traditional');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-purple-600" />
          Logros y Recompensas
        </h1>
        <p className="text-muted-foreground">
          Sistema de gamificación tradicional e inteligente con IA
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="traditional" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Logros Tradicionales
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Gamificación IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traditional">
          <AchievementsPanel />
        </TabsContent>

        <TabsContent value="ai">
          <IntelligentGamificationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements;
