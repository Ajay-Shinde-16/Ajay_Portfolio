import { useState } from "react";
import { PROFILE } from "../data/content";
import Modal from "./Modal";

// Fixed bottom-right button. Opens a modal that previews the résumé PDF inline,
// with a direct download action.
export default function ResumeFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="resume-fab" onClick={() => setOpen(true)} aria-label="Preview résumé">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 15h6M9 11h2" />
        </svg>
        <span>Résumé</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} label="Résumé preview" wide>
        <div className="resume-modal">
          <div className="rm-head">
            <h3>Résumé</h3>
            <a className="btn btn-solid" href={PROFILE.resume} download>Download PDF ↓</a>
          </div>
          <object data={PROFILE.resume} type="application/pdf" className="rm-frame" aria-label="Résumé PDF preview">
            <p className="rm-fallback">
              Your browser can't display the PDF inline.{" "}
              <a href={PROFILE.resume} target="_blank" rel="noreferrer">Open it in a new tab ↗</a>
            </p>
          </object>
        </div>
      </Modal>
    </>
  );
}
