import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatUI } from "@/components/ChatUI";
import { Plus, Search, MessageSquare, History, X, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getChatSessions, deleteChatSession, type ChatSessionSummary } from "@/lib/api";

function groupSessionsByDate(sessions: ChatSessionSummary[]): Record<string, ChatSessionSummary[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const last7 = new Date(today.getTime() - 7 * 86400000);

  const groups: Record<string, ChatSessionSummary[]> = {};

  for (const session of sessions) {
    const d = new Date(session.updated_at);
    let group: string;
    if (d >= today) group = "Today";
    else if (d >= yesterday) group = "Yesterday";
    else if (d >= last7) group = "Last 7 Days";
    else group = "Older";

    if (!groups[group]) groups[group] = [];
    groups[group].push(session);
  }

  return groups;
}

export function ChatPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    try {
      await deleteChatSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
    } catch {
      // failed silently
    } finally {
      setDeletingId(null);
    }
  };

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChatSessions();
      setSessions(data.sessions);
    } catch {
      // silently fail — empty state will show
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (historyOpen) fetchSessions();
  }, [historyOpen, fetchSessions]);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupedSessions = groupSessionsByDate(filteredSessions);

  const GROUP_ORDER = ["Today", "Yesterday", "Last 7 Days", "Older"];
  const orderedGroups = GROUP_ORDER.filter((g) => groupedSessions[g]);

  const HistoryPanel = (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className="absolute inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-surface/90 backdrop-blur-xl shadow-2xl border-l border-stone-200 flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-stone-200">
        <h3 className="font-semibold text-content-primary">Chat History</h3>
        <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(false)}>
          <X className="h-5 w-5 text-content-secondary" />
        </Button>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-elevated rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-content-tertiary" />
          </div>
        ) : orderedGroups.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-8 w-8 mx-auto text-content-tertiary mb-2" />
            <p className="text-sm text-content-tertiary">No chats yet</p>
          </div>
        ) : (
          orderedGroups.map((group) => (
            <div key={group}>
              <h4 className="px-1 mb-2 text-[10px] font-bold uppercase tracking-wider text-content-tertiary">
                {group}
              </h4>
              <div className="space-y-1">
                {groupedSessions[group].map((session) => (
                  <div
                    key={session.session_id}
                    className="group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left text-content-secondary hover:bg-surface-muted hover:text-content-primary transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-content-tertiary" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="truncate font-medium">{session.title}</span>
                      <span className="text-[10px] text-content-tertiary">
                        {session.message_count} messages{session.active ? " · Active" : ""}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, session.session_id)}
                      disabled={deletingId === session.session_id}
                      className="shrink-0 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-content-tertiary hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Delete chat"
                    >
                      {deletingId === session.session_id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-surface">
      {/* Top Header */}
      <header className="shrink-0 h-14 border-b border-stone-200 bg-surface/80 backdrop-blur-md px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-content-primary hidden sm:block">Chat with AI Doctor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
          <Button variant="outline" size="icon" className="sm:hidden rounded-xl">
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button variant="secondary" size="sm" onClick={() => setHistoryOpen(true)} className="gap-2 rounded-xl">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </div>
      </header>

      {/* History Overlay */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            {HistoryPanel}
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-5xl mx-auto p-2 sm:p-4 flex flex-col min-h-0 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 mb-2 sm:mb-3 px-2 sm:hidden">
          <h2 className="text-xl font-bold text-content-primary">Chat with AI Doctor</h2>
        </motion.div>
        <div className="flex-1 w-full relative min-h-0 overflow-hidden">
          <ChatUI />
        </div>
      </div>
    </div>
  );
}
