import React from "react";
import { VideoCard } from "./VideoCard";
import { useTikTok } from "../../context/TikTokContext";

export const VideoFeed = () => {
  const { videos, activeView } = useTikTok();

  const filteredVideos =
    activeView === "following"
      ? videos.filter((v) => v.user.isFollowing)
      : videos;

  const displayVideos = filteredVideos.length > 0 ? filteredVideos : videos;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="video-feed-container">
        {displayVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
