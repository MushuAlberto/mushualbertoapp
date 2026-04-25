
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Play } from "lucide-react";

interface VoiceRecorderProps {
  onRecord: (audioBase64: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecord }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        setAudioBase64(base64);
        onRecord(base64);
      };
      reader.readAsDataURL(blob);
    };
    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const playAudio = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="flex flex-col items-center gap-2 my-2">
      {isRecording ? (
        <Button onClick={stopRecording} variant="destructive" size="lg">
          <StopCircle className="mr-2" /> Detener
        </Button>
      ) : (
        <Button onClick={startRecording} variant="outline" size="lg">
          <Mic className="mr-2" /> Grabar Nota de Voz
        </Button>
      )}
      {audioUrl && (
        <Button type="button" variant="secondary" onClick={playAudio} size="sm">
          <Play className="mr-2" /> Reproducir Grabación
        </Button>
      )}
    </div>
  );
};

export default VoiceRecorder;
