export type Theme = "light" | "dark";
export type FeedTab = "for-you" | "following";
export type NotificationTab = "all" | "verified" | "mentions";
export type ExploreTab = "for-you" | "trending" | "news" | "sports" | "entertainment";

export interface User {
  id: string;
  name: string;
  handle: string;
  initials: string;
  avatarClass: string;
  verified?: boolean;
  bio: string;
  location?: string;
  website?: string;
  joined?: string;
  followers: number;
  following: number;
  followedBy?: string[];
}

export interface Tweet {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  timeLabel: string;
  replies: number;
  reposts: number;
  likes: number;
  views: number;
  media?: string[];
  mediaAlt?: string[];
  context?: string;
  quotedTweetId?: string;
  replyingTo?: string;
  promoted?: boolean;
}

export interface NotificationItem {
  id: string;
  kind: "like" | "repost" | "follow" | "mention" | "post";
  userIds: string[];
  text: string;
  tweetId?: string;
  timestamp: string;
  verified?: boolean;
  unread?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: Message[];
  unread?: boolean;
}

export interface Trend {
  id: string;
  eyebrow: string;
  title: string;
  posts: string;
  summary?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
}
