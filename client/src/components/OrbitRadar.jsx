import { openMailLink } from './MenuOverlay.jsx';

const BRANDS = {
  GitHub: {
    tint: '#e6edf3',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
  },
  LinkedIn: {
    tint: '#38bdf8',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v15.5h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.14v9.36h-4v-8.3c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.48v8.46h-4V8z" />
      </svg>
    ),
  },
  'X / Twitter': {
    tint: '#e7e9ea',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.23l-4.88-6.38L6.5 22H3.36l7.24-8.28L2.8 2h6.39l4.41 5.83L18.9 2zm-1.1 18.1h1.72L7.98 3.8H6.13L17.8 20.1z" />
      </svg>
    ),
  },
  Instagram: {
    tint: '#f472b6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.2" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  Mail: {
    tint: '#fbbf24',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
};

const FALLBACK_BRAND = {
  tint: '#10b981',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.5 4 5.6 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.6-4-9s1.4-6.5 4-9z" />
    </svg>
  ),
};

/**
 * Vortex "Global Scale" orbit radar: dashed rings + rotating tick dial around a
 * green core, with the profile's social links orbiting as satellite icons.
 */
export default function OrbitRadar({ socials = [] }) {
  const n = Math.max(socials.length, 1);

  return (
    <div className="orbits">
      <svg className="orbits__rings" viewBox="0 0 400 400" aria-hidden="true">
        <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
        <circle
          cx="200"
          cy="200"
          r="112"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
          strokeDasharray="1 6"
        />
        <g className="orbits__ticks">
          {Array.from({ length: 72 }, (_, i) => (
            <line
              key={i}
              x1="200"
              y1="16"
              x2="200"
              y2={i % 6 === 0 ? '28' : '22'}
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1"
              transform={`rotate(${i * 5} 200 200)`}
            />
          ))}
        </g>
      </svg>

      <span className="orbits__core" aria-hidden="true">
        <span className="orbits__core-dot" />
      </span>

      <div className="orbits__sats">
        {socials.map((s, i) => {
          const brand = BRANDS[s.label] ?? FALLBACK_BRAND;
          const isMail = s.url.startsWith('mailto:');
          return (
            <a
              key={s.label}
              className="orbits__sat"
              style={{ '--angle': `${(i / n) * 360}deg`, '--tint': brand.tint }}
              href={s.url}
              target={isMail ? undefined : '_blank'}
              rel={isMail ? undefined : 'noreferrer'}
              onClick={isMail ? (e) => openMailLink(e, s.url) : undefined}
              aria-label={s.label}
              title={isMail ? `Email: ${s.url.replace('mailto:', '')}` : s.label}
            >
              <span className="orbits__sat-icon">{brand.icon}</span>
            </a>
          );
        })}
      </div>

      <span className="orbits__dot orbits__dot--a" aria-hidden="true" />
      <span className="orbits__dot orbits__dot--b" aria-hidden="true" />
      <span className="orbits__dot orbits__dot--c" aria-hidden="true" />

      <span className="orbits__chip mono">
        <span className="orbits__chip-dot" aria-hidden="true" />
        Network active — replies &lt; 24h
      </span>
    </div>
  );
}