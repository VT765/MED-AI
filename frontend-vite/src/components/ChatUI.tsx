import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Paperclip, BrainCircuit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/lib/auth";
import { apiUrl } from "@/lib/api";

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
    {
      id: "0",
      role: "assistant",
      content: "Hello! I am your AI medical assistant. How can I help you today? You can describe your symptoms or ask me general health questions.",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedDocText, setExtractedDocText] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setInputError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setInputError("Only PDF files are supported right now.");
      return;
    }

    setIsUploading(true);
    setInputError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = getAuthToken();
      // Upload document to Python backend
      const res = await fetch(apiUrl("/api/documents/upload"), {
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
      const text = data.document.extractedText;
      if (text) setExtractedDocText(text);

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "system", content: `Uploaded document: ${file.name}. The AI has analyzed it and is ready for questions.`, timestamp: new Date() }
      ]);
    } catch (err: any) {
      console.error(err);
      setInputError(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    setInputError(null);
    if (!trimmed) return;

    if (isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    try {
      const token = getAuthToken();

      // If we have a document, we use the original logic if it exists, otherwise we just query the LLM. 
      // Note: the backend `/api/chat` route requires `documentId` and `question`.
      // Since the user wants to chat WITHOUT a document, we will build a composite prompt and hit the new `/llm/analyze` LLM directly if there's no chat history route on the backend for general chat. 
      // If the backend `/api/chat` route *does* support None for documentId, we use that. 
      // Let's assume the backend LLM service on port 8001 is the best way to handle generic medical AI.

      let aiResponseText = "";

      if (documentId && extractedDocText) {
        // Has document: Include document context in the prompt for port 8001 LLM
        const compositePrompt = `User question: ${trimmed}\n\nContext block (Extracted Document):\n${extractedDocText.substring(0, 3000)}`;
        const llmRes = await fetch(apiUrl("/llm/analyze"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: compositePrompt }),
        });

        if (!llmRes.ok) throw new Error("AI Chat failed");
        const llmData = await llmRes.json();
        aiResponseText = llmData.analysis || "I could not generate an analysis.";
      } else {
        // No document: Standard prompt
        const llmRes = await fetch(apiUrl("/llm/analyze"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: `Patient asks: ${trimmed}` }),
        });

        if (!llmRes.ok) throw new Error("AI Chat failed");
        const llmData = await llmRes.json();
        aiResponseText = llmData.analysis || "I could not generate a response.";
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: aiResponseText, timestamp: new Date() }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "system", content: `Error generating response. Please try again.`, timestamp: new Date() }
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

  // Pre-defined quick prompt chips
  const quickPrompts = [
    "I have a constant headache",
    "What are early signs of flu?",
    "How to improve my sleep?"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-surface shadow-card relative" role="region" aria-label="AI Doctor chat">

      {/* Header */}
      <div className="shrink-0 border-b border-stone-200 bg-surface px-6 py-4 flex items-center justify-between z-10 sticky top-0 backdrop-blur-md bg-white/90 relative overflow-hidden">
        {/* Ambient subtle animation in the header */}
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-teal-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s' }} />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-inner border border-primary-200" aria-hidden>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-primary-400/20 rounded-full blur-md" />
            <BrainCircuit className="h-6 w-6 relative z-10" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">AI Doctor</h3>
            <p className="text-sm font-medium flex items-center gap-1.5 mt-0.5 text-primary-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Online • Ready to assist
            </p>
          </div>
        </div>

        {fileName && (
          <div className="hidden sm:flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
            <FileText className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-semibold text-primary-700 max-w-[150px] truncate">{fileName}</span>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 scroll-smooth">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isSystem = msg.role === "system";

              if (isSystem) {
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-4">
                    <div className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-500">
                      {msg.content}
                    </div>
                  </motion.div>
                )
              }

              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex gap-3 w-full ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm border border-white" aria-hidden>
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div className={cn(
                    "max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
                    isUser
                      ? "rounded-2xl rounded-tr-sm bg-primary-600 text-white"
                      : "rounded-2xl rounded-tl-sm border border-stone-200 bg-white text-gray-800"
                  )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <p className={cn("mt-2 text-[10px] font-medium text-right", isUser ? "text-primary-200" : "text-gray-400")}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {isUser && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-sm border border-white" aria-hidden>
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 w-full">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm border border-white" aria-hidden>
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-stone-200 bg-white px-5 py-4 shadow-sm" role="status" aria-label="AI is typing">
                <div className="flex gap-1.5 items-center justify-center h-2.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty state suggestions */}
          {messages.length === 1 && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-2 mt-4 ml-11">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="bg-white border border-primary-200 text-primary-700 text-sm py-1.5 px-3 rounded-full hover:bg-primary-50 transition-colors shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input Dock */}
      <div className="shrink-0 bg-white p-4 sm:p-6 pb-6 sm:pb-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-gray-100 z-20">
        <div className="mx-auto max-w-3xl relative">

          {inputError && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} id="input-error" className="absolute -top-7 left-0 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md" role="alert">
              {inputError}
            </motion.p>
          )}

          <div className={`relative flex items-end gap-2 rounded-2xl border bg-white p-2 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-500/50 ${inputError ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200 hover:border-gray-300'}`}>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleUpload}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-10 w-10 shrink-0 rounded-xl mb-1 ml-1 text-gray-500 hover:bg-gray-100 hover:text-primary-600 transition-colors ${isUploading ? 'animate-pulse bg-gray-100' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isUploading}
              title="Attach Medical Report (PDF)"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms or ask a medical question..."
              className="max-h-[120px] min-h-[44px] w-full resize-none bg-transparent py-3 text-[15px] outline-none placeholder:text-gray-400 disabled:opacity-50"
              disabled={isLoading || isUploading}
              aria-invalid={!!inputError}
              rows={1}
            />

            <Button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isUploading}
              className={`h-10 w-10 shrink-0 rounded-xl mb-1 mr-1 transition-all duration-200 flex items-center justify-center p-0
                 ${input.trim() && !isLoading ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-md' : 'bg-gray-100 text-gray-400'}`}
              aria-label="Send message"
            >
              <Send className="h-[18px] w-[18px] ml-0.5" aria-hidden />
            </Button>

          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
            MedAI can make mistakes. Please verify important medical information with a doctor.
          </p>
        </div>
      </div>

    </div>
  );
}
