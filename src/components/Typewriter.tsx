import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
}

export default function Typewriter({ lines, typingSpeed = 30, lineDelay = 500 }: TypewriterProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = '';
          }
          newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, typingSpeed);

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
