import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Sparkles, Send } from 'lucide-react';

interface BrainDumpProps {
  onParse: (text: string) => Promise<void>;
  loading: boolean;
}

const BrainDump: React.FC<BrainDumpProps> = ({ onParse, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await onParse(text);
    setText('');
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Vaciado de Cerebro (Brain Dump)
        </CardTitle>
        <CardDescription>
          Escribe todo lo que tengas en la cabeza, sin orden. Mushu lo organizará por ti.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Ej: Tengo que comprar pan, no olvidar llamar al médico mañana a las 10, limpiar la pecera el domingo y terminar el reporte de ventas..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[150px] bg-white/50 backdrop-blur-sm"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !text.trim()}
            className="gap-2"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Organizar con IA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrainDump;
