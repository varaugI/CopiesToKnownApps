import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, TrendingUp, PlusCircle, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { usePosts } from '../context/PostContext';

export default function Sidebar() {
  const { subreddits, activeSubreddit, setActiveSubreddit, setCreateSubModalOpen } = usePosts();
  const location = useLocation();

  const isHome = location.pathname === '/' && !activeSubreddit;

  return (
    <aside className="left-sidebar">
      <div className="sidebar-group">
        <div className="sidebar-title">Feeds</div>
        <Link
          to="/"
          onClick={() => setActiveSubreddit('')}
          className={`sidebar-item ${isHome ? 'active' : ''}`}
        >
          <Home size={19} />
          <span>Home</span>
        </Link>
        <Link
          to="/"
          onClick={() => setActiveSubreddit('')}
          className="sidebar-item"
        >
          <Flame size={19} />
          <span>Popular</span>
        </Link>
        <Link
          to="/"
          onClick={() => setActiveSubreddit('')}
          className="sidebar-item"
        >
          <TrendingUp size={19} />
          <span>All Feeds</span>
        </Link>
      </div>

      <div className="sidebar-group">
        <div className="sidebar-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Communities</span>
          <button
            onClick={() => setCreateSubModalOpen(true)}
            style={{ color: 'var(--reddit-orange)', cursor: 'pointer' }}
            title="Create Community"
          >
            <PlusCircle size={16} />
          </button>
        </div>

        {subreddits.map(sub => {
          const isActive = activeSubreddit.toLowerCase() === sub.name.toLowerCase();
          return (
            <Link
              key={sub._id || sub.name}
              to={`/r/${sub.name}`}
              onClick={() => setActiveSubreddit(sub.name)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <div className="subreddit-badge-icon">
                {sub.icon || '🔥'}
              </div>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                r/{sub.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="sidebar-group" style={{ marginTop: 'auto' }}>
        <div className="sidebar-title">Resources</div>
        <div className="sidebar-item" style={{ cursor: 'pointer' }}>
          <Sparkles size={18} />
          <span>Reddit Premium</span>
        </div>
        <div className="sidebar-item" style={{ cursor: 'pointer' }}>
          <ShieldAlert size={18} />
          <span>Privacy & Policy</span>
        </div>
      </div>
    </aside>
  );
}
