import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { Feed } from "./components/feed/Feed";
import { Explore } from "./components/explore/Explore";
import { Reels } from "./components/reels/Reels";
import { DirectMessages } from "./components/messages/DirectMessages";
import { Profile } from "./components/profile/Profile";
import { StoryViewer } from "./components/stories/StoryViewer";
import { CreatePostModal } from "./components/create/CreatePostModal";
import { LikesModal } from "./components/feed/LikesModal";
import { ShareModal } from "./components/feed/ShareModal";
import { PostDetailModal } from "./components/explore/PostDetailModal";
import { SearchDrawer } from "./components/search/SearchDrawer";
import { NotificationsDrawer } from "./components/notifications/NotificationsDrawer";
import "./index.css";

const MainLayout = () => {
  const { activeView } = useApp();

  return (
    <div className="app-container">
      <Sidebar />
      <Header />

      <main className="main-content">
        {activeView === "home" && <Feed />}
        {activeView === "explore" && <Explore />}
        {activeView === "reels" && <Reels />}
        {activeView === "messages" && <DirectMessages />}
        {activeView === "profile" && <Profile />}
      </main>

      <BottomNav />

      {/* Global Modals & Drawers */}
      <SearchDrawer />
      <NotificationsDrawer />
      <StoryViewer />
      <CreatePostModal />
      <LikesModal />
      <ShareModal />
      <PostDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
