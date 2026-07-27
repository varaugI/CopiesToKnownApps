import { create } from "zustand";

interface ComposerState {
  text: string;
  isAttachmentOpen: boolean;
  isRecordingVoice: boolean;
  setText: (text: string) => void;
  setAttachmentOpen: (open: boolean) => void;
  setRecordingVoice: (recording: boolean) => void;
  resetComposer: () => void;
}

export const useComposerStore = create<ComposerState>((set) => ({
  text: "",
  isAttachmentOpen: false,
  isRecordingVoice: false,

  setText: (text) => set({ text }),
  setAttachmentOpen: (open) => set({ isAttachmentOpen: open }),
  setRecordingVoice: (recording) => set({ isRecordingVoice: recording }),

  resetComposer: () =>
    set({
      text: "",
      isAttachmentOpen: false,
      isRecordingVoice: false
    })
}));
