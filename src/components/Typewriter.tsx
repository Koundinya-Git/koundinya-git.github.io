import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
}

export default function Typewriter({ lines, typingSpeed = 30, lineDelay = 500 }: TypewriterProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext only on user interaction or first mount if allowed
    if (typeof window !== 'undefined' && !audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }

    const resumeAudio = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    
    window.addEventListener('click', resumeAudio);
    window.addEventListener('keydown', resumeAudio);
    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
    };
  }, []);

  const playClick = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Cyber-techy click sound: short, high-pitched, square wave
    osc.type = 'square';
    osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      let delay = typingSpeed;
      const char = currentLine[currentCharIndex];
      // Add randomness for a more human-like typing feel, and pause on punctuation
      delay += Math.random() * (typingSpeed * 0.5);
      if (['.', ',', '!', '?'].includes(char)) {
        delay += 400; // Pause at punctuation
      }

      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = '';
          }
          newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        
        // Play sound if character is not a space
        if (char !== ' ') {
          playClick();
        }

        setCurrentCharIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      // Line finished typing
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, lineDelay);

      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, lines, typingSpeed, lineDelay]);

  return (
    <div className="typewriter-container mono">
      {displayedLines.map((line, index) => (
        <div key={index} className="typewriter-line" style={{ marginBottom: '0.5rem', wordBreak: 'break-word', color: 'var(--accent-primary)' }}>
          <span className="text-accent">{'> '}</span>
          <span>{line}</span>
          {index === currentLineIndex && currentCharIndex < lines[index].length && (
            <span className="cursor animate-pulse text-accent">_</span>
          )}
        </div>
      ))}
      {currentLineIndex >= lines.length && (
        <div className="typewriter-line" style={{ color: 'var(--accent-primary)' }}>
          <span className="text-accent">{'> '}</span>
          <span className="cursor animate-pulse text-accent">_</span>
        </div>
      )}
    </div>
  );
}
