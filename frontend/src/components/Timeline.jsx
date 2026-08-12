import { TIMELINE, CERTS } from "../data/content";

function TypeIcon({ type }) {
  if (type === "Work") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    );
  }
  // Education
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
    </svg>
  );
}

export default function Timeline() {
  return (
    <section id="journey" className="tint">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="idx">04</span><h2>Experience &amp; education</h2><span className="rule" />
        </div>
        <div className="timeline">
          {TIMELINE.map((j) => (
            <div className="tl-item reveal" key={j.title}>
              <span className="node"><TypeIcon type={j.type} /></span>
              <span className="type">{j.type}</span>
              <div className="when">{j.when}</div>
              <h3>{j.title}</h3>
              <div className="org">{j.org}</div>
              <p>{j.desc}</p>
            </div>
          ))}
        </div>
        <div className="certs">
          {CERTS.map((c) => (
            <div className="cert reveal" key={c.title}>
              <div className="ct">{c.title}</div>
              <div className="co">{c.org}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}