import React, { useState, useEffect } from 'react';
import { fetchCommentsService, createCommentService } from '../services/api';
import CommentItem from './CommentItem';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send } from 'lucide-react';

export default function CommentSection({ postId, postAuthorId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const { user, openAuthModal, showToast } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const data = await fetchCommentsService(postId);
        setComments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (postId) loadComments();
  }, [postId]);

  const handleRootCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!user) {
      openAuthModal('login');
      return;
    }

    try {
      const created = await createCommentService(postId, newCommentText);
      showToast('Comment posted! 💬');
      setNewCommentText('');

      // Add to root comments
      setComments(prev => [created, ...prev]);
    } catch (e) {
      showToast('Failed to post comment');
    }
  };

  const handleChildReplyAdded = (newReply, parentId) => {
    const attachReply = (list) => {
      return list.map(item => {
        if (item._id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newReply]
          };
        }
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: attachReply(item.children)
          };
        }
        return item;
      });
    };

    setComments(prev => attachReply(prev));
  };

  return (
    <div style={{ marginTop: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 700 }}>
        <MessageSquare size={20} color="var(--reddit-orange)" />
        <span>Comments ({comments.length})</span>
      </div>

      {user ? (
        <form onSubmit={handleRootCommentSubmit} style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Commenting as <span style={{ color: 'var(--reddit-orange)', fontWeight: 600 }}>u/{user.username}</span>
          </div>
          <textarea
            rows={3}
            placeholder="What are your thoughts?"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.92rem' }}
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>
            <Send size={16} /> Comment
          </button>
        </form>
      ) : (
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Log in or sign up to leave a comment</span>
          <button className="btn-primary" onClick={() => openAuthModal('login')} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
            Log In
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>
          No comments yet. Be the first to start the discussion!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comments.map(cmt => (
            <CommentItem
              key={cmt._id}
              comment={cmt}
              postAuthorId={postAuthorId}
              postId={postId}
              onReplyAdded={handleChildReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
