import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, {
  fetchCommentsService,
  fetchRepliesService,
  createCommentService,
  deleteCommentService
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useCommentsQuery = (postId, limit = 20, cursor = '') => {
  return useQuery({
    queryKey: ['comments', postId, { limit, cursor }],
    queryFn: () => fetchCommentsService(postId, limit, cursor),
    enabled: Boolean(postId)
  });
};

export const useRepliesQuery = (commentId, limit = 20, cursor = '') => {
  return useQuery({
    queryKey: ['replies', commentId, { limit, cursor }],
    queryFn: () => fetchRepliesService(commentId, limit, cursor),
    enabled: Boolean(commentId)
  });
};

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: ({ postId, content, parentCommentId }) => createCommentService(postId, content, parentCommentId),
    onSuccess: (newComment, { postId, parentCommentId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      if (parentCommentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', parentCommentId] });
      }
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      showToast('Comment added! 💬');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Failed to add comment.';
      showToast(`❌ ${errorMsg}`);
    }
  });
};

export const useVoteCommentMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: ({ commentId, voteType }) => api.post(`/comments/${commentId}/vote`, { voteType }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Vote failed.';
      showToast(`❌ ${errorMsg}`);
    }
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: (commentId) => deleteCommentService(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      showToast('Comment deleted.');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Failed to delete comment.';
      showToast(`❌ ${errorMsg}`);
    }
  });
};
