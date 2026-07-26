import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CURRENT_USER,
  INITIAL_VIDEOS,
  INITIAL_LIVE_STREAM,
  TRENDING_TAGS,
  INITIAL_INBOX
} from "../data/mockTikTokData";

const TikTokContext = createContext();

export const TikTokProvider = ({ children }) => {
  // Navigation active view
  const [activeView, setActiveView] = useState("foryou");

  // User Profile
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("tiktok_user");
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const updateUserProfile = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem("tiktok_user", JSON.stringify(updated));
      return updated;
    });
  };

  // Videos State
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("tiktok_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem("tiktok_videos", JSON.stringify(videos));
  }, [videos]);

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

  const toggleBookmarkVideo = (videoId) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isBookmarked = !v.isBookmarked;
          return {
            ...v,
            isBookmarked,
            bookmarksCount: isBookmarked ? v.bookmarksCount + 1 : v.bookmarksCount - 1
          };
        }
        return v;
      })
    );
  };

  const addCommentToVideo = (videoId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: "c_" + Date.now(),
      user: {
        username: user.username,
        avatar: user.avatar,
        isVerified: user.isVerified
      },
      text: text.trim(),
      timestamp: "Just now",
      likes: 0,
      isLiked: false
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
            comments: [newComment, ...v.comments]
          };
        }
        return v;
      })
    );
  };

  const toggleLikeComment = (videoId, commentId) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const updatedComments = v.comments.map((c) => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likes: isLiked ? c.likes + 1 : c.likes - 1
              };
            }
            return c;
          });
          return { ...v, comments: updatedComments };
        }
        return v;
      })
    );
  };

  const toggleFollowUser = (username) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.user.username === username) {
          return {
            ...v,
            user: { ...v.user, isFollowing: !v.user.isFollowing }
          };
        }
        return v;
      })
    );
  };

  const uploadVideo = ({ videoUrl, poster, caption, sound }) => {
    const newVid = {
      id: "vid_" + Date.now(),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isFollowing: false
      },
      videoUrl: videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
      poster: poster || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      caption,
      sound: sound || `Original Sound - ${user.username} 🎵`,
      likesCount: 1,
      commentsCount: 0,
      bookmarksCount: 0,
      sharesCount: 0,
      isLiked: true,
      isBookmarked: false,
      comments: []
    };

    setVideos((prev) => [newVid, ...prev]);
    setActiveView("foryou");
  };

  // Modals & Drawers State
  const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);
  const [activeShareVideo, setActiveShareVideo] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const activeCommentVideo = videos.find((v) => v.id === activeCommentVideoId) || null;

  return (
    <TikTokContext.Provider
      value={{
        activeView,
        setActiveView,
        user,
        updateUserProfile,
        videos,
        toggleLikeVideo,
        toggleBookmarkVideo,
        addCommentToVideo,
        toggleLikeComment,
        toggleFollowUser,
        uploadVideo,
        activeCommentVideo,
        setActiveCommentVideoId,
        activeShareVideo,
        setActiveShareVideo,
        isEditProfileOpen,
        setIsEditProfileOpen,
        liveStream: INITIAL_LIVE_STREAM,
        trendingTags: TRENDING_TAGS,
        inboxNotifications: INITIAL_INBOX
      }}
    >
      {children}
    </TikTokContext.Provider>
  );
};

export const useTikTok = () => useContext(TikTokContext);
