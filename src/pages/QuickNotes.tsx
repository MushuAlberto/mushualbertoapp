import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { QuickNote } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, Trash2, Mic, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceRecorder from "@/components/VoiceRecorder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuickNotes: React.FC = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useLocalStorage<QuickNote[]>('mushu_quick_notes', []);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'text' | 'voice'>('text');
  const [voiceData, setVoiceData] = useState<string | null>(null);

  const addNote = () => {
    if (noteType === 'text' && !newNote.trim()) return;
    if (noteType === 'voice' && !voiceData) return;

    const note: QuickNote = {
      id: Date.now().toString(),
      userId: 'current',
      content: noteType === 'text' ? newNote : "",
      createdAt: new Date().toISOString(),
      audio: noteType === 'voice' ? voiceData! : undefined,
    };

    setNotes([note, ...notes]);
    setNewNote('');
    setVoiceData(null);
    toast({
      title: noteType === 'text' ? "¡Nota añadida!" : "¡Nota de voz guardada!",
      description: "Tu idea ha sido guardada exitosamente",
    });
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    toast({ title: "Nota eliminada" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-lg">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notas Rápidas</h1>
          <p className="text-muted-foreground text-sm">Captura todas tus ideas al vuelo</p>
        </div>
      </div>

      {/* Input Type Selector */}
      <div className="flex justify-center">
        <Tabs defaultValue={noteType} onValueChange={val => setNoteType(val as "text" | "voice")}>
          <TabsList>
            <TabsTrigger value="text">✍️ Texto</TabsTrigger>
            <TabsTrigger value="voice">🎤 Voz</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* New Note Input */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            {noteType === 'text'
              ? <><Plus className="mr-2 h-4 w-4" />Nueva Idea</>
              : <><Mic className="mr-2 h-4 w-4" />Nueva Nota de Voz</>
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {noteType === 'text' ? (
            <Textarea
              placeholder="Escribe tu idea, pensamiento o recordatorio aquí..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          ) : (
            <VoiceRecorder onRecord={data => setVoiceData(data)} />
          )}
          <Button onClick={addNote} className="w-full sm:w-auto" disabled={
            noteType === 'text' ? !newNote.trim() : !voiceData
          }>
            <Lightbulb className="mr-2 h-4 w-4" />
            {noteType === 'text' ? 'Guardar Idea' : 'Guardar Audio'}
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mis Ideas ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {note.audio ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Mic className="text-blue-500 w-4 h-4" />
                            <span className="font-semibold text-sm text-foreground">Nota de Voz</span>
                          </div>
                          <audio controls src={`data:audio/webm;base64,${note.audio}`} className="mb-2 w-full max-w-md" />
                          {note.content && (
                            <p className="text-muted-foreground whitespace-pre-wrap text-sm mt-1">{note.content}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-foreground whitespace-pre-wrap text-sm">{note.content}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {new Date(note.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-base font-medium text-foreground mb-1">¡Captura tus ideas!</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Este es tu espacio para anotar pensamientos rápidos, recordatorios o cualquier idea.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickNotes;
