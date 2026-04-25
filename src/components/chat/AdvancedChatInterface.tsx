import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  Send, 
  Brain, 
  Heart, 
  TrendingUp, 
  Lightbulb,
  Settings,
  BarChart3
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import VoiceInput from '@/components/VoiceInput';
import ConversationHistory from '@/components/chat/ConversationHistory';
import { useAdvancedChat } from '@/hooks/useAdvancedChat';
import { useAutoDiary } from '@/hooks/useChatDiary';
import { useChatStorage } from '@/hooks/useChatStorage';
import { ChatMessage } from '@/types';
import { toast } from 'sonner';

const AdvancedChatInterface: React.FC = () => {
  const {
    messages,
    loading,
    sendMessage,
    clearMessages,
    userContext,
    emotionalState,
    proactiveActions,
    preferences
  } = useAdvancedChat();

  const { saveConversation } = useChatStorage();

  const [currentMessage, setCurrentMessage] = useState('');
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-guardar en diario
  useAutoDiary(messages);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    await sendMessage(currentMessage);
    setCurrentMessage('');
  };

  const handleSaveConversation = () => {
    if (messages.length > 0) {
      const conversationId = saveConversation(messages);
      if (conversationId) {
        toast.success('Conversación guardada exitosamente');
      }
    }
  };

  const handleLoadConversation = (loadedMessages: ChatMessage[]) => {
    clearMessages();
    // La carga se maneja en el hook useChatStorage
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      sadness: 'bg-blue-100 text-blue-800 border-blue-200',
      anxiety: 'bg-orange-100 text-orange-800 border-orange-200',
      anger: 'bg-red-100 text-red-800 border-red-200',
      neutral: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMushuPersonality = () => {
    const { current, trend } = emotionalState;
    
    if (current === 'sadness' || trend === 'declining') {
      return { mood: 'compassionate', emoji: '🤗', color: 'text-blue-600' };
    }
    if (current === 'anxiety') {
      return { mood: 'calming', emoji: '🧘‍♂️', color: 'text-purple-600' };
    }
    if (current === 'joy' || trend === 'improving') {
      return { mood: 'energetic', emoji: '✨', color: 'text-green-600' };
    }
    
    return { mood: 'balanced', emoji: '😊', color: 'text-indigo-600' };
  };

  const mushuPersonality = getMushuPersonality();

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header con stats emocionales */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-full bg-primary/10 ${mushuPersonality.color}`}>
                <Brain className="w-5 h-5" />
              </div>
              <span>Mushu Alberto</span>
              <span className="text-lg">{mushuPersonality.emoji}</span>
              <Badge variant="outline" className="text-xs">
                {mushuPersonality.mood}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        {showStats && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span className="text-muted-foreground">Estado Actual</span>
                </div>
                <Badge className={getEmotionColor(emotionalState.current)}>
                  {emotionalState.current}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {getTrendIcon(emotionalState.trend)}
                  <span className="text-muted-foreground">Tendencia</span>
                </div>
                <p className="font-medium">{emotionalState.trend}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-blue-500" />
                  <span className="text-muted-foreground">Conversaciones</span>
                </div>
                <p className="font-medium">{userContext.totalConversations}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-muted-foreground">Productividad</span>
                </div>
                <p className="font-medium">{userContext.productivityLevel}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Acciones proactivas */}
      {proactiveActions.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Iniciativas Proactivas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {proactiveActions.slice(0, 2).map((action, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  action.urgency === 'high' ? 'border-red-400 bg-red-50' :
                  action.urgency === 'medium' ? 'border-orange-400 bg-orange-50' :
                  'border-blue-400 bg-blue-50'
                }`}
              >
                <p className="text-sm font-medium">{action.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {action.actionType} • {new Date(action.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversación Inteligente
            </CardTitle>
            <div className="flex items-center gap-2">
              <ConversationHistory onLoadConversation={handleLoadConversation} />
              {messages.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleSaveConversation}>
                    Guardar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearMessages}>
                    Limpiar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                        {message.role === 'user' ? 'Tú' : 'M'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`space-y-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {message.emotionalContext && (
                          <Badge variant="outline" className={`text-xs ${getEmotionColor(message.emotionalContext)}`}>
                            {message.emotionalContext}
                          </Badge>
                        )}
                        
                        {message.emotionalAnalysis && (
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800">
                            Análisis: {Math.round(message.emotionalAnalysis.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl ${mushuPersonality.color} bg-primary/10`}>
                  {mushuPersonality.emoji}
                </div>
                <h3 className="font-semibold mb-2">¡Hola! Soy Mushu Alberto Superinteligente</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  He evolucionado para conocerte mejor. Ahora puedo recordar nuestras conversaciones, 
                  analizar tus emociones y sugerir acciones proactivas para apoyarte.
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline">Memoria Contextual</Badge>
                  <Badge variant="outline">Análisis Emocional</Badge>
                  <Badge variant="outline">Iniciativas Proactivas</Badge>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Cuéntame cómo te sientes o qué necesitas..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!currentMessage.trim() || loading}
                  className="h-10 w-10 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <VoiceInput
                  onText={(text) => setCurrentMessage(text)}
                  disabled={loading}
                />
              </div>
            </div>
            
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-pulse flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Mushu está analizando y preparando una respuesta inteligente...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedChatInterface;