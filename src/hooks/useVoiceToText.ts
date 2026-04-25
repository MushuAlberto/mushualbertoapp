
import { useState } from "react";

export function useVoiceToText() {
  const [loading, setLoading] = useState(false);

  const transcribe = async (audioBase64: string): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch("/functions/v1/voice-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: audioBase64 }),
      });
      const data = await res.json();
      setLoading(false);
      return data.text || null;
    } catch (error) {
      setLoading(false);
      return null;
    }
  };

  return { transcribe, loading };
}
