export type MessageStatus =
  | "PENDING_LOCAL"
  | "SENDING"
  | "ACCEPTED"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED"
  | "read"
  | "delivered"
  | "sent"
  | "unread";

export type MessageType = "text" | "image" | "video" | "audio" | "document";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  phone: string;
  avatar: string;
  about: string;
  wallpaper: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  statusText: string;
  isOnline: boolean;
  about?: string;
  isGroup?: boolean;
}

export interface Message {
  id: string;
  clientMessageId?: string;
  conversationId?: string;
  senderId: string;
  senderName?: string;
  text?: string;
  image?: string;
  caption?: string;
  audioDuration?: string;
  timestamp: string;
  status: MessageStatus;
  type: MessageType;
}

export interface ChatConversation {
  id: string;
  contact: Contact;
  unreadCount: number;
  isPinned: boolean;
  messages: Message[];
}

export interface StatusStory {
  id: string;
  media: string;
  caption?: string;
  timestamp: string;
}

export interface StatusGroup {
  id: string;
  contact: {
    name: string;
    avatar: string;
  };
  hasUnseen: boolean;
  stories: StatusStory[];
}

export interface CallRecord {
  id: string;
  contact: {
    name: string;
    avatar: string;
  };
  type: "incoming" | "outgoing";
  callType: "voice" | "video";
  timestamp: string;
  isMissed: boolean;
}

export interface ChannelItem {
  id: string;
  name: string;
  subscribers: string;
  avatar: string;
  description: string;
  isFollowing: boolean;
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
}
