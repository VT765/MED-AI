import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Mic, Paperclip, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/auth";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "0", role: "system", content: "Please upload a medical document (PDF) to start chatting.", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setInputError("Only PDF files are supported.");
      return;
    }

    setIsLoading(true);
    setInputError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = getToken();
      const res = await fetch("http://localhost:3000/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setDocumentId(data.document.id);
      setFileName(data.document.filename);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "system", content: `Uploaded: ${file.name}. You can now ask questions about it.`, timestamp: new Date() }
      ]);
    } catch (err: any) {
      console.error(err);
      setInputError(err.message || "Failed to upload document");
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    setInputError(null);
    if (!trimmed) {
      setInputError("Please enter a message.");
      return;
    }
    if (!documentId) {
      setInputError("Please upload a document first.");
      return;
    }

    if (isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const token = getToken();
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: trimmed,
          documentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Chat failed");
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.answer, timestamp: new Date() }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "system", content: `Error: ${err.message}`, timestamp: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-card border border-stone-200 bg-surface shadow-card" role="region" aria-label="AI Doctor chat">
      <div className="shrink-0 border-b border-stone-200 bg-surface-elevated px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700" aria-hidden>
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-content-primary">AI Doctor</p>
              <p className="text-xs text-content-secondary">
                {fileName ? `Analyzing: ${fileName}` : "Upload a PDF to start"}
              </p>
            </div>
          </div>
          <p className="hidden text-[11px] text-amber-800 sm:block" role="status">AI guidance is not a substitute for certified doctors.</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-primary-50/30 via-surface to-surface px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isSystem = msg.role === "system";
              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && !isSystem && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700" aria-hidden>
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                    isUser ? "rounded-br-md bg-primary-600 text-white" :
                      isSystem ? "w-full text-center bg-stone-100 text-stone-600 italic" :
                        "rounded-bl-md border border-stone-200 bg-surface-elevated text-content-primary")}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {!isSystem && <p className={cn("mt-1.5 text-[11px]", isUser ? "text-primary-100/90" : "text-content-tertiary")}>{formatTime(msg.timestamp)}</p>}
                  </div>
                  {isUser && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700" aria-hidden>
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700" aria-hidden>
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-stone-200 bg-surface-elevated px-4 py-2.5 shadow-soft" role="status" aria-label="AI is typing">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" />
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="shrink-0 border-t border-stone-200 bg-surface-elevated p-4">
        {inputError && (
          <p id="input-error" className="mb-2 text-xs text-red-600" role="alert">{inputError}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf"
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            title="Upload PDF"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input placeholder={documentId ? "Ask about your document..." : "Upload a PDF first..."} value={input} onChange={(e) => { setInput(e.target.value); setInputError(null); }} onKeyDown={handleKeyDown} className={cn("min-h-[48px] flex-1 rounded-xl border-stone-200 text-base focus-visible:ring-primary-500", inputError && "border-red-300 focus-visible:ring-red-500")} disabled={isLoading || !documentId} aria-invalid={!!inputError} aria-describedby={inputError ? "input-error" : undefined} />
          <Button type="button" onClick={handleSend} disabled={!input.trim() || isLoading || !documentId} className="h-12 w-12 shrink-0 rounded-xl bg-primary-600 hover:bg-primary-700" aria-label="Send message">
            <Send className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
