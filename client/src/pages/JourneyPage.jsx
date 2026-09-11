import LineEnergy from '../components/LineEnergy.jsx';

const KIND_LABEL = { start: 'Origin', edu: 'Studies', work: 'Work', startup: 'Startup', now: 'Now' };

export default function JourneyPage({ content }) {
  const items = content.journey ?? [];

  return (
    <section className="page journey-page">
      <div className="journey-page__glow journey-page__glow--a" aria-hidden="true" />
      <div className="journey-page__glow journey-page__glow--b" aria-hidden="true" />

      <div className="container">
        <div className="tl reveal">
          <span className="tl__line" aria-hidden="true" />
          <span className="tl__pulse" aria-hidden="true" />
          <LineEnergy />

          {items.map((item, i) => (
            <div
              key={`${item.year}-${item.title}`}
              className={`tl-item reveal ${i % 2 ? 'tl-item--right' : 'tl-item--left'}`}
              style={{ transitionDelay: `${(i % 2) * 0.06}s` }}
            >
              <div className="tl-spacer" />
              <div className="tl-mid">
                <span className="tl-link" aria-hidden="true" />
                <span
                  className={`tl-node ${item.kind === 'start' ? 'tl-node--start' : ''}`}
                  aria-hidden="true"
                />
              </div>
              <div className="tl-card">
                <div className="tl-card__meta mono">
                  <span className="tl-kind">{KIND_LABEL[item.kind] ?? 'Step'}</span>
                  <span className="tl-year">{item.year}</span>
                </div>
                <h3 className="tl-card__title">{item.title}</h3>
                <p className="tl-card__text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
