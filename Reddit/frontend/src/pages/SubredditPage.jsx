import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSubredditByNameService } from '../services/api';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Users, Plus, Flame, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function SubredditPage() {
  const { name } = useParams();
  const [subreddit, setSubreddit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const { posts, loadingPosts, setActiveSubreddit, activeSort, setActiveSort, setCreatePostModalOpen } = usePosts();
  const { user, openAuthModal, showToast } = useAuth();

  useEffect(() => {
    const loadSub = async () => {
      setLoading(true);
      try {
        const sub = await fetchSubredditByNameService(name);
        setSubreddit(sub);
        setActiveSubreddit(sub.name);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (name) loadSub();
  }, [name, setActiveSubreddit]);

  const toggleJoin = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setJoined(!joined);
    showToast(joined ? `Left r/${name}` : `Joined r/${name}! 🎉`);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading community r/{name}...</div>;
  }

  if (!subreddit) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>Community r/{name} not found</div>;
  }

  const subPosts = posts.filter(p => p.subredditName?.toLowerCase() === name.toLowerCase());

  return (
    <div>
      {/* Subreddit Profile Header Banner */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '20px', overflow: 'hidden' }}>
        <div
          className="subreddit-banner"
          style={{ background: subreddit.bannerColor || 'linear-gradient(135deg, #ff4500, #ff8700)' }}
        />
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="subreddit-avatar-large">
              {subreddit.icon || '🔥'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {subreddit.displayName}
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                r/{subreddit.name}
              </div>
              <p style={{ marginTop: '6px', fontSize: '0.9rem', color: 'var(--text-main)', maxWidth: '600px' }}>
                {subreddit.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={15} color="var(--reddit-orange)" />
                  <strong>{(subreddit.membersCount || 100).toLocaleString()}</strong> Members
                </span>
                <span>•</span>
                <span>Category: <strong>{subreddit.category || 'General'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={toggleJoin}
              className={joined ? 'btn-secondary' : 'btn-primary'}
            >
              {joined ? 'Joined' : 'Join Community'}
            </button>
          </div>
        </div>
      </div>

      {/* Feed Toolbar */}
      <div className="feed-toolbar">
        <div className="sort-tabs">
          <button className={`sort-tab ${activeSort === 'hot' ? 'active' : ''}`} onClick={() => setActiveSort('hot')}>
            <Flame size={16} /> Hot
          </button>
          <button className={`sort-tab ${activeSort === 'new' ? 'active' : ''}`} onClick={() => setActiveSort('new')}>
            <Sparkles size={16} /> New
          </button>
          <button className={`sort-tab ${activeSort === 'top' ? 'active' : ''}`} onClick={() => setActiveSort('top')}>
            <TrendingUp size={16} /> Top
          </button>
        </div>

        <button onClick={() => setCreatePostModalOpen(true)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
          <Plus size={16} /> Create Post
        </button>
      </div>

      {/* Subreddit Rules Widget if Present */}
      {subreddit.rules && subreddit.rules.length > 0 && (
        <div className="widget-card" style={{ marginBottom: '16px' }}>
          <div className="widget-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="var(--reddit-orange)" /> r/{subreddit.name} Rules
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {subreddit.rules.map((rule, idx) => (
              <div key={idx} style={{ fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>{idx + 1}. {rule.title}</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed */}
      {loadingPosts ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading r/{name} posts...</div>
      ) : subPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3>No posts in r/{name} yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Be the first to start a conversation in this community!</p>
          <button onClick={() => setCreatePostModalOpen(true)} className="btn-primary" style={{ marginTop: '14px' }}>
            Create Post
          </button>
        </div>
      ) : (
        subPosts.map(post => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}
