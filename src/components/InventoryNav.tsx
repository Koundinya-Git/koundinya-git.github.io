import React, { useState } from 'react';
import { Compass, Book, FlaskConical, Wrench, Code, Telescope, Music, Map, Mail, ChevronUp, ChevronDown } from 'lucide-react';

const inventoryItems = [
  { name: 'Home', href: '/', icon: <Compass size={24} /> },
  { name: 'World Map', href: '/world', icon: <Map size={24} /> },
  { name: 'About Max', href: '/about', icon: <Book size={24} /> },
  { name: 'Research', href: '/research', icon: <FlaskConical size={24} /> },
  { name: 'Projects', href: '/projects', icon: <Wrench size={24} /> },
  { name: 'GitHub', href: '/github', icon: <Code size={24} /> },
  { name: 'Astronomy', href: '/astronomy', icon: <Telescope size={24} /> },
  { name: 'Music', href: '/music', icon: <Music size={24} /> },
  { name: 'Contact', href: '/contact', icon: <Mail size={24} /> },
];

export default function InventoryNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`inventory-wrapper ${isOpen ? 'open' : ''}`}>
      <button className="inventory-toggle block-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDown /> : <ChevronUp />} INVENTORY
      </button>
      
      <div className="inventory-grid block-panel">
        {inventoryItems.map((item, index) => (
          <a key={item.name} href={item.href} className="inventory-slot" title={item.name}>
            <div className="inventory-icon">
              {item.icon}
            </div>
            <div className="inventory-tooltip mono">{item.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
