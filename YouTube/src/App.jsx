import React from "react";
import { YouTubeProvider, useYouTube } from "./context/YouTubeContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { VideoGrid } from "./components/feed/VideoGrid";
import { WatchView } from "./components/watch/WatchView";
import { ShortsView } from "./components/shorts/ShortsView";
import { ChannelView } from "./components/channel/ChannelView";
import { LibraryView } from "./components/library/LibraryView";
import { UploadVideoModal } from "./components/studio/UploadVideoModal";
import "./index.css";

const MainLayout = () => {
  const { activeView } = useYouTube();

  return (
    <div className="yt-app-container">
      <Header />

      <div className="yt-main-wrapper">
        {activeView !== "watch" && <Sidebar />}

        <main
          className="yt-main-content"
          style={{ marginLeft: activeView === "watch" ? 0 : undefined }}
        >
          {(activeView === "home" || activeView === "search" || activeView === "subscriptions") && (
            <VideoGrid />
          )}
          {activeView === "watch" && <WatchView />}
          {activeView === "shorts" && <ShortsView />}
          {activeView === "channel" && <ChannelView />}
          {activeView === "library" && <LibraryView />}
        </main>
      </div>

      <UploadVideoModal />
    </div>
  );
};

export default function App() {
  return (
    <YouTubeProvider>
      <MainLayout />
    </YouTubeProvider>
  );
}
