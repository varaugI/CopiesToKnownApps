import React from "react";
import { History, Clock, ThumbsUp } from "lucide-react";
import { VideoCard } from "../feed/VideoCard";
import { useYouTube } from "../../context/YouTubeContext";

export const LibraryView = () => {
  const { watchHistory, videos } = useYouTube();

  const likedVideos = videos.filter((v) => v.isLiked);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      {/* History */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <History size={24} color="var(--yt-red)" />
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Watch History</h2>
        </div>

        <div className="video-grid">
          {watchHistory.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>

      {/* Liked Videos */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <ThumbsUp size={24} color="var(--yt-red)" />
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Liked Videos</h2>
        </div>

        <div className="video-grid">
          {likedVideos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </div>
  );
};
