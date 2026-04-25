
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onText: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onText, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const handleStart = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      setLoading(true);
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        // Llama la función de transcripción del hook externo
        try {
          const mod = await import("@/hooks/useVoiceToText");
          const { useVoiceToText } = mod;
          const { transcribe } = useVoiceToText();
          const result = await transcribe(base64);
          if (result) onText(result);
        } catch (e) {}
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorder.current.start();
  };

  const handleStop = () => {
    setIsRecording(false);
    mediaRecorder.current?.stop();
  };

  if (loading) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="animate-spin mr-2" /> Transcribiendo...
      </Button>
    );
  }

  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      onClick={isRecording ? handleStop : handleStart}
      disabled={disabled}
      title="Grabar y transcribir voz"
      type="button"
    >
      {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
      {isRecording ? "Detener" : "Dictar"}
    </Button>
  );
};

export default VoiceInput;
