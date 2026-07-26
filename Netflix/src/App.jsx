import React, { useState, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BillboardHero from './components/BillboardHero';
import ContentRow from './components/ContentRow';
import ProfileSelector from './components/ProfileSelector';
import { CATEGORIES } from './data/mockData';

// Code Splitting for heavy overlays (1M User Bundle Optimization)
const MovieModal = lazy(() => import('./components/MovieModal'));
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));
const SearchResults = lazy(() => import('./components/SearchResults'));

function MainLayout() {
  const {
    allMovies,
    heroMovie,
    myList,
    searchQuery,
    selectedCategoryTab,
    selectedGenre,
    setSelectedGenre,
    currentProfile
  } = useApp();

  const [showProfileSelector, setShowProfileSelector] = useState(false);

  if (showProfileSelector) {
    return <ProfileSelector onSelect={() => setShowProfileSelector(false)} />;
  }

  // Filter content by active Tab
  let displayedMovies = allMovies;
  if (selectedCategoryTab === 'TV Shows') {
    displayedMovies = allMovies.filter(m => m.type === 'Series' || m.type === 'Docuseries');
  } else if (selectedCategoryTab === 'Movies') {
    displayedMovies = allMovies.filter(m => m.type === 'Movie');
  } else if (selectedCategoryTab === 'New & Popular') {
    displayedMovies = allMovies.filter(m => m.releaseYear >= 2024);
  }

  // Filter content by genre if selected
  if (selectedGenre !== 'All') {
    displayedMovies = displayedMovies.filter(m => m.genres.includes(selectedGenre));
  }

  const myListMovies = allMovies.filter(m => myList.includes(m.id));
  const top10Movies = [...allMovies].sort((a, b) => (a.topRank || 99) - (b.topRank || 99)).slice(0, 5);

  const genresList = ['All', 'Sci-Fi', 'Action', 'Crime', 'Drama', 'Documentary', 'Fantasy', 'Reality'];

  return (
    <div className="app-container">
      <Navbar onChangeProfileClick={() => setShowProfileSelector(true)} />

      {searchQuery ? (
        <Suspense fallback={<div style={{ padding: 100, textAlign: 'center', color: '#AAA' }}>Loading results...</div>}>
          <SearchResults />
        </Suspense>
      ) : selectedCategoryTab === 'My List' ? (
        <div style={{ padding: '100px 4% 60px', minHeight: '80vh' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>My List</h1>
          {myListMovies.length === 0 ? (
            <div style={{ color: '#888', fontSize: '1.1rem', marginTop: 40 }}>
              You haven't added any titles to your list yet.
            </div>
          ) : (
            <ContentRow title={`Titles saved by ${currentProfile.name}`} movies={myListMovies} />
          )}
        </div>
      ) : (
        <>
          {/* Main Billboard Hero */}
          <BillboardHero movie={heroMovie} />

          {/* Optional Genre Filter Bar */}
          {(selectedCategoryTab === 'TV Shows' || selectedCategoryTab === 'Movies') && (
            <div style={{ padding: '0 4%', marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedCategoryTab}</span>
              <select
                className="season-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genresList.map(g => (
                  <option key={g} value={g}>{g} Genres</option>
                ))}
              </select>
            </div>
          )}

          {/* Content Rows */}
          <div style={{ marginTop: selectedCategoryTab === 'Home' ? 0 : 30 }}>
            {/* Continue Watching Row */}
            <ContentRow
              title={`Continue Watching for ${currentProfile.name}`}
              movies={allMovies.slice(0, 4)}
            />

            {/* Top 10 Today Row */}
            <ContentRow
              title="Top 10 Movies & Shows Today"
              movies={top10Movies}
              isTop10={true}
            />

            {/* Categorized Rows */}
            {CATEGORIES.map((cat) => {
              const catMovies = displayedMovies.filter(m => m.categories.includes(cat));
              if (catMovies.length === 0) return null;
              return <ContentRow key={cat} title={cat} movies={catMovies} />;
            })}
          </div>
        </>
      )}

      {/* Netflix Footer */}
      <footer style={{ padding: '60px 4% 40px', color: '#757575', fontSize: 13, borderTop: '1px solid #222', marginTop: 60 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <span>Questions? Call 1-800-012-3456</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <span>FAQ</span>
          <span>Help Center</span>
          <span>Account</span>
          <span>Media Center</span>
          <span>Investor Relations</span>
          <span>Jobs</span>
          <span>Terms of Use</span>
          <span>Privacy</span>
          <span>Cookie Preferences</span>
        </div>
        <div style={{ color: '#555', marginTop: 20 }}>
          © 2026 StreamFlix, Inc. All rights reserved. Netflix React Client (1M Users Scale Edition).
        </div>
      </footer>

      {/* Modals & Fullscreen Player with Lazy Loading */}
      <Suspense fallback={null}>
        <MovieModal />
        <VideoPlayer />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
