import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Marquee from '../components/Marquee.jsx';
import ServiceCards from '../components/ServiceCards.jsx';

export default function HomePage({ content }) {
  const { profile, expertise } = content;

  return (
    <>
      <Hero profile={profile} />
      <Marquee items={profile.marquee} />

      <section className="section">
        <div className="container">
          <div className="section__head reveal">
            <span className="label mono">01 — Expertise</span>
            <h2 className="section__title">What I do best.</h2>
          </div>
          <ServiceCards items={expertise.slice(0, 3)} />
          <Link className="link-arrow reveal" to="/expertise" style={{ marginTop: 28, display: 'inline-flex' }}>
            Explore all expertise <span>→</span>
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner reveal">
            <h2>
              Have an idea?
              <br />
              Let&rsquo;s build it <span className="accent">together</span>.
            </h2>
            <Link className="btn btn--light" to="/contact">
              Start a project <span className="btn__arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
