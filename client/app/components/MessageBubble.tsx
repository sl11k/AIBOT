"use client";

import { SafeMarkdown } from "@/lib/markdown";

export function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm transition-all ${
          isUser
            ? "bg-[var(--nc-primary)] text-white rounded-tr-none"
            : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none"
        }`}
      >
        {isUser ? (
          <p className="text-[15px] font-medium whitespace-pre-wrap break-words leading-relaxed" dir="auto">
            {content}
          </p>
        ) : (
          <div className="text-[15px] leading-relaxed prose prose-zinc max-w-none prose-p:my-2 prose-headings:text-zinc-900 prose-strong:text-zinc-900 prose-ul:my-2 prose-li:my-1" dir="auto">
            <SafeMarkdown content={content} />
          </div>
        )}
      </div>
    </div>
  );
}

