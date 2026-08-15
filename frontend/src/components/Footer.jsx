import { PROFILE, NAV } from "../data/content";
import Logo from "./Logo";
import { socialIcon, IconResume } from "./Icons";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        {/* Call to action */}
        <div className="foot-cta">
          <div className="foot-cta-text">
            <span className="foot-avail"><span className="gdot" />{PROFILE.availability}</span>
            <h3>Let's build something great.</h3>
            <p>Have a role or project in mind? I usually reply within a day.</p>
          </div>
          <a className="btn btn-solid foot-cta-btn" href="#contact">Get in touch →</a>
        </div>

        {/* Brand · nav · socials */}
        <div className="foot-mid">
          <a href="#top" className="foot-logo"><Logo size={26} />{PROFILE.logo}<span className="dot">.</span>dev</a>
          <nav className="foot-links" aria-label="Footer navigation">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
            <a href="#contact">contact</a>
          </nav>
          <div className="foot-soc">
            {PROFILE.socials.map((soc) => (
              <a key={soc.label} href={soc.url} target="_blank" rel="noreferrer" aria-label={soc.label} title={soc.label}>
                {socialIcon(soc.label)}
              </a>
            ))}
            <a href={PROFILE.resume} target="_blank" rel="noreferrer" aria-label="Résumé" title="Résumé"><IconResume /></a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 {PROFILE.name}. All rights reserved.</span>
          <a href="#top" className="foot-top">Back to top ↑</a>
          <span>Built with React &amp; Spring Boot ✦</span>
        </div>
      </div>
    </footer>
  );
}