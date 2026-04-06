"use client";

import { useState, useCallback } from "react";

export function ChatInput({
  onSend,
  disabled,
  maxLength,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
  maxLength: number;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setValue("");
    },
    [value, disabled, onSend]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-4 bg-white border-t border-zinc-100 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4"
    >
      <div className="flex gap-2 sm:gap-3 items-end max-w-4xl mx-auto">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
          placeholder="اسأل عن خطط التغذية، الصحة، أو الاستشارات…"
          disabled={disabled}
          rows={1}
          maxLength={maxLength}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="flex-1 min-h-[48px] sm:min-h-[52px] max-h-[120px] sm:max-h-[150px] resize-none rounded-2xl border border-zinc-200 px-4 py-3 sm:px-5 sm:py-3.5 text-[15px] font-medium text-zinc-900 placeholder-zinc-400 focus:border-[var(--nc-primary)] focus:ring-4 focus:ring-[var(--nc-primary)]/5 focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-400 transition-all"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="h-[48px] sm:h-[52px] rounded-2xl bg-[var(--nc-primary)] text-white px-4 sm:px-6 text-[15px] font-bold hover:bg-[var(--nc-primary-dark)] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm shadow-[var(--nc-primary)]/20 shrink-0"
        >
          <span className="hidden sm:inline">إرسال</span>
          <SendIcon />
        </button>
      </div>
      <div className="flex justify-between items-center mt-2 sm:mt-3 max-w-4xl mx-auto">
        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          NutriCare Intelligence System v2.0
        </p>
        <p className="text-[11px] font-medium text-zinc-400">
          {value.length} / {maxLength}
        </p>
      </div>
    </form>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

