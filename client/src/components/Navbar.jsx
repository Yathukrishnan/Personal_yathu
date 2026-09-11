import { NavLink } from 'react-router-dom';
import { useScrolled } from '../hooks.js';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/expertise', label: 'Expertise' },
  { to: '/work', label: 'Work' },
  { to: '/journey', label: 'Journey' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar({ menuOpen, onToggleMenu }) {
  const scrolled = useScrolled(12);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__pill">
        <NavLink className="brand" to="/" onClick={() => menuOpen && onToggleMenu()}>
          <img className="brand__logo" src="/logo.png" alt="Yathu logo" />
        </NavLink>
        <div className="nav__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="nav__actions">
          <NavLink className="btn btn--light btn--sm" to="/contact">
            Start a project
          </NavLink>
          <button
            className={`burger ${menuOpen ? 'burger--open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
