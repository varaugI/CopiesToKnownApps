import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CURRENT_USER,
  CATEGORIES,
  INITIAL_VIDEOS,
  INITIAL_SHORTS,
  INITIAL_PLAYLISTS,
  SEARCH_SUGGESTIONS
} from "../data/mockYouTubeData";

const YouTubeContext = createContext();

export const YouTubeProvider = ({ children }) => {
  // Active Navigation View ('home' | 'shorts' | 'subscriptions' | 'library' | 'watch' | 'channel' | 'search')
  const [activeView, setActiveView] = useState("home");

  // User Profile
  const [user, setUser] = useState(CURRENT_USER);

  // Videos State with LocalStorage
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("yt_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem("yt_videos", JSON.stringify(videos));
  }, [videos]);

  // Ambient & Theater Modes
  const [isAmbientMode, setIsAmbientMode] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isMiniplayerActive, setIsMiniplayerActive] = useState(false);

  // Active Video Watch ID
  const [activeWatchVideoId, setActiveWatchVideoId] = useState("yt_1");
  const activeWatchVideo = videos.find((v) => v.id === activeWatchVideoId) || videos[0];

  // Watch History
  const [watchHistory, setWatchHistory] = useState([videos[0], videos[1]]);

  // Playlists State with LocalStorage
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem("yt_playlists");
    return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
  });

  useEffect(() => {
    localStorage.setItem("yt_playlists", JSON.stringify(playlists));
  }, [playlists]);

  const [isSaveToPlaylistModalOpen, setIsSaveToPlaylistModalOpen] = useState(false);
  const [targetPlaylistVideoId, setTargetPlaylistVideoId] = useState(null);

  const openWatchView = (videoId) => {
    setActiveWatchVideoId(videoId);
    setIsMiniplayerActive(false);
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
      ambientColor: "rgba(0, 200, 255, 0.4)",
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

  const openSaveToPlaylistModal = (videoId) => {
    setTargetPlaylistVideoId(videoId);
    setIsSaveToPlaylistModalOpen(true);
  };

  const createNewPlaylist = (title, isPrivate) => {
    if (!title.trim()) return;
    const newPl = {
      id: "pl_" + Date.now(),
      title: title.trim(),
      isPrivate: Boolean(isPrivate),
      videosCount: 1,
      thumbnail: activeWatchVideo?.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80"
    };
    setPlaylists((prev) => [newPl, ...prev]);
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Shorts State
  const [shorts, setShorts] = useState(INITIAL_SHORTS);

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
        isAmbientMode,
        setIsAmbientMode,
        isTheaterMode,
        setIsTheaterMode,
        isMiniplayerActive,
        setIsMiniplayerActive,
        playlists,
        openSaveToPlaylistModal,
        createNewPlaylist,
        isSaveToPlaylistModalOpen,
        setIsSaveToPlaylistModalOpen,
        searchQuery,
        setSearchQuery,
        searchSuggestions: SEARCH_SUGGESTIONS,
        selectedCategory,
        setSelectedCategory,
        categories: CATEGORIES,
        shorts,
        watchHistory,
        isUploadModalOpen,
        setIsUploadModalOpen
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => useContext(YouTubeContext);
