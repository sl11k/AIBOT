"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "مرحباً، معك نورا مساعدك الذكي في NutriCare. كيف يمكنني مساعدتك اليوم؟",
};

interface ChatState {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onNewChat: () => void;
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatState | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const onNewChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        error,
        setError,
        onNewChat,
        isChatOpen,
        openChat,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatState() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatState must be used within ChatProvider");
  return ctx;
}
