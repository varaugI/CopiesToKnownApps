import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPostsService,
  fetchPostByIdService,
  createPostService,
  votePostService,
  votePollService
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const usePostsQuery = (subreddit = '', sort = 'hot', search = '', limit = 20, cursor = '') => {
  return useQuery({
    queryKey: ['posts', { subreddit, sort, search, limit, cursor }],
    queryFn: () => fetchPostsService(subreddit, sort, search, limit, cursor),
    staleTime: 30000
  });
};

export const usePostDetailQuery = (postId) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostByIdService(postId),
    enabled: Boolean(postId)
  });
};

export const useVotePostMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: ({ postId, voteType }) => votePostService(postId, voteType),
    onMutate: async ({ postId, voteType }) => {
      // Cancel outgoing queries for post feed and detail
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      // Snapshot previous state for rollback
      const previousPostsQueries = queryClient.getQueriesData({ queryKey: ['posts'] });
      const previousPostDetail = queryClient.getQueryData(['post', postId]);

      // Optimistically update post list cache
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData) => {
        if (!oldData) return oldData;

        const updateItem = (item) => {
          if (item._id !== postId) return item;

          const currentUserVote = item.userVote || 0;
          let scoreDelta = 0;
          let newVote = voteType;

          if (currentUserVote === voteType || voteType === 0) {
            scoreDelta = -currentUserVote;
            newVote = 0;
          } else {
            scoreDelta = voteType - currentUserVote;
          }

          return {
            ...item,
            score: (item.score || 0) + scoreDelta,
            userVote: newVote
          };
        };

        if (Array.isArray(oldData)) {
          return oldData.map(updateItem);
        } else if (oldData.items) {
          return {
            ...oldData,
            items: oldData.items.map(updateItem)
          };
        }
        return oldData;
      });

      // Optimistically update post detail cache
      queryClient.setQueryData(['post', postId], (oldPost) => {
        if (!oldPost) return oldPost;
        const currentUserVote = oldPost.userVote || 0;
        let scoreDelta = 0;
        let newVote = voteType;

        if (currentUserVote === voteType || voteType === 0) {
          scoreDelta = -currentUserVote;
          newVote = 0;
        } else {
          scoreDelta = voteType - currentUserVote;
        }

        return {
          ...oldPost,
          score: (oldPost.score || 0) + scoreDelta,
          userVote: newVote
        };
      });

      return { previousPostsQueries, previousPostDetail };
    },
    onError: (err, { postId }, context) => {
      // Rollback to previous snapshot
      if (context?.previousPostsQueries) {
        context.previousPostsQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousPostDetail) {
        queryClient.setQueryData(['post', postId], context.previousPostDetail);
      }
      const errorMsg = err.response?.data?.message || 'Vote failed. Preserving original state.';
      showToast(`❌ ${errorMsg}`);
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    }
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: (postData) => createPostService(postData),
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showToast(`Post created successfully! 📝`);
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Failed to create post.';
      showToast(`❌ ${errorMsg}`);
    }
  });
};

export const useVotePollMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: ({ postId, optionId }) => votePollService(postId, optionId),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['post', updatedPost._id], updatedPost);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showToast('Poll vote recorded! 📊');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Poll vote failed.';
      showToast(`❌ ${errorMsg}`);
    }
  });
};
