import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function ContentRow({ title, movies, isTop10 = false }) {
  const trackRef = useRef(null);

  const handleScroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.75;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="row-container">
      <h2 className="row-title">
        {title} <ChevronRight size={18} />
      </h2>

      <div className="carousel-wrapper">
        <button
          className="carousel-arrow left"
          onClick={() => handleScroll('left')}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="carousel-track" ref={trackRef}>
          {movies.map((movie, idx) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isTop10={isTop10}
              rank={idx + 1}
            />
          ))}
        </div>

        <button
          className="carousel-arrow right"
          onClick={() => handleScroll('right')}
          aria-label="Scroll Right"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
