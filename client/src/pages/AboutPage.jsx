import { Link } from 'react-router-dom';
import SkillsNetwork from '../components/SkillsNetwork.jsx';

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
    </svg>
  );
}

export default function AboutPage({ content }) {
  const { about, skills, experience, profile } = content;
  const btech = experience.find((e) => e.company?.includes('St. Joseph'));
  const mscStudy = experience.find((e) => e.place === 'Rome, Italy');

  const nowCards = [
    {
      label: 'Currently',
      value: mscStudy
        ? `Going to Italy — ${mscStudy.role} at ${mscStudy.company}`
        : profile.role,
    },
    {
      label: 'Studying',
      value: mscStudy
        ? `M.Sc — ICT & Internet Engineering, Tor Vergata University, Rome`
        : btech?.role ?? 'B.Tech AI & Data Science',
    },
    { label: 'Based in', value: profile.location },
    { label: 'Status', value: profile.availability, live: true },
  ];

  return (
    <section className="page about-page">
      <div className="about-page__glow about-page__glow--a" aria-hidden="true" />
      <div className="about-page__glow about-page__glow--b" aria-hidden="true" />
      <div className="about-page__noise" aria-hidden="true" />

      <div className="container about-page__inner">
        {/* ——— hero split: copy left, skill-routing diagram right ——— */}
        <div className="ahero">
          <div className="ahero__copy">
            <span className="alabel mono reveal">
              <BoltIcon />
              Profile engine
            </span>
            <h1 className="ahero__title">
              <span className="ahero__line">
                <span className="ahero__line-inner">Engineer by study.</span>
              </span>
              <span className="ahero__line">
                <span className="ahero__line-inner ahero__line-inner--accent">Builder by obsession.</span>
              </span>
            </h1>
            <p className="ahero__text reveal" style={{ transitionDelay: '0.4s' }}>
              {about.statement}
            </p>
            <div className="ahero__cta reveal" style={{ transitionDelay: '0.5s' }}>
              <Link className="abtn" to="/work">
                See my work <span className="abtn__arrow">→</span>
              </Link>
              <Link className="link-arrow" to="/contact">
                Get in touch <span>→</span>
              </Link>
            </div>
          </div>

          <div className="ahero__net">
            <SkillsNetwork skills={skills} />
          </div>
        </div>

        {/* ——— bio ——— */}
        <div className="abio">
          <span className="alabel mono reveal">The story</span>
          <p className="reveal" style={{ transitionDelay: '0.12s' }}>
            {about.bio}
          </p>
        </div>

        {/* ——— now ——— */}
        <div className="anow">
          <span className="alabel mono reveal">Now</span>
          <div className="anow__grid">
            {nowCards.map((c, i) => (
              <div className="anow__card reveal" key={c.label} style={{ transitionDelay: `${0.08 * i}s` }}>
                <span className="anow__label mono">
                  {c.live && <span className="anow__live" aria-hidden="true" />}
                  {c.label}
                </span>
                <span className="anow__value">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
