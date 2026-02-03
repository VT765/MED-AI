import { motion } from "framer-motion";
import { ChatUI } from "@/components/ChatUI";

export function ChatPage() {
  return (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="shrink-0">
        <h2 className="text-2xl font-bold text-content-primary">Chat with AI Doctor</h2>
        <p className="mt-1 text-sm text-content-secondary">
          Describe your symptoms. AI suggestions are not a replacement for certified doctors.
        </p>
      </motion.div>
      <div className="flex-1" style={{ minHeight: "calc(100vh - 280px)", maxHeight: "calc(100vh - 280px)" }}>
        <ChatUI />
      </div>
    </div>
  );
}
