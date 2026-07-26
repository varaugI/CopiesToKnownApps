import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// Default mock comments for fallback
const defaultComments = [
  {
    _id: 'cmt_1',
    post: 'post_101',
    content: 'This Reddit clone interface is exceptionally clean! Glassmorphism combined with quick upvoting feels incredibly responsive.',
    author: { _id: 'usr_dev1', username: 'FrontendGeek', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FrontendGeek' },
    score: 42,
    depth: 0,
    parentComment: null,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    _id: 'cmt_2',
    post: 'post_101',
    content: 'Appreciate it! The nested thread layout and collapsible replies make long comment chains super easy to follow.',
    author: { _id: 'usr_admin', username: 'AlexDev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexDev' },
    score: 19,
    depth: 1,
    parentComment: 'cmt_1',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'cmt_3',
    post: 'post_101',
    content: 'Are you using Mongoose schemas for voting indices? The query performance looks rock solid.',
    author: { _id: 'usr_db', username: 'MongoNinja', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MongoNinja' },
    score: 8,
    depth: 2,
    parentComment: 'cmt_2',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    _id: 'cmt_4',
    post: 'post_102',
    content: 'Zustand + TanStack Query is definitely the gold standard stack for modern React state management!',
    author: { _id: 'usr_react', username: 'ReactMaster', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ReactMaster' },
    score: 31,
    depth: 0,
    parentComment: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

// Helper to assemble linear array of comments into a hierarchical tree
const buildCommentTree = (comments) => {
  const commentMap = {};
  const rootComments = [];

  comments.forEach(comment => {
    const raw = comment.toObject ? comment.toObject() : { ...comment };
    raw.children = [];
    commentMap[raw._id] = raw;
  });

  comments.forEach(comment => {
    const raw = commentMap[comment._id];
    if (raw.parentComment) {
      const parent = commentMap[raw.parentComment._id || raw.parentComment];
      if (parent) {
        parent.children.push(raw);
      } else {
        rootComments.push(raw);
      }
    } else {
      rootComments.push(raw);
    }
  });

  return rootComments;
};

// @desc Get comments for a post
// @route GET /api/comments/post/:postId
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (Comment.db && Comment.db.readyState === 1) {
      const comments = await Comment.find({ post: postId })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 });

      const tree = buildCommentTree(comments);
      return res.json(tree);
    } else {
      const filtered = defaultComments.filter(c => c.post === postId);
      const tree = buildCommentTree(filtered);
      return res.json(tree);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create comment or reply
// @route POST /api/comments
export const createComment = async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ message: 'Post ID and content are required' });
    }

    if (Comment.db && Comment.db.readyState === 1) {
      let depth = 0;
      if (parentCommentId) {
        const parent = await Comment.findById(parentCommentId);
        if (parent) {
          depth = parent.depth + 1;
        }
      }

      const comment = await Comment.create({
        post: postId,
        author: req.user._id,
        content,
        parentComment: parentCommentId || null,
        depth,
        votes: [{ user: req.user._id, voteType: 1 }],
        score: 1
      });

      // Update post comment count
      await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
      // Update author comment karma
      await User.findByIdAndUpdate(req.user._id, { $inc: { commentKarma: 1 } });

      const populated = await Comment.findById(comment._id).populate('author', 'username avatar');
      return res.status(201).json(populated);
    } else {
      let depth = 0;
      if (parentCommentId) {
        const parent = defaultComments.find(c => c._id === parentCommentId);
        if (parent) depth = (parent.depth || 0) + 1;
      }

      const newComment = {
        _id: 'cmt_' + Date.now(),
        post: postId,
        content,
        author: { _id: req.user._id, username: req.user.username, avatar: req.user.avatar },
        parentComment: parentCommentId || null,
        depth,
        score: 1,
        userVote: 1,
        children: [],
        createdAt: new Date().toISOString()
      };

      defaultComments.push(newComment);

      const targetPost = defaultPosts.find(p => p._id === postId);
      if (targetPost) targetPost.commentsCount = (targetPost.commentsCount || 0) + 1;

      return res.status(201).json(newComment);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Upvote / Downvote a comment
// @route POST /api/comments/:id/vote
export const voteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;

    if (Comment.db && Comment.db.readyState === 1) {
      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });

      const existingVoteIndex = comment.votes.findIndex(v => v.user.toString() === req.user._id.toString());

      if (existingVoteIndex > -1) {
        const currentVote = comment.votes[existingVoteIndex].voteType;
        if (currentVote === voteType || voteType === 0) {
          comment.votes.splice(existingVoteIndex, 1);
        } else {
          comment.votes[existingVoteIndex].voteType = voteType;
        }
      } else if (voteType !== 0) {
        comment.votes.push({ user: req.user._id, voteType });
      }

      comment.score = comment.votes.reduce((acc, v) => acc + v.voteType, 0);
      await comment.save();

      return res.json({ score: comment.score });
    } else {
      const cmt = defaultComments.find(c => c._id === id);
      if (cmt) {
        cmt.score = (cmt.score || 1) + (voteType || 1);
        return res.json({ score: cmt.score });
      }
      return res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
