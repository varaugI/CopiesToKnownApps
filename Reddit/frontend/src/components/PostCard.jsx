import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Bookmark, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post }) {
  const { handleVote, handlePollVote } = usePosts();
  const { user, showToast } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const authorName = post.author?.username || post.author || 'anonymous';
  const authorAvatar = post.author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${authorName}`;
  const subName = post.subredditName || (post.subreddit?.name) || 'general';

  const userVote = post.userVote || 0;

  const formattedDate = () => {
    try {
      const date = new Date(post.createdAt);
      const diffHours = Math.floor((Date.now() - date.getTime()) / (1000 * 3600));
      if (diffHours < 1) return 'just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch (e) {
      return 'recently';
    }
  };

  const toggleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Post removed from Saved' : 'Post saved to your library! 📌');
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/r/${subName}/comments/${post._id}`;
    navigator.clipboard.writeText(url);
    showToast('Post link copied to clipboard! 📋');
  };

  return (
    <article className="post-card">
      <div className="vote-sidebar">
        <button
          onClick={(e) => { e.stopPropagation(); handleVote(post._id, 1); }}
          className={`vote-btn ${userVote === 1 ? 'upvoted' : ''}`}
          title="Upvote"
        >
          <ArrowBigUp size={24} fill={userVote === 1 ? 'currentColor' : 'none'} />
        </button>

        <span className={`vote-score ${userVote === 1 ? 'upvoted' : userVote === -1 ? 'downvoted' : ''}`}>
          {post.score || 0}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); handleVote(post._id, -1); }}
          className={`vote-btn ${userVote === -1 ? 'downvoted' : ''}`}
          title="Downvote"
        >
          <ArrowBigDown size={24} fill={userVote === -1 ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="post-main">
        <div className="post-header">
          <Link to={`/r/${subName}`} className="post-subreddit-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>r/{subName}</span>
          </Link>

          <span>•</span>

          <span>Posted by</span>
          <Link to={`/user/${authorName}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, color: 'var(--text-main)' }}>
            <img src={authorAvatar} alt={authorName} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
            <span>u/{authorName}</span>
          </Link>

          <span>•</span>
          <span>{formattedDate()}</span>

          {post.flair && (
            <span className="post-flair">{post.flair}</span>
          )}

          {post.isNSFW && (
            <span style={{ backgroundColor: '#ff000022', color: '#ff4d4d', border: '1px solid #ff000044', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
              NSFW
            </span>
          )}
        </div>

        <Link to={`/r/${subName}/comments/${post._id}`}>
          <h2 className="post-title">{post.title}</h2>
        </Link>

        {/* Text Post Content */}
        {post.content && (
          <div className="post-content-preview">
            {post.content.length > 280 ? `${post.content.substring(0, 280)}...` : post.content}
          </div>
        )}

        {/* Image Post */}
        {post.type === 'image' && post.mediaUrl && (
          <div className="post-media-box">
            <img src={post.mediaUrl} alt={post.title} loading="lazy" />
          </div>
        )}

        {/* Link Post */}
        {post.type === 'link' && post.linkUrl && (
          <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="post-link-box">
            <ExternalLink size={18} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post.linkUrl}
            </span>
          </a>
        )}

        {/* Poll Post Widget */}
        {post.type === 'poll' && post.pollOptions && (
          <div className="poll-box">
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Votes: {post.pollTotalVotes || 0}
            </div>
            {post.pollOptions.map((opt) => {
              const optId = opt.id || opt._id;
              const isSelected = post.userPollVote === optId;
              const total = post.pollTotalVotes || 1;
              const percentage = Math.round(((opt.votesCount || 0) / total) * 100);

              return (
                <div
                  key={optId}
                  className="poll-option"
                  onClick={() => handlePollVote(post._id, optId)}
                  style={{ borderColor: isSelected ? 'var(--reddit-orange)' : undefined }}
                >
                  <div className="poll-bar" style={{ width: `${percentage}%` }} />
                  <span className="poll-option-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isSelected && <CheckCircle size={16} color="var(--reddit-orange)" />}
                    {opt.text}
                  </span>
                  <span className="poll-option-count">
                    {opt.votesCount || 0} votes ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="post-footer">
          <Link to={`/r/${subName}/comments/${post._id}`} className="post-action-btn">
            <MessageSquare size={16} />
            <span>{post.commentsCount || 0} Comments</span>
          </Link>

          <button onClick={toggleSave} className="post-action-btn" style={{ color: isSaved ? 'var(--reddit-orange)' : undefined }}>
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button onClick={handleShare} className="post-action-btn">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}
