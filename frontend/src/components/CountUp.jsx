import { useEffect, useRef, useState } from "react";

function format(n, decimals, comma) {
  let s = decimals ? n.toFixed(decimals) : String(Math.round(n));
  if (comma) s = Number(s).toLocaleString("en-US");
  return s;
}

// Counts from 0 to `value` once the element scrolls into view.
export default function CountUp({ value, suffix = "", prefix = "", decimals = 0, comma = false, duration = 1400 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(comma || decimals ? format(0, decimals, comma) : "0");

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(format(value, decimals, comma)); return; }

    let raf, start;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect();
          const step = (t) => {
            if (start == null) start = t;
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setDisplay(format(value * eased, decimals, comma));
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (el) io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, decimals, comma, duration]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}
