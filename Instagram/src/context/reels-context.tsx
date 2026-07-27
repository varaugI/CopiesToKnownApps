// oxlint-disable react/only-export-components -- Typed context hooks are intentionally colocated with their providers.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_REELS } from "../data/mockData";
import type { Reel } from "../types/domain";

interface ReelsContextValue {
  reels: Reel[];
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
}

const ReelsContext = createContext<ReelsContextValue | undefined>(undefined);

export function ReelsProvider({ children }: { children: ReactNode }) {
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS as Reel[]);

  const toggleLikeReel = useCallback((reelId: string) => {
    setReels((previous) =>
      previous.map((reel) => {
        if (reel.id !== reelId) return reel;
        const isLiked = !reel.isLiked;
        return {
          ...reel,
          isLiked,
          likesCount: isLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1),
        };
      }),
    );
  }, []);

  const toggleSaveReel = useCallback((reelId: string) => {
    setReels((previous) =>
      previous.map((reel) =>
        reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ reels, toggleLikeReel, toggleSaveReel }),
    [reels, toggleLikeReel, toggleSaveReel],
  );

  return <ReelsContext.Provider value={value}>{children}</ReelsContext.Provider>;
}

export function useReels(): ReelsContextValue {
  const value = useContext(ReelsContext);
  if (!value) throw new Error("useReels must be used inside ReelsProvider");
  return value;
}
