import { useEffect, useState } from "react";
import { NAV, PROFILE } from "../data/content";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

export default function Nav({ theme, onToggle }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape and return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.querySelector(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Scroll-spy: highlight the nav link for the section currently in view.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="wrap">
        <nav aria-label="Primary">
          <a href="#top" className="logo"><Logo size={26} />{PROFILE.logo}<span className="dot">.</span>dev</a>
          <div className={`nav-links${menuOpen ? " open" : ""}`}>
            {NAV.map((n) => {
              const isActive = active === n.href.slice(1);
              return (
                <a
                  key={n.href}
                  href={n.href}
                  className={isActive ? "active" : ""}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="num">{n.num}</span>{n.label}
                </a>
              );
            })}
            <a href={PROFILE.resume} className="btn btn-solid" target="_blank" rel="noreferrer">résumé</a>
          </div>
          <div className="nav-right">
            <ThemeToggle theme={theme} onToggle={onToggle} />
            <button
              className="menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}