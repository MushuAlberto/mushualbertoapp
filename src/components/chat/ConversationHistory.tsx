import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  MessageCircle, 
  Calendar,
  Heart,
  Trash2,
  Search,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useChatStorage, SavedConversation } from '@/hooks/useChatStorage';
import { ChatMessage } from '@/types';

interface ConversationHistoryProps {
  onLoadConversation: (messages: ChatMessage[]) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ onLoadConversation }) => {
  const { savedConversations, deleteConversation, loadConversation } = useChatStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<SavedConversation | null>(null);

  const filteredConversations = savedConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLoadConversation = (conversationId: string) => {
    const messages = loadConversation(conversationId);
    onLoadConversation(messages);
  };

  const getEmotionColor = (emotion?: string) => {
    const colors = {
      joy: 'bg-yellow-100 text-yellow-800',
      sadness: 'bg-blue-100 text-blue-800',
      anxiety: 'bg-orange-100 text-orange-800',
      anger: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800',
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  };

  const getConversationEmotions = (messages: ChatMessage[]) => {
    const emotions = messages
      .filter(msg => msg.emotionalContext)
      .map(msg => msg.emotionalContext!)
      .filter((emotion, index, arr) => arr.indexOf(emotion) === index)
      .slice(0, 3);
    
    return emotions;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return `Hoy ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffHours < 48) {
      return `Ayer ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          Historial ({savedConversations.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial de Conversaciones
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de conversaciones */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                            <h3 className="font-medium truncate">{conversation.title}</h3>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(conversation.createdAt)}</span>
                            <span>•</span>
                            <span>{conversation.messages.length} mensajes</span>
                          </div>

                          {/* Emociones detectadas */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {getConversationEmotions(conversation.messages).map((emotion) => (
                              <Badge 
                                key={emotion} 
                                variant="outline" 
                                className={`text-xs px-2 py-0.5 ${getEmotionColor(emotion)}`}
                              >
                                <Heart className="w-2 h-2 mr-1" />
                                {emotion}
                              </Badge>
                            ))}
                          </div>

                          {/* Preview del último mensaje */}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {conversation.messages[conversation.messages.length - 1]?.content || ''}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleLoadConversation(conversation.id)}
                          >
                            Cargar
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedConversation(conversation)}
                              >
                                Ver
                              </Button>
                            </DialogTrigger>
                            
                            <DialogContent className="max-w-2xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <MessageCircle className="w-5 h-5" />
                                  {selectedConversation?.title}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <ScrollArea className="h-[500px]">
                                <div className="space-y-4 pr-4">
                                  {selectedConversation?.messages.map((message) => (
                                    <div
                                      key={message.id}
                                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                      <div className={`max-w-[80%] space-y-2`}>
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
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteConversation(conversation.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {searchTerm 
                      ? 'No se encontraron conversaciones que coincidan con la búsqueda'
                      : 'No hay conversaciones guardadas aún'
                    }
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationHistory;