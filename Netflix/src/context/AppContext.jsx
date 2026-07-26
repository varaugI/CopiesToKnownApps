import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PROFILES, MOVIES } from '../data/mockData';

const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [allMovies, setAllMovies] = useState(MOVIES);
  const [billboardMovie, setBillboardMovie] = useState(MOVIES[0]);
  const [profiles, setProfiles] = useState(PROFILES);

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

  // Sync with High-Scale Node.js API
  useEffect(() => {
    fetch(`${API_BASE}/movies`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllMovies(data);
        }
      })
      .catch(() => console.log('⚡ Using client cached data store (Backend API offline)'));

    fetch(`${API_BASE}/billboard`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) setBillboardMovie(data);
      })
      .catch(() => {});

    fetch(`${API_BASE}/profiles`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setProfiles(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('netflix_active_profile', currentProfile.id);
    }
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem('netflix_my_list', JSON.stringify(myListMap));
  }, [myListMap]);

  const setCurrentProfile = useCallback((profile) => {
    setCurrentProfileState(profile);
  }, []);

  const currentProfileList = myListMap[currentProfile.id] || [];

  const toggleMyList = useCallback((movieId) => {
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

    // Async sync to Node.js backend
    fetch(`${API_BASE}/mylist/${currentProfile.id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId })
    }).catch(() => {});
  }, [currentProfile.id]);

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

  return (
    <AppContext.Provider
      value={{
        currentProfile,
        setCurrentProfile,
        profiles,
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
        heroMovie: billboardMovie
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
