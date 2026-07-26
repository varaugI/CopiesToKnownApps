import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CURRENT_USER,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  EXPLORE_POSTS
} from "../data/mockData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("insta_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("insta_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Active View State ('home', 'search', 'explore', 'reels', 'messages', 'notifications', 'profile')
  const [activeView, setActiveView] = useState("home");

  // User Profile
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("insta_user");
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem("insta_user", JSON.stringify(next));
      return next;
    });
  };

  // Posts State
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("insta_posts");
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  useEffect(() => {
    localStorage.setItem("insta_posts", JSON.stringify(posts));
  }, [posts]);

  const toggleLikePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          const likesCount = isLiked ? post.likesCount + 1 : post.likesCount - 1;
          let likesPreview = [...(post.likesPreview || [])];
          if (isLiked) {
            likesPreview.unshift({ username: user.username, avatar: user.avatar });
          } else {
            likesPreview = likesPreview.filter((u) => u.username !== user.username);
          }
          return { ...post, isLiked, likesCount, likesPreview };
        }
        return post;
      })
    );
  };

  const toggleSavePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: "comment_" + Date.now(),
      user: {
        username: user.username,
        avatar: user.avatar
      },
      text: text.trim(),
      timestamp: "Just now",
      likes: 0,
      isLiked: false
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  };

  const toggleLikeComment = (postId, commentId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedComments = post.comments.map((comment) => {
            if (comment.id === commentId) {
              const isLiked = !comment.isLiked;
              return {
                ...comment,
                isLiked,
                likes: isLiked ? comment.likes + 1 : comment.likes - 1
              };
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );
  };

  const createPost = ({ images, caption, location }) => {
    const newPost = {
      id: "post_" + Date.now(),
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        location: location || "San Francisco, CA",
        isVerified: user.isVerified
      },
      images: images && images.length ? images : ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80"],
      caption,
      likesCount: 1,
      isLiked: true,
      isSaved: false,
      timestamp: "JUST NOW",
      likesPreview: [{ username: user.username, avatar: user.avatar }],
      comments: []
    };

    setPosts((prev) => [newPost, ...prev]);
    setUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
  };

  // Stories State
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [activeStoryGroup, setActiveStoryGroup] = useState(null); // story object or null

  const markStoryAsSeen = (storyGroupId) => {
    setStories((prev) =>
      prev.map((item) =>
        item.id === storyGroupId ? { ...item, hasUnseen: false } : item
      )
    );
  };

  // Reels State
  const [reels, setReels] = useState(INITIAL_REELS);

  const toggleLikeReel = (reelId) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const isLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked,
            likesCount: isLiked ? reel.likesCount + 1 : reel.likesCount - 1
          };
        }
        return reel;
      })
    );
  };

  const toggleSaveReel = (reelId) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel
      )
    );
  };

  // Direct Messages State
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("insta_chats");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [activeChatId, setActiveChatId] = useState("chat_1");

  useEffect(() => {
    localStorage.setItem("insta_chats", JSON.stringify(chats));
  }, [chats]);

  const sendChatMessage = (chatId, text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: "msg_" + Date.now(),
      senderId: "user_me",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLiked: false
    };

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, messages: [...chat.messages, newMsg] };
        }
        return chat;
      })
    );
  };

  // Notifications State
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [activeLikesModalPost, setActiveLikesModalPost] = useState(null);
  const [activeShareModalPost, setActiveShareModalPost] = useState(null);
  const [activeDetailPost, setActiveDetailPost] = useState(null);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeView,
        setActiveView,
        user,
        updateUserProfile,
        posts,
        toggleLikePost,
        toggleSavePost,
        addComment,
        toggleLikeComment,
        createPost,
        stories,
        activeStoryGroup,
        setActiveStoryGroup,
        markStoryAsSeen,
        reels,
        toggleLikeReel,
        toggleSaveReel,
        chats,
        activeChatId,
        setActiveChatId,
        sendChatMessage,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,
        explorePosts: EXPLORE_POSTS,
        // Modals
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        activeLikesModalPost,
        setActiveLikesModalPost,
        activeShareModalPost,
        setActiveShareModalPost,
        activeDetailPost,
        setActiveDetailPost,
        isSearchDrawerOpen,
        setIsSearchDrawerOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
