import React, { useState, useEffect, useRef } from 'react';

const commands = [
  { name: 'Home', href: '/' },
  { name: 'About Max', href: '/about' },
  { name: 'Research', href: '/research' },
  { name: 'Publications', href: '/publications' },
  { name: 'Projects', href: '/projects' },
  { name: 'GitHub', href: '/github' },
  { name: 'Blog', href: '/blog' },
  { name: 'Astronomy', href: '/astronomy' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Contact', href: '/contact' },
  { name: 'Links', href: '/links' },
  { name: 'Now', href: '/now' },
  { name: 'Uses', href: '/uses' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter(cmd => cmd.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery('');
    window.location.href = item.href;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    }
    if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      handleSelect(filteredCommands[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="palette-overlay" onClick={() => setIsOpen(false)}>
      <div className="palette-modal block-panel" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="palette-input mono"
          placeholder="Type a command or search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <ul className="palette-results">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, i) => (
              <li 
                key={cmd.name} 
                className={`palette-item mono ${i === selectedIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => handleSelect(cmd)}
              >
                {cmd.name}
              </li>
            ))
          ) : (
            query.toLowerCase() === 'sudo' ? (
              <li className="palette-item mono text-accent">Permission denied. You are not in the sudoers file. This incident will be reported.</li>
            ) : query.toLowerCase() === 'rm -rf /' ? (
              <li className="palette-item mono" style={{color: '#ff5555'}}>Nice try.</li>
            ) : query.toLowerCase() === 'hello' ? (
              <li className="palette-item mono text-accent">World.</li>
            ) : query.toLowerCase() === '42' ? (
              <li className="palette-item mono text-accent">The answer to the ultimate question of life, the universe, and everything.</li>
            ) : (
              <li className="palette-item mono text-secondary">No results found for '{query}'</li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
