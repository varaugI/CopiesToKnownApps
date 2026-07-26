import React from "react";
import { TikTokProvider, useTikTok } from "./context/TikTokContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { VideoFeed } from "./components/feed/VideoFeed";
import { LiveStream } from "./components/live/LiveStream";
import { Inbox } from "./components/inbox/Inbox";
import { ProfileView } from "./components/profile/ProfileView";
import { UploadStudio } from "./components/upload/UploadStudio";
import { SearchDiscover } from "./components/search/SearchDiscover";
import { CommentDrawer } from "./components/comments/CommentDrawer";
import { ShareModal } from "./components/feed/ShareModal";
import "./index.css";

const MainLayout = () => {
  const { activeView } = useTikTok();

  return (
    <div className="tiktok-app">
      <Sidebar />
      <Header />

      <main className="tiktok-main-content">
        {(activeView === "foryou" || activeView === "following") && <VideoFeed />}
        {activeView === "live" && <LiveStream />}
        {activeView === "inbox" && <Inbox />}
        {activeView === "profile" && <ProfileView />}
        {activeView === "upload" && <UploadStudio />}
        {activeView === "search" && <SearchDiscover />}
      </main>

      <BottomNav />

      {/* Global Modals & Drawers */}
      <CommentDrawer />
      <ShareModal />
    </div>
  );
};

export default function App() {
  return (
    <TikTokProvider>
      <MainLayout />
    </TikTokProvider>
  );
}
