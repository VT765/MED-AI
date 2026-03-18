import { motion } from "framer-motion";
import { ChatUI } from "@/components/ChatUI";

export function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 mb-4 px-2">
        <h2 className="text-2xl font-bold text-content-primary">Chat with AI Doctor</h2>
        <p className="mt-1 text-sm text-content-secondary">
          Describe your symptoms. AI suggestions are not a replacement for certified doctors.
        </p>
      </motion.div>
      <div className="flex-1 w-full relative min-h-0">
        <ChatUI />
      </div>
    </div>
  );
}
