// oxlint-disable react/only-export-components -- Typed context hooks are intentionally colocated with their providers.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EXPLORE_POSTS, INITIAL_POSTS } from "../data/mockData";
import type { Comment, CreatePostInput, ExplorePost, Post } from "../types/domain";
import { createClientId, loadStoredValue, saveStoredValue } from "./browser-storage";
import { useProfile } from "./profile-context";

interface PostsContextValue {
  posts: Post[];
  explorePosts: ExplorePost[];
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  createPost: (input: CreatePostInput) => void;
  getPostById: (postId: string) => Post | undefined;
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

function parseMetric(value: string): number {
  const normalized = value.trim().toUpperCase();
  const multiplier = normalized.endsWith("K") ? 1_000 : normalized.endsWith("M") ? 1_000_000 : 1;
  const numeric = Number.parseFloat(normalized.replace(/[KM]$/, ""));
  return Number.isFinite(numeric) ? Math.round(numeric * multiplier) : 0;
}

function mapExplorePost(item: ExplorePost): Post {
  return {
    id: item.id,
    user: {
      id: "explore_creator",
      username: "explore_creator",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      isVerified: false,
    },
    images: [item.image],
    caption: "Featured on the PhotoFlow Explore feed ✨ #photoflow #explore",
    likesCount: parseMetric(item.likes),
    isLiked: false,
    isSaved: false,
    timestamp: "EXPLORE",
    likesPreview: [],
    comments: [],
  };
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const { user, incrementPostCount } = useProfile();
  const [posts, setPosts] = useState<Post[]>(() =>
    loadStoredValue("insta_posts", INITIAL_POSTS as Post[]),
  );
  const explorePosts = EXPLORE_POSTS as ExplorePost[];

  useEffect(() => {
    saveStoredValue("insta_posts", posts);
  }, [posts]);

  const toggleLikePost = useCallback(
    (postId: string) => {
      setPosts((previousPosts) =>
        previousPosts.map((post) => {
          if (post.id !== postId) return post;

          const isLiked = !post.isLiked;
          const likesPreview = isLiked
            ? [{ username: user.username, avatar: user.avatar }, ...(post.likesPreview ?? [])]
            : (post.likesPreview ?? []).filter((preview) => preview.username !== user.username);

          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
            likesPreview,
          };
        }),
      );
    },
    [user.avatar, user.username],
  );

  const toggleSavePost = useCallback((postId: string) => {
    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post,
      ),
    );
  }, []);

  const addComment = useCallback(
    (postId: string, text: string) => {
      const normalizedText = text.trim();
      if (!normalizedText) return;

      const comment: Comment = {
        id: createClientId("comment"),
        user: { username: user.username, avatar: user.avatar },
        text: normalizedText,
        timestamp: "Just now",
        likes: 0,
        isLiked: false,
      };

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post.id === postId ? { ...post, comments: [...post.comments, comment] } : post,
        ),
      );
    },
    [user.avatar, user.username],
  );

  const toggleLikeComment = useCallback((postId: string, commentId: string) => {
    setPosts((previousPosts) =>
      previousPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const isLiked = !comment.isLiked;
            return {
              ...comment,
              isLiked,
              likes: isLiked ? comment.likes + 1 : Math.max(0, comment.likes - 1),
            };
          }),
        };
      }),
    );
  }, []);

  const createPost = useCallback(
    ({ images, caption, location }: CreatePostInput) => {
      const post: Post = {
        id: createClientId("post"),
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          location: location || "San Francisco, CA",
          isVerified: user.isVerified,
        },
        images:
          images.length > 0
            ? images
            : [
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
              ],
        caption,
        likesCount: 1,
        isLiked: true,
        isSaved: false,
        timestamp: "JUST NOW",
        likesPreview: [{ username: user.username, avatar: user.avatar }],
        comments: [],
      };

      setPosts((previous) => [post, ...previous]);
      incrementPostCount();
    },
    [incrementPostCount, user],
  );

  const getPostById = useCallback(
    (postId: string) => {
      const localPost = posts.find((post) => post.id === postId);
      if (localPost) return localPost;
      const explorePost = explorePosts.find((post) => post.id === postId);
      return explorePost ? mapExplorePost(explorePost) : undefined;
    },
    [explorePosts, posts],
  );

  const value = useMemo(
    () => ({
      posts,
      explorePosts,
      toggleLikePost,
      toggleSavePost,
      addComment,
      toggleLikeComment,
      createPost,
      getPostById,
    }),
    [
      addComment,
      createPost,
      explorePosts,
      getPostById,
      posts,
      toggleLikeComment,
      toggleLikePost,
      toggleSavePost,
    ],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts(): PostsContextValue {
  const value = useContext(PostsContext);
  if (!value) throw new Error("usePosts must be used inside PostsProvider");
  return value;
}
