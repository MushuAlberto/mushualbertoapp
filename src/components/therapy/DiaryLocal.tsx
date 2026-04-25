import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEmotionAnalysis } from "@/hooks/useEmotionAnalysis";
import AvatarMushu from "@/components/AvatarMushu";

export function storeDiaryEntryLocal(entry: any) {
  const all: any[] = JSON.parse(localStorage.getItem("diary_entries_local") || "[]");
  all.unshift(entry);
  localStorage.setItem("diary_entries_local", JSON.stringify(all));
}

export function getDiaryEntriesLocal(): any[] {
  return JSON.parse(localStorage.getItem("diary_entries_local") || "[]");
}

const DiaryLocal: React.FC = () => {
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const { analyzeEmotion, loading: analyzing } = useEmotionAnalysis();

  const handleSend = async () => {
    if (!input.trim()) return;
    setSaving(true);

    try {
      // Analyze emotion using AI
      const analysis = await analyzeEmotion(input);
      
      const entry = {
        id: Date.now().toString(),
        content: input,
        summary: analysis?.summary || input.slice(0, 80) + "...",
        emotion: analysis?.emotion || "Neutro",
        emoji: analysis?.emoji || "😐",
        confidence: analysis?.confidence || 0.5,
        date: new Date().toISOString(),
        aiAnalyzed: !!analysis
      };
      
      storeDiaryEntryLocal(entry);
      setInput("");
    } catch (error) {
      console.error('Error saving diary entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const isProcessing = saving || analyzing;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <AvatarMushu size={40} />
        <span className="font-semibold">
          ¿Sobre qué te gustaría escribir hoy? Mushu te ayudará a analizar tus emociones.
        </span>
      </div>
      <div className="mb-4">
        <Textarea
          placeholder="¿Qué te gustaría escribir hoy? Mushu analizará tus emociones..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isProcessing}
          rows={4}
          className="mb-3"
        />
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSend} 
            disabled={isProcessing || !input.trim()}
            className="flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <Brain className="h-4 w-4 animate-pulse" />
                Analizando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
          <span className="text-xs text-muted-foreground">
            🧠 Análisis emocional con IA • Se guarda solo en tu dispositivo
          </span>
        </div>
        
        {analyzing && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Analizando emociones con IA...
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryLocal;
