
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmotionAnalysis {
  emotion: string;
  emoji: string;
  confidence: number;
  summary: string;
}

export const useEmotionAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeEmotion = async (text: string): Promise<EmotionAnalysis | null> => {
    if (!text.trim()) return null;
    
    setLoading(true);
    
    try {
      console.log('Analyzing emotion for text:', text.substring(0, 50));
      
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: { text }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log('Emotion analysis completed:', data);
      return data;

    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Error en análisis",
        description: "No se pudo analizar la emoción. Usando análisis básico.",
        variant: "destructive"
      });
      
      // Fallback to basic analysis
      return basicEmotionAnalysis(text);
    } finally {
      setLoading(false);
    }
  };

  return { analyzeEmotion, loading };
};

// Fallback basic emotion analysis
function basicEmotionAnalysis(text: string): EmotionAnalysis {
  const lower = text.toLowerCase();
  
  if (lower.includes("feliz") || lower.includes("bien") || lower.includes("alegre")) {
    return { emotion: "Feliz", emoji: "😊", confidence: 0.7, summary: "Contenido positivo detectado" };
  }
  if (lower.includes("triste") || lower.includes("mal") || lower.includes("sol@")) {
    return { emotion: "Triste", emoji: "😢", confidence: 0.7, summary: "Contenido melancólico detectado" };
  }
  if (lower.includes("estres") || lower.includes("ansioso") || lower.includes("miedo")) {
    return { emotion: "Ansioso", emoji: "😰", confidence: 0.7, summary: "Señales de ansiedad detectadas" };
  }
  if (lower.includes("enojad")) {
    return { emotion: "Enojado", emoji: "😠", confidence: 0.7, summary: "Contenido de frustración detectado" };
  }
  
  return { emotion: "Neutro", emoji: "😐", confidence: 0.5, summary: "Tono neutral" };
}
