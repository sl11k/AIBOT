"use client";

import { useChatState } from "@/app/context/ChatContext";

export function ChatHeader() {
  const { onNewChat, closeChat } = useChatState();
  return (
    <header className="px-3 sm:px-6 py-3 sm:py-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--nc-primary)] flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm shrink-0">
            N
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-bold text-zinc-900 tracking-tight truncate">
                NutriCare
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">نشط</span>
              </div>
            </div>
            <p className="text-[11px] sm:text-[12px] font-medium text-zinc-500 truncate">
              مساعدك الذكي في التغذية والصحة
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onNewChat}
            className="hidden sm:block px-4 py-2 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95"
          >
            محادثة جديدة
          </button>
          <button
            type="button"
            onClick={onNewChat}
            className="sm:hidden p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-all active:scale-90"
            aria-label="محادثة جديدة"
          >
            <NewChatIcon />
          </button>
          <button
            type="button"
            onClick={closeChat}
            aria-label="تصغير أو إخفاء المحادثة"
            className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-all active:scale-90"
          >
            <CloseIcon className="sm:hidden" />
            <MinimizeIcon className="hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}


function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
