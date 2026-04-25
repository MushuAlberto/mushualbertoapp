export interface User {
  id: string;
  name: string;
  email: string;
  sparkles: number;
  equippedItem: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  lastCompleted?: string;
  createdAt: string;
}

export interface QuickNote {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  audio?: string; // base64 string (audio/wav)
  // Si es audio, content puede quedarse vacío, o tener un texto complementario
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentimentEmoji?: string;
  summary?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  emotionalContext?: string;
  emotionalAnalysis?: {
    emotion: string;
    confidence: number;
    recommendation: string;
    supportLevel: string;
  };
  functionCall?: {
    name: string;
    arguments: string;
  };
}

export interface MoodLog {
  id: string;
  userId: string;
  mood: 'Happy' | 'Productive' | 'Okay' | 'Tired' | 'Anxious' | 'Sad';
  notes?: string;
  date: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  icon: string;
}

export interface UserStoreItem {
  userId: string;
  itemId: string;
  purchasedAt: string;
}
