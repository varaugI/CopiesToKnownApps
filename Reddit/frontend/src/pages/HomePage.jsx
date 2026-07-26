import React, { useState } from 'react';
import { Flame, Sparkles, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { usePostsQuery } from '../hooks/usePosts';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [activeSort, setActiveSort] = useState('hot');
  const { data, isLoading, isError, refetch } = usePostsQuery('', activeSort);
  const { setCreatePostModalOpen } = usePosts();

  const posts = Array.isArray(data) ? data : (data?.items || []);

  return (
    <div>
      {/* Create Quick Post Bar */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="nav-brand-logo" style={{ width: '32px', height: '32px' }}>
          <Flame size={18} />
        </div>
        <input
          type="text"
          placeholder="Create a post..."
          onClick={() => setCreatePostModalOpen(true)}
          readOnly
          style={{ flex: 1, padding: '8px 16px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer' }}
        />
        <button onClick={() => setCreatePostModalOpen(true)} className="icon-btn" title="Create Post">
          <Plus size={20} />
        </button>
      </div>

      {/* Feed Toolbar */}
      <div className="feed-toolbar">
        <div className="sort-tabs">
          <button
            className={`sort-tab ${activeSort === 'hot' ? 'active' : ''}`}
            onClick={() => setActiveSort('hot')}
          >
            <Flame size={16} /> Hot
          </button>
          <button
            className={`sort-tab ${activeSort === 'new' ? 'active' : ''}`}
            onClick={() => setActiveSort('new')}
          >
            <Sparkles size={16} /> New
          </button>
          <button
            className={`sort-tab ${activeSort === 'top' ? 'active' : ''}`}
            onClick={() => setActiveSort('top')}
          >
            <TrendingUp size={16} /> Top
          </button>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Loading community feeds...
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: '#ff4d4d' }}>Failed to load community feed</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Database or network service may be unavailable.</p>
          <button onClick={() => refetch()} className="btn-primary" style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3>No posts found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Be the first to post in this community!</p>
          <button onClick={() => setCreatePostModalOpen(true)} className="btn-primary" style={{ marginTop: '14px' }}>
            Create Post
          </button>
        </div>
      ) : (
        <div>
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
