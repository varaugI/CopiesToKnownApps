import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Users, Shield, Award, ExternalLink } from 'lucide-react';
import { usePosts } from '../context/PostContext';

export default function Rightbar() {
  const { subreddits, setCreateSubModalOpen } = usePosts();

  const topCommunities = [...subreddits]
    .sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0))
    .slice(0, 5);

  return (
    <aside className="right-sidebar">
      <div className="widget-card" style={{ background: 'linear-gradient(135deg, rgba(255,69,0,0.15), rgba(20,34,38,0.95))', borderColor: 'rgba(255,69,0,0.3)' }}>
        <div className="widget-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="var(--reddit-orange)" /> Home Feed
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
          Your personal TentraSocial frontpage. Come here to check in with your favorite communities and live discussions.
        </p>
        <button
          onClick={() => setCreateSubModalOpen(true)}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Create Community
        </button>
      </div>

      <div className="widget-card">
        <div className="widget-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--accent-blue)" /> Top Communities
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topCommunities.map((sub, idx) => (
            <Link
              key={sub._id || sub.name}
              to={`/r/${sub.name}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-muted)', width: '16px' }}>{idx + 1}</span>
                <span style={{ fontSize: '1.1rem' }}>{sub.icon || '🔥'}</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>r/{sub.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {(sub.membersCount || 100).toLocaleString()} members
                  </div>
                </div>
              </div>
              <span className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>View</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="widget-card">
        <div className="widget-header">
          <span>TentraSocial Guidelines</span>
        </div>
        <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Remember the human & treat members with respect</li>
          <li>Be authentic & post high quality content</li>
          <li>Search before asking repetitive questions</li>
        </ul>
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '12px', paddingTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          TentraSocial Inc. © 2026. All rights reserved.
        </div>
      </div>
    </aside>
  );
}
