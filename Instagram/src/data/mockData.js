export const CURRENT_USER = {
  id: "user_me",
  username: "alex_designs",
  name: "Alex Rivera",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  bio: "🎨 Digital Creator & UI/UX Designer\n📸 Capturing moments & crafting pixel-perfect interfaces\n📍 San Francisco, CA\nlinktr.ee/alex_rivera",
  website: "https://alexrivera.design",
  postsCount: 14,
  followersCount: 12400,
  followingCount: 382,
  isVerified: true,
  highlights: [
    { id: "h1", title: "Travel ✈️", cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80" },
    { id: "h2", title: "Work 💻", cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&auto=format&fit=crop&q=80" },
    { id: "h3", title: "Food ☕", cover: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80" },
    { id: "h4", title: "Setup ⌨️", cover: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=80" }
  ]
};

export const INITIAL_STORIES = [
  {
    id: "story_1",
    user: {
      id: "u1",
      username: "elena_sunset",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
    },
    hasUnseen: true,
    stories: [
      {
        id: "s1_1",
        media: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        type: "image",
        timestamp: "2h ago",
        caption: "Golden hour in Santorini 🌊✨"
      },
      {
        id: "s1_2",
        media: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80",
        type: "image",
        timestamp: "1h ago",
        caption: "Never leaving this view 💙"
      }
    ]
  },
  {
    id: "story_2",
    user: {
      id: "u2",
      username: "tech_insider",
      name: "Tech Pulse",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80"
    },
    hasUnseen: true,
    stories: [
      {
        id: "s2_1",
        media: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        type: "image",
        timestamp: "4h ago",
        caption: "Next-gen workspace design ⚡"
      }
    ]
  },
  {
    id: "story_3",
    user: {
      id: "u3",
      username: "marco_kitchen",
      name: "Chef Marco",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
    },
    hasUnseen: true,
    stories: [
      {
        id: "s3_1",
        media: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
        type: "image",
        timestamp: "5h ago",
        caption: "Fresh wood-fired sourdough pizza! 🍕🔥"
      }
    ]
  },
  {
    id: "story_4",
    user: {
      id: "u4",
      username: "sophia_art",
      name: "Sophia Vance",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
    },
    hasUnseen: false,
    stories: [
      {
        id: "s4_1",
        media: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
        type: "image",
        timestamp: "8h ago",
        caption: "Working on a new oil painting project 🎨"
      }
    ]
  },
  {
    id: "story_5",
    user: {
      id: "u5",
      username: "urban_explorer",
      name: "Kai Nakamura",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
    },
    hasUnseen: false,
    stories: [
      {
        id: "s5_1",
        media: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
        type: "image",
        timestamp: "12h ago",
        caption: "Tokyo nights in Shinjuku 🗼✨"
      }
    ]
  }
];

export const INITIAL_POSTS = [
  {
    id: "post_1",
    user: {
      id: "u1",
      username: "elena_sunset",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      location: "Oia, Santorini, Greece",
      isVerified: true
    },
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80"
    ],
    caption: "Lost in the blue and white alleys of Santorini. Mediterranean summers are unmatched 🌊☀️ #travel #santorini #greece #vibes",
    likesCount: 3842,
    isLiked: false,
    isSaved: false,
    timestamp: "3 HOURS AGO",
    likesPreview: [
      { username: "alex_designs", avatar: CURRENT_USER.avatar },
      { username: "urban_explorer", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" },
      { username: "sophia_art", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" }
    ],
    comments: [
      {
        id: "c1",
        user: { username: "urban_explorer", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" },
        text: "This framing is absolutely incredible! What camera were you using?",
        timestamp: "2h ago",
        likes: 12,
        isLiked: false
      },
      {
        id: "c2",
        user: { username: "sophia_art", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
        text: "Adding this straight to my dream travel list 😍✨",
        timestamp: "1h ago",
        likes: 5,
        isLiked: true
      }
    ]
  },
  {
    id: "post_2",
    user: {
      id: "user_me",
      username: "alex_designs",
      avatar: CURRENT_USER.avatar,
      location: "San Francisco Studio",
      isVerified: true
    },
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80"
    ],
    caption: "Just finished redesigning our mobile app component system! Glassmorphism combined with dark mode gives such a clean futuristic look 💻🎨 #uiux #design #react #developer #webdesign",
    likesCount: 1290,
    isLiked: true,
    isSaved: true,
    timestamp: "6 HOURS AGO",
    likesPreview: [
      { username: "tech_insider", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80" },
      { username: "marco_kitchen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" }
    ],
    comments: [
      {
        id: "c3",
        user: { username: "tech_insider", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80" },
        text: "Clean gradients! Is this using CSS variables?",
        timestamp: "4h ago",
        likes: 8,
        isLiked: true
      }
    ]
  },
  {
    id: "post_3",
    user: {
      id: "u3",
      username: "marco_kitchen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      location: "Trattoria Napoli, Italy",
      isVerified: false
    },
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&auto=format&fit=crop&q=80"
    ],
    caption: "72-hour fermented dough, San Marzano tomatoes, fresh buffalo mozzarella and basil leaves. Pure Neapolitan perfection 🍕🇮🇹 #foodie #pizza #chef #napoli",
    likesCount: 5120,
    isLiked: false,
    isSaved: false,
    timestamp: "12 HOURS AGO",
    likesPreview: [
      { username: "elena_sunset", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" }
    ],
    comments: [
      {
        id: "c4",
        user: { username: "elena_sunset", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
        text: "I am literally ordering pizza right now because of this post 😂🍕",
        timestamp: "9h ago",
        likes: 34,
        isLiked: false
      }
    ]
  },
  {
    id: "post_4",
    user: {
      id: "u5",
      username: "urban_explorer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      location: "Tokyo, Japan",
      isVerified: true
    },
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80"
    ],
    caption: "Neon reflection in the rain. Tokyo never sleeps 🌧️🗼 #cyberpunk #tokyo #nightphotography #street",
    likesCount: 9420,
    isLiked: true,
    isSaved: true,
    timestamp: "1 DAY AGO",
    likesPreview: [
      { username: "alex_designs", avatar: CURRENT_USER.avatar }
    ],
    comments: []
  }
];

export const INITIAL_REELS = [
  {
    id: "reel_1",
    user: {
      username: "nature_wild",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      isVerified: true
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    caption: "Soothing ocean waves under sunset skies 🌅🌊 Listen to nature's frequency. #ocean #relax #sunset #reels",
    audioTrack: "Original Sound - nature_wild",
    likesCount: 45200,
    commentsCount: 382,
    isLiked: false,
    isSaved: false
  },
  {
    id: "reel_2",
    user: {
      username: "cyber_beats",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      isVerified: true
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
    poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    caption: "Late night coding session workflow 💻🚀 Synthwave beats + React code = peak productivity. #coder #dev #tech",
    audioTrack: "Midnight Synthwave - Cyber Beats",
    likesCount: 128900,
    commentsCount: 1420,
    isLiked: true,
    isSaved: true
  },
  {
    id: "reel_3",
    user: {
      username: "street_art_daily",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      isVerified: false
    },
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-city-at-night-41272-large.mp4",
    poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
    caption: "City lights from above 🏙️✨ Aerial night tour over Manhattan. #drone #citylights #nyc",
    audioTrack: "Skyline Echoes - Ambient City",
    likesCount: 89300,
    commentsCount: 654,
    isLiked: false,
    isSaved: false
  }
];

export const INITIAL_MESSAGES = [
  {
    id: "chat_1",
    user: {
      id: "u1",
      username: "elena_sunset",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      isOnline: true,
      lastSeen: "Active now"
    },
    unreadCount: 1,
    messages: [
      { id: "m1", senderId: "u1", text: "Hey Alex! Loved your latest UI design post! 🔥", timestamp: "10:42 AM", isLiked: false },
      { id: "m2", senderId: "user_me", text: "Thank you so much Elena! Really appreciate it 🙏", timestamp: "10:45 AM", isLiked: true },
      { id: "m3", senderId: "u1", text: "Are you planning to travel to Greece anytime soon?", timestamp: "11:02 AM", isLiked: false }
    ]
  },
  {
    id: "chat_2",
    user: {
      id: "u2",
      username: "tech_insider",
      name: "Tech Pulse",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
      isOnline: false,
      lastSeen: "Active 42m ago"
    },
    unreadCount: 0,
    messages: [
      { id: "m4", senderId: "u2", text: "Hey Alex, we'd love to feature your workspace setup on our page!", timestamp: "Yesterday", isLiked: true },
      { id: "m5", senderId: "user_me", text: "That sounds awesome! Let me know what high-res assets you need.", timestamp: "Yesterday", isLiked: false }
    ]
  },
  {
    id: "chat_3",
    user: {
      id: "u3",
      username: "urban_explorer",
      name: "Kai Nakamura",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
      isOnline: true,
      lastSeen: "Active now"
    },
    unreadCount: 0,
    messages: [
      { id: "m6", senderId: "user_me", text: "That Tokyo neon shot was insane bro 🌧️", timestamp: "2 days ago", isLiked: true },
      { id: "m7", senderId: "u3", text: "Appreciate it man! Rainy nights in Tokyo hit different.", timestamp: "2 days ago", isLiked: false }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "like",
    user: { username: "elena_sunset", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    content: "liked your post.",
    postPreview: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&auto=format&fit=crop&q=80",
    timestamp: "2h ago",
    isRead: false
  },
  {
    id: "n2",
    type: "follow",
    user: { username: "marco_kitchen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    content: "started following you.",
    timestamp: "5h ago",
    isFollowing: true,
    isRead: false
  },
  {
    id: "n3",
    type: "comment",
    user: { username: "tech_insider", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80" },
    content: 'commented: "Clean gradients! Is this using CSS variables?"',
    postPreview: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&auto=format&fit=crop&q=80",
    timestamp: "6h ago",
    isRead: true
  },
  {
    id: "n4",
    type: "like",
    user: { username: "sophia_art", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
    content: "liked your story.",
    timestamp: "1d ago",
    isRead: true
  }
];

export const EXPLORE_POSTS = [
  { id: "e1", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80", likes: "12.4K", comments: "230", type: "photo" },
  { id: "e2", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80", likes: "45.1K", comments: "892", type: "reel" },
  { id: "e3", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80", likes: "8.9K", comments: "142", type: "photo" },
  { id: "e4", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80", likes: "28.3K", comments: "410", type: "photo" },
  { id: "e5", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80", likes: "19.8K", comments: "312", type: "reel" },
  { id: "e6", image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80", likes: "67.2K", comments: "1.1K", type: "photo" },
  { id: "e7", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80", likes: "15.6K", comments: "205", type: "photo" },
  { id: "e8", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80", likes: "33.9K", comments: "540", type: "reel" },
  { id: "e9", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", likes: "9.2K", comments: "98", type: "photo" }
];
