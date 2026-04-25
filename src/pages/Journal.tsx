import React, { useState, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTextToVoice } from "@/hooks/useTextToVoice";
import { useIntelligentJournal } from "@/hooks/useIntelligentJournal";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalEntryList from "@/components/journal/JournalEntryList";
import JournalEntryInput from "@/components/journal/JournalEntryInput";
import IntelligentJournalPanel from "@/components/journal/IntelligentJournalPanel";
import JournalAnalysisDisplay from "@/components/journal/JournalAnalysisDisplay";
import { Brain, BookOpen } from "lucide-react";

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  analysis?: any;
}

const simulateAIResponse = async (userInput: string) => {
  return `🤖 Mushu: He leído tu entrada: "${userInput}". Te felicito por expresarte, recuerda que este espacio es tuyo para reflexionar y crecer.`;
};

const JournalPage: React.FC = () => {
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

    // Analyze the journal entry with AI
    const recentEntryTexts = entries.slice(0, 5).map(e => e.content);
    const analysis = await analyzeJournalEntry(currentText.trim(), recentEntryTexts);

    // Save user entry with analysis
    const userEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentText.trim(),
      createdAt: new Date().toISOString(),
      analysis: analysis
    };

    // Create AI response based on analysis
    const aiMessage = analysis?.supportResponse || await simulateAIResponse(currentText.trim());
    
    const aiEntry: JournalEntry = {
      id: (Date.now() + 1).toString(),
      title: "Respuesta IA",
      content: aiMessage,
      createdAt: new Date().toISOString(),
    };

    setEntries([aiEntry, userEntry, ...entries]);
    setCurrentAnalysis(analysis);

    // Speak AI response
    await speak({
      text: aiMessage,
      voiceId: "TX3LPaxmHKxFdv7VOQHJ",
      model: "eleven_multilingual_v2",
      language: "es"
    });

    setCurrentText("");
    if (textareaRef.current) textareaRef.current.focus();
    setLoading(false);
    setAnalyzing(false);

    // Switch to analysis tab if analysis was successful
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
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      <JournalHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Journal */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Escribir
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Análisis IA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <Card>
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

            <TabsContent value="analysis">
              {currentAnalysis ? (
                <JournalAnalysisDisplay analysis={currentAnalysis} />
              ) : (
                <Card className="p-8 text-center">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No hay análisis disponible</h3>
                  <p className="text-muted-foreground">
                    Escribe una entrada en el diario para obtener un análisis emocional detallado
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Intelligent Assistant */}
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

export default JournalPage;