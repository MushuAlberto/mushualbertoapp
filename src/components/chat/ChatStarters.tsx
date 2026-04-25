
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const conversationStarters = [
  "¿Cómo puedo organizar mejor mi día?",
  "Me siento un poco abrumado/a hoy",
  "¿Qué técnicas de concentración me recomiendas?",
  "Necesito motivación para mis tareas",
  "¿Cómo puedo manejar mi ansiedad?",
  "Quiero mejorar mis hábitos diarios"
];

interface ChatStartersProps {
  onStarterClick: (starterText: string) => void;
}

const ChatStarters: React.FC<ChatStartersProps> = ({
  onStarterClick
}) => (
  <Card>
    <CardHeader>
      <CardTitle>¿No sabes cómo empezar?</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {conversationStarters.map((starter, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onStarterClick(starter)}
            className="text-left justify-start h-auto py-3 px-4"
          >
            "{starter}"
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ChatStarters;
