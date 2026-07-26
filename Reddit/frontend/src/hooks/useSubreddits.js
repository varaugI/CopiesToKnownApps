import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSubredditsService,
  fetchSubredditByNameService,
  createSubredditService,
  api
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useSubredditsQuery = () => {
  return useQuery({
    queryKey: ['subreddits'],
    queryFn: fetchSubredditsService,
    staleTime: 60000 * 5
  });
};

export const useSubredditByNameQuery = (name) => {
  return useQuery({
    queryKey: ['subreddit', name],
    queryFn: () => fetchSubredditByNameService(name),
    enabled: Boolean(name)
  });
};

export const useCreateSubredditMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: (data) => createSubredditService(data),
    onSuccess: (newSub) => {
      queryClient.invalidateQueries({ queryKey: ['subreddits'] });
      showToast(`r/${newSub.name} created successfully! 🎉`);
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Failed to create subreddit.';
      showToast(`❌ ${errorMsg}`);
    }
  });
};

export const useToggleJoinSubredditMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuth();

  return useMutation({
    mutationFn: (subId) => api.post(`/subreddits/${subId}/join`).then(res => res.data),
    onSuccess: (data, subId) => {
      queryClient.invalidateQueries({ queryKey: ['subreddits'] });
      queryClient.invalidateQueries({ queryKey: ['subreddit'] });
      showToast(data.isMember ? 'Joined community! 🎉' : 'Left community.');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Action failed.';
      showToast(`❌ ${errorMsg}`);
    }
  });
};
