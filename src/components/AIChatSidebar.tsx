import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIChatSidebar = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI tutor. Ask me anything about your courses — I'll explain concepts, help debug code, or quiz you on what you've learned. 🧠",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response (replace with edge function call)
    setTimeout(() => {
      const responses = [
        "Great question! Let me break that down for you. The key concept here is about understanding how data flows through the system. Think of it like water flowing through pipes — each function transforms the data as it passes through.",
        "That's a common confusion! Here's a simpler way to think about it: imagine you're building with LEGO blocks. Each block (function) snaps onto others to create something bigger. The important thing is that each block has a specific shape (input/output type).",
        "Let me explain with an example. Consider a sorting algorithm — it takes an unsorted list and returns a sorted one. The 'how' is the algorithm's logic, and the 'what' is the contract it fulfills. Focus on understanding the 'what' first!",
      ];
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responses[Math.floor(Math.random() * responses.length)] },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-elevated transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl bg-card shadow-elevated border border-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-accent px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-foreground/10">
            <Bot className="h-4.5 w-4.5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-accent-foreground">AI Tutor</h3>
            <p className="text-xs text-accent-foreground/70">Always ready to help</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-accent-foreground/70 hover:bg-accent-foreground/10 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              msg.role === "assistant" ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
            }`}>
              {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            </div>
            <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
              msg.role === "assistant"
                ? "bg-muted text-foreground"
                : "bg-primary text-primary-foreground"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-xl bg-muted px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
