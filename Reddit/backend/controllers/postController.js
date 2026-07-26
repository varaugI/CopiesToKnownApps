import Post from '../models/Post.js';
import Subreddit from '../models/Subreddit.js';
import User from '../models/User.js';

// Default mock posts for instant fallback
const defaultPosts = [
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
    commentsCount: 18,
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
    commentsCount: 34,
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
    commentsCount: 42,
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
    commentsCount: 128,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// @desc Get posts with filtering, sorting, and search
// @route GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const { subreddit, sort = 'hot', search } = req.query;

    if (Post.db && Post.db.readyState === 1) {
      let query = {};
      if (subreddit) {
        query.subredditName = subreddit.toLowerCase();
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'top') sortOptions = { score: -1 };
      if (sort === 'hot') sortOptions = { score: -1, createdAt: -1 };

      const posts = await Post.find(query)
        .populate('author', 'username avatar')
        .populate('subreddit', 'name displayName icon bannerColor')
        .sort(sortOptions);

      return res.json(posts);
    } else {
      let filtered = [...defaultPosts];
      if (subreddit) {
        filtered = filtered.filter(p => p.subredditName.toLowerCase() === subreddit.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
      }

      if (sort === 'top') {
        filtered.sort((a, b) => b.score - a.score);
      } else if (sort === 'new') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        // hot
        filtered.sort((a, b) => (b.score * 1.5) - (a.score * 1.5));
      }

      return res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get post by ID
// @route GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (Post.db && Post.db.readyState === 1) {
      const post = await Post.findById(id)
        .populate('author', 'username avatar bio postKarma')
        .populate('subreddit', 'name displayName icon description membersCount rules');
      if (post) return res.json(post);
    }

    const found = defaultPosts.find(p => p._id === id);
    if (found) return res.json(found);

    return res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new post
// @route POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { title, type = 'text', content, mediaUrl, linkUrl, pollOptions, subredditName, flair, isNSFW, isSpoiler } = req.body;

    if (!title || !subredditName) {
      return res.status(400).json({ message: 'Title and target subreddit are required' });
    }

    if (Post.db && Post.db.readyState === 1) {
      const subreddit = await Subreddit.findOne({ name: subredditName.toLowerCase() });
      if (!subreddit) {
        return res.status(404).json({ message: 'Target subreddit does not exist' });
      }

      let formattedPoll = [];
      if (type === 'poll' && Array.isArray(pollOptions)) {
        formattedPoll = pollOptions.filter(opt => opt.trim()).map(text => ({ text, votesCount: 0, voters: [] }));
      }

      const post = await Post.create({
        title,
        type,
        content: content || '',
        mediaUrl: mediaUrl || '',
        linkUrl: linkUrl || '',
        pollOptions: formattedPoll,
        flair: flair || '',
        isNSFW: !!isNSFW,
        isSpoiler: !!isSpoiler,
        author: req.user._id,
        subreddit: subreddit._id,
        subredditName: subreddit.name,
        votes: [{ user: req.user._id, voteType: 1 }],
        upvotesCount: 1,
        downvotesCount: 0,
        score: 1
      });

      const populatedPost = await Post.findById(post._id)
        .populate('author', 'username avatar')
        .populate('subreddit', 'name displayName icon');

      // Update user karma
      await User.findByIdAndUpdate(req.user._id, { $inc: { postKarma: 1 } });

      return res.status(201).json(populatedPost);
    } else {
      let formattedPoll = [];
      if (type === 'poll' && Array.isArray(pollOptions)) {
        formattedPoll = pollOptions.map((text, idx) => ({ id: 'opt_' + idx, text, votesCount: 0, voters: [] }));
      }

      const newPost = {
        _id: 'post_' + Date.now(),
        title,
        type,
        content: content || '',
        mediaUrl: mediaUrl || '',
        linkUrl: linkUrl || '',
        pollOptions: formattedPoll,
        pollTotalVotes: 0,
        flair: flair || '',
        isNSFW: !!isNSFW,
        isSpoiler: !!isSpoiler,
        author: { _id: req.user._id, username: req.user.username, avatar: req.user.avatar },
        subreddit: 'sub_' + subredditName.toLowerCase(),
        subredditName: subredditName.toLowerCase(),
        score: 1,
        upvotesCount: 1,
        downvotesCount: 0,
        userVote: 1,
        commentsCount: 0,
        createdAt: new Date().toISOString()
      };

      defaultPosts.unshift(newPost);
      return res.status(201).json(newPost);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Upvote or Downvote post
// @route POST /api/posts/:id/vote
export const votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 1 for upvote, -1 for downvote, 0 to cancel

    if (Post.db && Post.db.readyState === 1) {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const existingVoteIndex = post.votes.findIndex(v => v.user.toString() === req.user._id.toString());

      if (existingVoteIndex > -1) {
        const currentVote = post.votes[existingVoteIndex].voteType;
        if (currentVote === voteType || voteType === 0) {
          // Remove vote
          post.votes.splice(existingVoteIndex, 1);
          if (currentVote === 1) post.upvotesCount = Math.max(0, post.upvotesCount - 1);
          if (currentVote === -1) post.downvotesCount = Math.max(0, post.downvotesCount - 1);
        } else {
          // Switch vote direction
          post.votes[existingVoteIndex].voteType = voteType;
          if (voteType === 1) {
            post.upvotesCount += 1;
            post.downvotesCount = Math.max(0, post.downvotesCount - 1);
          } else {
            post.downvotesCount += 1;
            post.upvotesCount = Math.max(0, post.upvotesCount - 1);
          }
        }
      } else if (voteType !== 0) {
        // Add new vote
        post.votes.push({ user: req.user._id, voteType });
        if (voteType === 1) post.upvotesCount += 1;
        if (voteType === -1) post.downvotesCount += 1;
      }

      post.score = post.upvotesCount - post.downvotesCount;
      await post.save();

      return res.json({ score: post.score, upvotesCount: post.upvotesCount, downvotesCount: post.downvotesCount });
    } else {
      const post = defaultPosts.find(p => p._id === id);
      if (post) {
        if (post.userVote === voteType) {
          post.score -= voteType;
          post.userVote = 0;
        } else {
          const diff = voteType - (post.userVote || 0);
          post.score += diff;
          post.userVote = voteType;
        }
        return res.json({ score: post.score, userVote: post.userVote });
      }
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Vote in a poll post
// @route POST /api/posts/:id/poll
export const votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;

    if (Post.db && Post.db.readyState === 1) {
      const post = await Post.findById(id);
      if (!post || post.type !== 'poll') return res.status(400).json({ message: 'Invalid poll post' });

      const option = post.pollOptions.id(optionId);
      if (!option) return res.status(404).json({ message: 'Option not found' });

      // Check if user already voted in this poll
      const hasVoted = post.pollOptions.some(opt => opt.voters.includes(req.user._id));
      if (hasVoted) return res.status(400).json({ message: 'You have already voted in this poll' });

      option.votesCount += 1;
      option.voters.push(req.user._id);
      post.pollTotalVotes += 1;

      await post.save();
      return res.json(post);
    } else {
      const post = defaultPosts.find(p => p._id === id);
      if (post && post.pollOptions) {
        const option = post.pollOptions.find(o => o.id === optionId);
        if (option) {
          option.votesCount += 1;
          post.pollTotalVotes = (post.pollTotalVotes || 0) + 1;
          post.userPollVote = optionId;
          return res.json(post);
        }
      }
      return res.status(404).json({ message: 'Poll option not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
