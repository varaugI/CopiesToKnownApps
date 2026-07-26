import React, { useState } from 'react';
import { X, Play, Plus, Check, ThumbsUp, Volume2, VolumeX, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MovieModal() {
  const {
    activeModalMovie,
    closeMovieModal,
    playMovie,
    isInMyList,
    toggleMyList,
    allMovies
  } = useApp();

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isMuted, setIsMuted] = useState(true);

  if (!activeModalMovie) return null;

  const movie = activeModalMovie;
  const inMyList = isInMyList(movie.id);

  // Recommendations: exclude current movie, match genres
  const recommended = allMovies
    .filter(m => m.id !== movie.id)
    .slice(0, 6);

  return (
    <div className="modal-overlay" onClick={closeMovieModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeMovieModal}>
          <X size={20} />
        </button>

        <div className="modal-hero">
          <video
            className="modal-hero-video"
            src={movie.trailerUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
          <div className="modal-hero-vignette" />

          <div className="modal-hero-details">
            <h1 className="modal-hero-title">{movie.title}</h1>
            <div className="billboard-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  closeMovieModal();
                  playMovie(movie);
                }}
              >
                <Play size={20} fill="black" />
                <span>Play</span>
              </button>
              <button
                className="icon-btn"
                onClick={() => toggleMyList(movie.id)}
                title={inMyList ? "Remove from My List" : "Add to My List"}
              >
                {inMyList ? <Check size={20} color="#2BDB66" /> : <Plus size={20} />}
              </button>
              <button className="icon-btn">
                <ThumbsUp size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-info-grid">
            <div>
              <div className="preview-meta" style={{ fontSize: 14, marginBottom: 12 }}>
                <span className="match-score">{movie.matchScore}% Match</span>
                <span>{movie.releaseYear}</span>
                <span className="badge-outline">{movie.ageRating}</span>
                {movie.seasons ? (
                  <span>{movie.seasons}</span>
                ) : (
                  <span>{movie.duration}</span>
                )}
                <span className="badge-outline">{movie.resolution}</span>
              </div>
              <p className="modal-description">{movie.overview}</p>
            </div>

            <div className="modal-cast-col">
              <div>
                <span className="modal-cast-label">Cast: </span>
                <span className="modal-cast-value">{movie.cast.join(', ')}</span>
              </div>
              <div>
                <span className="modal-cast-label">Director: </span>
                <span className="modal-cast-value">{movie.director}</span>
              </div>
              <div>
                <span className="modal-cast-label">Genres: </span>
                <span className="modal-cast-value">{movie.genres.join(', ')}</span>
              </div>
              <div>
                <span className="modal-cast-label">This show is: </span>
                <span className="modal-cast-value">{movie.tags ? movie.tags.join(', ') : 'Exciting'}</span>
              </div>
            </div>
          </div>

          {/* Episodes Section if Series */}
          {movie.episodes && movie.episodes.length > 0 && (
            <div className="episodes-section">
              <div className="episodes-header">
                <h3 className="episodes-title">Episodes</h3>
                <select
                  className="season-select"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                >
                  <option value={1}>Season 1</option>
                  {movie.seasons && <option value={2}>Season 2</option>}
                </select>
              </div>

              <div className="episodes-grid">
                {movie.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="episode-card"
                    onClick={() => {
                      closeMovieModal();
                      playMovie(movie);
                    }}
                  >
                    <span className="episode-number">{ep.number}</span>
                    <img src={ep.thumbnail} alt={ep.title} className="episode-thumb" />
                    <div className="episode-details">
                      <div className="episode-title-row">
                        <span>{ep.title}</span>
                        <span>{ep.duration}</span>
                      </div>
                      <p className="episode-summary">{ep.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Like This Section */}
          <div style={{ marginTop: 40 }}>
            <h3 className="episodes-title" style={{ marginBottom: 16 }}>More Like This</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {recommended.map(rec => (
                <div
                  key={rec.id}
                  style={{
                    background: '#242424',
                    borderRadius: 6,
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => openMovieModal(rec)}
                >
                  <img src={rec.backdrop} alt={rec.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{rec.title}</div>
                    <div className="preview-meta" style={{ fontSize: 11, marginBottom: 8 }}>
                      <span className="match-score">{rec.matchScore}% Match</span>
                      <span className="badge-outline">{rec.ageRating}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#AAA', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {rec.overview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
