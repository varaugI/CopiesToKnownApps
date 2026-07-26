export const CURRENT_USER = {
  id: "user_tiktok_me",
  username: "alex_tiktok_creator",
  name: "Alex Rivera",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  bio: "⚡ Digital Creator | Tech & Design Trends 🚀\n✨ Creating daily viral UI & Code snippets\n👇 Check my latest project!",
  followingCount: 248,
  followersCount: 184200,
  likesCount: 2900000,
  isVerified: true,
  website: "https://alexrivera.design"
};

export const INITIAL_VIDEOS = [
  {
    id: "video_1",
    user: {
      id: "u1",
      username: "cyber_beats_official",
      name: "Cyber Beats ⚡",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      isVerified: true,
      isFollowing: false
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
    poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    caption: "Late night coding session workflow 💻✨ Synthwave beats + React code = peak focus! What's your late-night coding stack? 🤔 #coder #devtok #webdesign #programming #react",
    sound: "Original Sound - Cyber Beats Synthwave 🎵",
    likesCount: 342100,
    commentsCount: 2840,
    bookmarksCount: 45200,
    sharesCount: 12900,
    isLiked: false,
    isBookmarked: false,
    comments: [
      {
        id: "c1_1",
        user: {
          username: "dev_sarah",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
          isVerified: true
        },
        text: "Keyboard sounds + synthwave is literally therapeutic for debugging 🧘‍♀️💻",
        timestamp: "2h ago",
        likes: 1420,
        isLiked: false
      },
      {
        id: "c1_2",
        user: {
          username: "code_ninja",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
          isVerified: false
        },
        text: "What mechanical switches are those? Sound profile is crisp! 🔥",
        timestamp: "1h ago",
        likes: 382,
        isLiked: true
      }
    ]
  },
  {
    id: "video_2",
    user: {
      id: "u2",
      username: "elena_travels",
      name: "Elena Rostova 🌊",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      isVerified: true,
      isFollowing: true
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    caption: "Sunset in Santorini hitting different tonight 🌅✨ Save this location for your summer trip! 💙 #traveltok #greece #santorini #sunset #wanderlust",
    sound: "Mediterranean Sunset Vibes - Elena Travels 🏖️",
    likesCount: 892000,
    commentsCount: 6420,
    bookmarksCount: 112000,
    sharesCount: 34100,
    isLiked: true,
    isBookmarked: true,
    comments: [
      {
        id: "c2_1",
        user: {
          username: "marco_chef",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
        },
        text: "Greece in the summer is unmatched 😍 Enjoy the seafood!",
        timestamp: "5h ago",
        likes: 512,
        isLiked: false
      }
    ]
  },
  {
    id: "video_3",
    user: {
      id: "u3",
      username: "urban_drone_tok",
      name: "Tokyo Visuals 🗼",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      isVerified: true,
      isFollowing: false
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-city-at-night-41272-large.mp4",
    poster: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    caption: "Rainy cyberpunk nights in Shinjuku, Tokyo 🌧️ Neon lights reflecting on wet streets is magic! #tokyo #cyberpunk #streetphotography #nightlife",
    sound: "Tokyo Neon Echoes - Lofi Beats 🎧",
    likesCount: 1240000,
    commentsCount: 9320,
    bookmarksCount: 184000,
    sharesCount: 52000,
    isLiked: false,
    isBookmarked: false,
    comments: [
      {
        id: "c3_1",
        user: {
          username: "anime_fanatic",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
        },
        text: "Feels like walking inside Blade Runner 2049 🤖✨",
        timestamp: "8h ago",
        likes: 2410,
        isLiked: true
      }
    ]
  }
];

export const INITIAL_LIVE_STREAM = {
  id: "live_1",
  creator: {
    username: "dj_synth_master",
    name: "DJ Synth Master 🎧",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
    viewersCount: 24890
  },
  videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
  giftsCount: 14200,
  topGifts: [
    { name: "Rose 🌹", cost: "1 Coin", icon: "🌹" },
    { name: "TikTok Star ⭐", cost: "99 Coins", icon: "⭐" },
    { name: "Diamond 💎", cost: "499 Coins", icon: "💎" },
    { name: "Universe 🌌", cost: "19999 Coins", icon: "🌌" }
  ]
};

export const TRENDING_TAGS = [
  { tag: "#DevTok", views: "14.2B views", icon: "💻" },
  { tag: "#SummerVibes", views: "88.6B views", icon: "☀️" },
  { tag: "#TechTrends2026", views: "5.4B views", icon: "⚡" },
  { tag: "#TokyoNights", views: "12.8B views", icon: "🗼" },
  { tag: "#FoodieTok", views: "45.1B views", icon: "🍕" }
];

export const INITIAL_INBOX = [
  {
    id: "notif_1",
    type: "like",
    user: { username: "elena_travels", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    text: "liked your video.",
    timestamp: "2h ago",
    videoThumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "notif_2",
    type: "follow",
    user: { username: "cyber_beats_official", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    text: "started following you.",
    timestamp: "5h ago"
  },
  {
    id: "notif_3",
    type: "comment",
    user: { username: "urban_drone_tok", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" },
    text: 'commented: "Incredible UI layout design! 🔥"',
    timestamp: "1d ago",
    videoThumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&auto=format&fit=crop&q=80"
  }
];
