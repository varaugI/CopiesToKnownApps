import { create } from "zustand";
import { Contact } from "../types";

interface ActiveCall {
  contact: Contact;
  type: "voice" | "video";
}

interface CallState {
  activeCall: ActiveCall | null;
  isMuted: boolean;
  isVideoOn: boolean;
  callDurationSeconds: number;
  startCall: (contact: Contact, type?: "voice" | "video") => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  tickTimer: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  activeCall: null,
  isMuted: false,
  isVideoOn: true,
  callDurationSeconds: 0,

  startCall: (contact, type = "voice") =>
    set({
      activeCall: { contact, type },
      isMuted: false,
      isVideoOn: true,
      callDurationSeconds: 0
    }),

  endCall: () =>
    set({
      activeCall: null,
      isMuted: false,
      isVideoOn: true,
      callDurationSeconds: 0
    }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOn: !state.isVideoOn })),
  tickTimer: () => set((state) => ({ callDurationSeconds: state.callDurationSeconds + 1 }))
}));
