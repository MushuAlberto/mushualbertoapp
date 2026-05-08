import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AvatarMushu from "@/components/AvatarMushu";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAdvancedChat } from "@/hooks/useAdvancedChat";
import { Badge } from "@/components/ui/badge";

const FloatingMushuWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    loading,
    sendMessage,
    emotionalState,
  } = useAdvancedChat();

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!currentMessage.trim()) return;
    await sendMessage(currentMessage);
    setCurrentMessage("");
  };

  const getMushuMood = () => {
    const { current } = emotionalState;
    if (current === "sadness") return "🤗";
    if (current === "anxiety") return "🧘‍♂️";
    if (current === "joy") return "✨";
    return "😊";
  };

  return (
    <>
      {/* Chat Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[420px] p-0 flex flex-col bg-background"
        >
          {/* Header */}
          <SheetHeader className="px-4 py-3 border-b border-border bg-gradient-to-r from-violet-500/10 to-pink-500/10">
            <SheetTitle className="flex items-center gap-3">
              <div className="relative">
                <AvatarMushu size={40} />
                <span className="absolute -bottom-0.5 -right-0.5 text-sm">
                  {getMushuMood()}
                </span>
              </div>
              <div>
                <span className="text-base font-semibold">Mushu</span>
                <p className="text-xs text-muted-foreground font-normal">
                  Tu asistente personal
                </p>
              </div>
              {emotionalState.current !== "neutral" && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {emotionalState.current}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-violet-500/10">
                  <Sparkles className="w-8 h-8 text-violet-500" />
                </div>
                <h3 className="font-semibold mb-2">¡Hola! Soy Mushu</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Cuéntame cómo te sientes o pregúntame lo que necesites. Estoy
                  aquí para ayudarte.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {[
                    "¿Cómo estoy hoy?",
                    "Necesito motivación",
                    "Ayúdame a enfocarme",
                  ].map((starter) => (
                    <Button
                      key={starter}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setCurrentMessage(starter);
                      }}
                    >
                      {starter}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-primary text-primary-foreground text-xs"
                            : "bg-violet-100 dark:bg-violet-900 text-xs"
                        }
                      >
                        {message.role === "user" ? "Tú" : "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-xs">Mushu está pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-background/80 backdrop-blur">
            <div className="flex gap-2">
              <Textarea
                placeholder="Escribe a Mushu..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 min-h-[40px] max-h-[120px] text-sm resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!currentMessage.trim() || loading}
                size="icon"
                className="shrink-0 rounded-full bg-violet-600 hover:bg-violet-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Button */}
      <button
        className={cn(
          "fixed z-50 right-4 bottom-20 md:bottom-6 pointer-events-auto rounded-full border-2 border-violet-300 dark:border-violet-700 bg-background shadow-xl hover:scale-110 active:scale-100 transition-all duration-200 focus:outline-none overflow-visible flex items-center justify-center group",
          open ? "ring-2 ring-violet-400 scale-105" : ""
        )}
        style={{
          width: 56,
          height: 56,
          boxShadow:
            "0 4px 20px rgba(139, 92, 246, 0.3), 0 1px 10px rgba(0,0,0,0.1)",
        }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Cerrar Mushu" : "Hablar con Mushu"}
      >
        <AvatarMushu size={48} className="z-10" />
        <span className="absolute -top-1 -right-1 bg-violet-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-white shadow font-bold animate-pulse z-10">
          💬
        </span>
      </button>
    </>
  );
};

export default FloatingMushuWidget;
