import { PROFILE, NAV } from "../data/content";
import Logo from "./Logo";
import { socialIcon, IconResume } from "./Icons";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a href="#top" className="foot-logo"><Logo size={24} />{PROFILE.logo}<span className="dot">.</span>dev</a>
            <p className="foot-tag">{PROFILE.tagline1} {PROFILE.tagline2}</p>
            <div className="foot-soc">
              {PROFILE.socials.map((soc) => (
                <a key={soc.label} href={soc.url} target="_blank" rel="noreferrer" aria-label={soc.label} title={soc.label}>
                  {socialIcon(soc.label)}
                </a>
              ))}
              <a href={PROFILE.resume} target="_blank" rel="noreferrer" aria-label="Résumé" title="Résumé"><IconResume /></a>
            </div>
          </div>
          <nav className="foot-nav" aria-label="Footer navigation">
            <span className="h">Navigate</span>
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
            <a href="#contact">contact</a>
          </nav>
        </div>
        <div className="foot-bottom">
          <span>© 2026 {PROFILE.name}. All rights reserved.</span>
          <span>Built with React &amp; Spring Boot ✦</span>
        </div>
      </div>
    </footer>
  );
}