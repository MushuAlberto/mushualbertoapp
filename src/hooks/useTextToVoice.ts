
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Options {
  text: string;
  voiceId?: string;
  model?: string;
  language?: string;
}

export function useTextToVoice() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const speak = async ({
    text,
    voiceId = "TX3LPaxmHKxFdv7VOQHJ", // Liam
    model = "eleven_multilingual_v2",
    language = "es",
  }: Options) => {
    setLoading(true);
    try {
      console.log("[Mushu] [FRONT] Iniciando text-to-voice. Parámetros:", { text, voiceId, model, language });

      // SIEMPRE usar la URL de producción de Supabase
      const supabaseUrl = "https://xdudrydyvrbhvyigpztm.supabase.co";
      const endpoint = `${supabaseUrl}/functions/v1/text-to-voice`;

      console.log(`[Mushu] [FRONT] Llamando a: ${endpoint}`);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdWRyeWR5dnJiaHZ5aWdwenRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzQ0NjMsImV4cCI6MjA2NTUxMDQ2M30.TcwiepA2GMesx40zonMOv0C9jWfESWU58eOwKH8Lb8Y`
        },
        body: JSON.stringify({
          text,
          voiceId,
          model,
          language,
        }),
      });

      console.log("[Mushu] [FRONT] Respuesta HTTP recibida:", res);

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("[Mushu] [FRONT] Error response body:", txt);
        throw new Error(`[FRONT] HTTP ${res.status}: ${res.statusText} - ${txt}`);
      }

      let data;
      try {
        data = await res.json();
        console.log("[Mushu] [FRONT] JSON recibido:", data);
      } catch (e) {
        console.error("[Mushu] [FRONT] La respuesta no es JSON válido", e);
        setLoading(false);
        toast({
          title: "Error al convertir texto a voz",
          description: "La respuesta del servidor no es válida.",
          variant: "destructive"
        });
        return;
      }
      setLoading(false);

      if (data.audioContent) {
        try {
          const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
          console.log("[Mushu] [FRONT] Decodificando audio base64:", data.audioContent.slice(0,30), "...(truncado)");

          const audio = new Audio(audioSrc);
          audio.oncanplaythrough = () => {
            console.log("[Mushu] [FRONT] Audio listo para reproducir.");
          };
          audio.onended = () => {
            console.log("[Mushu] [FRONT] Audio terminó.");
          };
          audio.onerror = (e) => {
            console.error("[Mushu] [FRONT] Error en el elemento Audio.", e);
            toast({
              title: "No se pudo reproducir el audio",
              description: "Error en el reproductor de audio.",
              variant: "destructive"
            });
          };

          await audio.play();
          console.log("[Mushu] [FRONT] Audio reproduciéndose OK");
          toast({
            title: "¡Mensaje de Mushu!",
            description: "Reproduciendo audio...",
            duration: 1600
          });
        } catch (error) {
          console.error("[Mushu] [FRONT] Error al reproducir audio:", error);
          toast({
            title: "No se pudo reproducir el audio",
            description: "Hubo un problema al inicializar el audio.",
            variant: "destructive"
          });
        }
      } else if (data.error) {
        console.error("[Mushu] [FRONT] Error desde función text-to-voice:", data.error);
        toast({
          title: "Error de Mushu TTS",
          description: data.error,
          variant: "destructive"
        });
      } else {
        console.error("[Mushu] [FRONT] No se recibió audio ni error desde la función.");
        toast({
          title: "No se recibió audio",
          description: "La función no devolvió audio. Contacta soporte.",
          variant: "destructive"
        });
      }
    } catch (e) {
      setLoading(false);
      console.error("[Mushu-TTS] [FRONT] Error general:", e);
      toast({
        title: "Error general en texto-a-voz",
        description: String(e),
        variant: "destructive"
      });
    }
  };

  return { speak, loading };
}
