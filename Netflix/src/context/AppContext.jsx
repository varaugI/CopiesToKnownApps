import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PROFILES, MOVIES } from '../data/mockData';

const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [allMovies, setAllMovies] = useState(MOVIES);
  const [billboardMovie, setBillboardMovie] = useState(MOVIES[0]);
  const [profiles, setProfiles] = useState(PROFILES);

  // Authentication State (In-Memory Access Token & Account)
  const [accessToken, setAccessToken] = useState(null);
  const [userAccount, setUserAccount] = useState(() => {
    const saved = localStorage.getItem('streamflix_account_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentProfile, setCurrentProfileState] = useState(() => {
    const saved = localStorage.getItem('netflix_active_profile');
    if (saved) {
      const found = PROFILES.find(p => p.id === saved);
      if (found) return found;
    }
    return PROFILES[0];
  });

  const [myListMap, setMyListMap] = useState(() => {
    const saved = localStorage.getItem('netflix_my_list');
    return saved ? JSON.parse(saved) : { p1: ['m1', 'm3'], p2: ['m2'] };
  });

  const [activeModalMovie, setActiveModalMovie] = useState(null);
  const [activeVideoMovie, setActiveVideoMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('Home');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [billboardMuted, setBillboardMuted] = useState(true);

  const [apiError, setApiError] = useState(null);
  const [myListSyncError, setMyListSyncError] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Sync catalog with Backend API
  useEffect(() => {
    fetch(`${API_BASE}/movies`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllMovies(data);
          setApiError(null);
        }
      })
      .catch(err => {
        console.warn('Backend API connection warning:', err.message);
        setApiError('Backend API offline or unreachable. Displaying fallback catalog.');
      });

    fetch(`${API_BASE}/billboard`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && data.id) setBillboardMovie(data);
      })
      .catch(() => {});
  }, []);

  // Fetch account profiles from Spring Boot API when authenticated
  useEffect(() => {
    if (accessToken) {
      fetch('http://localhost:8080/api/v1/profiles', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(res => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setProfiles(res.data);
          }
        })
        .catch(() => {});
    }
  }, [accessToken]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('netflix_active_profile', currentProfile.id);
    }
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem('netflix_my_list', JSON.stringify(myListMap));
  }, [myListMap]);

  useEffect(() => {
    if (userAccount) {
      localStorage.setItem('streamflix_account_user', JSON.stringify(userAccount));
    } else {
      localStorage.removeItem('streamflix_account_user');
    }
  }, [userAccount]);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }
      setAccessToken(data.data.accessToken);
      setUserAccount(data.data.account);
      return data.data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (email, password, role = 'USER') => {
    setAuthError(null);
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }
      setAccessToken(data.data.accessToken);
      setUserAccount(data.data.account);
      return data.data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:8080/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {}
    setAccessToken(null);
    setUserAccount(null);
  }, []);

  const setCurrentProfile = useCallback((profile) => {
    setCurrentProfileState(profile);
  }, []);

  const currentProfileList = myListMap[currentProfile.id] || [];

  const toggleMyList = useCallback((movieId) => {
    setMyListSyncError(null);

    // Optimistic local update
    setMyListMap(prev => {
      const pId = currentProfile.id;
      const list = prev[pId] || [];
      const exists = list.includes(movieId);
      const updatedList = exists
        ? list.filter(id => id !== movieId)
        : [...list, movieId];
      return {
        ...prev,
        [pId]: updatedList
      };
    });

    // Async sync to backend with rollback & user-visible error handling
    fetch(`${API_BASE}/mylist/${currentProfile.id}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({ movieId })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`My List sync failed (HTTP ${res.status})`);
        }
        return res.json();
      })
      .catch(err => {
        console.error('My List backend sync failed:', err);
        setMyListSyncError('Failed to synchronize My List with backend server. Reverting change.');
        // Rollback optimistic update
        setMyListMap(prev => {
          const pId = currentProfile.id;
          const list = prev[pId] || [];
          const exists = list.includes(movieId);
          const rolledBackList = exists
            ? list.filter(id => id !== movieId)
            : [...list, movieId];
          return {
            ...prev,
            [pId]: rolledBackList
          };
        });
      });
  }, [currentProfile.id, accessToken]);

  const isInMyList = useCallback((movieId) => {
    return currentProfileList.includes(movieId);
  }, [currentProfileList]);

  const playMovie = useCallback((movie) => {
    setActiveVideoMovie(movie);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideoMovie(null);
  }, []);

  const openMovieModal = useCallback((movie) => {
    setActiveModalMovie(movie);
  }, []);

  const closeMovieModal = useCallback(() => {
    setActiveModalMovie(null);
  }, []);

  const clearMyListSyncError = useCallback(() => {
    setMyListSyncError(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentProfile,
        setCurrentProfile,
        profiles,
        setProfiles,
        userAccount,
        accessToken,
        login,
        register,
        logout,
        authError,
        myList: currentProfileList,
        toggleMyList,
        isInMyList,
        activeModalMovie,
        setActiveModalMovie,
        openMovieModal,
        closeMovieModal,
        activeVideoMovie,
        setActiveVideoMovie,
        playMovie,
        closeVideo,
        searchQuery,
        setSearchQuery,
        selectedCategoryTab,
        setSelectedCategoryTab,
        selectedGenre,
        setSelectedGenre,
        billboardMuted,
        setBillboardMuted,
        allMovies,
        heroMovie: billboardMovie,
        apiError,
        myListSyncError,
        clearMyListSyncError,
        apiBaseUrl: API_BASE
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
