import type { ReactNode } from "react";
import { MessagingProvider } from "./messaging-context";
import { NotificationsProvider } from "./notifications-context";
import { PostsProvider } from "./posts-context";
import { ProfileProvider } from "./profile-context";
import { ReelsProvider } from "./reels-context";
import { StoriesProvider } from "./stories-context";
import { UiProvider } from "./ui-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UiProvider>
      <ProfileProvider>
        <PostsProvider>
          <StoriesProvider>
            <ReelsProvider>
              <MessagingProvider>
                <NotificationsProvider>{children}</NotificationsProvider>
              </MessagingProvider>
            </ReelsProvider>
          </StoriesProvider>
        </PostsProvider>
      </ProfileProvider>
    </UiProvider>
  );
}
