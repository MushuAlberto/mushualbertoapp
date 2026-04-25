import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useIntelligentJournal } from '@/hooks/useIntelligentJournal';
import { Brain, Heart, TrendingUp, Lightbulb, Target, Sparkles } from 'lucide-react';

interface IntelligentJournalPanelProps {
  recentEntries?: any[];
  onPromptSelect?: (prompt: string) => void;
}

const IntelligentJournalPanel: React.FC<IntelligentJournalPanelProps> = ({
  recentEntries = [],
  onPromptSelect
}) => {
  const { toast } = useToast();
  const {
    loading,
    prompts,
    emotionalInsights,
    generatePersonalizedPrompts,
    getEmotionalInsights,
    getEmotionColor,
    getMoodEmoji
  } = useIntelligentJournal();

  const [activeTab, setActiveTab] = useState('prompts');

  useEffect(() => {
    loadPersonalizedPrompts();
  }, []);

  const loadPersonalizedPrompts = async () => {
    const entryTexts = recentEntries.map(entry => entry.content).slice(0, 5);
    await generatePersonalizedPrompts([], entryTexts);
  };

  const loadEmotionalInsights = async () => {
    const entryTexts = recentEntries.map(entry => entry.content).slice(0, 10);
    await getEmotionalInsights([], entryTexts);
  };

  const handlePromptClick = (promptText: string) => {
    if (onPromptSelect) {
      onPromptSelect(promptText);
    }
    toast({
      title: "Prompt seleccionado",
      description: "El prompt se ha añadido al campo de escritura"
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      reflection: Brain,
      gratitude: Heart,
      goals: Target,
      emotions: Heart,
      creativity: Sparkles,
      relationships: Heart
    };
    return icons[category] || Brain;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      reflection: 'hsl(var(--primary))',
      gratitude: 'hsl(var(--chart-1))',
      goals: 'hsl(var(--chart-2))',
      emotions: 'hsl(var(--chart-3))',
      creativity: 'hsl(var(--chart-4))',
      relationships: 'hsl(var(--chart-5))'
    };
    return colors[category] || 'hsl(var(--primary))';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>Asistente Inteligente de Diario</CardTitle>
        </div>
        <CardDescription>
          Prompts personalizados e insights emocionales powered by IA
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Prompts IA
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Prompts generados especialmente para ti
              </p>
              <Button 
                onClick={loadPersonalizedPrompts} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? "Generando..." : "Generar Nuevos"}
              </Button>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {prompts.map((prompt, index) => {
                  const IconComponent = getCategoryIcon(prompt.category);
                  return (
                    <Card 
                      key={index} 
                      className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handlePromptClick(prompt.text)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm flex-1">{prompt.text}</p>
                          <IconComponent 
                            className="h-4 w-4 text-muted-foreground flex-shrink-0" 
                            style={{ color: getCategoryColor(prompt.category) }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ backgroundColor: `${getCategoryColor(prompt.category)}20` }}
                          >
                            {prompt.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                          >
                            {prompt.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {prompt.emotionalFocus}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                
                {prompts.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                    <p>No hay prompts disponibles</p>
                    <p className="text-sm">Haz clic en "Generar Nuevos" para crear prompts personalizados</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Análisis de tu bienestar emocional
              </p>
              <Button 
                onClick={loadEmotionalInsights} 
                disabled={loading || recentEntries.length === 0}
                variant="outline"
                size="sm"
              >
                {loading ? "Analizando..." : "Analizar"}
              </Button>
            </div>

            {emotionalInsights ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {/* Wellness Score */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Puntuación de Bienestar</h4>
                      <span className="text-2xl">
                        {emotionalInsights.wellnessScore >= 80 ? '😊' : 
                         emotionalInsights.wellnessScore >= 60 ? '😌' : 
                         emotionalInsights.wellnessScore >= 40 ? '😐' : '😔'}
                      </span>
                    </div>
                    <Progress value={emotionalInsights.wellnessScore} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {emotionalInsights.wellnessScore}/100
                    </p>
                  </Card>

                  {/* Emotional Trends */}
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2">Tendencias Emocionales</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Estado general:</span>
                        <Badge variant={
                          emotionalInsights.emotionalTrends.overall === 'improving' ? 'default' :
                          emotionalInsights.emotionalTrends.overall === 'stable' ? 'secondary' : 'destructive'
                        }>
                          {emotionalInsights.emotionalTrends.overall}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>Emociones dominantes: {emotionalInsights.emotionalTrends.dominantEmotions.join(', ')}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Insights */}
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2">Insights Personalizados</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {emotionalInsights.insights}
                    </p>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium text-primary">
                        💙 {emotionalInsights.encouragement}
                      </p>
                    </div>
                  </Card>

                  {/* Recommendations */}
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2">Recomendaciones</h4>
                    <div className="space-y-2">
                      {emotionalInsights.recommendations.priorityAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm">{area}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p>No hay insights disponibles</p>
                <p className="text-sm">
                  {recentEntries.length === 0 
                    ? "Escribe algunas entradas primero para generar insights" 
                    : "Haz clic en 'Analizar' para obtener insights emocionales"
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntelligentJournalPanel;