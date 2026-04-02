"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/app/context/ChatContext";

export function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="px-4 py-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-[var(--nc-text-muted)] py-12 text-sm font-medium max-w-sm mx-auto">
          اسأل عن خطط التغذية، تقدم العملاء، أو الاستفسارات…
        </div>
      )}
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
