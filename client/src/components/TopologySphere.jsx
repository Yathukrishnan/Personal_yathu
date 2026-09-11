import { useEffect, useRef } from 'react';

/**
 * Cognitive-Routing style geodesic wireframe: an icosahedron (12 vertices,
 * 30 edges, 20 faces) slowly rotating behind the HUD heading — faint rust-red
 * edges, deeper fill on back faces, and a few glowing facets on the lit side.
 * 2D canvas, decorative only.
 */
export default function TopologySphere() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;

    // icosahedron vertices (unit circumradius)
    const t = (1 + Math.sqrt(5)) / 2;
    const raw = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ];
    const verts = raw.map(([x, y, z]) => {
      const l = Math.hypot(x, y, z);
      return { x: x / l, y: y / l, z: z / l };
    });

    // edges = vertex pairs at the minimal icosahedron edge length (~1.0515)
    const edges = [];
    const edgeKey = new Set();
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const d = Math.hypot(
          verts[i].x - verts[j].x,
          verts[i].y - verts[j].y,
          verts[i].z - verts[j].z
        );
        if (d < 1.3) {
          edges.push([i, j]);
          edgeKey.add(`${i}:${j}`);
        }
      }
    }

    // faces = mutually adjacent triples (exactly 20 on an icosahedron)
    const adj = (a, b) => edgeKey.has(`${Math.min(a, b)}:${Math.max(a, b)}`);
    const faces = [];
    for (let a = 0; a < 12; a++) {
      for (let b = a + 1; b < 12; b++) {
        if (!adj(a, b)) continue;
        for (let c = b + 1; c < 12; c++) {
          if (adj(a, c) && adj(b, c)) faces.push([a, b, c]);
        }
      }
    }

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

    let theta = 0.6;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36;
      const tiltX = 0.38;
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      if (!reduce) theta += 0.0022;
      const cosA = Math.cos(theta);
      const sinA = Math.sin(theta);

      const proj = verts.map((v) => {
        const x = v.x * cosA + v.z * sinA;
        const z1 = -v.x * sinA + v.z * cosA;
        const y = v.y * cosX - z1 * sinX;
        const z = v.y * sinX + z1 * cosX;
        const k = 2.6 / (2.6 - z);
        return { sx: cx + x * R * k, sy: cy + y * R * k, z, k };
      });

      // faces — subtle depth fill, back to front
      const order = faces
        .map((f, i) => ({ i, z: (proj[f[0]].z + proj[f[1]].z + proj[f[2]].z) / 3 }))
        .sort((a, b) => a.z - b.z);
      for (const { i, z } of order) {
        const [a, b, c] = faces[i];
        const A = proj[a];
        const B = proj[b];
        const C = proj[c];
        const d = (z + 1) / 2;
        ctx.fillStyle = `rgba(139, 58, 42, ${0.02 + 0.06 * d})`;
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        ctx.lineTo(B.sx, B.sy);
        ctx.lineTo(C.sx, C.sy);
        ctx.closePath();
        ctx.fill();
      }

      // edges — brighter toward the viewer
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const A = proj[a];
        const B = proj[b];
        const d = ((A.z + B.z) / 2 + 1) / 2;
        ctx.strokeStyle = `rgba(180, 71, 47, ${0.1 + 0.38 * d})`;
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        ctx.lineTo(B.sx, B.sy);
        ctx.stroke();
      }

      // glowing facets on the lit (left) side
      ctx.save();
      ctx.shadowColor = 'rgba(180, 71, 47, 0.9)';
      for (const [a, b, c] of faces) {
        const A = proj[a];
        const B = proj[b];
        const C = proj[c];
        const nz = (A.z + B.z + C.z) / 3;
        const nx = (A.sx + B.sx + C.sx) / 3;
        if (nz > 0.1 && nx < cx) {
          ctx.fillStyle = `rgba(180, 71, 47, ${0.12 + 0.1 * Math.abs(Math.sin(theta * 3))})`;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.moveTo(A.sx, A.sy);
          ctx.lineTo(B.sx, B.sy);
          ctx.lineTo(C.sx, C.sy);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    if (!reduce) raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="hud__sphere" aria-hidden="true" />;
}