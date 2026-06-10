import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header-name">barrett kowalsky</Link>
      <nav className="site-header-nav">
        <Link to="/about" className="site-header-link">About</Link>
        <Link to="/blog" className="site-header-link">Notes</Link>
        <Link to="/cv" className="site-header-link">CV</Link>
        <Link to="/video" className="site-header-link">Film</Link>
      </nav>
    </header>
  );
}
