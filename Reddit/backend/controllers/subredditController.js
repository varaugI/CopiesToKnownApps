import Subreddit from '../models/Subreddit.js';
import User from '../models/User.js';

// Seeded/Default subreddits for fallback mode
const defaultSubreddits = [
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
    membersCount: 28400,
    rules: [
      { title: 'No piracy links', description: 'Do not share pirated content or links.' }
    ]
  }
];

// @desc Get all subreddits
// @route GET /api/subreddits
export const getSubreddits = async (req, res) => {
  try {
    if (Subreddit.db && Subreddit.db.readyState === 1) {
      const subreddits = await Subreddit.find().sort({ membersCount: -1 });
      return res.json(subreddits.length ? subreddits : defaultSubreddits);
    } else {
      return res.json(defaultSubreddits);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single subreddit by name
// @route GET /api/subreddits/:name
export const getSubredditByName = async (req, res) => {
  try {
    const subName = req.params.name.toLowerCase();
    if (Subreddit.db && Subreddit.db.readyState === 1) {
      const subreddit = await Subreddit.findOne({ name: subName }).populate('creator', 'username avatar');
      if (subreddit) return res.json(subreddit);
    }

    const defaultSub = defaultSubreddits.find(s => s.name === subName);
    if (defaultSub) return res.json(defaultSub);

    return res.status(404).json({ message: 'Subreddit not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new subreddit
// @route POST /api/subreddits
export const createSubreddit = async (req, res) => {
  try {
    const { name, displayName, description, category, icon, bannerColor, rules } = req.body;

    if (!name || !displayName || !description) {
      return res.status(400).json({ message: 'Name, display name and description are required' });
    }

    const cleanName = name.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (Subreddit.db && Subreddit.db.readyState === 1) {
      const exists = await Subreddit.findOne({ name: cleanName });
      if (exists) {
        return res.status(400).json({ message: 'Subreddit name already exists' });
      }

      const subreddit = await Subreddit.create({
        name: cleanName,
        displayName,
        description,
        category: category || 'General',
        icon: icon || '🌐',
        bannerColor: bannerColor || 'linear-gradient(135deg, #ff4500, #ff8700)',
        creator: req.user._id,
        rules: rules || [],
        members: [req.user._id],
        membersCount: 1
      });

      return res.status(201).json(subreddit);
    } else {
      const newSub = {
        _id: 'sub_' + cleanName + '_' + Date.now(),
        name: cleanName,
        displayName,
        description,
        category: category || 'General',
        icon: icon || '🌐',
        bannerColor: bannerColor || 'linear-gradient(135deg, #ff4500, #ff8700)',
        membersCount: 1,
        rules: rules || []
      };
      defaultSubreddits.unshift(newSub);
      return res.status(201).json(newSub);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Join or leave a subreddit
// @route POST /api/subreddits/:id/join
export const toggleJoinSubreddit = async (req, res) => {
  try {
    const subId = req.params.id;
    if (Subreddit.db && Subreddit.db.readyState === 1) {
      const subreddit = await Subreddit.findById(subId);
      if (!subreddit) return res.status(404).json({ message: 'Subreddit not found' });

      const isMember = subreddit.members.includes(req.user._id);

      if (isMember) {
        subreddit.members.pull(req.user._id);
        subreddit.membersCount = Math.max(0, subreddit.membersCount - 1);
      } else {
        subreddit.members.push(req.user._id);
        subreddit.membersCount += 1;
      }

      await subreddit.save();
      return res.json({ isMember: !isMember, membersCount: subreddit.membersCount });
    } else {
      const sub = defaultSubreddits.find(s => s._id === subId || s.name === subId);
      if (sub) {
        sub.isJoined = !sub.isJoined;
        sub.membersCount += sub.isJoined ? 1 : -1;
        return res.json({ isMember: sub.isJoined, membersCount: sub.membersCount });
      }
      return res.json({ isMember: true, membersCount: 100 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
