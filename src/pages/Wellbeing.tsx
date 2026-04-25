import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smile, Heart, Brain, Award, Wind, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreathingExerciseSelector from "@/components/BreathingExerciseSelector";
import IntelligentBreathingCoach from "@/components/breathing/IntelligentBreathingCoach";
import MindGamesSection from "@/components/wellbeing/MindGamesSection";
import { IntelligentWellbeingPanel } from "@/components/wellbeing/IntelligentWellbeingPanel";

const TIPS = [
  {
    icon: <Brain className="h-5 w-5 mr-2 text-blue-500" />,
    title: "Escucha tu mente",
    text: "Dedica unos minutos al día a notar tus pensamientos sin juzgarlos. La autocompasión es una gran herramienta.",
  },
  {
    icon: <Heart className="h-5 w-5 mr-2 text-pink-500" />,
    title: "Cuida tu energía",
    text: "Regula tus actividades. Está bien decir 'no' para proteger tus límites.",
  },
  {
    icon: <Smile className="h-5 w-5 mr-2 text-amber-500" />,
    title: "Celebra pequeños logros",
    text: "Reconocer tus avances, aunque sean pequeños, ayuda a tu bienestar emocional.",
  },
  {
    icon: <Award className="h-5 w-5 mr-2 text-green-600" />,
    title: "Haz pausas intencionales",
    text: "Respirar profundo o estirarte unos minutos marca la diferencia. Prueba hacer una pausa consciente.",
  },
];

const MOODS = [
  { mood: "Feliz", icon: "😊", color: "bg-yellow-100 text-yellow-700" },
  { mood: "Motivado", icon: "💪", color: "bg-green-100 text-green-700" },
  { mood: "Cansado", icon: "😴", color: "bg-blue-100 text-blue-700" },
  { mood: "Ansioso", icon: "😬", color: "bg-red-100 text-red-700" },
  { mood: "Tranquilo", icon: "🧘‍♂️", color: "bg-purple-100 text-purple-700" },
  { mood: "Desanimado", icon: "😞", color: "bg-gray-100 text-gray-600" },
];

const Wellbeing: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  // Sample game results for testing
  const sampleGameResults = [
    {
      gameType: "Color Words",
      category: "attention" as const,
      score: 85,
      accuracy: 88,
      timeSpent: 120,
      difficulty: 2,
      completedAt: new Date().toISOString()
    },
    {
      gameType: "Memory Sequence",
      category: "memory" as const,
      score: 72,
      accuracy: 75,
      timeSpent: 180,
      difficulty: 3,
      completedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-8">
          <Card className="bg-gradient-to-r from-blue-100 to-indigo-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-7 w-7 text-pink-600" /> Bienestar &amp; Autocuidado
              </CardTitle>
              <CardDescription>
                Un espacio de apoyo y consejos para tu bienestar emocional y mental. Eres bienvenido tal y como eres.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-2">
                <span className="inline-block animate-pulse text-lg">✨</span>
                <span className="text-base">Recuerda que no necesitas ser perfecto para ser valioso.</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick mood selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5 text-yellow-500" /> ¿Cómo te sientes hoy?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map((m) => (
                  <Button
                    key={m.mood}
                    variant={currentMood === m.mood ? "default" : "outline"}
                    className={`rounded-full px-3 py-2 flex items-center justify-center gap-1 ${m.color} transition-all text-xs`}
                    onClick={() => setCurrentMood(m.mood)}
                  >
                    <span>{m.icon}</span> <span className="hidden sm:inline">{m.mood}</span>
                  </Button>
                ))}
              </div>
              {currentMood && (
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="text-base px-3 py-1.5">{currentMood}</Badge>
                  <div className="text-sm mt-2 text-muted-foreground">
                    ¡Gracias por registrar cómo te sientes! Mushu está aquí para ti.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main content with tabs */}
          <Tabs defaultValue="ai-breathing" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai-breathing" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                IA Respiración
              </TabsTrigger>
              <TabsTrigger value="breathing" className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Respiración
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Juegos Mentales
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-breathing" className="space-y-6">
              <IntelligentBreathingCoach />
            </TabsContent>

            <TabsContent value="breathing" className="space-y-6">
              <BreathingExerciseSelector mood={currentMood} />
            </TabsContent>

            <TabsContent value="games" className="space-y-6">
              <MindGamesSection />
            </TabsContent>
          </Tabs>

          {/* Tips block */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" /> Consejos para tu bienestar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {TIPS.map((tip, idx) => (
                  <li key={idx} className="flex items-start">
                    <div>{tip.icon}</div>
                    <div>
                      <span className="font-semibold">{tip.title}: </span>
                      <span className="text-gray-700">{tip.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar with intelligent wellbeing panel */}
        <div className="lg:col-span-1">
          <IntelligentWellbeingPanel 
            gameResults={sampleGameResults}
            userProfile={{ mood: currentMood, adhdProfile: true }}
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
