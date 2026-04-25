
import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";

interface JournalEntryInputProps {
  currentText: string;
  setCurrentText: (txt: string) => void;
  handleSend: () => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const JournalEntryInput: React.FC<JournalEntryInputProps> = ({
  currentText,
  setCurrentText,
  handleSend,
  loading,
  textareaRef
}) => (
  <div className="mt-4 flex gap-2">
    <Textarea
      ref={textareaRef}
      placeholder="¿Qué te gustaría anotar o contarle a Mushu hoy?"
      value={currentText}
      onChange={e => setCurrentText(e.target.value)}
      disabled={loading}
      rows={2}
      onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      }}
    />
    <div className="flex flex-col space-y-2">
      <Button
        className="h-fit self-end"
        onClick={handleSend}
        disabled={loading || !currentText.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
      <VoiceInput
        onText={txt => setCurrentText(txt)}
        disabled={loading}
      />
    </div>
  </div>
);

export default JournalEntryInput;
