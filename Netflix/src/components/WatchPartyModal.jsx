import React, { useState } from 'react';
import { X, Users, Copy, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WatchPartyModal({ movie, onClose, onJoinRoom }) {
  const { currentProfile, apiBaseUrl } = useApp();
  const [activeTab, setActiveTab] = useState('create');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [createdRoom, setCreatedRoom] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateRoom = async () => {
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/watchparty/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: currentProfile.name, movieId: movie.id })
      });
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const room = await res.json();
      setCreatedRoom(room);
    } catch (e) {
      console.error('Failed to create watch party room:', e);
      setError(`Failed to create watch party room (${e.message}). Backend service may be unreachable.`);
    }
  };

  const handleCopyCode = () => {
    if (createdRoom) {
      navigator.clipboard.writeText(createdRoom.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = async () => {
    if (!joinRoomCode.trim()) return;
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/watchparty/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: joinRoomCode.trim(), userName: currentProfile.name })
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error('Watch party room not found');
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const room = await res.json();
      if (room && !room.error) {
        onJoinRoom(room);
      } else {
        setError(room.error || 'Watch party room not found.');
      }
    } catch (e) {
      console.error('Failed to join watch party room:', e);
      setError(e.message || 'Failed to join watch party room. Please check the room code.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Users size={24} color="#E50914" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Watch Party - Stream Together</h2>
        </div>

        {error && (
          <div style={{
            background: 'rgba(229, 9, 20, 0.2)',
            border: '1px solid #E50914',
            color: '#FF8888',
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid #333', marginBottom: 20 }}>
          <button
            style={{
              flex: 1,
              padding: 10,
              background: 'transparent',
              border: 'none',
              color: activeTab === 'create' ? '#E50914' : '#AAA',
              borderBottom: activeTab === 'create' ? '2px solid #E50914' : 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => { setActiveTab('create'); setError(null); }}
          >
            Host a Party
          </button>
          <button
            style={{
              flex: 1,
              padding: 10,
              background: 'transparent',
              border: 'none',
              color: activeTab === 'join' ? '#E50914' : '#AAA',
              borderBottom: activeTab === 'join' ? '2px solid #E50914' : 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => { setActiveTab('join'); setError(null); }}
          >
            Join with Code
          </button>
        </div>

        {activeTab === 'create' ? (
          <div>
            <p style={{ fontSize: 14, color: '#CCC', marginBottom: 16 }}>
              Start a synchronized watch party for <strong>{movie.title}</strong>. Anyone with your 6-digit code can watch and chat live!
            </p>

            {!createdRoom ? (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCreateRoom}>
                Generate Watch Party Code
              </button>
            ) : (
              <div>
                <div style={{ background: '#222', padding: 16, borderRadius: 6, textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>YOUR WATCH PARTY CODE</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: 4, color: '#E50914' }}>
                    {createdRoom.id}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCopyCode}>
                    {copied ? <Check size={16} color="#2BDB66" /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onJoinRoom(createdRoom)}>
                    Start Watching
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 14, color: '#CCC', marginBottom: 16 }}>
              Enter the 6-digit Watch Party code provided by your friend:
            </p>
            <input
              type="text"
              placeholder="e.g. 849201"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 6,
                border: '1px solid #444',
                background: '#222',
                color: 'white',
                fontSize: '1.2rem',
                textAlign: 'center',
                letterSpacing: 2,
                marginBottom: 16,
                outline: 'none'
              }}
            />
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleJoin}>
              Join Watch Party
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
