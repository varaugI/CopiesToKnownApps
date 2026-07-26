import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';
import { Award, MessageSquare, Calendar, Edit3, Check } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams();
  const { user, showToast } = useAuth();
  const { posts } = usePosts();
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved'
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || 'Reddit enthusiast and community builder.');

  const isOwnProfile = user && user.username.toLowerCase() === username.toLowerCase();

  const userPosts = posts.filter(p => {
    const author = p.author?.username || p.author;
    return author?.toLowerCase() === username.toLowerCase();
  });

  const handleSaveBio = () => {
    setIsEditingBio(false);
    showToast('Bio updated! ✏️');
  };

  return (
    <div>
      {/* Profile Header Card */}
      <div className="widget-card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <img
            src={isOwnProfile && user?.avatar ? user.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`}
            alt={username}
            style={{ width: '84px', height: '84px', borderRadius: '50%', border: '3px solid var(--reddit-orange)', boxShadow: 'var(--shadow-sm)' }}
          />

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>u/{username}</h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={16} color="var(--reddit-orange)" />
                <strong>{isOwnProfile ? (user?.postKarma || 142) : 245}</strong> Post Karma
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MessageSquare size={16} color="var(--accent-blue)" />
                <strong>{isOwnProfile ? (user?.commentKarma || 88) : 112}</strong> Comment Karma
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={16} /> Member since 2026
              </span>
            </div>

            <div style={{ marginTop: '10px' }}>
              {isEditingBio ? (
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                  />
                  <button onClick={handleSaveBio} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <Check size={16} /> Save
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {bio}
                  </p>
                  {isOwnProfile && (
                    <button onClick={() => setIsEditingBio(true)} className="icon-btn" style={{ width: '28px', height: '28px' }} title="Edit Bio">
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="feed-toolbar">
        <div className="sort-tabs">
          <button className={`sort-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            Submitted Posts ({userPosts.length})
          </button>
          {isOwnProfile && (
            <button className={`sort-tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
              Saved Library
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'posts' ? (
        userPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            u/{username} has not submitted any posts yet.
          </div>
        ) : (
          userPosts.map(p => <PostCard key={p._id} post={p} />)
        )
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          Your saved posts will appear here.
        </div>
      )}
    </div>
  );
}
