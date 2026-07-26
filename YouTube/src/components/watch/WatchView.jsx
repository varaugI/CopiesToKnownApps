import React from "react";
import { VideoPlayer } from "./VideoPlayer";
import { CommentsSection } from "./CommentsSection";
import { RecommendedSidebar } from "./RecommendedSidebar";
import { useYouTube } from "../../context/YouTubeContext";

export const WatchView = () => {
  const { activeWatchVideo } = useYouTube();

  if (!activeWatchVideo) return null;

  return (
    <div className="watch-layout">
      <main className="watch-main">
        <VideoPlayer video={activeWatchVideo} />
        <CommentsSection video={activeWatchVideo} />
      </main>

      <RecommendedSidebar />
    </div>
  );
};
