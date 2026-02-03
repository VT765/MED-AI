"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_AI_RESPONSES } from "@/lib/mockData";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/** Chat container = 100vh minus navbar. Input bar always visible. No vertical overflow. */
export function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "0",
      role: "assistant",
      content: MOCK_AI_RESPONSES.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: MOCK_AI_RESPONSES.followup,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col rounded-card border border-stone-200 bg-surface-elevated shadow-card overflow-hidden">
      {/* Marquee disclaimer – sticky at top of chat area */}
      <div className="sticky top-0 z-10 shrink-0 overflow-hidden border-b border-amber-200 bg-amber-50/90 py-2">
        <div className="flex w-max animate-marquee items-center gap-2 text-sm font-medium text-amber-800">
          <span aria-hidden>⚠️</span>
          <span>AI medical guidance is not a substitute for certified doctors</span>
          <span className="ml-8" aria-hidden>⚠️</span>
          <span>AI medical guidance is not a substitute for certified doctors</span>
          <span className="ml-8" aria-hidden>⚠️</span>
          <span>AI medical guidance is not a substitute for certified doctors</span>
        </div>
      </div>

      {/* Messages – scrollable, no overflow of container */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-muted text-content-tertiary">
                    <Bot className="h-4 w-4" aria-hidden />
                  </div>
                )}
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-2.5 text-sm
                    ${
                      msg.role === "user"
                        ? "bg-primary-500 text-white"
                        : "bg-surface-muted text-content-primary"
                    }
                  `}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User className="h-4 w-4" aria-hidden />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-muted text-content-tertiary">
                <Bot className="h-4 w-4" aria-hidden />
              </div>
              <div className="rounded-2xl bg-gray-100 px-4 py-2.5">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar – always visible: text input (rounded, large), Mic (circular, tooltip), Send */}
      <div className="shrink-0 border-t border-stone-200 bg-surface-elevated p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Describe your symptoms or ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[48px] flex-1 rounded-input text-base"
            disabled={isLoading}
          />
          <div className="relative group">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              disabled
              aria-label="Voice input (coming soon)"
            >
              <Mic className="h-5 w-5" aria-hidden />
            </Button>
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              Voice Input (Coming Soon)
            </span>
          </div>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 shrink-0 rounded-xl"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
