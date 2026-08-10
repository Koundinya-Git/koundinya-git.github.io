// EnvironmentEngine.ts
// Calculates environmental states and applies them via CSS custom properties.

export type EnvironmentState = {
  time: number; // 0-24
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  weather: 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog' | 'snow';
  biome: 'plains' | 'forest' | 'taiga' | 'desert' | 'mountains' | 'ocean' | 'deep_dark' | 'nether' | 'end';
  mood: 'focused' | 'curious' | 'calm' | 'chaotic' | 'exploration' | 'night';
};

const defaultState: EnvironmentState = {
  time: 12,
  season: 'spring',
  weather: 'clear',
  biome: 'plains',
  mood: 'focused'
};

// Colors for 24 hours of the day
const timeGradients = [
  { time: 0, top: '#010014', mid: '#050528', bot: '#002244' }, // Midnight
  { time: 4, top: '#0a0a2a', mid: '#1a1a4a', bot: '#3a2a5a' }, // Pre-Dawn
  { time: 6, top: '#ff7e5f', mid: '#feb47b', bot: '#ffcca8' }, // Sunrise
  { time: 8, top: '#6a82fb', mid: '#8fc3f9', bot: '#c5e0fa' }, // Morning
  { time: 12, top: '#2980b9', mid: '#6dd5fa', bot: '#ffffff' }, // Zenith
  { time: 16, top: '#1e3c72', mid: '#2a5298', bot: '#8ba2d4' }, // Afternoon
  { time: 18, top: '#f12711', mid: '#f5af19', bot: '#ffde9e' }, // Sunset
  { time: 20, top: '#141e30', mid: '#243b55', bot: '#4b6e8a' }, // Twilight
  { time: 24, top: '#010014', mid: '#050528', bot: '#002244' }, // Midnight Return
];

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

export function getCurrentLocalTime(): number {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}

export function getCurrentSeason(): EnvironmentState['season'] {
  const month = new Date().getMonth(); // 0-11
  // Simple Northern Hemisphere season calculation
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function applyEnvironmentState(state: EnvironmentState) {
  const root = document.documentElement;

  // Time gradient interpolation
  let before = timeGradients[0];
  let after = timeGradients[timeGradients.length - 1];
  
  for (let i = 0; i < timeGradients.length - 1; i++) {
    if (state.time >= timeGradients[i].time && state.time <= timeGradients[i+1].time) {
      before = timeGradients[i];
      after = timeGradients[i+1];
      break;
    }
  }

  // Handle midnight wrap-around logic
  let factor = 0;
  if (after.time > before.time) {
    factor = (state.time - before.time) / (after.time - before.time);
  }

  const top = interpolateColor(before.top, after.top, factor);
  const mid = interpolateColor(before.mid, after.mid, factor);
  const bot = interpolateColor(before.bot, after.bot, factor);

  root.style.setProperty('--sky-top', top);
  root.style.setProperty('--sky-middle', mid);
  root.style.setProperty('--sky-bottom', bot);

  // Apply Biome overrides
  if (state.biome === 'nether') {
    root.style.setProperty('--sky-top', '#3a0000');
    root.style.setProperty('--sky-middle', '#8a0000');
    root.style.setProperty('--sky-bottom', '#ff3333');
    root.style.setProperty('--accent-primary', '#ffaa00');
    root.style.setProperty('--glow-color', 'rgba(255, 85, 0, 0.5)');
  } else if (state.biome === 'deep_dark') {
    root.style.setProperty('--sky-top', '#000000');
    root.style.setProperty('--sky-middle', '#001111');
    root.style.setProperty('--sky-bottom', '#003333');
    root.style.setProperty('--accent-primary', '#00aaaa');
    root.style.setProperty('--glow-color', 'rgba(0, 170, 170, 0.3)');
  } else {
    // Reset to defaults or base on season
    if (state.season === 'autumn') {
      root.style.setProperty('--accent-primary', '#ff7700');
      root.style.setProperty('--glow-color', 'rgba(255, 119, 0, 0.4)');
    } else if (state.season === 'winter') {
      root.style.setProperty('--accent-primary', '#00ffff');
      root.style.setProperty('--glow-color', 'rgba(0, 255, 255, 0.4)');
    } else {
      root.style.setProperty('--accent-primary', '#55ff55');
      root.style.setProperty('--glow-color', 'rgba(85, 255, 85, 0.4)');
    }
  }

  // Save to localStorage
  localStorage.setItem('env-state', JSON.stringify(state));

  // Dispatch custom event for canvas particles
  window.dispatchEvent(new CustomEvent('environmentChange', { detail: state }));
}

export function initEnvironment() {
  const saved = localStorage.getItem('env-state');
  const storedConfig = localStorage.getItem('env-mode') || 'auto';
  
  let state = { ...defaultState };
  
  if (storedConfig === 'manual' && saved) {
    try {
      state = JSON.parse(saved);
    } catch(e) {}
  } else {
    // Auto mode
    state.time = getCurrentLocalTime();
    state.season = getCurrentSeason();
    // Defaulting other things to clear/plains
  }

  applyEnvironmentState(state);

  // If auto, update every minute
  if (storedConfig !== 'manual') {
    setInterval(() => {
      const mode = localStorage.getItem('env-mode') || 'auto';
      if (mode === 'auto') {
        const s = JSON.parse(localStorage.getItem('env-state') || '{}');
        s.time = getCurrentLocalTime();
        s.season = getCurrentSeason();
        applyEnvironmentState(s as EnvironmentState);
      }
    }, 60000);
  }
}
