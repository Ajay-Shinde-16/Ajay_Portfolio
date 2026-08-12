import Modal from "./Modal";

// Renders the horizontal "Client → API → DB" flow plus supporting services.
function ArchitectureDiagram({ architecture }) {
  if (!architecture) return null;
  const flow = architecture.flow || [];
  const services = architecture.services || [];
  return (
    <div className="arch">
      <div className="arch-flow">
        {flow.map((node, i) => (
          <div className="arch-node-wrap" key={node}>
            <div className="arch-node">{node}</div>
            {i < flow.length - 1 && <span className="arch-arrow">→</span>}
          </div>
        ))}
      </div>
      {services.length > 0 && (
        <div className="arch-services">
          {services.map((s) => (
            <span className="arch-service" key={s}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectModal({ project, onClose }) {
  const open = Boolean(project);
  return (
    <Modal open={open} onClose={onClose} label={project ? `${project.name} details` : ""} wide>
      {project && (
        <div className="pm">
          <div className="pm-head">
            <h3>{project.name}{project.liveLabel && <span className="live">Live</span>}</h3>
            <div className="p-links">
              {project.live && <a className="primary" href={project.live} target="_blank" rel="noreferrer">Live demo ↗</a>}
              {project.code && <a href={project.code} target="_blank" rel="noreferrer">GitHub ↗</a>}
            </div>
          </div>
          <p className="pm-blurb">{project.blurb}</p>

          <h4 className="pm-label">System architecture</h4>
          <ArchitectureDiagram architecture={project.architecture} />

          <h4 className="pm-label">Technical highlights</h4>
          <div className="p-metrics">
            {project.metrics.map((m, i) => <div className="p-metric" key={i}>{m}</div>)}
          </div>

          <div className="ptech pm-tech">
            {project.tech.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      )}
    </Modal>
  );
}
