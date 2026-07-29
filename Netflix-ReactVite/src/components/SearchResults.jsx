import React from 'react';
import { useApp } from '../context/AppContext';
import MovieCard from './MovieCard';

export default function SearchResults() {
  const { searchQuery, allMovies } = useApp();

  if (!searchQuery.trim()) return null;

  const query = searchQuery.toLowerCase();
  const results = allMovies.filter((movie) => {
    const matchTitle = movie.title.toLowerCase().includes(query);
    const matchGenre = movie.genres.some(g => g.toLowerCase().includes(query));
    const matchCast = movie.cast.some(c => c.toLowerCase().includes(query));
    const matchDirector = movie.director.toLowerCase().includes(query);
    return matchTitle || matchGenre || matchCast || matchDirector;
  });

  return (
    <div style={{ padding: '100px 4% 40px', minHeight: '80vh' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#AAA', marginBottom: 24 }}>
        Search results for: <span style={{ color: '#FFF' }}>"{searchQuery}"</span>
      </h2>

      {results.length === 0 ? (
        <div style={{ color: '#888', fontSize: '1.1rem', marginTop: 40 }}>
          Your search for "{searchQuery}" did not have any matches.
          <ul style={{ marginTop: 16, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Try different keywords</li>
            <li>Looking for a movie or TV show?</li>
            <li>Try using a movie title, an actor's name, or a genre</li>
          </ul>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px 16px'
          }}
        >
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
