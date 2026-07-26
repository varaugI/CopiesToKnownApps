import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createCommentService } from '../services/api';

export default function CommentItem({ comment, postAuthorId, postId, onReplyAdded }) {
  const { user, openAuthModal, showToast } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [score, setScore] = useState(comment.score || 1);
  const [userVote, setUserVote] = useState(comment.userVote || 0);

  const authorName = comment.author?.username || 'anonymous';
  const authorAvatar = comment.author?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${authorName}`;
  const isOP = comment.author?._id === postAuthorId;

  const handleVote = (voteType) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    let newVote = voteType;
    if (userVote === voteType) newVote = 0;
    const diff = newVote - userVote;
    setUserVote(newVote);
    setScore(prev => prev + diff);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (!user) {
      openAuthModal('login');
      return;
    }

    try {
      const newReply = await createCommentService(postId, replyText, comment._id);
      showToast('Reply submitted! 💬');
      setReplying(false);
      setReplyText('');
      if (onReplyAdded) onReplyAdded(newReply, comment._id);
    } catch (e) {
      showToast('Failed to submit reply');
    }
  };

  return (
    <div className="comment-item">
      {/* Vertical Thread Line */}
      {!collapsed && (
        <div className="comment-thread-line" onClick={() => setCollapsed(true)} title="Click to collapse thread" />
      )}

      <div className="comment-header">
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>

        <img src={authorAvatar} alt={authorName} className="comment-author-avatar" />

        <Link to={`/user/${authorName}`} style={{ fontWeight: 600, color: 'var(--text-main)' }}>
          u/{authorName}
        </Link>

        {isOP && <span className="op-badge">OP</span>}

        <span>•</span>

        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {score} points
        </span>
      </div>

      {!collapsed && (
        <>
          <div className="comment-body">
            {comment.content}
          </div>

          <div className="comment-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <button
                onClick={() => handleVote(1)}
                className={`vote-btn ${userVote === 1 ? 'upvoted' : ''}`}
              >
                <ArrowBigUp size={18} fill={userVote === 1 ? 'currentColor' : 'none'} />
              </button>
              <span className={`vote-score ${userVote === 1 ? 'upvoted' : userVote === -1 ? 'downvoted' : ''}`}>
                {score}
              </span>
              <button
                onClick={() => handleVote(-1)}
                className={`vote-btn ${userVote === -1 ? 'downvoted' : ''}`}
              >
                <ArrowBigDown size={18} fill={userVote === -1 ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              onClick={() => setReplying(!replying)}
              className="post-action-btn"
            >
              <MessageSquare size={14} />
              <span>Reply</span>
            </button>
          </div>

          {replying && (
            <form onSubmit={handleReplySubmit} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                rows={2}
                placeholder={`Replying to u/${authorName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setReplying(false)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                  Reply
                </button>
              </div>
            </form>
          )}

          {/* Render Nested Children */}
          {comment.children && comment.children.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {comment.children.map(child => (
                <CommentItem
                  key={child._id}
                  comment={child}
                  postAuthorId={postAuthorId}
                  postId={postId}
                  onReplyAdded={onReplyAdded}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
