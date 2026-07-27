import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  UserProfile,
  ChatConversation,
  StatusGroup,
  CallRecord,
  ChannelItem,
  Message
} from "../types";
import {
  CURRENT_USER,
  INITIAL_CHATS,
  INITIAL_STATUS_STORIES,
  INITIAL_CALLS_LOG,
  INITIAL_CHANNELS
} from "../data/mockWhatsAppData";
import { saveConversationLocal, saveMessageLocal } from "../lib/db/indexedDB";

interface WhatsAppContextType {
  theme: string;
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  updateUserProfile: (fields: Partial<UserProfile>) => void;
  chats: ChatConversation[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  activeChat: ChatConversation | null;
  sendMessage: (
    chatId: string,
    payload: {
      text?: string;
      type?: "text" | "image" | "audio" | "video" | "document";
      image?: string;
      caption?: string;
      audioDuration?: string;
    }
  ) => void;
  markChatAsRead: (chatId: string) => void;
  statusStories: StatusGroup[];
  setStatusStories: React.Dispatch<React.SetStateAction<StatusGroup[]>>;
  activeStatusGroup: StatusGroup | null;
  setActiveStatusGroup: (group: StatusGroup | null) => void;
  callsLog: CallRecord[];
  activeCall: { contact: any; type: "voice" | "video" } | null;
  startCall: (contact: any, type?: "voice" | "video") => void;
  endCall: () => void;
  channels: ChannelItem[];
  toggleFollowChannel: (channelId: string) => void;
  wallpaper: string;
  setWallpaper: (wallpaper: string) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("wa_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wa_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [activeTab, setActiveTab] = useState<string>("chats");

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("wa_user");
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const updateUserProfile = (fields: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem("wa_user", JSON.stringify(updated));
      return updated;
    });
  };

  const [chats, setChats] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem("wa_chats");
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>("chat_1");

  useEffect(() => {
    localStorage.setItem("wa_chats", JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0] || null;

  const sendMessage = (
    chatId: string,
    { text, type = "text", image, caption, audioDuration }: {
      text?: string;
      type?: "text" | "image" | "audio" | "video" | "document";
      image?: string;
      caption?: string;
      audioDuration?: string;
    }
  ) => {
    const newMsg: Message = {
      id: "msg_" + Date.now(),
      senderId: "user_me",
      text,
      image,
      caption,
      audioDuration,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "PENDING_LOCAL",
      type
    };

    saveMessageLocal(newMsg).catch(() => {});

    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === chatId) {
          const updated = {
            ...c,
            unreadCount: 0,
            messages: [...c.messages, newMsg]
          };
          saveConversationLocal(updated).catch(() => {});
          return updated;
        }
        return c;
      })
    );
  };

  const markChatAsRead = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const [statusStories, setStatusStories] = useState<StatusGroup[]>(INITIAL_STATUS_STORIES);
  const [activeStatusGroup, setActiveStatusGroup] = useState<StatusGroup | null>(null);

  const [callsLog, setCallsLog] = useState<CallRecord[]>(INITIAL_CALLS_LOG as CallRecord[]);
  const [activeCall, setActiveCall] = useState<{ contact: any; type: "voice" | "video" } | null>(null);

  const startCall = (contact: any, type: "voice" | "video" = "voice") => {
    setActiveCall({ contact, type });
  };

  const endCall = () => {
    if (activeCall) {
      const newCallLog: CallRecord = {
        id: "call_" + Date.now(),
        contact: activeCall.contact,
        type: "outgoing",
        callType: activeCall.type,
        timestamp: "Just now",
        isMissed: false
      };
      setCallsLog((prev) => [newCallLog, ...prev]);
      setActiveCall(null);
    }
  };

  const [channels, setChannels] = useState<ChannelItem[]>(INITIAL_CHANNELS);

  const toggleFollowChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId ? { ...ch, isFollowing: !ch.isFollowing } : ch
      )
    );
  };

  const [wallpaper, setWallpaper] = useState<string>("default");

  return (
    <WhatsAppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        user,
        updateUserProfile,
        chats,
        activeChatId,
        setActiveChatId,
        activeChat,
        sendMessage,
        markChatAsRead,
        statusStories,
        setStatusStories,
        activeStatusGroup,
        setActiveStatusGroup,
        callsLog,
        activeCall,
        startCall,
        endCall,
        channels,
        toggleFollowChannel,
        wallpaper,
        setWallpaper
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = (): WhatsAppContextType => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp must be used within a WhatsAppProvider");
  }
  return context;
};
