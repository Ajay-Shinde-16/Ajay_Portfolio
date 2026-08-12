import { useEffect, useRef } from "react";

// Builds vertices + edges for each supported shape. All hand-generated,
// normalized to roughly unit radius. No 3D libraries.
function buildShape(shape) {
  if (shape === "torusknot") {
    const P = 2, Q = 3, N = 200;
    let V = [];
    for (let i = 0; i < N; i++) {
      const u = (i / N) * Math.PI * 2;
      const r = Math.cos(Q * u) + 2;
      V.push([r * Math.cos(P * u), r * Math.sin(P * u), -Math.sin(Q * u)]);
    }
    let mx = 0;
    V.forEach((p) => { mx = Math.max(mx, Math.hypot(p[0], p[1], p[2])); });
    V = V.map((p) => p.map((x) => x / mx));
    const E = [];
    for (let i = 0; i < N; i++) E.push([i, (i + 1) % N]);
    return { V, E, nodeStep: 12 };
  }

  if (shape === "sphere") {
    const nLat = 6, nLon = 12;
    const V = [];
    const idx = (a, b) => a * nLon + b;
    for (let a = 0; a < nLat; a++) {
      const theta = Math.PI * (a / (nLat - 1));
      for (let b = 0; b < nLon; b++) {
        const phi = (2 * Math.PI * b) / nLon;
        V.push([Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)]);
      }
    }
    const E = [];
    for (let a = 0; a < nLat; a++)
      for (let b = 0; b < nLon; b++) {
        if (a < nLat - 1) E.push([idx(a, b), idx(a + 1, b)]); // meridians
        E.push([idx(a, b), idx(a, (b + 1) % nLon)]);          // latitude rings
      }
    return { V, E, nodeStep: 0 };
  }

  // icosahedron (default)
  const t = (1 + Math.sqrt(5)) / 2;
  const V = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map((p) => { const l = Math.hypot(...p); return p.map((x) => x / l); });
  const E = [];
  for (let i = 0; i < V.length; i++)
    for (let j = i + 1; j < V.length; j++) {
      const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]);
      if (d < 1.2) E.push([i, j]);
    }
  return { V, E, nodeStep: 1 };
}

// A small auto-rotating wireframe for a project card. Theme-aware, pauses when
// off-screen, and respects reduced-motion.
export default function ProjectShape({ shape = "icosahedron", theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const light = theme === "light";
    const line = (a) => (light ? `rgba(85,96,216,${a})` : `rgba(124,140,255,${a})`);
    const node = (a) => (light ? `rgba(176,119,20,${a})` : `rgba(242,184,75,${a})`);
    const glowCol = light ? "rgba(176,119,20,.5)" : "rgba(242,184,75,.8)";

    let W, H, DPR, raf, visible = true;
    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    const { V, E, nodeStep } = buildShape(shape);
    let ry = 0.6;
    const rx = 0.5;
    const rot = (p, ax, ay) => {
      let [x, y, z] = p;
      let c = Math.cos(ay), s = Math.sin(ay);
      [x, z] = [x * c - z * s, x * s + z * c];
      c = Math.cos(ax); s = Math.sin(ax);
      [y, z] = [y * c - z * s, y * s + z * c];
      return [x, y, z];
    };

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.36, FL = 3;
      const pts = V.map((v) => {
        const p = rot(v, rx, ry);
        const k = FL / (FL - p[2]);
        return { x: cx + p[0] * R * k, y: cy + p[1] * R * k, z: p[2] };
      });
      E.forEach(([a, b]) => {
        const pa = pts[a], pb = pts[b], d = (pa.z + pb.z) / 2;
        ctx.strokeStyle = line(0.2 + (d + 1) / 2 * 0.6);
        ctx.lineWidth = 0.6 + (d + 1) / 2 * 1.1;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
      });
      if (nodeStep > 0) {
        pts.forEach((p, i) => {
          if (i % nodeStep !== 0) return;
          const g = (p.z + 1) / 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2 + g * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = node(0.35 + g * 0.6);
          ctx.shadowColor = glowCol; ctx.shadowBlur = g * 8;
          ctx.fill(); ctx.shadowBlur = 0;
        });
      }
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      ry += 0.006;
      draw();
    }

    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.05 });
    io.observe(canvas);

    if (reduce) draw();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      io.disconnect();
    };
  }, [shape, theme]);

  return <canvas ref={canvasRef} className="p-canvas" aria-hidden="true" />;
}