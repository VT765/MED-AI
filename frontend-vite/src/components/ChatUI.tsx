import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Paperclip, BrainCircuit, FileText, Plus, Loader2, AlertTriangle, LogIn, Stethoscope, Mic, Square, ArrowDown, X, AudioLines, RefreshCw, Copy, Check } from "lucide-react";
import { VoiceMode } from "@/components/VoiceMode";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/lib/auth";
import { useChatUiStore } from "@/stores/useChatUiStore";
import {
  apiUrl,
  sendChatMessage,
  getChatHistory,
  startNewChat,
  sendGuestChatMessage,
  startNewGuestChat,
  transcribeAudio,
  getSessionHistory,
  streamChatMessage,
} from "@/lib/api";

export type ChatMode = "guest" | "authenticated";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatTimer(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const WAVEFORM_BARS = 28;

// ── Markdown renderer for assistant replies ─────────────────
function MessageMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 last:mb-0 list-disc pl-5 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 last:mb-0 list-decimal pl-5 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-content-primary">{children}</strong>,
        h1: ({ children }) => <h3 className="mt-3 mb-1.5 first:mt-0 text-[15px] font-bold text-content-primary">{children}</h3>,
        h2: ({ children }) => <h3 className="mt-3 mb-1.5 first:mt-0 text-[15px] font-bold text-content-primary">{children}</h3>,
        h3: ({ children }) => <h4 className="mt-2.5 mb-1 first:mt-0 text-sm font-bold text-content-primary">{children}</h4>,
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[13px] font-mono text-stone-700">{children}</code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 border-primary-300 pl-3 text-content-secondary italic">{children}</blockquote>
        ),
        table: ({ children }) => (
          <div className="mb-2 overflow-x-auto">
            <table className="w-full border-collapse text-xs">{children}</table>
          </div>
        ),
        th: ({ children }) => <th className="border border-stone-200 bg-stone-50 px-2 py-1.5 text-left font-semibold">{children}</th>,
        td: ({ children }) => <td className="border border-stone-200 px-2 py-1.5">{children}</td>,
        hr: () => <hr className="my-3 border-stone-200" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ── Guest Welcome Card ──────────────────────────────────────

function GuestWelcomeCard({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-lg"
    >
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-soft text-center">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
          <Stethoscope className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-content-primary">General Health Assistant</h3>
        <p className="mt-2 text-sm text-content-secondary leading-relaxed">
          Ask any common health question and get general medical information instantly — no sign-up, no data stored.
        </p>
        <div className="mt-5 rounded-xl bg-primary-50 border border-primary-100 p-4 text-left">
          <p className="text-sm font-medium text-primary-800">💬 How this works</p>
          <ul className="mt-2 space-y-1.5 text-xs text-primary-700/80 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">1.</span>
              <span>Ask a general health or medical question</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">2.</span>
              <span>Get common, evidence-based information back</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">3.</span>
              <span>No personal data is collected or stored</span>
            </li>
          </ul>
        </div>
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-left">
          <p className="text-[11px] text-amber-700 font-medium">⚠️ Guest Mode provides general information only. For personalized medical advice, log in to unlock the full AI Doctor experience.</p>
        </div>
        <Button
          onClick={onContinue}
          className="mt-4 h-11 w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold"
        >
          Ask a Question
        </Button>
        <p className="mt-3 text-[11px] text-content-tertiary">
          No sign-up needed · No data stored · General info only
        </p>
      </div>
    </motion.div>
  );
}

// ── Main ChatUI Component ───────────────────────────────────

interface ChatUIProps {
  mode?: ChatMode;
  /** When set, loads that past session's messages into the chat. */
  requestedSessionId?: string | null;
}

export function ChatUI({ mode = "authenticated", requestedSessionId }: ChatUIProps) {
  const isGuest = mode === "guest";
  const newChatCounter = useChatUiStore((s) => s.newChatCounter);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!isGuest);
  const [inputError, setInputError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedDocText, setExtractedDocText] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(isGuest);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [retryText, setRetryText] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => new Array(WAVEFORM_BARS).fill(0.08));
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const recordStartRef = useRef<number>(0);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // Show a scroll-to-bottom pill when the user has scrolled up
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 280);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isLoadingHistory]);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Load a specific past session picked from the history panel
  useEffect(() => {
    if (!requestedSessionId || isGuest) return;
    let cancelled = false;
    (async () => {
      setIsLoadingHistory(true);
      try {
        const data = await getSessionHistory(requestedSessionId);
        if (cancelled) return;
        setSessionId(data.session_id);
        setMessages(
          (data.messages || []).map((m, i) => ({
            id: `sess-${requestedSessionId}-${i}`,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.timestamp),
          }))
        );
      } catch {
        // keep current conversation on failure
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    })();
    return () => { cancelled = true; };
  }, [requestedSessionId, isGuest]);

  // Load chat history on mount (authenticated only)
  useEffect(() => {
    if (isGuest) {
      // Guest starts fresh — no history to load
      return;
    }
    async function loadHistory() {
      try {
        const data = await getChatHistory();
        if (data.session_id) setSessionId(data.session_id);
        if (data.messages && data.messages.length > 0) {
          const loaded: ChatMessage[] = data.messages.map((m, i) => ({
            id: `hist-${i}`,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(loaded);
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadHistory();
  }, [isGuest]);

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
      const res = await fetch(apiUrl("/api/documents/upload"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setDocumentId(data.document.id);
      setFileName(data.document.filename);
      if (data.document.extractedText) setExtractedDocText(data.document.extractedText);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(), role: "system",
        content: `📄 Uploaded: ${file.name}. You can now ask questions about it.`,
        timestamp: new Date(),
      }]);
    } catch (err: any) {
      setInputError(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Voice input: record → transcribe → drop text into the box ──

  const appendTranscript = (text: string) => {
    setInput((prev) => (prev ? `${prev.trim()} ${text}` : text));
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }, 30);
  };

  // Tear down the live audio visualiser + timer.
  const stopAudioViz = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setLevels(new Array(WAVEFORM_BARS).fill(0.08));
    setRecordingTime(0);
  }, []);

  // Feed the waveform bars from the live mic amplitude.
  const startAudioViz = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx: AudioContext = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      audioContextRef.current = audioCtx;
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(data);
        const next: number[] = [];
        for (let i = 0; i < WAVEFORM_BARS; i++) {
          // Sample lower/mid bins where voice energy lives, mirror for symmetry.
          const idx = Math.floor(Math.abs(i - WAVEFORM_BARS / 2)) + 1;
          next.push(Math.max(0.08, (data[idx] ?? 0) / 255));
        }
        setLevels(next);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Visualiser is best-effort; recording still works without it.
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    setInputError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setInputError("Voice input isn't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stopAudioViz();
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (blob.size === 0) return;

        setIsTranscribing(true);
        try {
          const { text } = await transcribeAudio(blob);
          if (text) appendTranscript(text);
          else setInputError("Didn't catch that — please try again.");
        } catch (err: any) {
          setInputError(err.message || "Couldn't transcribe your voice. Please try again.");
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Kick off the live waveform + elapsed timer.
      startAudioViz(stream);
      recordStartRef.current = Date.now();
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - recordStartRef.current) / 1000));
      }, 250);
    } catch {
      setInputError("Microphone access was blocked. Allow mic access to use voice input.");
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  // Stop any active recording/stream if the component unmounts mid-record.
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      stopAudioViz();
    };
  }, [stopAudioViz]);

  const sendText = useCallback(async (trimmed: string) => {
    setInputError(null);
    setRetryText(null);
    if (!trimmed || isLoading) return;

    let messageToSend = trimmed;
    if (!isGuest && extractedDocText) {
      messageToSend = `[Document Context: ${extractedDocText.substring(0, 2000)}]\n\nUser question: ${trimmed}`;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: "user", content: trimmed, timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    const replyId = `reply-${Date.now()}`;
    try {
      if (isGuest) {
        const response = await sendGuestChatMessage(messageToSend, sessionId);
        if (response.session_id) setSessionId(response.session_id);
        setMessages((prev) => [...prev, {
          id: replyId, role: "assistant",
          content: response.reply, timestamp: new Date(response.timestamp),
        }]);
      } else {
        // Stream the reply token-by-token into a growing assistant bubble
        let placeholderAdded = false;
        const response = await streamChatMessage(messageToSend, sessionId, (fullText) => {
          setIsLoading(false); // first token arrived — swap dots for real text
          if (!placeholderAdded) {
            placeholderAdded = true;
            setMessages((prev) => [...prev, {
              id: replyId, role: "assistant", content: fullText, timestamp: new Date(),
            }]);
          } else {
            setMessages((prev) =>
              prev.map((m) => (m.id === replyId ? { ...m, content: fullText } : m))
            );
          }
        });
        if (response.session_id) setSessionId(response.session_id);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === replyId
              ? { ...m, content: response.reply, timestamp: new Date(response.timestamp) }
              : m
          )
        );
      }
    } catch (err: any) {
      // Drop a partially-streamed bubble so the retry starts clean
      setMessages((prev) => prev.filter((m) => m.id !== replyId));
      const errorMessage = err.message?.includes("401") || err.message?.includes("authorized")
        ? "Session expired. Please log in again."
        : err.message || "Failed to get a response. Please try again.";
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`, role: "system",
        content: `⚠️ ${errorMessage}`, timestamp: new Date(),
      }]);
      setRetryText(trimmed);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isLoading, sessionId, extractedDocText, isGuest]);

  const handleSend = useCallback(() => {
    sendText(input.trim());
  }, [input, sendText]);

  const handleRetry = useCallback(() => {
    if (!retryText || isLoading) return;
    // Remove the previous failed user message + error bubble before resending
    setMessages((prev) => {
      const next = [...prev];
      while (next.length > 0) {
        const last = next[next.length - 1];
        if (last.role === "system" && last.id.startsWith("err-")) { next.pop(); continue; }
        if (last.role === "user" && last.content === retryText) { next.pop(); break; }
        break;
      }
      return next;
    });
    const text = retryText;
    setRetryText(null);
    // Defer so the message-list cleanup lands before the resend appends
    setTimeout(() => sendText(text), 0);
  }, [retryText, isLoading, sendText]);

  // Voice mode: send a spoken turn through the chat, mirror it into the
  // transcript, and return the reply text for TTS playback.
  const sendVoiceMessage = useCallback(async (text: string): Promise<string> => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(), role: "user", content: text, timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const response = isGuest
      ? await sendGuestChatMessage(text, sessionId)
      : await sendChatMessage(text, sessionId);
    if (response.session_id) setSessionId(response.session_id);
    setMessages((prev) => [...prev, {
      id: (Date.now() + 1).toString(), role: "assistant",
      content: response.reply, timestamp: new Date(response.timestamp),
    }]);
    return response.reply;
  }, [isGuest, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleNewChat = async () => {
    if (isLoading) return;
    try {
      const data = isGuest ? await startNewGuestChat() : await startNewChat();
      setSessionId(data.session_id);
      setDocumentId(null);
      setFileName(null);
      setExtractedDocText(null);
      if (isGuest) {
        setShowWelcome(true);
      }
      setMessages([]);
    } catch (err: any) {
      setInputError(err.message || "Failed to start new chat");
    }
  };

  // Header "New Chat" CTA (rendered in the dashboard layout) triggers this
  useEffect(() => {
    if (newChatCounter > 0) handleNewChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChatCounter]);

  // Pool of realistic quick prompts — randomized each session for freshness
  const allGuestPrompts = [
    "What are common causes of headaches?",
    "How can I improve my sleep quality?",
    "What helps with a sore throat?",
    "What are signs of dehydration?",
    "How to relieve back pain naturally?",
    "What causes frequent fatigue?",
    "When should I see a doctor for a cough?",
    "What are common cold vs flu differences?",
    "How to manage stress and anxiety?",
    "What foods help with digestion?",
    "How much water should I drink daily?",
    "What causes muscle cramps?",
  ];

  const allAuthPrompts = [
    "I have a headache",
    "What are signs of flu?",
    "How can I sleep better?",
    "Explain my latest report",
  ];

  // Pick 5 random prompts for guests, 3 for auth — stable per component mount
  const [quickPrompts] = useState(() => {
    if (isGuest) {
      const shuffled = [...allGuestPrompts].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 5);
    }
    return allAuthPrompts;
  });

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleGuestContinue = () => {
    setShowWelcome(false);
    setMessages([{
      id: "guest-welcome",
      role: "assistant",
      content: `👋 Welcome to Med-AI Guest Mode!\n\nI can help with general health questions and provide common medical information. Each question is treated independently — no conversation history or personal data is stored.\n\nAsk me anything about common symptoms, general wellness, or health topics!\n\n⚕️ For personalized advice, consider logging in.`,
      timestamp: new Date(),
    }]);
  };

  if (isLoadingHistory) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-stone-200 bg-surface">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <p className="text-sm text-content-secondary">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Guest welcome screen
  if (isGuest && showWelcome) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-surface shadow-card">
        {/* Guest header */}
        <div className="shrink-0 border-b border-stone-200 bg-surface px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 sticky top-0 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-inner border border-primary-200">
              <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight flex items-center gap-2">
                🟢 Guest Mode
              </h3>
              <p className="text-xs sm:text-sm font-medium text-content-secondary mt-0.5">
                General Medical Guidance
              </p>
            </div>
          </div>
          <Link
            to="/auth/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary-50 px-3 sm:px-4 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Login for Personalized AI</span>
            <span className="sm:hidden">Login</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gray-50/50">
          <GuestWelcomeCard onContinue={handleGuestContinue} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-surface relative" role="region" aria-label="AI Doctor chat">

      {/* Header — guest mode only; authenticated CTAs live in the app header */}
      {isGuest && (
        <div className="shrink-0 border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between z-10 bg-white/85 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft" aria-hidden>
              <BrainCircuit className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-content-primary leading-tight">Guest Mode</h3>
              <p className="text-[11px] text-content-tertiary">General medical guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to="/auth/login"
              className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-xl bg-primary-50 px-3 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login for Personalized AI
            </Link>
            <Button type="button" variant="ghost" size="sm" onClick={handleNewChat} disabled={isLoading}
              className="h-8 gap-1.5 rounded-xl text-xs font-semibold text-content-secondary hover:bg-primary-50 hover:text-primary-700 transition-colors" title="Start new chat">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-stone-50/80 to-white p-4 sm:p-6 scroll-smooth">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:gap-5">

          {/* Empty state — modern hero with quick prompts */}
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center text-center pt-[10vh] px-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-600 text-white shadow-soft mb-4">
                <Stethoscope className="h-7 w-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">
                How can I help you today?
              </h2>
              <p className="mt-1.5 text-sm text-content-secondary max-w-sm">
                Describe your symptoms, ask a health question, or attach a medical report.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-left text-xs sm:text-sm font-medium text-content-secondary hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700 transition-all shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-[11px] text-content-tertiary">
                ⚕️ I'm an AI assistant, not a real doctor — always verify with a professional.
              </p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isSystem = msg.role === "system";

              if (isSystem) {
                const canRetry = msg.id.startsWith("err-") && !!retryText && !isLoading;
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-1.5 my-1">
                    <div className={cn("rounded-full px-4 py-1.5 text-xs font-medium max-w-[90%] text-center",
                      msg.content.startsWith("⚠️") ? "bg-red-50 border border-red-200 text-red-600" : "bg-stone-100 border border-stone-200 text-stone-500"
                    )}>
                      {msg.content}
                    </div>
                    {canRetry && (
                      <button
                        onClick={handleRetry}
                        className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-content-secondary hover:border-primary-300 hover:text-primary-700 transition-colors shadow-xs"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Try again
                      </button>
                    )}
                  </motion.div>
                );
              }

              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  className={cn("group flex gap-2.5 w-full", isUser ? "justify-end" : "justify-start")}>
                  {!isUser && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-teal-600 shadow-xs" aria-hidden>
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={cn("flex flex-col max-w-[88%] sm:max-w-[78%]", isUser && "items-end")}>
                    <div className={cn("px-4 py-2.5 sm:py-3 text-sm sm:text-[15px] leading-relaxed",
                      isUser
                        ? "rounded-2xl rounded-br-md bg-primary-600 text-white shadow-soft"
                        : "rounded-2xl rounded-bl-md border border-stone-200/80 bg-white text-content-primary shadow-xs"
                    )}>
                      {isUser ? (
                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                      ) : (
                        <MessageMarkdown content={msg.content} />
                      )}
                    </div>
                    <span className="mt-1 flex items-center gap-1.5 px-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-[10px] font-medium text-content-tertiary">
                        {formatTime(msg.timestamp)}
                      </span>
                      {!isUser && (
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(msg.content).then(() => {
                              setCopiedId(msg.id);
                              setTimeout(() => setCopiedId(null), 1500);
                            });
                          }}
                          className="rounded p-0.5 text-content-tertiary hover:text-primary-600 transition-colors"
                          title="Copy message"
                          aria-label="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-primary-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5 w-full">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-teal-600 shadow-xs" aria-hidden>
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-stone-200/80 bg-white px-4 py-3.5 shadow-xs" role="status" aria-label="AI is typing">
                <div className="flex gap-1.5 items-center h-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-400" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Scroll-to-bottom pill */}
      <AnimatePresence>
        {showScrollDown && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={scrollToBottom}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-content-secondary shadow-cardHover hover:text-primary-600 hover:border-primary-300 transition-colors"
            aria-label="Scroll to latest message"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="shrink-0 bg-white/90 backdrop-blur-md p-3 sm:p-4 pb-3 sm:pb-4 border-t border-stone-100 z-20">
        <div className="mx-auto max-w-3xl relative">
          {/* Voice conversation widget — docked above the input bar */}
          <AnimatePresence>
            {isVoiceModeOpen && (
              <VoiceMode
                onClose={() => setIsVoiceModeOpen(false)}
                onSendMessage={sendVoiceMessage}
              />
            )}
          </AnimatePresence>

          {!isGuest && fileName && (
            <div className="mb-2 inline-flex items-center gap-1.5 bg-primary-50 pl-2.5 pr-1.5 py-1 rounded-full border border-primary-100">
              <FileText className="w-3.5 h-3.5 text-primary-600" />
              <span className="text-[11px] font-semibold text-primary-700 max-w-[160px] truncate">{fileName}</span>
              <button
                type="button"
                onClick={() => { setDocumentId(null); setFileName(null); setExtractedDocText(null); }}
                className="rounded-full p-0.5 text-primary-400 hover:bg-primary-100 hover:text-primary-700"
                title="Remove attached report"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {inputError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="absolute -top-8 left-0 right-0 flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200" role="alert">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {inputError}
            </motion.div>
          )}

          <div className={`relative flex items-end gap-1.5 sm:gap-2 rounded-[1.4rem] border bg-white p-1.5 sm:p-2 shadow-soft transition-all duration-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10 ${inputError ? "border-red-300 ring-4 ring-red-50" : "border-stone-200 hover:border-stone-300"}`}>
            {/* File upload — authenticated only */}
            {!isGuest && (
              <>
                <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleUpload} />
                <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading} title="Attach Medical Report (PDF)"
                  className={`h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl mb-0.5 sm:mb-1 ml-0.5 sm:ml-1 text-gray-500 hover:bg-gray-100 hover:text-primary-600 transition-colors ${isUploading ? "animate-pulse bg-gray-100" : ""}`}>
                  <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </>
            )}

            {isRecording ? (
              <div className="flex-1 flex items-center gap-2 sm:gap-3 h-[44px] px-2 sm:px-3" role="status" aria-label="Recording your voice">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                <span className="text-xs font-bold text-red-500 tabular-nums shrink-0">{formatTimer(recordingTime)}</span>
                <div className="flex-1 flex items-center justify-center gap-[3px] h-8 overflow-hidden">
                  {levels.map((l, i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-primary-500 transition-[height] duration-75 ease-out"
                      style={{ height: `${Math.max(10, l * 100)}%` }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-content-tertiary shrink-0 hidden sm:inline">Recording…</span>
              </div>
            ) : (
              <textarea ref={textareaRef} value={input} onChange={handleInput} onKeyDown={handleKeyDown}
                placeholder={
                  isTranscribing ? "Transcribing your voice…"
                  : isGuest ? "Ask a health question..."
                  : "Describe your symptoms or ask a health question..."
                }
                className={cn(
                  "max-h-[120px] min-h-[40px] sm:min-h-[44px] w-full resize-none bg-transparent py-2.5 sm:py-3 text-sm sm:text-[15px] outline-none placeholder:text-gray-400 disabled:opacity-50",
                  isTranscribing && "animate-pulse",
                  isGuest && "ml-3"
                )}
                disabled={isLoading || isUploading || isTranscribing} aria-invalid={!!inputError} rows={1} />
            )}

            {/* Voice conversation mode — talk and hear replies */}
            <Button type="button" variant="ghost" size="icon"
              onClick={() => setIsVoiceModeOpen(true)}
              disabled={isLoading || isUploading || isTranscribing || isRecording}
              aria-label="Start voice conversation"
              title="Voice conversation — speak and hear replies"
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl mb-0.5 sm:mb-1 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center justify-center p-0">
              <AudioLines className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Voice input — record then transcribe */}
            <Button type="button" variant="ghost" size="icon" onClick={toggleRecording}
              disabled={isLoading || isUploading || isTranscribing}
              aria-label={isRecording ? "Stop recording" : "Record voice message"}
              title={isRecording ? "Stop recording" : "Speak your question"}
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl mb-0.5 sm:mb-1 transition-colors flex items-center justify-center p-0",
                isRecording
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                  : "text-gray-500 hover:bg-gray-100 hover:text-primary-600"
              )}>
              {isTranscribing ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : isRecording ? (
                <Square className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            <Button type="button" onClick={handleSend} disabled={!input.trim() || isLoading || isUploading || isRecording || isTranscribing} aria-label="Send message"
              className={`h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl mb-0.5 sm:mb-1 mr-0.5 sm:mr-1 transition-all duration-200 flex items-center justify-center p-0 ${input.trim() && !isLoading ? "bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-md" : "bg-gray-100 text-gray-400"}`}>
              <Send className="h-4 w-4 sm:h-[18px] sm:w-[18px] ml-0.5" aria-hidden />
            </Button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2 sm:mt-3 font-medium">
            MedAI can make mistakes. Always verify with a doctor.
          </p>
        </div>
      </div>

    </div>
  );
}
