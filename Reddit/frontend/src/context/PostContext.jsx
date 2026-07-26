import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchPostsService,
  fetchSubredditsService,
  votePostService,
  votePollService,
  createPostService,
  createSubredditService
} from '../services/api';
import { useAuth } from './AuthContext';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [subreddits, setSubreddits] = useState([]);
  const [activeSort, setActiveSort] = useState('hot'); // 'hot' | 'new' | 'top'
  const [activeSubreddit, setActiveSubreddit] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [createSubModalOpen, setCreateSubModalOpen] = useState(false);

  const { user, openAuthModal, showToast } = useAuth();

  const loadSubreddits = useCallback(async () => {
    try {
      const subs = await fetchSubredditsService();
      setSubreddits(subs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const data = await fetchPostsService(activeSubreddit, activeSort, searchQuery);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  }, [activeSubreddit, activeSort, searchQuery]);

  useEffect(() => {
    loadSubreddits();
  }, [loadSubreddits]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleVote = async (postId, voteType) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p._id === postId) {
          const currentVote = p.userVote || 0;
          let newVote = voteType;
          if (currentVote === voteType) newVote = 0;
          const diff = newVote - currentVote;

          return {
            ...p,
            userVote: newVote,
            score: (p.score || 0) + diff
          };
        }
        return p;
      })
    );

    try {
      await votePostService(postId, voteType);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePollVote = async (postId, optionId) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p._id === postId && p.pollOptions) {
          return {
            ...p,
            userPollVote: optionId,
            pollTotalVotes: (p.pollTotalVotes || 0) + 1,
            pollOptions: p.pollOptions.map(opt =>
              opt.id === optionId || opt._id === optionId
                ? { ...opt, votesCount: (opt.votesCount || 0) + 1 }
                : opt
            )
          };
        }
        return p;
      })
    );

    try {
      await votePollService(postId, optionId);
      showToast('Poll vote recorded! 📊');
    } catch (e) {
      console.error(e);
    }
  };

  const addPost = async (postData) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    try {
      const newPost = await createPostService(postData);
      setPosts(prev => [newPost, ...prev]);
      setCreatePostModalOpen(false);
      showToast('Post published successfully! 🚀');
      return newPost;
    } catch (e) {
      showToast('Failed to create post');
    }
  };

  const addSubreddit = async (subData) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    try {
      const newSub = await createSubredditService(subData);
      setSubreddits(prev => [newSub, ...prev]);
      setCreateSubModalOpen(false);
      showToast(`r/${newSub.name} created! 🎉`);
      return newSub;
    } catch (e) {
      showToast('Failed to create community');
    }
  };

  return (
    <PostContext.Provider value={{
      posts,
      subreddits,
      activeSort,
      setActiveSort,
      activeSubreddit,
      setActiveSubreddit,
      searchQuery,
      setSearchQuery,
      loadingPosts,
      handleVote,
      handlePollVote,
      addPost,
      addSubreddit,
      createPostModalOpen,
      setCreatePostModalOpen,
      createSubModalOpen,
      setCreateSubModalOpen,
      refreshPosts: loadPosts
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
