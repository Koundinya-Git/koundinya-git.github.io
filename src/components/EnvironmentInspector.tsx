import React, { useState, useEffect } from 'react';

export default function EnvironmentInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<any>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('env-state');
      if (saved) setState(JSON.parse(saved));
      
      const updateFn = (e: any) => setState(e.detail);
      window.addEventListener('environmentChange', updateFn);
      return () => window.removeEventListener('environmentChange', updateFn);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="inspector-panel block-panel">
      <div className="inspector-header mono">
        <span>ENVIRONMENT INSPECTOR</span>
        <button onClick={() => setIsOpen(false)}>×</button>
      </div>
      <div className="inspector-content mono text-sm text-secondary">
        <p><strong>TIME:</strong> {state.time?.toFixed(2) || 0} ({state.time < 5 || state.time > 19 ? 'NIGHT' : 'DAY'})</p>
        <p><strong>SEASON:</strong> {state.season}</p>
        <p><strong>WEATHER:</strong> {state.weather}</p>
        <p><strong>BIOME:</strong> {state.biome}</p>
        <p><strong>MOOD:</strong> {state.mood}</p>
        <hr className="border-t border-surface-color-border my-2" />
        <p className="text-xs">Press Ctrl+Shift+E to toggle</p>
      </div>
    </div>
  );
}
