import React, { useState } from 'react';
import { X, LogIn, UserPlus, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalMode, login, register } = useAuth();
  const [mode, setMode] = useState(authModalMode || 'login');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'login') {
      await login(emailOrUsername, password);
    } else {
      await register(username, email, password);
    }
    setLoading(false);
  };

  const handleDemoLogin = async (demoName) => {
    setLoading(true);
    await login(demoName, 'password123');
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="nav-brand-logo" style={{ width: '28px', height: '28px' }}>
              <Flame size={16} />
            </div>
            <h2>{mode === 'login' ? 'Log In to TentraSocial' : 'Join TentraSocial'}</h2>
          </div>
          <button className="icon-btn" onClick={() => setAuthModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <button
              type="button"
              className={`sort-tab ${mode === 'login' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setMode('login')}
            >
              <LogIn size={16} /> Log In
            </button>
            <button
              type="button"
              className={`sort-tab ${mode === 'register' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setMode('register')}
            >
              <UserPlus size={16} /> Sign Up
            </button>
          </div>

          {mode === 'login' ? (
            <div className="form-group">
              <label>Email or Username</label>
              <input
                type="text"
                placeholder="AlexDev or alex@tentrasocial.com"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="CoolCoder99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          <div style={{ position: 'relative', margin: '14px 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', inset: '50% 0 0 0', borderTop: '1px solid var(--border-color)', zIndex: 0 }} />
            <span style={{ position: 'relative', backgroundColor: 'var(--bg-card)', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)', zIndex: 1 }}>
              OR QUICK DEMO LOGIN
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
              onClick={() => handleDemoLogin('AlexDev')}
            >
              Demo (AlexDev)
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
              onClick={() => handleDemoLogin('SarahFrontend')}
            >
              Demo (Sarah)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
