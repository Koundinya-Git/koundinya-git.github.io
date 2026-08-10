import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // 20% default volume
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Load saved volume
    const savedVolume = localStorage.getItem('bgm_volume');
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    localStorage.setItem('bgm_volume', volume.toString());
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.2); // Reset to 20% if muted
    }
  };

  return (
    <div 
      className="music-player-widget block-panel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 1rem',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderColor: isPlaying ? 'var(--accent-primary)' : 'var(--surface-color-border)',
        transition: 'all 0.3s ease',
        boxShadow: isPlaying ? '0 0 15px rgba(85,255,85,0.2)' : 'none'
      }}
    >
      <audio 
        ref={audioRef} 
        src="/audio/bgm.mp3" 
        loop 
      />
      
      <button 
        onClick={togglePlay}
        className="text-secondary hover:text-accent transition-colors"
        title={isPlaying ? "Pause Music" : "Play Music"}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <Music size={20} className={isPlaying ? 'animate-pulse text-accent' : ''} />
        {isHovered && <span className="mono text-xs hidden sm:inline">{isPlaying ? 'PLAYING' : 'MUTED'}</span>}
      </button>

      {isHovered && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="animate-fade-in">
          <button onClick={toggleMute} className="text-secondary hover:text-accent" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '60px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
        </div>
      )}

      <style>{`
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; width: 0; }
          to { opacity: 1; width: 100px; }
        }
      `}</style>
    </div>
  );
}
