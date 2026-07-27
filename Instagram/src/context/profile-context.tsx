// oxlint-disable react/only-export-components -- Typed context hooks are intentionally colocated with their providers.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CURRENT_USER } from "../data/mockData";
import type { Profile } from "../types/domain";
import { loadStoredValue, saveStoredValue } from "./browser-storage";

interface ProfileContextValue {
  user: Profile;
  updateUserProfile: (updatedFields: Partial<Profile>) => void;
  incrementPostCount: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile>(() =>
    loadStoredValue("insta_user", CURRENT_USER as Profile),
  );

  const updateUserProfile = useCallback((updatedFields: Partial<Profile>) => {
    setUser((previous) => {
      const next = { ...previous, ...updatedFields };
      saveStoredValue("insta_user", next);
      return next;
    });
  }, []);

  const incrementPostCount = useCallback(() => {
    setUser((previous) => {
      const next = { ...previous, postsCount: previous.postsCount + 1 };
      saveStoredValue("insta_user", next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, updateUserProfile, incrementPostCount }),
    [incrementPostCount, updateUserProfile, user],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (!value) throw new Error("useProfile must be used inside ProfileProvider");
  return value;
}
