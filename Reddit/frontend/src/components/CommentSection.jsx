import React, { useState } from 'react';
import { useCommentsQuery, useCreateCommentMutation } from '../hooks/useComments';
import CommentItem from './CommentItem';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

export default function CommentSection({ postId, postAuthorId }) {
  const { data: commentsData, isLoading, isError, refetch } = useCommentsQuery(postId);
  const createCommentMutation = useCreateCommentMutation();
  const [newCommentText, setNewCommentText] = useState('');
  const { user, openAuthModal } = useAuth();

  const comments = Array.isArray(commentsData) ? commentsData : (commentsData?.items || []);

  const handleRootCommentSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!user) {
      openAuthModal('login');
      return;
    }

    createCommentMutation.mutate(
      { postId, content: newCommentText },
      {
        onSuccess: () => {
          setNewCommentText('');
        }
      }
    );
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
          <button
            type="submit"
            className="btn-primary"
            disabled={createCommentMutation.isPending}
            style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {createCommentMutation.isPending ? <Loader2 size={16} className="spin" /> : <Send size={16} />} Comment
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

      {isLoading ? (
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>Loading comments...</div>
      ) : isError ? (
        <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '20px' }}>
          Failed to load comments.{' '}
          <button onClick={() => refetch()} style={{ textDecoration: 'underline', color: 'var(--text-main)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
