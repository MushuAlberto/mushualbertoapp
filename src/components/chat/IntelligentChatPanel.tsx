import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIntelligentChat } from '@/hooks/useIntelligentChat';
import { Brain, Heart, MessageSquare, Lightbulb, TrendingUp, Zap } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface IntelligentChatPanelProps {
  conversationHistory: ChatMessage[];
  userContext?: any;
  currentEmotionalState?: string;
}

export const IntelligentChatPanel: React.FC<IntelligentChatPanelProps> = ({
  conversationHistory,
  userContext = {},
  currentEmotionalState
}) => {
  const {
    isAnalyzing,
    conversationSummary,
    emotionalInsights,
    personalizedSuggestions,
    generateConversationSummary,
    performEmotionalCheck,
    getPersonalizedSuggestions
  } = useIntelligentChat();

  const [activeTab, setActiveTab] = useState<'summary' | 'emotions' | 'suggestions'>('suggestions');

  const conversationStats = useMemo(() => {
    if (!conversationHistory?.length) return null;

    const totalMessages = conversationHistory.length;
    const userMessages = conversationHistory.filter(msg => msg.role === 'user').length;
    const assistantMessages = conversationHistory.filter(msg => msg.role === 'assistant').length;
    
    return {
      total: totalMessages,
      user: userMessages,
      assistant: assistantMessages,
      ratio: userMessages > 0 ? (assistantMessages / userMessages).toFixed(1) : '0'
    };
  }, [conversationHistory]);

  const handleGenerateSummary = async () => {
    if (conversationHistory?.length > 0) {
      await generateConversationSummary(conversationHistory, userContext);
    }
  };

  const handleEmotionalCheck = async () => {
    if (conversationHistory?.length > 0) {
      await performEmotionalCheck(conversationHistory, userContext);
    }
  };

  const handleGetSuggestions = async () => {
    if (conversationHistory?.length > 0) {
      await getPersonalizedSuggestions(conversationHistory, userContext, currentEmotionalState);
    }
  };

  if (!conversationHistory?.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Chat Inteligente
          </CardTitle>
          <CardDescription>
            Análisis contextual de tus conversaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Inicia una conversación para ver análisis inteligentes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Chat Inteligente
        </CardTitle>
        <CardDescription>
          Análisis contextual y sugerencias personalizadas
        </CardDescription>
        
        {conversationStats && (
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">
              {conversationStats.total} mensajes
            </Badge>
            <Badge variant="outline">
              Ratio: {conversationStats.ratio}:1
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={activeTab === 'summary' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('summary');
                handleGenerateSummary();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Resumen
            </Button>
            <Button
              variant={activeTab === 'emotions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('emotions');
                handleEmotionalCheck();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Emociones
            </Button>
            <Button
              variant={activeTab === 'suggestions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('suggestions');
                handleGetSuggestions();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Sugerencias
            </Button>
          </div>

          <Separator />

          {/* Analysis Content */}
          <ScrollArea className="h-[300px]">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span>Analizando conversación...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'summary' && conversationSummary && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Resumen de la Conversación
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {conversationSummary}
                    </div>
                  </div>
                )}

                {activeTab === 'emotions' && emotionalInsights && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Análisis Emocional
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {emotionalInsights}
                    </div>
                  </div>
                )}

                {activeTab === 'suggestions' && personalizedSuggestions && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Sugerencias Personalizadas
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {personalizedSuggestions}
                    </div>
                  </div>
                )}

                {!conversationSummary && !emotionalInsights && !personalizedSuggestions && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un análisis para comenzar</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Context Indicators */}
          {currentEmotionalState && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Estado actual:</span>
                <Badge variant="secondary">{currentEmotionalState}</Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};