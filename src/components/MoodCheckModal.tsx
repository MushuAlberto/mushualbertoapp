
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Activity } from "lucide-react";

const MOODS = [
  {
    key: "Happy",
    label: "Feliz",
    icon: <Smile className="text-yellow-500 mr-2" />,
  },
  {
    key: "Productive",
    label: "Productivo",
    icon: <Activity className="text-green-500 mr-2" />,
  },
  {
    key: "Okay",
    label: "Ok",
    icon: <Meh className="text-blue-400 mr-2" />,
  },
  {
    key: "Tired",
    label: "Cansado",
    icon: <Meh className="text-gray-400 mr-2" />,
  },
  {
    key: "Anxious",
    label: "Ansioso",
    icon: <Frown className="text-red-400 mr-2" />,
  },
  {
    key: "Sad",
    label: "Triste",
    icon: <Frown className="text-blue-700 mr-2" />,
  },
];

const SUGGESTIONS: Record<string, { message: string; activity: string }> = {
  Happy: {
    message: "¡Qué alegría verte tan feliz! 😊",
    activity: "Podrías aprovechar el ánimo para avanzar en ese proyecto pendiente o felicitarte con tu música favorita.",
  },
  Productive: {
    message: "¡Energía productiva detectada! 💪",
    activity: "¿Qué te parece usar un Pomodoro para aprovechar el enfoque? O haz una lista pequeña de logros rápidos.",
  },
  Okay: {
    message: "¡Gracias por compartir cómo te sientes!",
    activity: "Quizá un paseo corto o escribir en tu diario te ayude a descubrir algo positivo hoy.",
  },
  Tired: {
    message: "¡Descansar es válido! 💤",
    activity: "Te sugiero una pausa breve, respirar profundo, o escuchar música suave.",
  },
  Anxious: {
    message: "Entiendo ese sentimiento. No estás solx. 🤗",
    activity: "¿Quieres probar una breve meditación guiada? O simplemente toma agua y mueve el cuerpo un poco.",
  },
  Sad: {
    message: "Días grises pasan, cuenta con Mushu. 💙",
    activity: "¿Te gustaría escribir un poco, dibujar, o abrazar tu peluche favorito?",
  },
};

const LOCAL_STORAGE_KEY = "mushu-mood-check-last";

const shouldShowMoodCheck = (): boolean => {
  const lastCheck = localStorage.getItem(LOCAL_STORAGE_KEY);
  const today = new Date().toDateString();
  return lastCheck !== today;
};

const setMoodCheckDone = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toDateString());
};

const MoodCheckModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (shouldShowMoodCheck()) setOpen(true);
  }, []);

  const handleSelect = (mood: string) => {
    setSelected(mood);
    setMoodCheckDone();
  };

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm mx-auto rounded-lg">
        {!selected ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center mb-2">¿Cómo te sientes ahora?</DialogTitle>
              <p className="text-center text-gray-600 text-sm mb-4">
                Elegir tu estado de ánimo me ayuda a sugerirte actividades notificadas para ti. Puedes actualizarlo cuantas veces quieras.
              </p>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              {MOODS.map((mood) => (
                <Button
                  key={mood.key}
                  variant="outline"
                  className="flex justify-start items-center py-6 px-3 transition-all hover:scale-105"
                  onClick={() => handleSelect(mood.key)}
                >
                  {mood.icon}
                  <span>{mood.label}</span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <h3 className="text-lg mb-2">{SUGGESTIONS[selected].message}</h3>
            <div className="bg-yellow-50 p-3 rounded font-medium text-yellow-900">{SUGGESTIONS[selected].activity}</div>
            <Button className="mt-4 w-full" onClick={handleClose}>¡Gracias, Mushu!</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MoodCheckModal;
