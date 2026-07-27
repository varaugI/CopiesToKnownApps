// oxlint-disable react/only-export-components -- Typed context hooks are intentionally colocated with their providers.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_MESSAGES } from "../data/mockData";
import type { Chat, ChatMessage } from "../types/domain";
import { createClientId, loadStoredValue, saveStoredValue } from "./browser-storage";

interface MessagingContextValue {
  chats: Chat[];
  sendChatMessage: (chatId: string, text: string) => void;
}

const MessagingContext = createContext<MessagingContextValue | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() =>
    loadStoredValue("insta_chats", INITIAL_MESSAGES as Chat[]),
  );

  useEffect(() => {
    saveStoredValue("insta_chats", chats);
  }, [chats]);

  const sendChatMessage = useCallback((chatId: string, text: string) => {
    const normalizedText = text.trim();
    if (!normalizedText) return;

    const message: ChatMessage = {
      id: createClientId("msg"),
      senderId: "user_me",
      text: normalizedText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isLiked: false,
    };

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat,
      ),
    );
  }, []);

  const value = useMemo(() => ({ chats, sendChatMessage }), [chats, sendChatMessage]);

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
}

export function useMessaging(): MessagingContextValue {
  const value = useContext(MessagingContext);
  if (!value) throw new Error("useMessaging must be used inside MessagingProvider");
  return value;
}
