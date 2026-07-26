import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setMemoryAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Attempt silent refresh via HTTP-Only cookie on application load
        const res = await api.post('/auth/refresh');
        setMemoryAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch (err) {
        // No active session cookie or session expired
        setMemoryAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
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
      setMemoryAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setAuthModalOpen(false);
      showToast(`Welcome back, u/${res.data.user.username}! 👋`);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check credentials or database status.';
      showToast(`❌ ${errorMsg}`);
      return { success: false, message: errorMsg };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', { username, email, password });
      setMemoryAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setAuthModalOpen(false);
      showToast(`Welcome to TentraSocial, u/${res.data.user.username}! 🚀`);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Check password requirements or database status.';
      showToast(`❌ ${errorMsg}`);
      return { success: false, message: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    setMemoryAccessToken(null);
    setUser(null);
    showToast('Logged out successfully.');
  };

  const logoutAll = async () => {
    try {
      await api.post('/auth/logout-all');
    } catch (e) {}
    setMemoryAccessToken(null);
    setUser(null);
    showToast('Logged out of all sessions & devices.');
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
      logoutAll,
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


