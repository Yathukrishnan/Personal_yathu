import { useCountUp } from '../hooks.js';

/* Tiny outline glyphs, one per skill — matched by keyword. */
const ICONS = {
  chip: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M12 3.5V7M12 17v3.5M3.5 12H7M17 12h3.5" />
      <circle className="solid" cx="12" cy="12" r="1.3" />
    </svg>
  ),
  atom: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle className="solid" cx="12" cy="12" r="1.4" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.4" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(120 12 12)" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7.5 4.5 12 9 16.5" />
      <path d="m15 7.5 4.5 4.5L15 16.5" />
    </svg>
  ),
  hash: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.8 4.5 8.2 19.5M15.8 4.5l-1.6 15M4.5 9.2h15M4.5 14.8h15" />
    </svg>
  ),
  braces: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 4.5c-2.3 0-3.3 1-3.3 3v2c0 1.2-.8 2.1-2.2 2.5 1.4.4 2.2 1.3 2.2 2.5v2c0 2 1 3 3.3 3" />
      <path d="M14.5 4.5c2.3 0 3.3 1 3.3 3v2c0 1.2.8 2.1 2.2 2.5-1.4.4-2.2 1.3-2.2 2.5v2c0 2-1 3-3.3 3" />
    </svg>
  ),
};

function iconFor(name = '') {
  const n = name.toLowerCase();
  if (n.includes('ai') || n.includes('data') || n.includes('ml')) return ICONS.chip;
  if (n.includes('react')) return ICONS.atom;
  if (n.includes('html')) return ICONS.code;
  if (n.includes('css')) return ICONS.hash;
  if (n.includes('script') || n.includes('js')) return ICONS.braces;
  return ICONS.code;
}

const SHORT = { 'AI & Data Science': 'AI / ML', JavaScript: 'JS' };

function SkillBranch({ skill, index }) {
  const [ref, value] = useCountUp(skill.level, 1500);

  return (
    <div className="skbranch" style={{ '--i': index }}>
      <span className="skbranch__stub" aria-hidden="true">
        <span className="skpulse skpulse--stub" />
      </span>
      <div className="sknode" title={`${skill.name} — ${skill.level}%`}>
        <span className="sknode__tile">{iconFor(skill.name)}</span>
        <span className="sknode__label mono">{SHORT[skill.name] ?? skill.name}</span>
      </div>
      <span className="sknode__pct mono" ref={ref}>
        {value}%
      </span>
    </div>
  );
}

/**
 * "Intelligent routing" style skill map: a glowing hub routes pulses down a
 * trunk, across a rail and into one node per skill. Lines draw themselves and
 * nodes pop in, staggered, once the block scrolls into view (.visible).
 */
export default function SkillsNetwork({ skills }) {
  return (
    <div
      className="sknet reveal"
      aria-label={`Skill map — ${skills.map((s) => `${s.name} ${s.level}%`).join(', ')}`}
    >
      <div className="sknet__hub">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 7.5 4.5 12 9 16.5" />
          <path d="m15 7.5 4.5 4.5L15 16.5" />
        </svg>
        <span className="sknet__dot" aria-hidden="true" />
      </div>

      <div className="sknet__trunk" aria-hidden="true">
        <span className="skpulse skpulse--trunk" />
      </div>

      <div className="sknet__branches">
        <span className="sknet__rail" aria-hidden="true" />
        {skills.map((s, i) => (
          <SkillBranch key={s.name} skill={s} index={i} />
        ))}
      </div>
    </div>
  );
}