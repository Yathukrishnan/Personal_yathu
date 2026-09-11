import { useEffect, useRef } from 'react';

/**
 * AuraCore-style isometric telemetry visual: faint dark platform, glowing cyan
 * core column, orbiting cubes, rotating wireframe rings and rising particles —
 * drawn on a 2D canvas. Data chips are HTML overlays bobbing via CSS.
 */
export default function SpatialView({ chips = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;

    const HW = 34;
    const HH = 19;
    const CH = 22;
    const N = 5;

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

    const poly = (pts, fill, stroke) => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const draw = (time) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);

      const scale = Math.min(1, Math.max(0.5, (w - 40) / 400));
      ctx.save();
      ctx.translate(w / 2, h * 0.52);
      ctx.scale(scale, scale);

      const P = (gx, gy, z) => ({
        x: (gx - gy) * HW,
        y: (gx + gy) * HH - z - (N - 1) * HH,
      });

      // platform tiles
      for (let gy = 0; gy < N; gy++) {
        for (let gx = 0; gx < N; gx++) {
          const p = P(gx, gy, 0);
          poly(
            [
              { x: p.x - HW, y: p.y - HH },
              { x: p.x + HW, y: p.y - HH },
              { x: p.x + HW, y: p.y + HH },
              { x: p.x - HW, y: p.y + HH },
            ],
            (gx + gy) % 2 === 0 ? '#0c0e11' : '#0a0c0f',
            'rgba(0, 229, 255, 0.06)'
          );
        }
      }

      // rotating wireframe rings
      ctx.save();
      ctx.setLineDash([5, 9]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineDashOffset = -t * 14;
      ctx.beginPath();
      ctx.ellipse(0, -2, HW * 2.6, HW * 2.6 * (HH / HW), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0, 119, 255, 0.32)';
      ctx.lineDashOffset = t * 10;
      ctx.beginPath();
      ctx.ellipse(0, -8, HW * 3.3, HW * 3.3 * (HH / HW), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // glow pooling under the core
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 95);
      g.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
      g.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(-95, -95, 190, 190);

      // core column — 3 stacked glowing cubes
      const C = (dx, dy, z) => ({ x: (dx - dy) * HW * 0.62, y: (dx + dy) * HH * 0.62 - z });
      for (let s = 0; s < 3; s++) {
        const z0 = s * CH;
        const z1 = z0 + CH;
        poly(
          [C(-0.5, 0.5, z1), C(0.5, 0.5, z1), C(0.5, 0.5, z0), C(-0.5, 0.5, z0)],
          '#066f85'
        );
        poly([C(0.5, -0.5, z1), C(0.5, 0.5, z1), C(0.5, 0.5, z0), C(0.5, -0.5, z0)], '#099cb8');
        ctx.save();
        ctx.shadowColor = 'rgba(0, 229, 255, 0.85)';
        ctx.shadowBlur = 22;
        poly([C(-0.5, -0.5, z1), C(0.5, -0.5, z1), C(0.5, 0.5, z1), C(-0.5, 0.5, z1)], '#3ee9ff');
        ctx.restore();
      }

      // orbiting cubes
      const sats = [
        { gx: 2.9, gy: 1.4, z: 46, ph: 0 },
        { gx: 0.9, gy: 2.4, z: 34, ph: 1.4 },
        { gx: 3.3, gy: 3.0, z: 26, ph: 2.6 },
        { gx: 1.5, gy: 0.7, z: 58, ph: 3.9 },
        { gx: 2.2, gy: 3.6, z: 40, ph: 5.1 },
      ];
      for (const s of sats) {
        const bob = Math.sin(t * 1.6 + s.ph) * 5;
        const p = P(s.gx, s.gy, s.z + bob);
        const f = 0.42;
        const K = (dx, dy, z) => ({ x: p.x + (dx - dy) * HW * f, y: p.y + (dx + dy) * HH * f - z });
        poly([K(-0.5, 0.5, CH), K(0.5, 0.5, CH), K(0.5, 0.5, 0), K(-0.5, 0.5, 0)], '#0a0c0f', 'rgba(0,229,255,0.3)');
        poly([K(0.5, -0.5, CH), K(0.5, 0.5, CH), K(0.5, 0.5, 0), K(0.5, -0.5, 0)], '#101317', 'rgba(0,229,255,0.3)');
        poly([K(-0.5, -0.5, CH), K(0.5, -0.5, CH), K(0.5, 0.5, CH), K(-0.5, 0.5, CH)], '#1b1e23', 'rgba(0,229,255,0.4)');
      }

      // rising particles
      for (let i = 0; i < 9; i++) {
        const px = Math.sin(i * 2.7) * 70;
        const cyc = 110;
        const off = (t * 26 + i * 29) % cyc;
        ctx.globalAlpha = 0.5 * (1 - off / cyc);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(px, 34 - off, 2, 2);
      }
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    const loop = (time) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    const onResize = () => {
      resize();
      if (reduce) draw(0);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="sviz">
      <canvas ref={ref} className="sviz__canvas" aria-hidden="true" />
      {chips.map((c) => (
        <span key={c.pos} className={`sviz__chip sviz__chip--${c.pos} mono`}>
          {c.live && <span className="sviz__live" aria-hidden="true" />}
          <span>{c.label}</span>
          {c.value ? <b>{c.value}</b> : null}
        </span>
      ))}
    </div>
  );
}