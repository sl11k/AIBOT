"use client";

import { useChatState } from "@/app/context/ChatContext";

export function ChatHeader() {
  const { onNewChat, closeChat } = useChatState();
  return (
    <header className="px-6 py-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--nc-primary)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-zinc-900 tracking-tight">
                NutriCare
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">نشط</span>
              </div>
            </div>
            <p className="text-[12px] font-medium text-zinc-500">
              مساعدك الذكي في التغذية والصحة
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onNewChat}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95"
          >
            محادثة جديدة
          </button>
          <button
            type="button"
            onClick={closeChat}
            aria-label="تصغير أو إخفاء المحادثة"
            className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-all active:scale-90"
          >
            <MinimizeIcon />
          </button>
        </div>
      </div>
    </header>
  );
}


function MinimizeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
