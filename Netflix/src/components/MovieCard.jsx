import React, { useState, useRef, memo } from 'react';
import { Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MovieCard = memo(function MovieCard({ movie, isTop10 = false, rank = 1 }) {
  const { playMovie, openMovieModal, isInMyList, toggleMyList } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const inMyList = isInMyList(movie.id);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  if (isTop10) {
    return (
      <div
        className="top10-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="top10-number">{rank}</span>
        <img
          src={movie.poster}
          alt={movie.title}
          className="top10-poster"
          onClick={() => openMovieModal(movie)}
          loading="lazy"
        />
        {isHovered && (
          <div className="movie-card-preview" style={{ left: 0, width: '220px' }}>
            <div className="preview-media">
              <video src={movie.trailerUrl} autoPlay loop muted playsInline />
            </div>
            <div className="preview-info">
              <div className="preview-actions">
                <button className="icon-btn primary" onClick={() => playMovie(movie)}>
                  <Play size={16} fill="black" />
                </button>
                <button className="icon-btn" onClick={() => toggleMyList(movie.id)}>
                  {inMyList ? <Check size={16} color="#2BDB66" /> : <Plus size={16} />}
                </button>
                <button className="icon-btn">
                  <ThumbsUp size={16} />
                </button>
                <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={() => openMovieModal(movie)}>
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="preview-meta">
                <span className="match-score">{movie.matchScore}% Match</span>
                <span className="badge-outline">{movie.ageRating}</span>
                <span className="badge-outline">{movie.resolution}</span>
              </div>
              <div className="preview-genres">
                {movie.genres.slice(0, 3).join(' • ')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="movie-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="card-poster-img"
        onClick={() => openMovieModal(movie)}
        loading="lazy"
      />

      {isHovered && (
        <div className="movie-card-preview">
          <div className="preview-media">
            <video src={movie.trailerUrl} autoPlay loop muted playsInline />
          </div>
          <div className="preview-info">
            <div className="preview-actions">
              <button className="icon-btn primary" onClick={() => playMovie(movie)}>
                <Play size={16} fill="black" />
              </button>
              <button className="icon-btn" onClick={() => toggleMyList(movie.id)}>
                {inMyList ? <Check size={16} color="#2BDB66" /> : <Plus size={16} />}
              </button>
              <button className="icon-btn">
                <ThumbsUp size={16} />
              </button>
              <button
                className="icon-btn"
                style={{ marginLeft: 'auto' }}
                onClick={() => openMovieModal(movie)}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="preview-meta">
              <span className="match-score">{movie.matchScore}% Match</span>
              <span className="badge-outline">{movie.ageRating}</span>
              <span className="badge-outline">{movie.resolution}</span>
            </div>
            <div className="preview-genres">
              {movie.genres.slice(0, 3).join(' • ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default MovieCard;
