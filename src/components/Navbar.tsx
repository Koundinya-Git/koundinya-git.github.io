import React, { useState, useEffect } from 'react';
import { siteConfig } from '../siteConfig';
import { Menu, X, Terminal, Compass } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'WORLD', href: '/world' },
    { name: 'ABOUT', href: '/about' },
    { name: 'RESEARCH', href: '/research' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="/" className="brand">
          <Terminal size={20} className="text-accent" />
          <span className="mono">{siteConfig.githubUsername}</span>
        </a>
        
        <div className="desktop-nav">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="nav-link mono">
              {link.name}
            </a>
          ))}
          <button className="nav-btn mono" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}>
             <Compass size={16} /> MORE (Ctrl+K)
          </button>
        </div>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {isOpen && (
        <div className="mobile-menu block-panel">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="nav-link mono">
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
