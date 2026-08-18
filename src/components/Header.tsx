import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getSiteBio } from '../services/contentful';
import './Header.css';

const links = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/cv', label: 'CV' },
  { to: '/video', label: 'Film' },
];

export default function Header() {
  const [bio, setBio] = useState<string | null>(null);

  useEffect(() => {
    getSiteBio()
      .then(setBio)
      .catch((err) => console.error('Error loading bio:', err));
  }, []);

  return (
    <header className="site-header">
      <Link to="/" className="site-header-name">Barrett Kowalsky</Link>
      {bio && <p className="site-header-bio">{bio}</p>}
      <nav className="site-header-nav">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'site-header-link site-header-link--active' : 'site-header-link'
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
