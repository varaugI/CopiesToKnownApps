import { create } from "zustand";

interface RealtimeState {
  isConnected: boolean;
  reconnectAttempts: number;
  typingUsers: Record<string, string[]>; // conversationId -> array of typing user names
  setConnected: (status: boolean) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  setUserTyping: (conversationId: string, username: string, isTyping: boolean) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  isConnected: false,
  reconnectAttempts: 0,
  typingUsers: {},

  setConnected: (status) => set({ isConnected: status }),

  incrementReconnectAttempts: () =>
    set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),

  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),

  setUserTyping: (conversationId, username, isTyping) =>
    set((state) => {
      const currentList = state.typingUsers[conversationId] || [];
      const updatedList = isTyping
        ? Array.from(new Set([...currentList, username]))
        : currentList.filter((u) => u !== username);

      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: updatedList
        }
      };
    })
}));
