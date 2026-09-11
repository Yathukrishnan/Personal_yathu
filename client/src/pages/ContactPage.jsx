import { useState } from 'react';
import { sendContact } from '../api.js';
import OrbitRadar from '../components/OrbitRadar.jsx';

export default function ContactPage({ content }) {
  const { profile } = content;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [flying, setFlying] = useState(false);
  const [sentName, setSentName] = useState('');

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    const sentName = form.name.trim();
    try {
      await sendContact(form);
      const firstName = sentName.split(/\s+/)[0];
      setSentName(firstName);
      setStatus({
        state: 'sent',
        message: `Thank you, ${firstName}! Your message landed — I'll get back to you within 24 hours.`,
      });
      setForm({ name: '', email: '', message: '' });
      setFlying(true);
      setTimeout(() => setFlying(false), 3200);
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <section className="page contact-page">
      <div className="container cthead">
        <div className="cthead__copy">
          <span className="cthead__label mono reveal">05 — Contact</span>
          <h1 className="cthead__title reveal" style={{ transitionDelay: '0.08s' }}>
            Have an idea?
            <br />
            Let&rsquo;s build it <span>together</span>.
          </h1>
          <p className="cthead__text reveal" style={{ transitionDelay: '0.16s' }}>
            I&rsquo;m open to paid work — freelance, full-time, or collaborating with companies on
            exciting projects. Tell me about your idea; I usually reply within 24 hours.
          </p>
        </div>

        <div className="cthead__viz reveal" style={{ transitionDelay: '0.2s' }}>
          <OrbitRadar socials={profile.socials} />
        </div>
      </div>

      <div className="container">
        <form className="contact__form reveal" onSubmit={submit} style={{ transitionDelay: '0.1s' }}>
          <div className="form__row">
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={update}
                required
                minLength={2}
              />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input
                id="c-email"
                name="email"
                type="email"
                placeholder="jane@studio.com"
                value={form.email}
                onChange={update}
                required
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="c-message">Project details</label>
            <textarea
              id="c-message"
              name="message"
              placeholder="What are we building?"
              value={form.message}
              onChange={update}
              required
              minLength={10}
            />
          </div>
          <div className="form__foot">
            <button className="btn btn--light" type="submit" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Sending…' : 'Send message'} <span className="btn__arrow">→</span>
            </button>
            {status.state !== 'idle' && status.message && (
              <p className={`form__status form__status--${status.state}`} role="status">
                {status.message}
              </p>
            )}
          </div>
        </form>
      </div>

      {flying && (
        <div className="flysent" aria-hidden="true">
          <svg className="flysent__path" viewBox="0 0 1200 700" preserveAspectRatio="none">
            <path
              d="M300 520 C 440 470, 580 500, 700 430 S 920 280, 1000 210 S 1070 130, 1090 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="10 14"
            />
          </svg>
          <span className="flysent__plane">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M58 6L6 28l20 8 4 20 10-14 14 8z" fill="#fff" opacity="0.95" />
              <path d="M58 6L26 36l4 20 10-14z" fill="#d7dbe0" />
              <path d="M58 6L26 36l-20-8z" fill="#b9bfc7" />
            </svg>
          </span>
          <span className="flysent__spark flysent__spark--a" />
          <span className="flysent__spark flysent__spark--b" />
          <span className="flysent__spark flysent__spark--c" />
          <span className="flysent__chip mono">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12.5l5 5L20 6.5" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Thanks, {sentName} — message on its way!
          </span>
        </div>
      )}
    </section>
  );
}
