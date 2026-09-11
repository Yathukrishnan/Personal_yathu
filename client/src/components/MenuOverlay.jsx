import { useEffect } from 'react';

/**
 * Opens a mailto: link via the OS mail client, with a Gmail web-compose
 * fallback for visitors who have no default mail app configured.
 * If the page stays visible/focused after a short delay, the mail app
 * didn't take over — so we open Gmail compose in a new tab instead.
 */
export function openMailLink(e, mailto) {
  e.preventDefault();
  const email = mailto.replace(/^mailto:/, '');
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  let opened = false;
  const markOpened = () => {
    opened = true;
  };
  window.addEventListener('blur', markOpened, { once: true });
  document.addEventListener('visibilitychange', markOpened, { once: true });

  window.location.href = mailto;

  setTimeout(() => {
    window.removeEventListener('blur', markOpened);
    document.removeEventListener('visibilitychange', markOpened);
    if (!opened && !document.hidden) window.open(gmail, '_blank', 'noopener');
  }, 1200);
}
import { Link } from 'react-router-dom';

const LINKS = [
  { n: '01', label: 'Home', to: '/' },
  { n: '02', label: 'About', to: '/about' },
  { n: '03', label: 'Expertise', to: '/expertise' },
  { n: '04', label: 'Work', to: '/work' },
  { n: '05', label: 'Journey', to: '/journey' },
  { n: '06', label: 'Contact', to: '/contact' },
];

export default function MenuOverlay({ profile, open, onClose }) {
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open, onClose]);

  return (
    <div className={`menu ${open ? 'menu--open' : ''}`} aria-hidden={!open}>
      <div className="container menu__inner">
        <nav className="menu__nav" aria-label="Main">
          {LINKS.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className="menu__link"
              style={{ transitionDelay: open ? `${0.08 * i + 0.15}s` : '0s' }}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
            >
              <span className="mono menu__num">{l.n}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="menu__foot">
          <a className="menu__mail" href={`mailto:${profile.email}`} onClick={(e) => openMailLink(e, `mailto:${profile.email}`)}>
            {profile.email}
          </a>
          <div className="menu__socials">
            {profile.socials.map((s) => {
              const isMail = s.url.startsWith('mailto:');
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noreferrer'}
                  onClick={isMail ? (e) => openMailLink(e, s.url) : undefined}
                  tabIndex={open ? 0 : -1}
                >
                  {s.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
