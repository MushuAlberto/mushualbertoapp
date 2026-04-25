
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types';

export interface SavedConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

const CONVERSATIONS_KEY = 'mushu_saved_conversations';

export const useChatStorage = () => {
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY);
      if (stored) {
        setSavedConversations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setSavedConversations([]);
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const saveConversation = (messagesToSave?: ChatMessage[], title?: string) => {
    const messagesToUse = messagesToSave || messages;
    if (messagesToUse.length === 0) return null;

    const conversationTitle = title || 
      messagesToUse.find(m => m.role === 'user')?.content.slice(0, 50) + '...' || 
      'Nueva conversación';

    const conversation: SavedConversation = {
      id: Date.now().toString(),
      title: conversationTitle,
      messages: [...messagesToUse],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [conversation, ...savedConversations];
    setSavedConversations(updated);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
    
    return conversation.id;
  };

  const deleteConversation = (id: string) => {
    const updated = savedConversations.filter(conv => conv.id !== id);
    setSavedConversations(updated);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
  };

  const loadConversation = (id: string): ChatMessage[] => {
    const conversation = savedConversations.find(conv => conv.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      return conversation.messages;
    }
    return [];
  };

  return {
    messages,
    addMessage,
    clearMessages,
    savedConversations,
    saveConversation,
    deleteConversation,
    loadConversation
  };
};
