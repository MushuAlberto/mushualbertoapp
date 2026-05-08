import React, { useState, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTextToVoice } from "@/hooks/useTextToVoice";
import { useIntelligentJournal } from "@/hooks/useIntelligentJournal";
import JournalEntryList from "@/components/journal/JournalEntryList";
import JournalEntryInput from "@/components/journal/JournalEntryInput";
import IntelligentJournalPanel from "@/components/journal/IntelligentJournalPanel";
import JournalAnalysisDisplay from "@/components/journal/JournalAnalysisDisplay";
import IntelligentTherapyPanel from "@/components/therapy/IntelligentTherapyPanel";
import DiaryHistory from "@/components/therapy/DiaryHistory";
import { Brain, BookOpen, Heart, Clock, Sparkles } from "lucide-react";

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  analysis?: any;
}

const MyDiary: React.FC = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('mushu_journal_entries', []);
  const { speak } = useTextToVoice();
  const { analyzeJournalEntry } = useIntelligentJournal();
  const [currentText, setCurrentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!currentText.trim()) return;

    setLoading(true);
    setAnalyzing(true);

    const recentEntryTexts = entries.slice(0, 5).map(e => e.content);
    const analysis = await analyzeJournalEntry(currentText.trim(), recentEntryTexts);

    const userEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentText.trim(),
      createdAt: new Date().toISOString(),
      analysis: analysis
    };

    const aiMessage = analysis?.supportResponse || `🤗 He leído tu entrada. Te felicito por expresarte, este espacio es tuyo para reflexionar y crecer.`;

    const aiEntry: JournalEntry = {
      id: (Date.now() + 1).toString(),
      title: "Respuesta de Mushu",
      content: aiMessage,
      createdAt: new Date().toISOString(),
    };

    setEntries([aiEntry, userEntry, ...entries]);
    setCurrentAnalysis(analysis);

    try {
      await speak({
        text: aiMessage,
        voiceId: "TX3LPaxmHKxFdv7VOQHJ",
        model: "eleven_multilingual_v2",
        language: "es"
      });
    } catch (e) {
      // TTS is optional
    }

    setCurrentText("");
    if (textareaRef.current) textareaRef.current.focus();
    setLoading(false);
    setAnalyzing(false);

    if (analysis) {
      setActiveTab('analysis');
    }
  };

  const handlePromptSelect = (promptText: string) => {
    setCurrentText(promptText);
    setActiveTab('write');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mi Diario</h1>
            <p className="text-muted-foreground text-sm">Tu espacio seguro para reflexionar y crecer</p>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {entries.filter(e => !e.title).length} reflexiones
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Última: {entries[0] ? new Date(entries[0].createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="write" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Escribir</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Análisis</span>
              </TabsTrigger>
              <TabsTrigger value="therapy" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Terapia</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Historial</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="mt-4">
              <Card className="border-border">
                <JournalEntryList entries={entries as any} loading={loading} />
                <JournalEntryInput
                  currentText={currentText}
                  setCurrentText={setCurrentText}
                  handleSend={handleSend}
                  loading={loading || analyzing}
                  textareaRef={textareaRef}
                />
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              {currentAnalysis ? (
                <JournalAnalysisDisplay analysis={currentAnalysis} />
              ) : (
                <Card className="p-8 text-center border-border">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No hay análisis disponible</h3>
                  <p className="text-muted-foreground">
                    Escribe una entrada en tu diario para obtener un análisis emocional detallado con IA
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="therapy" className="mt-4">
              <IntelligentTherapyPanel />
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <DiaryHistory />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <IntelligentJournalPanel
            recentEntries={entries}
            onPromptSelect={handlePromptSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MyDiary;
