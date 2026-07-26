import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, Link2, BarChart2, Plus, Trash2 } from 'lucide-react';
import { usePosts } from '../context/PostContext';

export default function PostCreateModal() {
  const { createPostModalOpen, setCreatePostModalOpen, subreddits, addPost, activeSubreddit } = usePosts();
  const [postType, setPostType] = useState('text'); // 'text' | 'image' | 'link' | 'poll'
  const [targetSub, setTargetSub] = useState(activeSubreddit || (subreddits[0]?.name || 'webdev'));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [flair, setFlair] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [isNSFW, setIsNSFW] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(false);

  if (!createPostModalOpen) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handlePollChange = (idx, value) => {
    const updated = [...pollOptions];
    updated[idx] = value;
    setPollOptions(updated);
  };

  const handleRemovePollOption = (idx) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addPost({
      title,
      type: postType,
      content,
      mediaUrl,
      linkUrl,
      pollOptions: postType === 'poll' ? pollOptions.filter(o => o.trim()) : [],
      subredditName: targetSub,
      flair,
      isNSFW,
      isSpoiler
    });

    // Reset
    setTitle('');
    setContent('');
    setMediaUrl('');
    setLinkUrl('');
    setFlair('');
  };

  return (
    <div className="modal-overlay" onClick={() => setCreatePostModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a Post</h2>
          <button className="icon-btn" onClick={() => setCreatePostModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Choose a Community</label>
            <select value={targetSub} onChange={(e) => setTargetSub(e.target.value)}>
              {subreddits.map(sub => (
                <option key={sub._id || sub.name} value={sub.name}>
                  r/{sub.name} ({sub.displayName})
                </option>
              ))}
            </select>
          </div>

          {/* Post Type Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <button
              type="button"
              className={`sort-tab ${postType === 'text' ? 'active' : ''}`}
              onClick={() => setPostType('text')}
            >
              <FileText size={16} /> Text
            </button>
            <button
              type="button"
              className={`sort-tab ${postType === 'image' ? 'active' : ''}`}
              onClick={() => setPostType('image')}
            >
              <ImageIcon size={16} /> Image & Media
            </button>
            <button
              type="button"
              className={`sort-tab ${postType === 'link' ? 'active' : ''}`}
              onClick={() => setPostType('link')}
            >
              <Link2 size={16} /> Link
            </button>
            <button
              type="button"
              className={`sort-tab ${postType === 'poll' ? 'active' : ''}`}
              onClick={() => setPostType('poll')}
            >
              <BarChart2 size={16} /> Poll
            </button>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="Title your post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={300}
            />
          </div>

          {postType === 'text' && (
            <div className="form-group">
              <label>Text Content (Optional)</label>
              <textarea
                rows={5}
                placeholder="Write your discussion points here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          )}

          {postType === 'image' && (
            <div className="form-group">
              <label>Image / Media URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                required
              />
              {mediaUrl && (
                <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', maxHeight: '180px' }}>
                  <img src={mediaUrl} alt="Preview" style={{ width: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          )}

          {postType === 'link' && (
            <div className="form-group">
              <label>URL Link</label>
              <input
                type="url"
                placeholder="https://example.com/article"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
              />
            </div>
          )}

          {postType === 'poll' && (
            <div className="form-group">
              <label>Poll Options</label>
              {pollOptions.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handlePollChange(idx, e.target.value)}
                    required
                  />
                  {pollOptions.length > 2 && (
                    <button type="button" className="icon-btn" onClick={() => handleRemovePollOption(idx)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 6 && (
                <button type="button" className="btn-secondary" onClick={handleAddPollOption} style={{ alignSelf: 'flex-start' }}>
                  <Plus size={16} /> Add Option
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Post Flair (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Discussion, News, Help"
                value={flair}
                onChange={(e) => setFlair(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '22px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isNSFW} onChange={(e) => setIsNSFW(e.target.checked)} />
                NSFW
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} />
                Spoiler
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setCreatePostModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Post to r/{targetSub}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
