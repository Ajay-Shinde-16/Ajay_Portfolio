import { useCallback, useEffect, useMemo, useState } from "react";
import { PROJECTS } from "../data/content";
import { fetchProjects } from "../lib/api";
import ProjectModal from "./ProjectModal";
import ProjectShape from "./ProjectShape";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="sk-media shimmer" />
      <div className="sk-body">
        <div className="sk-line shimmer" style={{ width: "45%", height: 22 }} />
        <div className="sk-line shimmer" style={{ width: "85%" }} />
        <div className="sk-line shimmer" style={{ width: "70%" }} />
        <div className="sk-line shimmer" style={{ width: "30%", marginTop: 10 }} />
      </div>
    </div>
  );
}

export default function Projects({ theme }) {
  const [projects, setProjects] = useState(PROJECTS);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const load = useCallback(() => {
    setStatus("loading");
    fetchProjects()
      .then((data) => {
        if (Array.isArray(data) && data.length) setProjects(data);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filters = useMemo(() => {
    const tags = new Set();
    projects.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return ["All", ...tags];
  }, [projects]);

  const visible = filter === "All"
    ? projects
    : projects.filter((p) => (p.tags || []).includes(filter));

  const openProject = (p) => setSelected(p);
  const onKeyOpen = (e, p) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(p); }
  };

  // Only show skeletons if we truly have nothing yet (API-only setups).
  const showSkeletons = status === "loading" && projects.length === 0;

  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="idx">03</span><h2>Featured projects</h2><span className="rule" />
        </div>

        {filters.length > 2 && projects.length > 0 && (
          <div className="filters reveal" role="group" aria-label="Filter projects by technology">
            {filters.map((f) => (
              <button
                key={f}
                className={`filter-btn${filter === f ? " active" : ""}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {showSkeletons ? (
          <div className="projects">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : (
          <div className="projects">
            {visible.map((p) => {
              const domain = (p.live || "").replace(/^https?:\/\//, "");
              const initials = p.name.replace(/[^A-Z]/g, "").slice(0, 2) || p.name.slice(0, 2).toUpperCase();
              return (
                <div
                  className="project reveal in"
                  key={p.name}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name} — view details`}
                  onClick={() => openProject(p)}
                  onKeyDown={(e) => onKeyOpen(e, p)}
                >
                  <div className="p-media">
                    {p.shape ? (
                      <ProjectShape shape={p.shape} theme={theme} />
                    ) : p.image ? (
                      <img src={p.image} alt={`${p.name} cover`} />
                    ) : (
                      <div className="p-shot">
                        <div className="p-shot-bar">
                          <span className="d" style={{ background: "#F2B84B" }} />
                          <span className="d" style={{ background: "#7C8CFF" }} />
                          <span className="d" style={{ background: "#7CE0A0" }} />
                          {domain && <span className="p-url">{domain}</span>}
                        </div>
                        <div className="p-shot-body"><span className="big">{initials}</span><span className="nm">{p.name}</span></div>
                      </div>
                    )}
                  </div>
                  <div className="p-content">
                    <div className="p-top">
                      <h3>{p.name}{p.liveLabel && <span className="live">Live</span>}</h3>
                      <div className="p-links" onClick={(e) => e.stopPropagation()}>
                        {p.live && <a className="primary" href={p.live} target="_blank" rel="noreferrer">Live demo ↗</a>}
                        {p.code && <a href={p.code} target="_blank" rel="noreferrer">GitHub ↗</a>}
                      </div>
                    </div>
                    <p className="p-blurb">{p.blurb}</p>
                    {p.impact && <p className="p-impact">{p.impact}</p>}
                    {p.tags && <div className="p-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>}
                    <span className="p-more">View architecture &amp; highlights →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* API status: honest about the free-tier backend waking up */}
        {status === "loading" && projects.length > 0 && (
          <div className="proj-status"><span className="dotp" /> Waking up the backend… (free tier, ~30s)</div>
        )}
        {status === "ok" && (
          <div className="proj-status" style={{ opacity: 0.6 }}>↳ served live from Spring Boot API</div>
        )}
        {status === "error" && (
          <div className="proj-status">
            Couldn't reach the API (it may be waking up) — showing saved copy.
            <button className="retry-btn" onClick={load}>Retry</button>
          </div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}