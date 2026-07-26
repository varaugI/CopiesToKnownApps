import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MessageSquare,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VideoPlayer() {
  const { activeVideoMovie, closeVideo } = useApp();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showAudioSubtitles, setShowAudioSubtitles] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('English [Original] (5.1 Atmos)');
  const [selectedSubtitle, setSelectedSubtitle] = useState('English [CC]');

  const controlsTimeoutRef = useRef(null);

  // Keyboard Shortcuts (Space, F, M, Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeVideoMovie) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          if (videoRef.current) videoRef.current.volume = Math.min(1, volume + 0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          if (videoRef.current) videoRef.current.volume = Math.max(0, volume - 0.1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoMovie, isPlaying, volume]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  if (!activeVideoMovie) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleRateChange = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="video-player-screen">
      <video
        ref={videoRef}
        className="player-video"
        src={activeVideoMovie.videoUrl}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />

      {/* Subtitles Overlay */}
      {selectedSubtitle !== 'Off' && (
        <div style={{
          position: 'absolute',
          bottom: showControls ? 110 : 40,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.75)',
          padding: '6px 16px',
          borderRadius: 4,
          fontSize: 18,
          fontWeight: 600,
          color: '#FFE600',
          textShadow: '0 2px 4px rgba(0,0,0,0.9)',
          zIndex: 10,
          pointerEvents: 'none',
          transition: 'bottom 0.3s'
        }}>
          [ {selectedSubtitle} ]: Streaming high-definition audio/video content
        </div>
      )}

      <div className={`player-overlay ${!showControls ? 'hidden' : ''}`}>
        {/* Top Header */}
        <div className="player-header">
          <button className="player-back-btn" onClick={closeVideo}>
            <ArrowLeft size={32} />
          </button>
          <span className="player-title">{activeVideoMovie.title}</span>
          <span style={{ fontSize: 12, color: '#AAA', marginLeft: 16 }}>
            (Press Space: Play/Pause, F: Fullscreen, M: Mute, ←/→: Seek)
          </span>
        </div>

        {/* Audio / Subtitles Overlay */}
        {showAudioSubtitles && (
          <div className="audio-subtitles-modal">
            <div className="audio-subtitles-col">
              <h4>Audio</h4>
              {['English [Original] (5.1 Atmos)', 'Spanish (Descriptive)', 'French', 'Japanese', 'German'].map(a => (
                <div
                  key={a}
                  className={`audio-subtitles-option ${selectedAudio === a ? 'active' : ''}`}
                  onClick={() => setSelectedAudio(a)}
                >
                  {a}
                </div>
              ))}
            </div>
            <div className="audio-subtitles-col">
              <h4>Subtitles</h4>
              {['Off', 'English [CC]', 'Spanish', 'French', 'Japanese', 'German'].map(s => (
                <div
                  key={s}
                  className={`audio-subtitles-option ${selectedSubtitle === s ? 'active' : ''}`}
                  onClick={() => setSelectedSubtitle(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="player-controls">
          <div className="seek-bar-container">
            <span style={{ fontSize: 13, minWidth: 45 }}>{formatTime(currentTime)}</span>
            <div className="seek-bar" onClick={handleSeek}>
              <div
                className="seek-progress"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span style={{ fontSize: 13, minWidth: 45 }}>{formatTime(duration)}</span>
          </div>

          <div className="player-buttons-row">
            <div className="player-btn-group">
              <button className="icon-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
              </button>
              <button className="icon-btn" onClick={() => skipTime(-10)}>
                <RotateCcw size={22} />
              </button>
              <button className="icon-btn" onClick={() => skipTime(10)}>
                <RotateCw size={22} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 10 }}>
                <button className="icon-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{ width: 80, cursor: 'pointer', accentColor: '#E50914' }}
                />
              </div>
            </div>

            <div className="player-btn-group">
              <button
                className="skip-intro-btn"
                onClick={() => skipTime(85)}
              >
                Skip Intro
              </button>

              <button
                className="icon-btn"
                onClick={() => setShowAudioSubtitles(prev => !prev)}
                title="Audio & Subtitles"
              >
                <MessageSquare size={20} />
              </button>

              <button
                className="icon-btn"
                onClick={handleRateChange}
                title="Playback Speed"
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                {playbackRate}x
              </button>

              <button className="icon-btn" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
