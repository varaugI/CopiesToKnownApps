import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Sun, Moon, LogIn, User as UserIcon, LogOut, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePosts } from '../context/PostContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, setCreatePostModalOpen, setActiveSubreddit } = usePosts();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" onClick={() => setActiveSubreddit('')} className="nav-brand">
        <div className="nav-brand-logo">
          <Flame size={20} />
        </div>
        <span>Tentra<span style={{ color: 'var(--reddit-orange)' }}>Social</span></span>
      </Link>

      <form onSubmit={handleSearchSubmit} className="nav-search">
        <Search className="nav-search-icon" size={18} />
        <input
          type="text"
          placeholder="Search TentraSocial..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="nav-actions">
        <button
          onClick={toggleTheme}
          className="icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {user && <NotificationDropdown />}

        {user ? (
          <>
            <button
              onClick={() => setCreatePostModalOpen(true)}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Create Post</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to={`/user/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                  alt={user.username}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>u/{user.username}</span>
              </Link>

              <button
                onClick={logout}
                className="icon-btn"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => openAuthModal('login')} className="btn-secondary">
              <LogIn size={16} />
              <span>Log In</span>
            </button>
            <button onClick={() => openAuthModal('register')} className="btn-primary">
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
