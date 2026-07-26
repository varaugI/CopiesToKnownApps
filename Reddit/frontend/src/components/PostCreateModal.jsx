import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, Link2, BarChart2, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { getPresignedUrlService, uploadFileToS3Service } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostCreateModal() {
  const { createPostModalOpen, setCreatePostModalOpen, subreddits, addPost, activeSubreddit } = usePosts();
  const { showToast } = useAuth();
  const [postType, setPostType] = useState('text'); // 'text' | 'image' | 'link' | 'poll'
  const [targetSub, setTargetSub] = useState(activeSubreddit || (subreddits[0]?.name || 'webdev'));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [flair, setFlair] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [isNSFW, setIsNSFW] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(false);

  if (!createPostModalOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalMediaUrl = mediaUrl;

    if (postType === 'image' && selectedFile) {
      setIsUploading(true);
      try {
        showToast('Requesting S3 pre-signed upload URL... ☁️');
        const presigned = await getPresignedUrlService(selectedFile.name, selectedFile.type, selectedFile.size);
        
        showToast('Uploading media directly to S3/MinIO... 🚀');
        await uploadFileToS3Service(presigned.uploadUrl, selectedFile);
        
        finalMediaUrl = presigned.publicUrl;
        showToast('Media uploaded to S3 storage! 📌');
      } catch (err) {
        showToast(`❌ S3 Upload failed: ${err.message}`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    addPost({
      title,
      type: postType,
      content,
      mediaUrl: finalMediaUrl,
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
    setSelectedFile(null);
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
              <label style={{ display: 'block', marginBottom: '8px' }}>Direct S3 Upload or Image URL</label>
              <div style={{ padding: '16px', border: '2px dashed var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-input)', textAlign: 'center', marginBottom: '12px' }}>
                <Upload size={24} style={{ color: 'var(--reddit-orange)', marginBottom: '6px' }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Upload image directly to MinIO/S3 Object Storage
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
                  onChange={handleFileChange}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>OR provide an external image URL</div>

              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
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
            <button type="submit" className="btn-primary" disabled={isUploading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isUploading ? <Loader2 size={16} className="spin" /> : null} Post to r/{targetSub}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
