import React, { useState } from 'react';
import { Bell, MessageSquare, ArrowBigUp, Award, CheckCircle2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialNotifications = [
  {
    id: 'n1',
    type: 'upvote',
    title: 'Your post reached 100 upvotes!',
    text: 'Welcome to TentraSocial! The next generation MERN Reddit clone...',
    time: '10m ago',
    read: false,
    link: '/r/webdev/comments/post_101'
  },
  {
    id: 'n2',
    type: 'comment',
    title: 'u/SarahFrontend replied to your comment',
    text: '"Zustand + TanStack Query is definitely the gold standard stack..."',
    time: '1h ago',
    read: false,
    link: '/r/reactjs/comments/post_102'
  },
  {
    id: 'n3',
    type: 'community',
    title: 'Welcome to r/webdev',
    text: 'You are now a member of Web Development community.',
    time: '2h ago',
    read: true,
    link: '/r/webdev'
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon-btn"
        style={{ position: 'relative' }}
        title="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '18px',
            height: '18px',
            backgroundColor: 'var(--reddit-orange)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 800,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-secondary)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '48px',
          width: '340px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1500,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            fontWeight: 700
          }}>
            <span>Notifications ({unreadCount} new)</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={markAllRead}
                style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', cursor: 'pointer' }}
              >
                Mark read
              </button>
              <button
                onClick={clearAll}
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No notifications right now
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n.id}
                  to={n.link}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: n.read ? 'transparent' : 'rgba(255, 69, 0, 0.06)',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    {n.type === 'upvote' && <ArrowBigUp size={18} color="var(--reddit-orange)" fill="currentColor" />}
                    {n.type === 'comment' && <MessageSquare size={18} color="var(--accent-blue)" />}
                    {n.type === 'community' && <Award size={18} color="#f5af19" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.text}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.time}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
