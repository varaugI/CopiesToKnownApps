// oxlint-disable react/only-export-components -- Typed context hooks are intentionally colocated with their providers.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_NOTIFICATIONS } from "../data/mockData";
import type { Notification } from "../types/domain";

interface NotificationsContextValue {
  notifications: Notification[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS as Notification[],
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((previous) =>
      previous.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );
  const value = useMemo(
    () => ({ notifications, unreadNotificationsCount, markAllNotificationsRead }),
    [markAllNotificationsRead, notifications, unreadNotificationsCount],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error("useNotifications must be used inside NotificationsProvider");
  return value;
}
