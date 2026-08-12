import { useState } from "react";
import { PROFILE } from "../data/content";
import { sendContact } from "../lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copied to clipboard`);
    } catch {
      setToast(`Couldn't copy — ${text}`);
    }
    setTimeout(() => setToast(""), 2200);
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await sendContact(form);
      setStatus("ok");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <p className="mono reveal">// let's build something</p>
        <h2 className="reveal">Have a role in mind?<br /><span className="grad">Let's talk.</span></h2>

        <form className="contact-form reveal" onSubmit={submit}>
          <div className="cf-row">
            <input type="text" placeholder="Your name" required value={form.name} onChange={update("name")} aria-label="Your name" />
            <input type="email" placeholder="Your email" required value={form.email} onChange={update("email")} aria-label="Your email" />
          </div>
          <textarea rows="4" placeholder="Your message" required value={form.message} onChange={update("message")} aria-label="Your message" />
          {/* Honeypot: hidden from humans, catches bots. Do not remove. */}
          <input type="text" name="website" tabIndex="-1" autoComplete="off" className="hp-field" aria-hidden="true"
                 value={form.website} onChange={update("website")} />
          <button className="btn btn-solid" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {status === "ok" && <p className="cf-note ok">Thanks — your message was sent. I'll be in touch soon.</p>}
          {status === "error" && <p className="cf-note err">Couldn't reach the server ({error}). You can copy my email below.</p>}
        </form>

        {/* Quick one-click copy for recruiters in a hurry */}
        <div className="contact-quick reveal">
          <div className="cq-item">
            <a href={`mailto:${PROFILE.email}`} className="mail">{PROFILE.email}</a>
            <button className="copy-btn" onClick={() => copy(PROFILE.email, "Email")} aria-label="Copy email address">
              <CopyIcon /> Copy
            </button>
          </div>
          <div className="cq-item">
            <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} className="mail">{PROFILE.phone}</a>
            <button className="copy-btn" onClick={() => copy(PROFILE.phone, "Phone")} aria-label="Copy phone number">
              <CopyIcon /> Copy
            </button>
          </div>
        </div>

        <p className="phone reveal">{PROFILE.location}</p>
        <div className="contact-socials reveal">
          {PROFILE.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
          ))}
          <a href={PROFILE.resume} target="_blank" rel="noreferrer">Résumé ↗</a>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </section>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
