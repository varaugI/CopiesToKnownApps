export const CURRENT_USER = {
  id: "user_me",
  name: "Alex Rivera",
  username: "alex_r",
  phone: "+1 (555) 019-2834",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  about: "At work | Available for code reviews 💻✨",
  wallpaper: "default"
};

export const INITIAL_CHATS = [
  {
    id: "chat_1",
    contact: {
      id: "c1",
      name: "Sarah Jenkins",
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      statusText: "online",
      isOnline: true,
      about: "Living one day at a time 🌿"
    },
    unreadCount: 2,
    isPinned: true,
    messages: [
      {
        id: "m1_1",
        senderId: "c1",
        text: "Hey Alex! Did you get a chance to review the new UI components?",
        timestamp: "10:30 AM",
        status: "read",
        type: "text"
      },
      {
        id: "m1_2",
        senderId: "user_me",
        text: "Yes! They look fantastic. The emerald theme matches perfectly! 💚",
        timestamp: "10:32 AM",
        status: "read",
        type: "text"
      },
      {
        id: "m1_3",
        senderId: "c1",
        text: "Awesome! Here is the mockup screenshot for the mobile layout:",
        timestamp: "10:34 AM",
        status: "read",
        type: "text"
      },
      {
        id: "m1_4",
        senderId: "c1",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
        caption: "Mobile view components layout prototype",
        timestamp: "10:35 AM",
        status: "read",
        type: "image"
      },
      {
        id: "m1_5",
        senderId: "c1",
        text: "Let me know when you want to get on a quick call to discuss details! 📞",
        timestamp: "10:36 AM",
        status: "unread",
        type: "text"
      }
    ]
  },
  {
    id: "chat_2",
    contact: {
      id: "c2",
      name: "David Miller",
      phone: "+1 (555) 876-5432",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      statusText: "last seen today at 09:42 AM",
      isOnline: false,
      about: "Building cool tech 🚀"
    },
    unreadCount: 0,
    isPinned: true,
    messages: [
      {
        id: "m2_1",
        senderId: "c2",
        text: "Hey Alex, listen to this quick audio note regarding the database schema:",
        timestamp: "Yesterday",
        status: "read",
        type: "text"
      },
      {
        id: "m2_2",
        senderId: "c2",
        audioDuration: "0:38",
        timestamp: "Yesterday",
        status: "read",
        type: "audio"
      },
      {
        id: "m2_3",
        senderId: "user_me",
        text: "Got it! Makes total sense. I will update the schema accordingly 👍",
        timestamp: "Yesterday",
        status: "read",
        type: "text"
      }
    ]
  },
  {
    id: "chat_3",
    contact: {
      id: "c3",
      name: "Elena Rostova",
      phone: "+1 (555) 432-1098",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      statusText: "online",
      isOnline: true,
      about: "Exploring Santorini 🌊☀️"
    },
    unreadCount: 0,
    isPinned: false,
    messages: [
      {
        id: "m3_1",
        senderId: "c3",
        text: "Greetings from Greece! Check out this sunset view:",
        timestamp: "July 25",
        status: "read",
        type: "text"
      },
      {
        id: "m3_2",
        senderId: "c3",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        caption: "Santorini Mediterranean Sunset 🌅",
        timestamp: "July 25",
        status: "read",
        type: "image"
      }
    ]
  },
  {
    id: "chat_4",
    contact: {
      id: "c4",
      name: "Tech Innovators Group 💻",
      phone: "Group · 12 members",
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80",
      statusText: "Sarah, David, Kai, Elena",
      isGroup: true,
      about: "Official Developer Discussions"
    },
    unreadCount: 0,
    isPinned: false,
    messages: [
      {
        id: "m4_1",
        senderId: "c1",
        senderName: "Sarah",
        text: "Hey everyone! The new v2.0 build has been deployed to production 🎉",
        timestamp: "July 24",
        status: "read",
        type: "text"
      },
      {
        id: "m4_2",
        senderId: "c2",
        senderName: "David",
        text: "Congrats team! Great work all around 👏🔥",
        timestamp: "July 24",
        status: "read",
        type: "text"
      }
    ]
  }
];

export const INITIAL_STATUS_STORIES = [
  {
    id: "st_1",
    contact: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
    },
    hasUnseen: true,
    stories: [
      {
        id: "st_1_1",
        media: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        caption: "Weekend coastal getaway 🌊✨",
        timestamp: "Today, 08:45 AM"
      }
    ]
  },
  {
    id: "st_2",
    contact: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
    },
    hasUnseen: true,
    stories: [
      {
        id: "st_2_1",
        media: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
        caption: "Fresh wood-fired pizza in Napoli! 🍕🇮🇹",
        timestamp: "Today, 11:12 AM"
      }
    ]
  }
];

export const INITIAL_CALLS_LOG = [
  {
    id: "call_1",
    contact: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
    },
    type: "incoming",
    callType: "video",
    timestamp: "Today, 10:36 AM",
    isMissed: false
  },
  {
    id: "call_2",
    contact: {
      name: "David Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    },
    type: "outgoing",
    callType: "voice",
    timestamp: "Yesterday, 04:15 PM",
    isMissed: false
  },
  {
    id: "call_3",
    contact: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
    },
    type: "incoming",
    callType: "voice",
    timestamp: "July 24, 09:20 PM",
    isMissed: true
  }
];

export const INITIAL_CHANNELS = [
  {
    id: "ch_1",
    name: "WhatsApp Official 💚",
    subscribers: "148.2M followers",
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80",
    description: "Official news and product features from the WhatsApp team.",
    isFollowing: true
  },
  {
    id: "ch_2",
    name: "TechCrunch Updates",
    subscribers: "12.4M followers",
    avatar: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&auto=format&fit=crop&q=80",
    description: "Daily technology news, start-ups, and innovation highlights.",
    isFollowing: false
  },
  {
    id: "ch_3",
    name: "Daily Coding Quotes",
    subscribers: "5.1M followers",
    avatar: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=200&auto=format&fit=crop&q=80",
    description: "Inspirational programming quotes & software architecture tips.",
    isFollowing: true
  }
];
