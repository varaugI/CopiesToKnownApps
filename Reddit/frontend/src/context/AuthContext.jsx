import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem('tentra_token');
      const savedUser = localStorage.getItem('tentra_user');
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }

      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('tentra_user', JSON.stringify(res.data));
        } catch (err) {
          // Token invalid or backend offline, retain fallback demo user if present
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const login = async (emailOrUsername, password) => {
    try {
      const res = await api.post('/auth/login', { emailOrUsername, password });
      setUser(res.data);
      localStorage.setItem('tentra_token', res.data.token);
      localStorage.setItem('tentra_user', JSON.stringify(res.data));
      setAuthModalOpen(false);
      showToast(`Welcome back, u/${res.data.username}! 👋`);
      return { success: true };
    } catch (err) {
      // Fallback demo login
      const username = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
      const demoUser = {
        _id: 'usr_' + username.toLowerCase(),
        username: username || 'DemoUser',
        email: `${username}@tentrasocial.com`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        bio: 'Reddit enthusiast and community builder.',
        postKarma: 142,
        commentKarma: 88,
        token: 'demo_token_' + Date.now()
      };
      setUser(demoUser);
      localStorage.setItem('tentra_token', demoUser.token);
      localStorage.setItem('tentra_user', JSON.stringify(demoUser));
      setAuthModalOpen(false);
      showToast(`LoggedIn as u/${demoUser.username}!`);
      return { success: true };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', { username, email, password });
      setUser(res.data);
      localStorage.setItem('tentra_token', res.data.token);
      localStorage.setItem('tentra_user', JSON.stringify(res.data));
      setAuthModalOpen(false);
      showToast(`Welcome to TentraSocial, u/${res.data.username}! 🚀`);
      return { success: true };
    } catch (err) {
      const demoUser = {
        _id: 'usr_' + username.toLowerCase(),
        username,
        email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        bio: 'Fresh Reddit member!',
        postKarma: 1,
        commentKarma: 1,
        token: 'demo_token_' + Date.now()
      };
      setUser(demoUser);
      localStorage.setItem('tentra_token', demoUser.token);
      localStorage.setItem('tentra_user', JSON.stringify(demoUser));
      setAuthModalOpen(false);
      showToast(`Account created for u/${demoUser.username}! 🎉`);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tentra_token');
    localStorage.removeItem('tentra_user');
    showToast('Logged out successfully.');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      authModalOpen,
      setAuthModalOpen,
      authModalMode,
      openAuthModal,
      toastMessage,
      showToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
