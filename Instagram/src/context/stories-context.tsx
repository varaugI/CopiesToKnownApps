// oxlint-disable react/only-export-components -- Typed context hooks are intentionally colocated with their providers.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_STORIES } from "../data/mockData";
import type { StoryGroup } from "../types/domain";

interface StoriesContextValue {
  stories: StoryGroup[];
  markStoryAsSeen: (storyGroupId: string) => void;
  findStoryGroup: (username: string) => StoryGroup | undefined;
}

const StoriesContext = createContext<StoriesContextValue | undefined>(undefined);

export function StoriesProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useState<StoryGroup[]>(INITIAL_STORIES as StoryGroup[]);

  const markStoryAsSeen = useCallback((storyGroupId: string) => {
    setStories((previous) =>
      previous.map((group) =>
        group.id === storyGroupId && group.hasUnseen ? { ...group, hasUnseen: false } : group,
      ),
    );
  }, []);

  const findStoryGroup = useCallback(
    (username: string) => stories.find((group) => group.user.username === username),
    [stories],
  );

  const value = useMemo(
    () => ({ stories, markStoryAsSeen, findStoryGroup }),
    [findStoryGroup, markStoryAsSeen, stories],
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}

export function useStories(): StoriesContextValue {
  const value = useContext(StoriesContext);
  if (!value) throw new Error("useStories must be used inside StoriesProvider");
  return value;
}
