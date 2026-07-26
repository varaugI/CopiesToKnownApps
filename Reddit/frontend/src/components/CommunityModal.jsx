import React, { useState } from 'react';
import { X, Users, Compass } from 'lucide-react';
import { usePosts } from '../context/PostContext';

export default function CommunityModal() {
  const { createSubModalOpen, setCreateSubModalOpen, addSubreddit } = usePosts();
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [icon, setIcon] = useState('🔥');

  if (!createSubModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !displayName.trim()) return;

    addSubreddit({
      name: name.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      displayName,
      description,
      category,
      icon,
      bannerColor: 'linear-gradient(135deg, #ff4500, #ff8700)'
    });

    setName('');
    setDisplayName('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={() => setCreateSubModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a Community</h2>
          <button className="icon-btn" onClick={() => setCreateSubModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Subreddit Name (r/...)*</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                r/
              </span>
              <input
                type="text"
                placeholder="community_name"
                style={{ paddingLeft: '32px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={21}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Names cannot be changed later. Lowercase letters, numbers & underscores.
            </span>
          </div>

          <div className="form-group">
            <label>Display Name *</label>
            <input
              type="text"
              placeholder="e.g. Frontend Engineers"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="Gaming">Gaming</option>
              <option value="Science">Science</option>
              <option value="General">General / Discussion</option>
            </select>
          </div>

          <div className="form-group">
            <label>Community Icon (Emoji)</label>
            <input
              type="text"
              placeholder="e.g. 🚀, 💻, 🎮"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={4}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows={3}
              placeholder="Describe what members will discuss in this community..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setCreateSubModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
