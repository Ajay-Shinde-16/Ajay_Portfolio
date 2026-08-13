import { useEffect, useRef } from "react";

// Hand-built rotating icosahedron wireframe — no libraries.
// Auto-rotates, follows the pointer, recolors with the theme, pauses when
// off-screen, and renders a single static frame under reduced-motion.
export default function Icosahedron({ theme }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const light = theme === "light";
    const line = (a) => (light ? `rgba(85,96,216,${a})` : `rgba(124,140,255,${a})`);
    const node = (a) => (light ? `rgba(176,119,20,${a})` : `rgba(242,184,75,${a})`);
    const glowCol = light ? "rgba(176,119,20,.5)" : "rgba(242,184,75,.8)";

    let W, H, DPR, raf, running = false;
    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (reduce) draw();
    }

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

    let ry = 0, rx = 0.4, tRX = 0.4, tRY = 0;
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      tRY = ((e.clientX - r.left) / r.width - 0.5) * 1.4;
      tRX = 0.4 + ((e.clientY - r.top) / r.height - 0.5) * 1.2;
    };
    const onLeave = () => { tRY = 0; tRX = 0.4; };
    const onTouch = (e) => {
      const tc = e.touches[0], r = stage.getBoundingClientRect();
      tRY = ((tc.clientX - r.left) / r.width - 0.5) * 1.6;
      tRX = 0.4 + ((tc.clientY - r.top) / r.height - 0.5) * 1.3;
    };
    if (!reduce) {
      stage.addEventListener("mousemove", onMove);
      stage.addEventListener("mouseleave", onLeave);
      stage.addEventListener("touchmove", onTouch, { passive: true });
    }

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
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.34, FL = 2.6;
      const pts = V.map((v) => {
        const p = rot(v, rx, ry + tRY);
        const k = FL / (FL - p[2]);
        return { x: cx + p[0] * R * k, y: cy + p[1] * R * k, z: p[2] };
      });
      E.forEach(([a, b]) => {
        const pa = pts[a], pb = pts[b], d = (pa.z + pb.z) / 2;
        ctx.strokeStyle = line(0.22 + (d + 1) / 2 * 0.6);
        ctx.lineWidth = (d + 1.4) * 0.8;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
      });
      pts.forEach((p) => {
        const g = (p.z + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 + g * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = node(0.35 + g * 0.65);
        ctx.shadowColor = glowCol; ctx.shadowBlur = g * 10;
        ctx.fill(); ctx.shadowBlur = 0;
      });
    }

    function frame() {
      ry += 0.004;
      rx += (tRX - rx) * 0.06;
      draw();
      raf = requestAnimationFrame(frame);
    }
    function start() { if (running || reduce) return; running = true; frame(); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    size();
    window.addEventListener("resize", size);

    // Only animate while the hero is on screen (saves CPU/battery).
    const io = new IntersectionObserver(
      (es) => { es[0].isIntersecting ? start() : stop(); },
      { threshold: 0.01 }
    );
    io.observe(stage);

    if (reduce) draw(); else start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", size);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("touchmove", onTouch);
    };
  }, [theme]);

  return (
    <div className="stage" ref={stageRef}>
      <div className="stage-frame" />
      <span className="corner tl" /><span className="corner tr" />
      <span className="corner bl" /><span className="corner br" />
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="stage-tag">render: <b>icosahedron.wire</b> · move to rotate</span>
    </div>
  );
}