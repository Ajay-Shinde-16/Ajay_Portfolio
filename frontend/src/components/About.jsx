import { ABOUT, NOW } from "../data/content";
import portrait from "../assets/ajay-portrait.jpg";

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="idx">01</span><h2>About</h2><span className="rule" />
        </div>
        <div className="about-grid">
          <div className="portrait reveal">
            <img src={portrait} alt="Ajay Shinde" />
            <span className="badge">Pune, IN</span>
          </div>
          <div className="about-body reveal">
            <span className="status-badge"><span className="gdot" />Open to full-time roles · 2026</span>
            {ABOUT.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            <div className="now-list">
              {NOW.map((n) => (
                <div className="now-item" key={n.k}>
                  <span className="k">{n.k}</span><span className="v">{n.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}