"use client";

import { useState, useCallback } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { sendChatMessage } from "@/lib/api";
import { useChatState } from "@/app/context/ChatContext";

export type { Message } from "@/app/context/ChatContext";

export function ChatWindow() {
  const { messages, setMessages, error, setError } = useChatState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, 1000);
      if (!trimmed || isLoading) return;

      setError(null);
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setIsLoading(true);

      let assistantContent = "";
      setMessages((prev) => {
        const next = [...prev];
        next.push({ role: "assistant", content: "" });
        return next;
      });

      const updateStream = (chunk: string) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            next[next.length - 1] = { ...last, content: assistantContent };
          }
          return next;
        });
      };

      try {
        await sendChatMessage(trimmed, updateStream);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Request failed";
        setError(message);
        setMessages((prev) => {
          const next = [...prev];
          if (next[next.length - 1]?.role === "assistant" && !next[next.length - 1].content) {
            next[next.length - 1] = { role: "assistant", content: message };
          }
          return next;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  return (
    <div className="grid grid-rows-[1fr_auto_auto_auto_auto] flex-1 min-h-0 overflow-hidden gap-0">
      <div className="nc-chat-messages min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y">
        <MessageList messages={messages} />
      </div>
      {isLoading && <LoadingIndicator />}
      {messages.length === 1 && (
        <SuggestedQuestions onSelect={handleSend} disabled={isLoading} />
      )}
      {error && (
        <div className="mx-4 mb-2 px-3 py-2 text-sm text-red-700 bg-red-50 rounded-nc border border-red-100 shrink-0">
          {error}
        </div>
      )}
      <div className="shrink-0">
        <ChatInput onSend={handleSend} disabled={isLoading} maxLength={1000} />
      </div>
    </div>
  );
}
