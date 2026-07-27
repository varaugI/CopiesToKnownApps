// oxlint-disable react/only-export-components -- Typed context hooks are intentionally colocated with their providers.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Post, ShareableContent } from "../types/domain";

interface UiContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
  activeLikesModalPost: Post | null;
  setActiveLikesModalPost: Dispatch<SetStateAction<Post | null>>;
  activeShareModalPost: ShareableContent | null;
  setActiveShareModalPost: Dispatch<SetStateAction<ShareableContent | null>>;
  isSearchDrawerOpen: boolean;
  setIsSearchDrawerOpen: Dispatch<SetStateAction<boolean>>;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const UiContext = createContext<UiContextValue | undefined>(undefined);

function initialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem("insta_theme") === "light" ? "light" : "dark";
}

export function UiProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeLikesModalPost, setActiveLikesModalPost] = useState<Post | null>(null);
  const [activeShareModalPost, setActiveShareModalPost] = useState<ShareableContent | null>(null);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("insta_theme", theme);
    } catch {
      // Theme still works for this tab when persistence is unavailable.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isCreateModalOpen,
      setIsCreateModalOpen,
      activeLikesModalPost,
      setActiveLikesModalPost,
      activeShareModalPost,
      setActiveShareModalPost,
      isSearchDrawerOpen,
      setIsSearchDrawerOpen,
      isNotificationsDrawerOpen,
      setIsNotificationsDrawerOpen,
    }),
    [
      activeLikesModalPost,
      activeShareModalPost,
      isCreateModalOpen,
      isNotificationsDrawerOpen,
      isSearchDrawerOpen,
      theme,
      toggleTheme,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const value = useContext(UiContext);
  if (!value) throw new Error("useUi must be used inside UiProvider");
  return value;
}
