
import React from "react";
import { ChatMessage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import VoiceInput from "@/components/VoiceInput";
import { Send } from "lucide-react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentMessage: string;
  setCurrentMessage: (txt: string) => void;
  sendMessage: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentMessage,
  setCurrentMessage,
  sendMessage,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Conversación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">¡Hola! Soy Mushu Alberto</p>
              <p className="text-gray-500 text-sm">
                Estoy aquí para apoyarte, motivarte y acompañarte en tu día a día.
                ¿En qué puedo ayudarte hoy?
              </p>
            </div>
          )}
        </div>
        {/* Message Input */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Escribe tu mensaje aquí..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-1"
              rows={2}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <div className="flex flex-col space-y-2">
              <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              {/* Solo entrada de voz del usuario */}
              <VoiceInput
                onText={txt => setCurrentMessage(txt)}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatMessages;
