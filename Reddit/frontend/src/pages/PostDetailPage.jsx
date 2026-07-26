import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostByIdService } from '../services/api';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const data = await fetchPostByIdService(postId);
        setPost(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (postId) loadPost();
  }, [postId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading post detail...</div>;
  }

  if (!post) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>Post not found</div>;
  }

  const authorId = post.author?._id || post.author;

  return (
    <div>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Feeds
      </Link>

      <PostCard post={post} />

      <CommentSection postId={post._id} postAuthorId={authorId} />
    </div>
  );
}
