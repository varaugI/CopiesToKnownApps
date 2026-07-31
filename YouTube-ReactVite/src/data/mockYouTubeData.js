export const CURRENT_USER = {
  id: "user_yt_me",
  name: "Alex Rivera",
  handle: "@alex_rivera_dev",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  subscribersCount: 14200,
  banner: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80"
};

export const CATEGORIES = [
  "All",
  "Coding",
  "Music",
  "Gaming",
  "Tech",
  "Cooking",
  "Live",
  "Podcasts",
  "Recently Uploaded"
];

export const INITIAL_VIDEOS = [
  {
    id: "yt_1",
    title: "Full-Stack Web Development Course 2026 - Build 5 Modern React Applications!",
    description: "In this comprehensive course, learn modern Web Development from scratch! We cover React 19, Vite, state management, custom CSS design systems, REST APIs, and deployment best practices.\n\nTimestamps:\n00:00 - Introduction & Course Overview\n04:15 - React Component Architecture & Hooks\n15:30 - CSS Tokens, Glassmorphism & Themes\n32:00 - LocalStorage State Persistence\n45:10 - Final Project Build & Deployment\n\n#webdev #react #coding #javascript #frontend #vite",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    duration: "48:15",
    viewsCount: 384200,
    likesCount: 24100,
    dislikesCount: 120,
    uploadedAt: "2 days ago",
    category: "Coding",
    ambientColor: "rgba(0, 150, 255, 0.35)",
    isLive: false,
    channel: {
      id: "ch_cyber",
      name: "Cyber Code Studio",
      handle: "@cybercodestudio",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      subscribersCount: 428000,
      isVerified: true,
      isSubscribed: true
    },
    pinnedComment: {
      id: "pin_1",
      user: {
        name: "Cyber Code Studio",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        isCreator: true
      },
      text: "📌 Pinned by Cyber Code Studio: Download the free source code & starter assets link in the description below! Let me know in the comments which app you build first! 🚀",
      timestamp: "2 days ago (edited)",
      likesCount: 1840,
      isLiked: true,
      hasCreatorHeart: true
    },
    comments: [
      {
        id: "c1",
        user: {
          name: "Sarah Jenkins",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
        },
        text: "This is hands down the best React tutorial on YouTube! The state management explanation at 15:30 made everything click 🙌🔥",
        timestamp: "1 day ago",
        likesCount: 412,
        isLiked: true,
        hasCreatorHeart: true
      },
      {
        id: "c2",
        user: {
          name: "David Miller",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
        },
        text: "Clean code structure and pristine CSS tokens! Subscribed immediately 💻🚀",
        timestamp: "18 hours ago",
        likesCount: 98,
        isLiked: false
      }
    ]
  },
  {
    id: "yt_2",
    title: "Late Night Synthwave Lo-Fi Beats 🎧 Chill Beats to Code / Relax / Study To",
    description: "Continuous synthwave beats for coding productivity, study sessions, and midnight relaxation. Sound engineering by Cyber Beats Studio.\n\n#synthwave #lofi #music #beats #focus #chill",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    duration: "3:42:10",
    viewsCount: 1890000,
    likesCount: 142000,
    dislikesCount: 310,
    uploadedAt: "1 week ago",
    category: "Music",
    ambientColor: "rgba(255, 0, 128, 0.35)",
    isLive: false,
    channel: {
      id: "ch_lofi",
      name: "Synthwave Pulse ⚡",
      handle: "@synthwavepulse",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
      subscribersCount: 1240000,
      isVerified: true,
      isSubscribed: false
    },
    comments: []
  },
  {
    id: "yt_3",
    title: "🔴 LIVE: 2026 Tech Launch Keynote - Next-Gen AI & Quantum Computing Breakthroughs",
    description: "Watch live coverage of the 2026 Global Tech Keynote featuring revolutionary AI agentic frameworks, quantum processing chips, and spatial computing demos.\n\n#tech #keynote #ai #quantum #live",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    duration: "LIVE",
    viewsCount: 482000,
    likesCount: 89400,
    dislikesCount: 190,
    uploadedAt: "Started streaming 45 minutes ago",
    category: "Live",
    ambientColor: "rgba(255, 60, 0, 0.4)",
    isLive: true,
    superChats: [
      { id: "sc1", user: "TechInsider", amount: "$50.00", text: "Quantum chips speedup is insane!! 🔥", color: "#e91e63" },
      { id: "sc2", user: "DevKev", amount: "$20.00", text: "Subscribed! Greetings from London 🇬🇧", color: "#ff9800" },
      { id: "sc3", user: "CodeNinja", amount: "$5.00", text: "Great coverage team! 👍", color: "#1e88e5" }
    ],
    channel: {
      id: "ch_tech",
      name: "Global Tech Pulse",
      handle: "@globaltechpulse",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      subscribersCount: 2890000,
      isVerified: true,
      isSubscribed: true
    },
    comments: []
  },
  {
    id: "yt_4",
    title: "Authentic Neapolitan Pizza Masterclass - 72 Hour Fermented Dough Recipe!",
    description: "Learn how to make authentic Neapolitan pizza at home with a 72-hour cold fermented dough, San Marzano tomato sauce, and fresh buffalo mozzarella.\n\n#pizza #cooking #chef #recipe #foodie",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    duration: "18:40",
    viewsCount: 942000,
    likesCount: 68400,
    dislikesCount: 180,
    uploadedAt: "3 days ago",
    category: "Cooking",
    ambientColor: "rgba(230, 100, 0, 0.35)",
    isLive: false,
    channel: {
      id: "ch_marco",
      name: "Chef Marco Kitchen",
      handle: "@chefmarcokitchen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      subscribersCount: 890000,
      isVerified: true,
      isSubscribed: true
    },
    comments: []
  },
  {
    id: "yt_5",
    title: "Tokyo Cyberpunk Night Walk 4K - Rain Reflection in Shinjuku & Shibuya",
    description: "Experience the vibrant neon lights and rainy reflections of Tokyo at night in ultra high definition 4K 60FPS binaural audio ambient walk.\n\n#tokyo #japan #cyberpunk #4k #travel",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-city-at-night-41272-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    duration: "25:30",
    viewsCount: 1540000,
    likesCount: 112000,
    dislikesCount: 420,
    uploadedAt: "5 days ago",
    category: "Live",
    ambientColor: "rgba(180, 0, 255, 0.35)",
    isLive: false,
    channel: {
      id: "ch_tokyo",
      name: "Tokyo Visuals 🗼",
      handle: "@tokyovisuals",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      subscribersCount: 650000,
      isVerified: true,
      isSubscribed: false
    },
    comments: []
  }
];

export const INITIAL_SHORTS = [
  {
    id: "short_1",
    title: "Top 3 CSS Tricks Every Developer Must Know in 2026! ⚡ #shorts #css #webdev",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
    poster: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    channel: {
      name: "Cyber Code Studio",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    likesCount: 142000,
    commentsCount: 1840
  },
  {
    id: "short_2",
    title: "Secret ingredient for perfect wood-fired pizza dough! 🍕🔥 #pizza #shorts #food",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    poster: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    channel: {
      name: "Chef Marco Kitchen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    },
    likesCount: 89300,
    commentsCount: 920
  }
];

export const INITIAL_PLAYLISTS = [
  {
    id: "pl_1",
    title: "Watch Later",
    isPrivate: true,
    videosCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "pl_2",
    title: "Liked Videos",
    isPrivate: true,
    videosCount: 12,
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "pl_3",
    title: "Web Development 2026",
    isPrivate: false,
    videosCount: 8,
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80"
  }
];

export const SEARCH_SUGGESTIONS = [
  "full stack web development course 2026",
  "react 19 vite tutorial",
  "synthwave lofi beats for coding",
  "tokyo 4k ambient rain walk",
  "neapolitan pizza dough recipe",
  "quantum computing keynote live",
  "css glassmorphism design tokens"
];
