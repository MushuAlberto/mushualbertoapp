import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Heart, Brain, Award, Gamepad2, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import IntelligentBreathingCoach from "@/components/breathing/IntelligentBreathingCoach";
import MindGamesSection from "@/components/wellbeing/MindGamesSection";
import { IntelligentWellbeingPanel } from "@/components/wellbeing/IntelligentWellbeingPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const MOODS = [
  { mood: "Feliz", icon: "😊", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20", hex: "#EAB308" },
  { mood: "Motivado", icon: "💪", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20", hex: "#22C55E" },
  { mood: "Cansado", icon: "😴", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20", hex: "#3B82F6" },
  { mood: "Ansioso", icon: "😬", color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20", hex: "#EF4444" },
  { mood: "Tranquilo", icon: "🧘‍♂️", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20", hex: "#A855F7" },
  { mood: "Bajo", icon: "😞", color: "bg-muted text-muted-foreground border-border", hex: "#94A3B8" },
];

const Wellbeing: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [gameResults] = useLocalStorage<any[]>('mushu_game_results', []);

  // Mock Mood Distribution Data
  const moodData = [
    { name: 'Lun', value: 4, color: '#A855F7' },
    { name: 'Mar', value: 6, color: '#22C55E' },
    { name: 'Mié', value: 3, color: '#EF4444' },
    { name: 'Jue', value: 8, color: '#EAB308' },
    { name: 'Vie', value: 7, color: '#3B82F6' },
    { name: 'Sáb', value: 9, color: '#EAB308' },
    { name: 'Dom', value: 5, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Visual */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-8 rounded-[2.5rem] border border-emerald-500/10 shadow-inner">
        <div className="p-5 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/20">
          <Heart className="w-10 h-10" />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Tu Bienestar</h1>
          <p className="text-muted-foreground text-sm font-medium">Equilibrio mental y emocional guiado por Mushu</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Paz Interior</Badge>
            <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Foco</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Visual Mood Tracker */}
          <Card className="border-none bg-card/50 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Smile className="h-5 w-5 text-amber-500" />
                ¿Cómo va el día?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {MOODS.map((m) => (
                  <button
                    key={m.mood}
                    className={`rounded-[2rem] p-4 flex flex-col items-center gap-2 border-2 transition-all duration-300 ${
                      currentMood === m.mood
                        ? "bg-violet-600 border-violet-600 shadow-lg shadow-violet-500/20 scale-105"
                        : `${m.color} border-transparent hover:border-violet-500/30 hover:scale-105`
                    }`}
                    onClick={() => setCurrentMood(m.mood)}
                  >
                    <span className="text-3xl transition-transform group-hover:scale-110">{m.icon}</span>
                    <span className={`text-[11px] font-black uppercase tracking-tighter ${currentMood === m.mood ? "text-white" : ""}`}>{m.mood}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mood Trend Chart */}
          <Card className="border-none bg-card/50 shadow-sm rounded-[2rem] overflow-hidden">
             <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Tendencia Emocional
                </CardTitle>
             </CardHeader>
             <CardContent className="h-[200px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                    <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={20}>
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>

          {/* Tabs for Breathing & Games */}
          <Tabs defaultValue="breathing" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-[2rem] h-14">
              <TabsTrigger value="breathing" className="rounded-[1.5rem] data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                <Brain className="h-4 w-4 text-violet-500" />
                Respiración IA
              </TabsTrigger>
              <TabsTrigger value="games" className="rounded-[1.5rem] data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-emerald-500" />
                Juegos Mentales
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breathing" className="animate-fade-in">
              <IntelligentBreathingCoach />
            </TabsContent>

            <TabsContent value="games" className="animate-fade-in">
              <MindGamesSection />
            </TabsContent>
          </Tabs>
        </div>

        {/* Visual Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <IntelligentWellbeingPanel
            gameResults={gameResults}
            userProfile={{ mood: currentMood, adhdProfile: false }}
            onDifficultyUpdate={() => {}}
          />
          
          <Card className="border-none bg-gradient-to-br from-violet-500 to-pink-500 text-white p-6 rounded-[2.5rem] shadow-xl shadow-violet-500/20">
             <div className="space-y-4 text-center">
                <Sparkles className="w-10 h-10 mx-auto text-amber-300" />
                <h3 className="font-bold text-lg">Mantra de hoy</h3>
                <p className="text-sm font-medium italic text-white/80">"Un pequeño paso hoy es un gran salto mañana."</p>
                <div className="pt-2">
                  <Button variant="secondary" className="rounded-full px-6 bg-white/20 hover:bg-white/30 border-none text-white text-xs font-black uppercase tracking-widest">Inspirarme más</Button>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wellbeing;
