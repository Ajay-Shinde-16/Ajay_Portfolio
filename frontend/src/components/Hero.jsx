import { useEffect, useState } from "react";
import { PROFILE, ROLES } from "../data/content";
import Icosahedron from "./Icosahedron";

function TypedRole() {
  const [text, setText] = useState("");
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setText(ROLES[0]); return; }
    let r = 0, c = 0, del = false, timer;
    function tick() {
      const w = ROLES[r];
      setText(del ? w.slice(0, c--) : w.slice(0, c++));
      let d = del ? 45 : 85;
      if (!del && c > w.length) { del = true; d = 1400; }
      else if (del && c < 0) { del = false; r = (r + 1) % ROLES.length; c = 0; d = 220; }
      timer = setTimeout(tick, d);
    }
    tick();
    return () => clearTimeout(timer);
  }, []);
  return <p className="role"><span>{text}</span><span className="caret">▊</span></p>;
}

export default function Hero({ theme }) {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">
              <span className="pulse" />
              <span className="mono">{PROFILE.availability}</span>
            </span>
            <h1 className="title">
              {PROFILE.name}<br />
              <span className="grad">{PROFILE.tagline1}<br />{PROFILE.tagline2}</span>
            </h1>
            <TypedRole />
            <p className="lede">{PROFILE.lede}</p>
            <div className="hero-cta">
              <a href="#work" className="btn btn-solid">View my work</a>
              <a href={PROFILE.resume} className="btn" target="_blank" rel="noreferrer">Download résumé</a>
              <a href="#contact" className="btn">Get in touch</a>
            </div>
            <div className="socials">
              {PROFILE.socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
              ))}
            </div>
          </div>
          <Icosahedron theme={theme} />
        </div>
      </div>
    </section>
  );
}
