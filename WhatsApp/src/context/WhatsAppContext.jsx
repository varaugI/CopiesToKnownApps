import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CURRENT_USER,
  INITIAL_CHATS,
  INITIAL_STATUS_STORIES,
  INITIAL_CALLS_LOG,
  INITIAL_CHANNELS
} from "../data/mockWhatsAppData";

const WhatsAppContext = createContext();

export const WhatsAppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("wa_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wa_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Sidebar navigation tab ('chats', 'status', 'channels', 'calls', 'profile', 'settings')
  const [activeTab, setActiveTab] = useState("chats");

  // User Profile
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("wa_user");
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const updateUserProfile = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem("wa_user", JSON.stringify(updated));
      return updated;
    });
  };

  // Chats State
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("wa_chats");
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState("chat_1");

  useEffect(() => {
    localStorage.setItem("wa_chats", JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const sendMessage = (chatId, { text, type = "text", image, caption, audioDuration }) => {
    const newMsg = {
      id: "msg_" + Date.now(),
      senderId: "user_me",
      text,
      image,
      caption,
      audioDuration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "read", // double blue ticks
      type
    };

    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            unreadCount: 0,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  const markChatAsRead = (chatId) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Status Stories State
  const [statusStories, setStatusStories] = useState(INITIAL_STATUS_STORIES);
  const [activeStatusGroup, setActiveStatusGroup] = useState(null);

  // Calls & Active Call Overlay
  const [callsLog, setCallsLog] = useState(INITIAL_CALLS_LOG);
  const [activeCall, setActiveCall] = useState(null); // { contact, type: 'voice' | 'video' } or null

  const startCall = (contact, type = "voice") => {
    setActiveCall({ contact, type });
  };

  const endCall = () => {
    if (activeCall) {
      const newCallLog = {
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

  // Channels State
  const [channels, setChannels] = useState(INITIAL_CHANNELS);

  const toggleFollowChannel = (channelId) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId ? { ...ch, isFollowing: !ch.isFollowing } : ch
      )
    );
  };

  // Wallpaper Setting
  const [wallpaper, setWallpaper] = useState("default");

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

export const useWhatsApp = () => useContext(WhatsAppContext);
