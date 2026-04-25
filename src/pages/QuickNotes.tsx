import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { QuickNote } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, Trash2, Brain, Mic } from 'lucide-react';
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
      description: noteType === 'text'
        ? "Tu idea ha sido guardada exitosamente"
        : "Tu nota de voz ha sido guardada exitosamente",
    });
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    toast({
      title: "Nota eliminada",
      description: "La nota ha sido eliminada",
    });
  };

  const processNotes = () => {
    toast({
      title: "¡Función próximamente!",
      description: "Mushu pronto podrá procesar tus notas para crear tareas y sugerencias",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Apuntes Rápidos</h1>
        <p className="text-gray-600">Captura todas tus ideas al vuelo como texto o voz</p>
      </div>
      {/* Tipo de nota */}
      <div className="flex justify-center mb-2">
        <Tabs defaultValue={noteType} onValueChange={val => setNoteType(val as "text" | "voice")}>
          <TabsList>
            <TabsTrigger value="text">✍️ Texto</TabsTrigger>
            <TabsTrigger value="voice">🎤 Voz</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* Add New Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {noteType === 'text'
              ? <><Plus className="mr-2 h-5 w-5" />Nueva Idea</>
              : <><Mic className="mr-2 h-5 w-5" /> Nueva Nota de Voz</>
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
            />
          ) : (
            <VoiceRecorder onRecord={data => setVoiceData(data)} />
          )}
          <div className="flex gap-2">
            <Button onClick={addNote} className="flex-1" disabled={
              noteType === 'text' ? !newNote.trim() : !voiceData
            }>
              {noteType === 'text'
                ? (<><Lightbulb className="mr-2 h-4 w-4" />Guardar Idea</>)
                : (<><Mic className="mr-2 h-4 w-4" />Guardar Audio</>)
              }
            </Button>
            {notes.length > 0 && (
              <Button variant="outline" onClick={processNotes}>
                <Brain className="mr-2 h-4 w-4" />
                Procesar con Mushu
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Ideas ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {note.audio ? (
                        // Nota de voz
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Mic className="text-blue-500" />
                            <span className="font-semibold text-blue-800">Nota de Voz</span>
                          </div>
                          <audio controls src={`data:audio/webm;base64,${note.audio}`} className="mb-2 w-full" />
                          {note.content && (
                            <p className="text-gray-700 whitespace-pre-wrap text-sm mt-1">{note.content}</p>
                          )}
                        </div>
                      ) : (
                        // Nota de texto
                        <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant="outline">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </Badge>
                        <Badge variant="outline">
                          {new Date(note.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">¡Captura tus ideas!</h3>
              <p className="text-gray-600 mb-4">
                Este es tu espacio para anotar pensamientos rápidos, recordatorios o cualquier idea que se te ocurra.
              </p>
              <p className="text-gray-500 text-sm">
                Mushu te ayudará a procesarlas y convertirlas en tareas o reflexiones útiles.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">💡 Consejos para tus apuntes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Anota ideas sin preocuparte por la estructura</li>
                <li>• Usa este espacio para "vaciar tu mente"</li>
                <li>• Mushu puede ayudarte a organizar tus notas más tarde</li>
                <li>• ¡No hay idea demasiado pequeña para capturar!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickNotes;
