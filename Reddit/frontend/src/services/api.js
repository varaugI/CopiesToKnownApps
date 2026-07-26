import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let memoryAccessToken = null;

export const setMemoryAccessToken = (token) => {
  memoryAccessToken = token;
};

export const getMemoryAccessToken = () => memoryAccessToken;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    if (memoryAccessToken) {
      config.headers.Authorization = `Bearer ${memoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatic 401 Silent Refresh Interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await api.post('/auth/refresh');
        const newToken = refreshRes.data.accessToken;
        setMemoryAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setMemoryAccessToken(null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export const fetchPostsService = async (subreddit = '', sort = 'hot', search = '', limit = 20, cursor = '') => {
  const res = await api.get('/posts', { params: { subreddit, sort, search, limit, cursor } });
  return Array.isArray(res.data) ? res.data : (res.data?.items || []);
};

export const fetchPostByIdService = async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

export const createPostService = async (postData) => {
  const res = await api.post('/posts', postData);
  return res.data;
};

export const votePostService = async (id, voteType) => {
  const res = await api.post(`/posts/${id}/vote`, { voteType });
  return res.data;
};

export const votePollService = async (id, optionId) => {
  const res = await api.post(`/posts/${id}/poll`, { optionId });
  return res.data;
};

export const fetchSubredditsService = async () => {
  const res = await api.get('/subreddits');
  return res.data;
};

export const fetchSubredditByNameService = async (name) => {
  const res = await api.get(`/subreddits/${name}`);
  return res.data;
};

export const createSubredditService = async (data) => {
  const res = await api.post('/subreddits', data);
  return res.data;
};

export const fetchCommentsService = async (postId, limit = 20, cursor = '') => {
  const res = await api.get(`/comments/post/${postId}`, { params: { limit, cursor } });
  return Array.isArray(res.data) ? res.data : (res.data?.items || []);
};

export const fetchRepliesService = async (commentId, limit = 20, cursor = '') => {
  const res = await api.get(`/comments/${commentId}/replies`, { params: { limit, cursor } });
  return Array.isArray(res.data) ? res.data : (res.data?.items || []);
};

export const createCommentService = async (postId, content, parentCommentId = null) => {
  const res = await api.post('/comments', { postId, content, parentCommentId });
  return res.data;
};

export const deleteCommentService = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};

export const getPresignedUrlService = async (filename, fileType, fileSize) => {
  const res = await api.post('/media/presigned-url', { filename, fileType, fileSize });
  return res.data;
};

export const uploadFileToS3Service = async (uploadUrl, file) => {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  });
  if (!res.ok) {
    throw new Error(`Direct S3 upload failed with status ${res.status}`);
  }
};

export default api;


