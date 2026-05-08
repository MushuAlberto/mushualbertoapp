import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smile, Heart, Brain, Award, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntelligentBreathingCoach from "@/components/breathing/IntelligentBreathingCoach";
import MindGamesSection from "@/components/wellbeing/MindGamesSection";
import { IntelligentWellbeingPanel } from "@/components/wellbeing/IntelligentWellbeingPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const MOODS = [
  { mood: "Feliz", icon: "😊", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
  { mood: "Motivado", icon: "💪", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
  { mood: "Cansado", icon: "😴", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  { mood: "Ansioso", icon: "😬", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
  { mood: "Tranquilo", icon: "🧘‍♂️", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20" },
  { mood: "Desanimado", icon: "😞", color: "bg-muted text-muted-foreground border-border" },
];

const TIPS = [
  {
    icon: <Brain className="h-5 w-5 text-blue-500" />,
    title: "Escucha tu mente",
    text: "Dedica unos minutos al día a notar tus pensamientos sin juzgarlos.",
  },
  {
    icon: <Heart className="h-5 w-5 text-pink-500" />,
    title: "Cuida tu energía",
    text: "Regula tus actividades. Está bien decir 'no' para proteger tus límites.",
  },
  {
    icon: <Smile className="h-5 w-5 text-amber-500" />,
    title: "Celebra pequeños logros",
    text: "Reconocer tus avances, aunque sean pequeños, ayuda a tu bienestar.",
  },
  {
    icon: <Award className="h-5 w-5 text-green-600 dark:text-green-400" />,
    title: "Haz pausas intencionales",
    text: "Respirar profundo o estirarte unos minutos marca la diferencia.",
  },
];

const Wellbeing: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [gameResults] = useLocalStorage<any[]>('mushu_game_results', []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
          <Heart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bienestar</h1>
          <p className="text-muted-foreground text-sm">Tu espacio de autocuidado y equilibrio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Mood Selector */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Smile className="h-5 w-5 text-amber-500" />
                ¿Cómo te sientes hoy?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {MOODS.map((m) => (
                  <Button
                    key={m.mood}
                    variant={currentMood === m.mood ? "default" : "outline"}
                    className={`rounded-xl px-2 py-3 h-auto flex flex-col items-center gap-1 border transition-all ${
                      currentMood === m.mood
                        ? "bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
                        : m.color
                    }`}
                    onClick={() => setCurrentMood(m.mood)}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-[11px] font-medium">{m.mood}</span>
                  </Button>
                ))}
              </div>
              {currentMood && (
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="text-sm px-4 py-1.5">{currentMood}</Badge>
                  <p className="text-sm mt-2 text-muted-foreground">
                    ¡Gracias por registrar cómo te sientes! Mushu está aquí para ti.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="breathing" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="breathing" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Respiración IA
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Juegos Mentales
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breathing" className="space-y-6">
              <IntelligentBreathingCoach />
            </TabsContent>

            <TabsContent value="games" className="space-y-6">
              <MindGamesSection />
            </TabsContent>
          </Tabs>

          {/* Tips */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5 text-blue-500" />
                Consejos para tu bienestar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {TIPS.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="shrink-0 mt-0.5">{tip.icon}</div>
                    <div>
                      <span className="font-semibold text-sm text-foreground">{tip.title}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{tip.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <IntelligentWellbeingPanel
            gameResults={gameResults}
            userProfile={{ mood: currentMood, adhdProfile: false }}
            onDifficultyUpdate={(gameType, difficulty) => {
              console.log(`Updating ${gameType} difficulty to ${difficulty}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Wellbeing;
