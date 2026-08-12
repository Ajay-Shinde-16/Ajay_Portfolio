import { TIMELINE, CERTS } from "../data/content";

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
              <span className="node" />
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
