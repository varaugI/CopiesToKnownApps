import React, { createContext, useContext, useState, useEffect } from "react";
import { HERO_SLIDES, CONTENT_ROWS } from "../data/mockPrimeData";

const PrimeContext = createContext();

export const PrimeProvider = ({ children }) => {
  const [activeView, setActiveView] = useState("home");

  const [heroSlides, setHeroSlides] = useState(HERO_SLIDES);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const activeHero = heroSlides[currentHeroIndex] || heroSlides[0];

  const [contentRows, setContentRows] = useState(CONTENT_ROWS);
  const [activePlayingVideo, setActivePlayingVideo] = useState(null);

  // Watchlist with LocalStorage
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("prime_watchlist");
    return saved ? JSON.parse(saved) : [HERO_SLIDES[0]];
  });

  useEffect(() => {
    localStorage.setItem("prime_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const playVideo = (videoObj) => {
    setActivePlayingVideo(videoObj);
    setActiveView("player");
  };

  const toggleWatchlist = (item) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [item, ...prev];
    });
  };

  return (
    <PrimeContext.Provider
      value={{
        activeView,
        setActiveView,
        heroSlides,
        currentHeroIndex,
        setCurrentHeroIndex,
        activeHero,
        contentRows,
        activePlayingVideo,
        playVideo,
        watchlist,
        toggleWatchlist
      }}
    >
      {children}
    </PrimeContext.Provider>
  );
};

export const usePrime = () => useContext(PrimeContext);
