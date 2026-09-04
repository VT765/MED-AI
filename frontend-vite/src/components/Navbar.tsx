import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { getCurrentUser, type User } from "@/lib/auth";
import { useState, useEffect } from "react";

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-surface-elevated/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90" aria-label="MedAI home">
          <Logo size={40} className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight text-content-primary">MedAI</span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex" aria-label="Main">
          {user ? (
            <Link
              to="/dashboard"
              className="rounded-button inline-flex h-10 items-center justify-center bg-primary-500 px-5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-600 active:scale-[0.98]"
            >
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/chat"
                className="rounded-button inline-flex h-10 items-center justify-center gap-2 bg-primary-500 px-5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-600 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                Start Chatting
              </Link>
              <Link
                to="/auth/login"
                className="rounded-button inline-flex h-10 items-center justify-center border border-stone-300 bg-white px-5 text-sm font-semibold text-content-primary shadow-soft transition-all hover:bg-surface-muted active:scale-[0.98]"
              >
                Login / Sign Up
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="rounded-button inline-flex h-10 w-10 items-center justify-center text-content-secondary hover:bg-surface-muted md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-stone-200 bg-surface-elevated px-4 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {user ? (
                <Link to="/dashboard" className="rounded-button px-4 py-3 text-sm font-medium text-content-primary hover:bg-surface-muted" onClick={() => setMobileOpen(false)}>
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/chat" className="rounded-button flex items-center gap-2 bg-primary-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-600" onClick={() => setMobileOpen(false)}>
                    <MessageCircle className="h-4 w-4" />
                    Start Chatting
                  </Link>
                  <Link to="/auth/login" className="rounded-button mt-1 border border-stone-300 bg-white px-4 py-3 text-center text-sm font-semibold text-content-primary hover:bg-surface-muted" onClick={() => setMobileOpen(false)}>
                    Login / Sign Up
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
