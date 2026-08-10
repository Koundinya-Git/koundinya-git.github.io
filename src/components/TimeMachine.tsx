import React, { useState, useEffect } from 'react';
import { applyEnvironmentState, getCurrentLocalTime, getCurrentSeason } from '../scripts/EnvironmentEngine';
import type { EnvironmentState } from '../scripts/EnvironmentEngine';

export default function TimeMachine() {
  const [time, setTime] = useState<number>(12);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('env-state');
    const mode = localStorage.getItem('env-mode') || 'auto';
    setIsManual(mode === 'manual');
    
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setTime(state.time);
      } catch (e) {}
    } else {
      setTime(getCurrentLocalTime());
    }
    
    const updateFn = (e: any) => {
      setTime(e.detail.time);
      setIsManual(localStorage.getItem('env-mode') === 'manual');
    };
    window.addEventListener('environmentChange', updateFn);
    return () => window.removeEventListener('environmentChange', updateFn);
  }, []);

  const handleTimeChange = (newTime: number) => {
    setTime(newTime);
    setIsManual(true);
    localStorage.setItem('env-mode', 'manual');
    
    const saved = localStorage.getItem('env-state');
    let state: EnvironmentState;
    if (saved) {
      state = JSON.parse(saved);
      state.time = newTime;
    } else {
      state = {
        time: newTime,
        season: getCurrentSeason(),
        weather: 'clear',
        biome: 'plains',
        mood: 'focused'
      };
    }
    applyEnvironmentState(state);
  };

  const handleAuto = () => {
    setIsManual(false);
    localStorage.setItem('env-mode', 'auto');
    const state = JSON.parse(localStorage.getItem('env-state') || '{}');
    state.time = getCurrentLocalTime();
    state.season = getCurrentSeason();
    applyEnvironmentState(state);
  };

  return (
    <div className="time-machine block-panel" style={{ marginTop: '2rem' }}>
      <h3 className="text-accent" style={{ marginBottom: '1rem' }}>TIME MACHINE</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="range" 
          min="0" 
          max="24" 
          step="0.1" 
          value={time}
          onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
          className="time-slider"
        />
        <div className="mono text-secondary" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
          <span>00:00</span>
          <span>{Math.floor(time).toString().padStart(2, '0')}:{Math.floor((time % 1) * 60).toString().padStart(2, '0')}</span>
          <span>24:00</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button className="block-button" onClick={() => handleTimeChange(6)}>SUNRISE</button>
          <button className="block-button" onClick={() => handleTimeChange(12)}>NOON</button>
          <button className="block-button" onClick={() => handleTimeChange(18)}>SUNSET</button>
          <button className="block-button" onClick={() => handleTimeChange(0)}>MIDNIGHT</button>
          {isManual && (
            <button className="block-button" style={{ borderColor: '#ff5555', color: '#ff5555' }} onClick={handleAuto}>
              RETURN TO REAL TIME
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
