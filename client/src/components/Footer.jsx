import { useLocalTime } from '../hooks.js';

export default function Footer({ profile }) {
  const time = useLocalTime();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__wordmark" aria-hidden="true">
          Yathu<span className="wordmark-dot">.</span>
        </div>
        <div className="footer__bar">
          <span className="mono">
            © {year} {profile.name} — All rights reserved
          </span>
          <span className="mono">Local time — {time}</span>
          <button className="mono footer__top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
