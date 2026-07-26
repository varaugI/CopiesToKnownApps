import React, { useRef, useState } from 'react';
import { Play, Info, Volume2, VolumeX, Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BillboardHero({ movie }) {
  const { playMovie, openMovieModal, billboardMuted, setBillboardMuted, isInMyList, toggleMyList } = useApp();
  const videoRef = useRef(null);

  if (!movie) return null;

  const inMyList = isInMyList(movie.id);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !billboardMuted;
    }
    setBillboardMuted(!billboardMuted);
  };

  return (
    <div className="billboard" style={{ backgroundImage: `url(${movie.backdrop})` }}>
      <div className="billboard-video-container">
        <video
          ref={videoRef}
          className="billboard-video"
          src={movie.trailerUrl}
          autoPlay
          loop
          muted={billboardMuted}
          playsInline
        />
      </div>

      <div className="billboard-vignette" />

      <div className="billboard-content">
        <div className="billboard-badge">
          <span>N</span> ORIGINAL SERIES
        </div>
        <h1 className="billboard-title">{movie.title}</h1>
        <p className="billboard-overview">{movie.overview}</p>

        <div className="billboard-actions">
          <button className="btn btn-primary" onClick={() => playMovie(movie)}>
            <Play size={20} fill="black" />
            <span>Play</span>
          </button>
          <button className="btn btn-secondary" onClick={() => openMovieModal(movie)}>
            <Info size={20} />
            <span>More Info</span>
          </button>
          <button
            className="icon-btn"
            onClick={() => toggleMyList(movie.id)}
            title={inMyList ? "Remove from My List" : "Add to My List"}
          >
            {inMyList ? <Check size={18} color="#2BDB66" /> : <Plus size={18} />}
          </button>
        </div>
      </div>

      <div className="billboard-controls">
        <button className="volume-btn" onClick={toggleMute}>
          {billboardMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="age-badge">{movie.ageRating}</div>
      </div>
    </div>
  );
}
