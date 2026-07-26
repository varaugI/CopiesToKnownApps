import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CURRENT_USER,
  CATEGORIES,
  INITIAL_VIDEOS,
  INITIAL_SHORTS
} from "../data/mockYouTubeData";

const YouTubeContext = createContext();

export const YouTubeProvider = ({ children }) => {
  // Navigation View
  const [activeView, setActiveView] = useState("home"); // 'home' | 'shorts' | 'subscriptions' | 'library' | 'watch' | 'channel' | 'search'

  // Current User
  const [user, setUser] = useState(CURRENT_USER);

  // Videos State
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("yt_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem("yt_videos", JSON.stringify(videos));
  }, [videos]);

  // Active Video Watch ID & Object
  const [activeWatchVideoId, setActiveWatchVideoId] = useState("yt_1");
  const activeWatchVideo = videos.find((v) => v.id === activeWatchVideoId) || videos[0];

  // Watch History
  const [watchHistory, setWatchHistory] = useState([videos[0], videos[1]]);

  const openWatchView = (videoId) => {
    setActiveWatchVideoId(videoId);
    const target = videos.find((v) => v.id === videoId);
    if (target) {
      setWatchHistory((prev) => [target, ...prev.filter((v) => v.id !== videoId)]);
    }
    setActiveView("watch");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLikeVideo = (videoId) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : v.likesCount - 1
          };
        }
        return v;
      })
    );
  };

  const toggleSubscribeChannel = (channelId) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.channel.id === channelId) {
          return {
            ...v,
            channel: {
              ...v.channel,
              isSubscribed: !v.channel.isSubscribed
            }
          };
        }
        return v;
      })
    );
  };

  const addCommentToVideo = (videoId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: "comment_" + Date.now(),
      user: {
        name: user.name,
        avatar: user.avatar
      },
      text: text.trim(),
      timestamp: "Just now",
      likesCount: 0,
      isLiked: false
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            comments: [newComment, ...v.comments]
          };
        }
        return v;
      })
    );
  };

  const createVideo = ({ title, description, videoUrl, thumbnail, category }) => {
    const newVid = {
      id: "yt_" + Date.now(),
      title,
      description,
      videoUrl: videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      duration: "12:30",
      viewsCount: 1,
      likesCount: 1,
      dislikesCount: 0,
      uploadedAt: "JUST NOW",
      category: category || "Coding",
      channel: {
        id: "ch_my_user",
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        subscribersCount: user.subscribersCount,
        isVerified: true,
        isSubscribed: true
      },
      comments: []
    };

    setVideos((prev) => [newVid, ...prev]);
    openWatchView(newVid.id);
  };

  // Search & Category
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Shorts State
  const [shorts, setShorts] = useState(INITIAL_SHORTS);

  // Active Channel View State
  const [activeChannel, setActiveChannel] = useState(null);

  // Studio Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <YouTubeContext.Provider
      value={{
        activeView,
        setActiveView,
        user,
        videos,
        activeWatchVideo,
        openWatchView,
        toggleLikeVideo,
        toggleSubscribeChannel,
        addCommentToVideo,
        createVideo,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories: CATEGORIES,
        shorts,
        watchHistory,
        activeChannel,
        setActiveChannel,
        isUploadModalOpen,
        setIsUploadModalOpen
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => useContext(YouTubeContext);
