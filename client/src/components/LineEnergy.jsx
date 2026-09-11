import { useEffect, useRef } from 'react';

/**
 * Green energy particles radiating outward from the timeline's central beam —
 * the "energy coming out" effect from the Global Agency template, rebuilt as
 * a light 2D canvas layer. Decorative only.
 */
export default function LineEnergy() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const parts = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => ({
      x: w / 2 + (Math.random() * 4 - 2),
      y: Math.random() * h,
      vx: (Math.random() * 0.5 + 0.15) * (Math.random() < 0.5 ? -1 : 1),
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.5,
      life: 0,
      max: 140 + Math.random() * 120,
      bright: Math.random() < 0.18,
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        const k = p.life / p.max;
        const a = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
        ctx.globalAlpha = Math.max(a, 0) * (p.bright ? 0.9 : 0.55);
        ctx.fillStyle = p.bright ? '#a7f3c9' : '#22c55e';
        if (p.bright) {
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (p.life >= p.max || p.x < -10 || p.x > w + 10) {
          parts[i] = spawn();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    for (let i = 0; i < 42; i++) {
      const p = spawn();
      p.x += (Math.random() * 2 - 1) * 30;
      p.life = Math.random() * p.max;
      parts.push(p);
    }
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="tl-energy" aria-hidden="true" />;
}