"use client";

import { ChatHeader } from "./components/ChatHeader";
import { ChatWindow } from "./components/ChatWindow";
import { ChatProvider, useChatState } from "./context/ChatContext";

export default function Home() {
  return (
    <ChatProvider>
      <MainWithPopup />
    </ChatProvider>
  );
}

function MainWithPopup() {
  const { isChatOpen, openChat, closeChat } = useChatState();

  return (
    <>
      <main className="min-h-screen bg-[var(--nc-bg)] flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--nc-primary)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center max-w-2xl relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold tracking-wide uppercase">
            NutriCare Intelligence System
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight mb-4">
            Nutri<span className="text-[var(--nc-primary)]">Care</span>
          </h1>
          <p className="text-xl text-zinc-500 font-medium max-w-lg mx-auto leading-relaxed">
            المنصة الذكية المتخصصة في تقديم الاستشارات التغذوية المبنية على الأدلة العلمية والأبحاث الدقيقة.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <button
              onClick={openChat}
              className="px-8 py-4 bg-[var(--nc-primary)] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[var(--nc-primary)]/20 hover:bg-[var(--nc-primary-dark)] transition-all active:scale-95 flex items-center gap-3"
            >
              <span>ابدأ المحادثة الآن</span>
              <ChatIcon />
            </button>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label="فتح المحادثة مع نورا"
          className="fixed bottom-8 end-8 z-40 w-16 h-16 rounded-2xl bg-[var(--nc-primary)] text-white shadow-2xl shadow-[var(--nc-primary)]/30 hover:bg-[var(--nc-primary-dark)] hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[var(--nc-primary)]/20 transition-all flex items-center justify-center animate-bounce-slow"
        >
          <ChatIcon />
        </button>
      )}

      {isChatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-300"
          onClick={closeChat}
          aria-modal="true"
          role="dialog"
          aria-label="نافذة المحادثة"
        >
          <div
            className="w-full max-w-[800px] h-[90vh] max-h-[850px] bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col min-h-0 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatHeader />
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-zinc-50/30">
              <ChatWindow />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
