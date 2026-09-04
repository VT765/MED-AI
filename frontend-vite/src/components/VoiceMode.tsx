// ─────────────────────────────────────────────────────────────────────────────
// VoiceMode.tsx — Full-screen voice conversation overlay.
// Tap the orb to talk → auto-stops on silence → transcribes (Groq Whisper) →
// sends to the chat API → speaks the reply back (browser speechSynthesis) →
// listens again. Supports Hindi/English replies via language auto-detect.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { transcribeAudio, synthesizeSpeech } from "@/lib/api";

type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface VoiceModeProps {
  onClose: () => void;
  /** Sends the transcribed text through the chat and resolves with the reply. */
  onSendMessage: (text: string) => Promise<string>;
}

// Rough markdown → plain text so TTS doesn't read out symbols.
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[_>#]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const hasDevanagari = (text: string) => /[ऀ-ॿ]/.test(text);

export function VoiceMode({ onClose, onSendMessage }: VoiceModeProps) {
  const [state, setState] = useState<VoiceState>("idle");
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const lastLoudAtRef = useRef(0);
  const spokeAtLeastOnceRef = useRef(false);
  const closedRef = useRef(false);
  // Generation counter: every (re)start of listening bumps this; async steps
  // bail out if a newer generation exists. Prevents StrictMode's double-mount
  // (and rapid taps) from running two recorders that each answer the turn.
  const listenGenRef = useRef(0);
  const stateRef = useRef<VoiceState>("idle");
  stateRef.current = state;
  // Always call the latest onSendMessage — the listen→speak→listen loop is
  // built from closures created on mount, which would otherwise capture a
  // stale callback (and e.g. keep sending a null session id every turn).
  const onSendMessageRef = useRef(onSendMessage);
  onSendMessageRef.current = onSendMessage;

  const teardownAudio = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLevel(0);
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.src = "";
      audioElRef.current = null;
    }
    window.speechSynthesis?.cancel();
  }, []);

  // Fallback: browser speechSynthesis (unreliable on some Chromium forks).
  const speakWithBrowser = useCallback((text: string, finish: () => void) => {
    const synth = window.speechSynthesis;
    if (!synth) { finish(); return; }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(stripMarkdown(text));
    utter.lang = hasDevanagari(text) ? "hi-IN" : "en-US";
    utter.onend = finish;
    utter.onerror = finish;
    // Small delay after cancel() or Chromium drops the utterance
    setTimeout(() => { synth.speak(utter); synth.resume(); }, 150);
  }, []);

  // Speak a reply via server-side TTS (edge neural voices — works in every
  // browser, supports Hindi), then resume listening when playback ends.
  const speak = useCallback(async (text: string, onDone: () => void) => {
    setState("speaking");
    let finished = false;
    const finish = () => { if (!finished) { finished = true; onDone(); } };

    try {
      const blob = await synthesizeSpeech(stripMarkdown(text));
      if (closedRef.current) { finish(); return; }
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioElRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); finish(); };
      audio.onerror = () => { URL.revokeObjectURL(url); finish(); };
      await audio.play();
    } catch {
      if (closedRef.current) { finish(); return; }
      speakWithBrowser(text, finish);
    }
  }, [speakWithBrowser]);

  const startListening = useCallback(async () => {
    if (closedRef.current) return;
    const gen = ++listenGenRef.current;
    // Defensively stop any previous recorder/stream before starting anew
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch { /* already stopped */ }
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Voice isn't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (closedRef.current || gen !== listenGenRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      recorder.onstop = async () => {
        teardownAudio();
        if (closedRef.current || gen !== listenGenRef.current) return;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size === 0 || !spokeAtLeastOnceRef.current) {
          setState("idle");
          return;
        }
        setState("processing");
        try {
          const { text } = await transcribeAudio(blob);
          if (closedRef.current) return;
          if (!text?.trim()) {
            setState("idle");
            setError("Didn't catch that — tap the orb and try again.");
            return;
          }
          const reply = await onSendMessageRef.current(text);
          if (closedRef.current) return;
          speak(reply, () => {
            if (!closedRef.current) startListening();
          });
        } catch (err: any) {
          if (closedRef.current) return;
          setState("idle");
          const msg: string = err?.message || "";
          setError(
            /authoriz|401|token|user not found/i.test(msg)
              ? "Your session has expired — please log out and log in again, then retry voice mode."
              : msg || "Something went wrong. Tap to try again."
          );
        }
      };

      // Live level + silence auto-stop (time-domain RMS — reliable for speech)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx: AudioContext = new AudioCtx();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        lastLoudAtRef.current = Date.now();
        spokeAtLeastOnceRef.current = false;

        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const d = (data[i] - 128) / 128;
            sum += d * d;
          }
          const rms = Math.sqrt(sum / data.length);
          setLevel(Math.min(1, rms * 5));
          if (rms > 0.02) {
            lastLoudAtRef.current = Date.now();
            spokeAtLeastOnceRef.current = true;
          }
          // Stop after 2s of silence (only once they've said something)
          if (
            spokeAtLeastOnceRef.current &&
            Date.now() - lastLoudAtRef.current > 2000 &&
            recorder.state === "recording"
          ) {
            recorder.stop();
            return;
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } else {
        spokeAtLeastOnceRef.current = true; // no analyser — rely on manual stop
      }

      recorder.start();
      mediaRecorderRef.current = recorder;
      setState("listening");
    } catch {
      setError("Microphone access was blocked. Allow mic access to use voice mode.");
      setState("idle");
    }
  }, [speak, teardownAudio]);

  // Auto-start listening when the overlay opens.
  // Reset the closed flag first — React StrictMode runs mount→cleanup→mount,
  // and the first cleanup would otherwise leave us permanently "closed".
  useEffect(() => {
    closedRef.current = false;
    startListening();
    return () => {
      closedRef.current = true;
      listenGenRef.current++;
      stopPlayback();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      teardownAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOrbTap = () => {
    if (state === "listening") {
      // Manual stop always sends, even if the level detector missed the speech
      spokeAtLeastOnceRef.current = true;
      stopListening();
    } else if (state === "speaking") {
      stopPlayback(); // interrupt, then talk
      startListening();
    } else if (state === "idle") {
      startListening();
    }
  };

  const statusLabel =
    state === "listening" ? "Listening… tap when done"
    : state === "processing" ? "Thinking…"
    : state === "speaking" ? "Speaking — tap to interrupt"
    : "Tap the orb to talk";

  const orbScale =
    state === "listening" ? 1 + Math.min(level * 1.6, 0.25)
    : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="mx-auto mb-2.5 flex w-full max-w-sm items-center gap-3.5 rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-md p-2.5 pr-1.5 shadow-cardHover"
      role="dialog"
      aria-label="Voice conversation"
    >
      {/* Orb */}
      <button onClick={handleOrbTap} className="relative shrink-0 outline-none" aria-label={statusLabel}>
        {/* Soft ambient halo */}
        <motion.div
          className="absolute -inset-2 rounded-full bg-teal-300/40 blur-lg"
          animate={{
            opacity: state === "speaking" ? [0.5, 0.9, 0.5] : [0.3, 0.55, 0.3],
            scale: state === "speaking" ? [1, 1.18, 1] : [1, 1.08, 1],
          }}
          transition={{ duration: state === "speaking" ? 1.1 : 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Core orb — small, soft cloudy gradient sphere */}
        <motion.div
          animate={{
            scale:
              state === "listening" ? orbScale
              : state === "speaking" ? [1, 1.07, 0.97, 1.05, 1]
              : 1,
          }}
          transition={
            state === "speaking"
              ? { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
              : { type: "spring", stiffness: 300, damping: 22 }
          }
          className="relative h-12 w-12 rounded-full overflow-hidden shadow-[0_0_20px_-2px_rgba(45,212,191,0.55)]"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #f0fdfa 0%, #99f6e4 28%, #2dd4bf 62%, #0f766e 100%)",
          }}
        >
          {/* Drifting cloud highlight */}
          <motion.div
            className="absolute h-[130%] w-[130%] rounded-full bg-white/60 blur-md"
            animate={{
              x: ["-25%", "5%", "-15%", "-25%"],
              y: ["-30%", "-5%", "-25%", "-30%"],
            }}
            transition={{ duration: state === "processing" ? 2 : 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Deep tint drifting opposite for depth */}
          <motion.div
            className="absolute h-[110%] w-[110%] rounded-full bg-teal-700/50 blur-md"
            animate={{
              x: ["45%", "25%", "40%", "45%"],
              y: ["50%", "30%", "45%", "50%"],
            }}
            transition={{ duration: state === "processing" ? 2.4 : 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </button>

      {/* Status */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-content-primary">{statusLabel}</p>
        {error ? (
          <p className="mt-0.5 text-[11px] leading-snug text-red-500 line-clamp-2">{error}</p>
        ) : (
          <p className="text-[11px] text-content-tertiary">Voice conversation</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-content-primary transition-colors"
        aria-label="Exit voice mode"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
