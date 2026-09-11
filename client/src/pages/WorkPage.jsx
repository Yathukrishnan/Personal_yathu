import SpatialView from '../components/SpatialView.jsx';

const GITHUB_PROFILE = 'https://github.com/Yathukrishnan';

const TONES = ['cyan', 'blue', 'violet', 'emerald'];

const ICONS = {
  cyan: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  ),
  blue: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="7" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M7.4 7.6l3.6 8.2M16 8.8l-3 7.4M8.2 6.2l7.6.6" />
    </svg>
  ),
  violet: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l8 4.5L12 12 4 7.5 12 3z" />
      <path d="M4 12l8 4.5 8-4.5" />
      <path d="M4 16.5L12 21l8-4.5" />
    </svg>
  ),
  emerald: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v16" />
      <path d="M5 9l7-5 7 5" />
      <path d="M5 15l7 5 7-5" />
    </svg>
  ),
};

export default function WorkPage({ content }) {
  const { projects } = content;

  return (
    <section className="page work-page">
      <div className="wspace" aria-hidden="true">
        <span className="wspace__glow wspace__glow--a" />
        <span className="wspace__glow wspace__glow--b" />
      </div>

      <div className="container wgrid">
        <div className="wcol">
          <span className="wlabel mono reveal">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v18M3 12h18" />
            </svg>
            Spatial work telemetry
          </span>
          <h1 className="wtitle reveal" style={{ transitionDelay: '0.08s' }}>
            Map the architecture
            <br />
            of my work.
          </h1>
          <p className="wcopy reveal" style={{ transitionDelay: '0.16s' }}>
            Projects rendered as systems — interface, logic and data composed into one
            reliable product. Open a card to explore the source on GitHub.
          </p>

          <div className="wcards">
            {projects.map((p, i) => (
              <a
                className="wcard reveal"
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                style={{ transitionDelay: `${0.2 + i * 0.08}s` }}
              >
                <span className={`wcard__icon wcard__icon--${TONES[i % 4]}`}>
                  {ICONS[TONES[i % 4]]}
                </span>
                <span className="wcard__body">
                  <span className="wcard__title">{p.title}</span>
                  <span className="wcard__sub mono">{p.category}</span>
                </span>
                <span className="wcard__chev" aria-hidden="true">
                  ›
                </span>
              </a>
            ))}
          </div>

          <a
            className="btn wmore reveal"
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noreferrer"
            style={{ transitionDelay: '0.55s' }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.47.09.64-.2.64-.45v-1.6c-2.64.58-3.2-1.27-3.2-1.27-.43-1.1-1.05-1.4-1.05-1.4-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.85 1.45 2.22 1.03 2.76.79.09-.62.33-1.03.6-1.27-2.1-.24-4.32-1.05-4.32-4.7 0-1.04.37-1.89.98-2.56-.1-.24-.42-1.21.09-2.52 0 0 .8-.26 2.61.98a9.1 9.1 0 0 1 4.76 0c1.81-1.24 2.6-.98 2.6-.98.52 1.31.2 2.28.1 2.52.61.67.98 1.52.98 2.56 0 3.66-2.23 4.46-4.34 4.7.34.29.65.87.65 1.75v2.6c0 .25.17.55.65.45A9.5 9.5 0 0 0 12 2.5z" />
            </svg>
            View more projects
            <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="wviz reveal" style={{ transitionDelay: '0.15s' }}>
          <SpatialView
            chips={[
              { label: 'Core stack', value: 'React · AI', pos: 'top' },
              { label: 'Open source', value: 'GitHub', pos: 'left' },
              { label: 'Reliability', value: '98.9%', pos: 'right' },
              { label: 'System stable', value: '', pos: 'bottom', live: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
