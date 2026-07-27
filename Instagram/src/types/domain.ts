export type PublicId = string;

export interface Highlight {
  id: PublicId;
  title: string;
  cover: string;
}

export interface Profile {
  id: PublicId;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  website: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  highlights: Highlight[];
}

export interface UserPreview {
  username: string;
  avatar: string;
}

export interface PostAuthor extends UserPreview {
  id: PublicId;
  location?: string;
  isVerified?: boolean;
}

export interface Comment {
  id: PublicId;
  user: UserPreview;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface Post {
  id: PublicId;
  user: PostAuthor;
  images: string[];
  caption: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: string;
  likesPreview: UserPreview[];
  comments: Comment[];
}

export interface CreatePostInput {
  images: string[];
  caption: string;
  location: string;
}

export interface ShareableContent {
  id: PublicId;
  caption: string;
  images: string[];
}

export interface StoryItem {
  id: PublicId;
  media: string;
  type: "image" | "video";
  timestamp: string;
  caption?: string;
}

export interface StoryGroup {
  id: PublicId;
  user: {
    id: PublicId;
    username: string;
    name: string;
    avatar: string;
  };
  hasUnseen: boolean;
  stories: StoryItem[];
}

export interface Reel {
  id: PublicId;
  user: {
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  videoUrl: string;
  poster: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface ChatMessage {
  id: PublicId;
  senderId: PublicId;
  text: string;
  timestamp: string;
  isLiked: boolean;
}

export interface Chat {
  id: PublicId;
  user: {
    id: PublicId;
    username: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen: string;
  };
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Notification {
  id: PublicId;
  type: "like" | "follow" | "comment";
  user: UserPreview;
  content: string;
  postPreview?: string;
  timestamp: string;
  isFollowing?: boolean;
  isRead: boolean;
}

export interface ExplorePost {
  id: PublicId;
  image: string;
  likes: string;
  comments: string;
  type: "photo" | "reel";
}
