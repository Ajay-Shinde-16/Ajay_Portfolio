import { PROFILE } from "../data/content";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <span>© 2026 {PROFILE.name} — built with React &amp; Spring Boot.</span>
          <span>Designed &amp; coded from scratch ✦</span>
        </div>
      </div>
    </footer>
  );
}
