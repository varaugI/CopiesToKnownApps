import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';
import { Search, Flame } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { posts, subreddits } = usePosts();

  const matchedPosts = posts.filter(p =>
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    p.content?.toLowerCase().includes(query.toLowerCase())
  );

  const matchedSubs = subreddits.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.displayName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={22} color="var(--reddit-orange)" />
          Search results for "{query}"
        </h1>
      </div>

      {matchedSubs.length > 0 && (
        <div className="widget-card" style={{ marginBottom: '20px' }}>
          <div className="widget-header">Communities</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {matchedSubs.map(sub => (
              <Link key={sub._id || sub.name} to={`/r/${sub.name}`} style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>{sub.icon || '🔥'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>r/{sub.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub.displayName}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
          Posts ({matchedPosts.length})
        </h3>

        {matchedPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            No posts match your search phrase.
          </div>
        ) : (
          matchedPosts.map(p => <PostCard key={p._id} post={p} />)
        )}
      </div>
    </div>
  );
}
