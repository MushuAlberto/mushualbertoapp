
import { useEffect } from "react";
import { ChatMessage } from "@/types";

/**
 * Guarda y recupera el historial del chat por día en localStorage.
 * El registro es privado/local.
 */
const CHAT_DIARY_KEY = "mushu_chat_diary_entries";

/**
 * Guarda los mensajes del día (por fecha local) en localStorage.
 * @param dateStr formato YYYY-MM-DD
 * @param messages mensajes del chat de ese día
 */
export function saveChatDiaryForToday(messages: ChatMessage[]) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const diaries: Record<string, ChatMessage[]> = JSON.parse(
    localStorage.getItem(CHAT_DIARY_KEY) || "{}"
  );
  diaries[dateStr] = messages;
  localStorage.setItem(CHAT_DIARY_KEY, JSON.stringify(diaries));
}

/**
 * Obtiene todos los registros diarios de chat.
 */
export function getAllChatDiaries(): Record<string, ChatMessage[]> {
  try {
    return JSON.parse(localStorage.getItem(CHAT_DIARY_KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Hook que guarda automáticamente el chat actual al enviar mensajes.
 * @param messages mensajes del chat actualizado
 */
export function useAutoDiary(messages: ChatMessage[]) {
  useEffect(() => {
    saveChatDiaryForToday(messages);
  }, [messages]);
}
