
import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { QuickNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FloatingQuickNote: React.FC = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useLocalStorage<QuickNote[]>('mushu_quick_notes', []);
  const [newNote, setNewNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: QuickNote = {
      id: Date.now().toString(),
      userId: 'current',
      content: newNote,
      createdAt: new Date().toISOString()
    };
    
    setNotes([note, ...notes]);
    setNewNote('');
    setIsOpen(false);
    toast({
      title: "¡Idea capturada! 💡",
      description: "Tu nota ha sido guardada exitosamente",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 shadow-lg z-40"
          size="lg"
        >
          <Lightbulb className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
            Captura tu idea
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Escribe tu idea rápida aquí..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={addNote} disabled={!newNote.trim()} className="flex-1">
              Guardar Idea
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FloatingQuickNote;
