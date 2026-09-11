import TopologySphere from '../components/TopologySphere.jsx';
import { useLocalTime } from '../hooks.js';

const STATUS = ['◍ Active system', '● Mesh converged', '◌ Proxy grid', '◦ Edge synced'];

export default function ExpertisePage({ content }) {
  const { expertise } = content;
  const time = useLocalTime();

  return (
    <section className="page exppage">
      <div className="container">
        <div className="hud reveal">
          <span className="hud__corner hud__corner--tl" aria-hidden="true" />
          <span className="hud__corner hud__corner--tr" aria-hidden="true" />
          <span className="hud__corner hud__corner--bl" aria-hidden="true" />
          <span className="hud__corner hud__corner--br" aria-hidden="true" />

          <header className="hud__bar">
            <span className="mono">[ EXP.CORE // V.2.0 ]</span>
            <span className="mono hud__sys">
              <span className="hud__sys-dot" aria-hidden="true" />
              SYS.ACTIVE // {time}Z
            </span>
          </header>

          <div className="hud__stage">
            <TopologySphere />
            <div className="hud__head">
              <span className="hud__label mono">Primary expertise environment</span>
              <h1 className="hud__title">
                Execution
                <br />
                Topology
              </h1>
              <p className="hud__sub mono">
                Four disciplines routed through one system — designed, built and shipped in
                real-time.
              </p>
            </div>
          </div>

          <div className="hud__grid">
            {expertise.map((item, i) => (
              <article
                className="hud__cell reveal"
                key={item.title}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="hud__cell-head mono">
                  <span className="hud__cell-title">{item.title}</span>
                  <span className="hud__cell-num">/ {item.num}</span>
                </div>
                <p className="hud__cell-text mono">{item.text}</p>
                <span className="hud__cell-status mono">
                  {STATUS[i % 4]} — {item.tags.join(' · ')}
                </span>
              </article>
            ))}
          </div>

          <footer className="hud__foot mono">
            <span>Awaiting instruction...</span>
            <span>Scroll status ▸ Online</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
