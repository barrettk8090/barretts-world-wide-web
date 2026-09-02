import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getSiteBio } from '../services/contentful';
import './Header.css';

interface NavItem {
  to: string;
  label: string;
}

const links: NavItem[] = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/cv', label: 'CV' },
  { to: '/video', label: 'Film' },
];

const streamLinks: NavItem[] = [
  { to: '/people', label: 'People' },
  { to: '/places', label: 'Places' },
  { to: '/things', label: 'Things' },
  { to: '/climate', label: 'Climate' },
  { to: '/archive', label: 'Archive' },
];

function renderLinks(items: NavItem[], onNavigate: () => void) {
  return items.map(({ to, label }) => (
    <NavLink
      key={to}
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        isActive ? 'site-header-link site-header-link--active' : 'site-header-link'
      }
    >
      {label}
    </NavLink>
  ));
}

export default function Header() {
  const [bio, setBio] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getSiteBio()
      .then(setBio)
      .catch((err) => console.error('Error loading bio:', err));
  }, []);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <Link to="/" className="site-header-name" onClick={closeMenu}>Barrett Kowalsky</Link>
        <button
          type="button"
          className={`site-header-toggle${menuOpen ? ' site-header-toggle--open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {bio && <p className="site-header-bio">{bio}</p>}

      <div className={`site-header-navs${menuOpen ? ' site-header-navs--open' : ''}`}>
        <nav className="site-header-nav site-header-nav--streams">
          {renderLinks(streamLinks, closeMenu)}
        </nav>
        <div className="site-header-divider" />
        <nav className="site-header-nav">
          {renderLinks(links, closeMenu)}
        </nav>
      </div>
    </header>
  );
}
