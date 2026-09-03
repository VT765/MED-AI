// ─────────────────────────────────────────────────────────────────────────────
// AiAnatomyAssistant.tsx — AI-Powered Medical Anatomy Copilot
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { aiAnatomyPresets, type AiPromptPreset } from "@/data/anatomyData";
import { useViewerStore } from "@/stores/useViewerStore";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  citations?: string[];
}

export function AiAnatomyAssistant() {
  const isAiAssistantOpen = useViewerStore((s) => s.isAiAssistantOpen);
  const setIsAiAssistantOpen = useViewerStore((s) => s.setIsAiAssistantOpen);
  const activeOrganId = useViewerStore((s) => s.activeOrganId);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your AI Anatomy & Physiology Copilot. You can ask me anything about the **Heart**, cardiac conduction, valve mechanics, histology, hemodynamics, or clinical pathologies. What would you like to explore?",
      timestamp: "Just now",
      citations: ["Guyton & Hall Medical Physiology", "Netter's Clinical Anatomy"],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isAiAssistantOpen) return null;

  const handleSend = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    // Simulate AI medical response with clinical depth
    setTimeout(() => {
      let aiResponseText = "";
      let citations: string[] = ["Harrison's Principles of Internal Medicine", "Robbins Basic Pathology"];

      const lowerQ = q.toLowerCase();
      if (lowerQ.includes("conduction") || lowerQ.includes("sa node") || lowerQ.includes("av node")) {
        aiResponseText = `### Cardiac Electrical Conduction Pathway\n\n1. **Sinoatrial (SA) Node**: Located in the posterior wall of the right atrium near the SVC entrance. Its spontaneous Phase 4 depolarization via **$I_f$ ('funny') channels** sets the intrinsic heart rate (60–100 bpm).\n2. **Internodal Tracts & Bachmann's Bundle**: Propagates impulses across the atria to ensure simultaneous right and left atrial contraction.\n3. **Atrioventricular (AV) Node**: Creates a crucial **physiological delay of ~0.12 to 0.20 seconds** (PR interval). This allows adequate time for atrial systole to fill the ventricles before ventricular systole begins.\n4. **Bundle of His & Purkinje Fibers**: Rapidly conducts impulses down the interventricular septum to the ventricular apex and papillary muscles, triggering coordinated apex-to-base contraction.`;
        citations = ["Braunwald's Heart Disease", "Guyton & Hall Medical Physiology"];
      } else if (lowerQ.includes("valve") || lowerQ.includes("aortic valve") || lowerQ.includes("mitral")) {
        aiResponseText = `### Biomechanics of Cardiac Valves\n\nThe heart features **4 valves** divided into two functional categories:\n\n- **Atrioventricular (AV) Valves (Mitral & Tricuspid)**: Prevent regurgitation into the atria during ventricular systole. Crucially anchored by fibrous **chordae tendineae** connected to ventricular **papillary muscles**, which contract synchronously with the myocardium to prevent leaflet prolapse under 120 mmHg pressures.\n- **Semilunar Valves (Aortic & Pulmonary)**: Consist of three pocket-like fibrous cusps without chordae. During ventricular diastole, back pressure from arterial recoil fills the pocket sinuses (Sinuses of Valsalva), snapping the free edges together in the midline to form a hermetic seal.`;
        citations = ["Netter's Cardiology", "Robbins & Cotran Pathologic Basis of Disease"];
      } else if (lowerQ.includes("infarction") || lowerQ.includes("heart attack") || lowerQ.includes("stemi")) {
        aiResponseText = `### Cellular Cascades in Acute Myocardial Infarction\n\n1. **Ischemic Onset (0–2 minutes)**: Sudden occlusion of a coronary artery (e.g. LAD) halts mitochondrial aerobic oxidative phosphorylation. Intracellular ATP depletes rapidly.\n2. **Anaerobic Glycolysis (2–10 minutes)**: Lactic acid accumulates, dropping intracellular pH. $Na^+/K^+$ ATPase pumps fail, causing cellular edema and loss of myocardial contractility within 60 seconds.\n3. **Irreversible Cell Death (20–30 minutes)**: Massive calcium influx triggers intracellular protease and lipase activation, sarcolemma rupture, and release of diagnostic biomarkers: **High-Sensitivity Cardiac Troponin I/T (hs-cTn)** and CK-MB.\n4. **Time Window**: Door-to-balloon primary PCI must occur within **< 90 minutes** to salvage ischemic penumbra.`;
        citations = ["ACC/AHA STEMI Guidelines 2023", "ESC Clinical Practice Guidelines"];
      } else if (lowerQ.includes("brain") || lowerQ.includes("metabolism") || lowerQ.includes("compare")) {
        aiResponseText = `### Heart vs. Brain Metabolic Demands\n\n- **The Heart (Cor)**: An **aerobic omnivore**. Relies primarily on **free fatty acid beta-oxidation (60–70%)**, followed by lactate and glucose. It has the highest mitochondrial density of any organ (~35% cell volume) to support relentless contraction.\n- **The Brain (Encephalon)**: An **obligate glucose consumer**. Consumes ~120g of glucose daily (~20% of total body resting glucose & oxygen), crossing the blood-brain barrier via GLUT1/GLUT3 transporters. In prolonged fasting, it shifts to ketone bodies (beta-hydroxybutyrate).\n- **Clinical Implication**: Hypoglycemia causes immediate cerebral syncope, while the heart can seamlessly switch to burning fatty acids and lactate.`;
        citations = ["Marks' Basic Medical Biochemistry", "Boron & Boulpaep Medical Physiology"];
      } else {
        aiResponseText = `### Anatomical & Clinical Overview\n\nThank you for asking about **${q}**.\n\nThe human cardiovascular system is a closed hydrodynamic circuit functioning at an average cardiac output of **5.0 L/min**. The left ventricle acts as the high-pressure engine (systolic pressure 120 mmHg), whereas the right ventricle circulates deoxygenated blood through the low-resistance pulmonary vascular bed (mean pressure 15 mmHg).\n\nKey anatomical landmarks include the **Aortic Arch**, **Coronary Sinuses**, **Atrioventricular Valves**, and **Intercalated Discs** with connexin-43 gap junctions that enable electrical syncytial coupling.\n\n*Feel free to select one of the preset chips below to drill down into specific physiological pathways.*`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        citations,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="border border-stone-200 w-full max-w-3xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-content-primary bg-white">
        {/* ── Modal Header ──────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-content-primary">
                  AI Anatomy & Physiology Copilot
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 rounded-full border border-primary-200">
                  Grounded Medical Intelligence
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                Ask questions about organ anatomy, microscopic histology, circulation pathways, and pathologies.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAssistantOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-content-primary hover:bg-stone-100 transition-colors"
            title="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Quick Prompt Chips ─────────────────────────────────────── */}
        <div className="border-b border-stone-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0 bg-stone-50/60">
          <span className="text-[10px] uppercase font-bold text-content-tertiary flex items-center gap-1 flex-shrink-0">
            <Lightbulb className="w-3 h-3 text-primary-600" />
            Prompts:
          </span>
          {aiAnatomyPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSend(preset.query)}
              className="px-2.5 py-1 text-content-secondary hover:text-primary-700 hover:bg-primary-50/60 border border-stone-200 hover:border-primary-300 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs flex-shrink-0 bg-white"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* ── Messages Chat Scroll Area ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-surface">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  msg.sender === "user"
                    ? "bg-primary-600 text-white font-bold"
                    : "bg-primary-50 text-primary-700 border border-primary-200"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary-600 text-white rounded-tr-sm shadow-soft"
                    : "bg-white border border-stone-200 text-content-primary rounded-tl-sm shadow-xs"
                }`}
              >
                <div className="prose prose-xs max-w-none text-current">
                  {msg.text.split("\n\n").map((para, i) => {
                    if (para.startsWith("### ")) {
                      return (
                        <h4 key={i} className={`text-sm font-extrabold mb-1.5 ${msg.sender === "user" ? "text-white" : "text-primary-800"}`}>
                          {para.replace("### ", "")}
                        </h4>
                      );
                    }
                    return (
                      <p key={i} className="mb-2 last:mb-0">
                        {para}
                      </p>
                    );
                  })}
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className={`mt-3 pt-2 border-t flex items-center gap-1.5 text-[10px] ${msg.sender === "user" ? "border-white/20 text-white/80" : "border-stone-100 text-content-tertiary"}`}>
                    <BookOpen className="w-3 h-3" />
                    <span>References: {msg.citations.join(" · ")}</span>
                  </div>
                )}

                <span className={`block text-[9px] mt-1.5 text-right ${msg.sender === "user" ? "text-white/70" : "text-content-tertiary"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-primary-50 text-primary-700 border border-primary-200 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="border border-stone-200 rounded-2xl p-3 shadow-xs bg-white">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-content-tertiary ml-1 font-medium">
                    Consulting medical ontology…
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Box & Footer ────────────────────────────────────── */}
        <div className="p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about coronary arteries, cardiac cycle, valves, histology..."
              className="flex-1 px-4 py-2.5 rounded-2xl text-xs text-content-primary placeholder:text-stone-400 bg-stone-50 border border-stone-200 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-soft"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
