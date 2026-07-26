import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X, Users } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const defaultChatMessages = [
  { id: 1, user: 'AlexDev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexDev', text: 'Welcome to the live chat room! Feel free to talk about tech.', time: '10:40 AM' },
  { id: 2, user: 'SarahFrontend', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahFrontend', text: 'Hey Alex! Loving the MERN Reddit stack implementation.', time: '10:42 AM' },
  { id: 3, user: 'QuantumCoder', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumCoder', text: 'Nested threads and live WebSockets are super slick.', time: '10:44 AM' }
];

export default function CommunityChat({ subredditName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(defaultChatMessages);
  const [input, setInput] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const { user, openAuthModal } = useAuth();
  const { socket, joinRoom, leaveRoom, sendChatMessage, sendTypingIndicator } = useSocket();

  const roomName = `livechat:${subredditName || 'global'}`;

  useEffect(() => {
    if (isOpen) {
      joinRoom(roomName);
    }
    return () => {
      if (isOpen) leaveRoom(roomName);
    };
  }, [isOpen, roomName]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msgData) => {
      setMessages(prev => [
        ...prev,
        {
          id: msgData.id,
          user: msgData.sender?.username || 'anonymous',
          avatar: msgData.sender?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${msgData.sender?.username}`,
          text: msgData.content,
          time: new Date(msgData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    const handleUserTyping = (data) => {
      if (data.isTyping) {
        setTypingUser(data.username);
        setTimeout(() => setTypingUser(''), 3000);
      } else {
        setTypingUser('');
      }
    };

    socket.on('new_chat_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_chat_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user) {
      openAuthModal('login');
      return;
    }

    sendChatMessage(roomName, input.trim());
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (user && socket) {
      sendTypingIndicator(roomName, e.target.value.length > 0);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1200 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{
            borderRadius: 'var(--radius-full)',
            padding: '10px 20px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <MessageCircle size={18} />
          <span>Live Chat {subredditName ? `(r/${subredditName})` : ''}</span>
        </button>
      ) : (
        <div style={{
          width: '340px',
          height: '440px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
              <div className="nav-brand-logo" style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}>💬</div>
              <span>Live Chat {subredditName ? `r/${subredditName}` : 'Global'}</span>
            </div>
            <button className="icon-btn" style={{ width: '28px', height: '28px' }} onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: '8px', fontSize: '0.84rem' }}>
                <img src={msg.avatar} alt={msg.user} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>u/{msg.user}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.35' }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {typingUser && (
            <div style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--reddit-orange)', fontStyle: 'italic' }}>
              u/{typingUser} is typing...
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Send a chat message..."
              value={input}
              onChange={handleInputChange}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 12px', borderRadius: '50%' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
