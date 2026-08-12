import { SKILLS } from "../data/content";

export default function Skills() {
  return (
    <section id="skills" className="tint">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="idx">02</span><h2>Technical skills</h2><span className="rule" />
        </div>
        <div className="skills-grid">
          {SKILLS.map((s) => (
            <div className="skill-card reveal" key={s.title}>
              <div className="cat"><span className="icn">{s.icon}</span><h3>{s.title}</h3></div>
              <div className="chips">
                {s.items.map((it) => <span className="chip" key={it}>{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
