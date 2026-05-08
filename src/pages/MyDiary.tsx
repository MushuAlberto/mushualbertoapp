import React, { useState, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent } from "@/components/ui/card";
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
import { Brain, BookOpen, Heart, Clock, Sparkles, PenTool, BarChart3 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
    } catch (e) {}

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
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Mock Mood Distribution from entries
  const moodData = [
    { name: 'Calma', value: 40, color: '#8B5CF6' },
    { name: 'Alegría', value: 30, color: '#F59E0B' },
    { name: 'Estrés', value: 20, color: '#EF4444' },
    { name: 'Tristeza', value: 10, color: '#3B82F6' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Visual Header */}
      <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 p-8 rounded-[2.5rem] border border-violet-500/20 flex flex-col md:flex-row items-center gap-6">
        <div className="p-5 rounded-[2rem] bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-xl shadow-violet-500/20">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black">Mi Diario</h1>
          <p className="text-muted-foreground font-medium">Libera tu mente y descubre tus patrones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 rounded-[2rem] h-14">
              <TabsTrigger value="write" className="rounded-[1.5rem] data-[state=active]:bg-background font-bold flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline">Escribir</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="rounded-[1.5rem] data-[state=active]:bg-background font-bold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Análisis</span>
              </TabsTrigger>
              <TabsTrigger value="therapy" className="rounded-[1.5rem] data-[state=active]:bg-background font-bold flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Terapia</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-[1.5rem] data-[state=active]:bg-background font-bold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Historial</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="animate-fade-in">
              <Card className="border-none bg-card/50 shadow-sm rounded-[2rem] overflow-hidden">
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

            <TabsContent value="analysis" className="animate-fade-in">
              {currentAnalysis ? (
                <JournalAnalysisDisplay analysis={currentAnalysis} />
              ) : (
                <Card className="p-12 text-center border-none bg-card/50 shadow-sm rounded-[2rem]">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="text-xl font-black mb-2">Sin datos aún</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Escribe cómo te sientes para que Mushu pueda analizar tu estado emocional.
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="therapy" className="animate-fade-in">
              <IntelligentTherapyPanel />
            </TabsContent>

            <TabsContent value="history" className="animate-fade-in">
              <DiaryHistory />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 space-y-6">
           {/* Visual Mood Summary Card */}
           <Card className="border-none bg-card/50 shadow-sm rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-4">
                 <BarChart3 className="w-5 h-5 text-violet-500" />
                 <h3 className="font-bold">Resumen Emocional</h3>
              </div>
              <div className="h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={moodData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {moodData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                 {moodData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                       <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{item.name}</span>
                    </div>
                 ))}
              </div>
           </Card>

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
