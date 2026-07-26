import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tentra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Fallback Mock Datastore if backend server is not running
const mockPosts = [
  {
    _id: 'post_101',
    title: 'Welcome to TentraSocial! The next generation MERN Reddit clone built with high performance.',
    type: 'text',
    content: 'TentraSocial brings together real-time nested thread discussions, interactive polls, dynamic community subreddits, and an intuitive dark/light mode experience. Explore subreddits, cast your votes, and start discussions!',
    author: { _id: 'usr_admin', username: 'AlexDev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexDev' },
    subreddit: 'sub_webdev',
    subredditName: 'webdev',
    flair: 'Announcement',
    score: 342,
    upvotesCount: 350,
    downvotesCount: 8,
    userVote: 1,
    commentsCount: 3,
    isNSFW: false,
    isSpoiler: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'post_102',
    title: 'What frontend state management library are you using for React apps in 2026?',
    type: 'poll',
    content: 'Cast your vote and let us know what setup has given you the best developer experience this year!',
    pollOptions: [
      { id: 'opt_1', text: 'Zustand / Redux Toolkit', votesCount: 145, voters: [] },
      { id: 'opt_2', text: 'React Context + Hooks', votesCount: 89, voters: [] },
      { id: 'opt_3', text: 'TanStack Query / SWR', votesCount: 210, voters: [] },
      { id: 'opt_4', text: 'Jotai / Recoil / Signals', votesCount: 42, voters: [] }
    ],
    pollTotalVotes: 486,
    author: { _id: 'usr_sarah', username: 'SarahFrontend', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahFrontend' },
    subreddit: 'sub_reactjs',
    subredditName: 'reactjs',
    flair: 'Discussion',
    score: 188,
    upvotesCount: 195,
    downvotesCount: 7,
    commentsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    _id: 'post_103',
    title: 'Breakthrough in Quantum Computing: 1,000 Logical Qubit Chip Unveiled',
    type: 'link',
    linkUrl: 'https://news.ycombinator.com',
    content: 'Engineers have demonstrated fault-tolerant quantum error correction running at room temperature, paving the way for commercially viable quantum simulations.',
    mediaUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    author: { _id: 'usr_techie', username: 'QuantumCoder', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumCoder' },
    subreddit: 'sub_technology',
    subredditName: 'technology',
    flair: 'News',
    score: 512,
    upvotesCount: 530,
    downvotesCount: 18,
    commentsCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: 'post_104',
    title: 'What is a small coding habit that drastically improved your productivity?',
    type: 'text',
    content: 'For me it was writing unit tests before writing complex edge-case heavy business logic. What is your go-to habit?',
    author: { _id: 'usr_mike', username: 'CodeCraft', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CodeCraft' },
    subreddit: 'sub_askreddit',
    subredditName: 'askreddit',
    flair: 'Question',
    score: 890,
    upvotesCount: 915,
    downvotesCount: 25,
    commentsCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const mockSubreddits = [
  {
    _id: 'sub_webdev',
    name: 'webdev',
    displayName: 'Web Development',
    description: 'A community dedicated to all things web development: frontend, backend, tools, frameworks & industry news.',
    category: 'Technology',
    icon: '💻',
    bannerColor: 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
    membersCount: 14230,
    rules: [
      { title: 'Be Respectful', description: 'Maintain polite and constructive discussions.' },
      { title: 'No Spam', description: 'Self-promotion should be placed in weekly threads.' }
    ]
  },
  {
    _id: 'sub_technology',
    name: 'technology',
    displayName: 'Technology News & Discussion',
    description: 'The central hub for news, discussions, and advancements in tech, AI, hardware, and software.',
    category: 'Technology',
    icon: '🚀',
    bannerColor: 'linear-gradient(135deg, #FF416C, #FF4B2B)',
    membersCount: 38900,
    rules: [
      { title: 'Submissions must be technology related', description: 'Keep content focused on tech.' }
    ]
  },
  {
    _id: 'sub_reactjs',
    name: 'reactjs',
    displayName: 'React Community',
    description: 'News, articles and discussions regarding the React ecosystem (React.js, React Native, Next.js, Vite).',
    category: 'Programming',
    icon: '⚛️',
    bannerColor: 'linear-gradient(135deg, #00B4DB, #0083B0)',
    membersCount: 9450,
    rules: [
      { title: 'React specific content', description: 'Posts must involve React or related tools.' }
    ]
  },
  {
    _id: 'sub_askreddit',
    name: 'askreddit',
    displayName: 'Ask Reddit',
    description: 'The place to ask and answer thought-provoking questions.',
    category: 'General',
    icon: '❓',
    bannerColor: 'linear-gradient(135deg, #f12711, #f5af19)',
    membersCount: 52100,
    rules: [
      { title: 'Open ended questions only', description: 'Questions cannot be answered with yes/no.' }
    ]
  },
  {
    _id: 'sub_gaming',
    name: 'gaming',
    displayName: 'Gaming Universe',
    description: 'A subreddit for (almost) anything related to games - video games, board games, trailers, and memes.',
    category: 'Gaming',
    icon: '🎮',
    bannerColor: 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
    membersCount: 28400
  }
];

const mockComments = {
  post_101: [
    {
      _id: 'cmt_1',
      post: 'post_101',
      content: 'This Reddit clone interface is exceptionally clean! Glassmorphism combined with quick upvoting feels incredibly responsive.',
      author: { _id: 'usr_dev1', username: 'FrontendGeek', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FrontendGeek' },
      score: 42,
      depth: 0,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      children: [
        {
          _id: 'cmt_2',
          post: 'post_101',
          content: 'Appreciate it! The nested thread layout and collapsible replies make long comment chains super easy to follow.',
          author: { _id: 'usr_admin', username: 'AlexDev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexDev' },
          score: 19,
          depth: 1,
          parentComment: 'cmt_1',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          children: [
            {
              _id: 'cmt_3',
              post: 'post_101',
              content: 'Are you using Mongoose schemas for voting indices? The query performance looks rock solid.',
              author: { _id: 'usr_db', username: 'MongoNinja', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MongoNinja' },
              score: 8,
              depth: 2,
              parentComment: 'cmt_2',
              createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
              children: []
            }
          ]
        }
      ]
    }
  ]
};

export const fetchPostsService = async (subreddit = '', sort = 'hot', search = '') => {
  try {
    const res = await api.get('/posts', { params: { subreddit, sort, search } });
    return res.data;
  } catch (err) {
    // Fallback
    let result = [...mockPosts];
    if (subreddit) result = result.filter(p => p.subredditName.toLowerCase() === subreddit.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }
    if (sort === 'top') result.sort((a, b) => b.score - a.score);
    if (sort === 'new') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }
};

export const fetchPostByIdService = async (id) => {
  try {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  } catch (err) {
    const post = mockPosts.find(p => p._id === id);
    if (post) return post;
    throw new Error('Post not found');
  }
};

export const createPostService = async (postData) => {
  try {
    const res = await api.post('/posts', postData);
    return res.data;
  } catch (err) {
    const newPost = {
      _id: 'post_' + Date.now(),
      ...postData,
      score: 1,
      userVote: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      author: { _id: 'usr_demo', username: 'DemoUser', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DemoUser' }
    };
    mockPosts.unshift(newPost);
    return newPost;
  }
};

export const votePostService = async (id, voteType) => {
  try {
    const res = await api.post(`/posts/${id}/vote`, { voteType });
    return res.data;
  } catch (err) {
    const post = mockPosts.find(p => p._id === id);
    if (post) {
      if (post.userVote === voteType) {
        post.score -= voteType;
        post.userVote = 0;
      } else {
        const diff = voteType - (post.userVote || 0);
        post.score += diff;
        post.userVote = voteType;
      }
      return { score: post.score, userVote: post.userVote };
    }
  }
};

export const votePollService = async (id, optionId) => {
  try {
    const res = await api.post(`/posts/${id}/poll`, { optionId });
    return res.data;
  } catch (err) {
    const post = mockPosts.find(p => p._id === id);
    if (post && post.pollOptions) {
      const opt = post.pollOptions.find(o => o.id === optionId);
      if (opt) {
        opt.votesCount += 1;
        post.pollTotalVotes = (post.pollTotalVotes || 0) + 1;
        post.userPollVote = optionId;
      }
    }
    return post;
  }
};

export const fetchSubredditsService = async () => {
  try {
    const res = await api.get('/subreddits');
    return res.data;
  } catch (err) {
    return mockSubreddits;
  }
};

export const fetchSubredditByNameService = async (name) => {
  try {
    const res = await api.get(`/subreddits/${name}`);
    return res.data;
  } catch (err) {
    const sub = mockSubreddits.find(s => s.name === name.toLowerCase());
    if (sub) return sub;
    throw new Error('Subreddit not found');
  }
};

export const createSubredditService = async (data) => {
  try {
    const res = await api.post('/subreddits', data);
    return res.data;
  } catch (err) {
    const newSub = {
      _id: 'sub_' + Date.now(),
      ...data,
      membersCount: 1
    };
    mockSubreddits.unshift(newSub);
    return newSub;
  }
};

export const fetchCommentsService = async (postId) => {
  try {
    const res = await api.get(`/comments/post/${postId}`);
    return res.data;
  } catch (err) {
    return mockComments[postId] || [];
  }
};

export const createCommentService = async (postId, content, parentCommentId = null) => {
  try {
    const res = await api.post('/comments', { postId, content, parentCommentId });
    return res.data;
  } catch (err) {
    const newCmt = {
      _id: 'cmt_' + Date.now(),
      post: postId,
      content,
      author: { _id: 'usr_demo', username: 'DemoUser', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DemoUser' },
      score: 1,
      depth: parentCommentId ? 1 : 0,
      parentComment: parentCommentId,
      children: [],
      createdAt: new Date().toISOString()
    };

    if (!mockComments[postId]) mockComments[postId] = [];
    if (!parentCommentId) {
      mockComments[postId].unshift(newCmt);
    } else {
      mockComments[postId].push(newCmt);
    }
    return newCmt;
  }
};

export default api;
