import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatUI } from "@/components/ChatUI";
import { Navbar } from "@/components/Navbar";
import { isAuthenticated } from "@/lib/auth";

export function GuestChatPage() {
  const navigate = useNavigate();

  // If already authenticated, redirect to the personalized chat
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard/chat", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 flex flex-col px-4 py-4 sm:py-6">
        <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto min-h-0">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 mb-3 sm:mb-4 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content-primary">Chat with AI Doctor</h2>
            <p className="mt-1 text-xs sm:text-sm text-content-secondary">
              Ask medical questions freely. No login required.
            </p>
          </motion.div>
          <div className="flex-1 w-full relative min-h-0" style={{ minHeight: "500px" }}>
            <ChatUI mode="guest" />
          </div>
        </div>
      </main>
    </div>
  );
}
