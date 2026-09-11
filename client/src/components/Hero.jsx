import { useLocalTime } from '../hooks.js';

export default function Hero({ profile }) {
  const time = useLocalTime();

  return (
    <header className="hero" id="top">
      {/* Background photo slot — served from client/public/hero.png */}
      <div className="hero__bg" aria-hidden="true">
        <img
          className="hero__photo"
          src="/hero.png"
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="hero__scrim" />
        <div className="hero__noise" />
      </div>

      <div className="container hero__inner">
        <h1 className="hero__title">
          {profile.tagline.map((line, i) => (
            <span className="hero__line" key={i}>
              <span className="hero__line-inner" style={{ animationDelay: `${0.15 + i * 0.09}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <ul className="hero__services" aria-label="Services">
          {profile.services.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <div className="hero__cta">
          <a className="btn btn--light" href="#contact">
            Start a project <span className="btn__arrow">→</span>
          </a>
          <a className="btn btn--ghost" href="#work">
            Selected work
          </a>
        </div>

        <div className="hero__meta">
          <span className="hero__meta-item mono">{profile.location}</span>
          <span className="hero__meta-item mono">{time}</span>
        </div>
      </div>

      <div className="hero__wordmark" aria-hidden="true">
        {profile.name}
        <span className="wordmark-dot">.</span>
      </div>
    </header>
  );
}
