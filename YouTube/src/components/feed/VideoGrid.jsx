import React from "react";
import { CategoryChips } from "../layout/CategoryChips";
import { VideoCard } from "./VideoCard";
import { useYouTube } from "../../context/YouTubeContext";

export const VideoGrid = () => {
  const { videos, selectedCategory, searchQuery, activeView } = useYouTube();

  const filteredVideos = videos.filter((v) => {
    const matchesCategory =
      selectedCategory === "All" ? true : v.category === selectedCategory;
    const matchesSearch =
      activeView === "search" && searchQuery.trim()
        ? v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.channel.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <CategoryChips />

      <div className="video-grid">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
