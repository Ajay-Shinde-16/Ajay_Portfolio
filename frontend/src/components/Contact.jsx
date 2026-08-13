import { useState } from "react";
import { PROFILE } from "../data/content";
import { IconMail, IconPhone, IconPin, IconResume, IconCopy, IconCheck, socialIcon } from "./Icons";

// See Icons.jsx notes — paste your Web3Forms access key here (or set VITE_WEB3FORMS_KEY).
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "PASTE-YOUR-WEB3FORMS-ACCESS-KEY-HERE";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(""); // "email" | "phone" | ""

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function copy(text, which) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(""), 1800);
    } catch { /* clipboard unavailable */ }
  }

  async function submit(e) {
    e.preventDefault();
    if (form.website) { setStatus("ok"); setForm({ name: "", email: "", message: "", website: "" }); return; }
    setStatus("sending"); setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio contact — ${form.name}`,
          from_name: "Portfolio Contact",
          name: form.name, email: form.email, message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) { setStatus("ok"); setForm({ name: "", email: "", message: "", website: "" }); }
      else { setStatus("error"); setError(data.message || "Submission failed."); }
    } catch (err) {
      setStatus("error"); setError(err.message || "Something went wrong.");
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <p className="mono reveal">// let's build something</p>
        <h2 className="reveal">Have a role in mind?<br /><span className="grad">Let's talk.</span></h2>
        <p className="contact-lede reveal">
          Drop a message below, or reach me directly — I usually reply within a day.
        </p>

        <form className="contact-form reveal" onSubmit={submit}>
          <div className="cf-row">
            <input type="text" placeholder="Your name" required value={form.name} onChange={update("name")} aria-label="Your name" />
            <input type="email" placeholder="Your email" required value={form.email} onChange={update("email")} aria-label="Your email" />
          </div>
          <textarea rows="4" placeholder="Your message" required value={form.message} onChange={update("message")} aria-label="Your message" />
          <input type="text" name="website" tabIndex="-1" autoComplete="off" className="hp-field" aria-hidden="true"
                 value={form.website} onChange={update("website")} />
          <button className="btn btn-solid" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {status === "ok" && <p className="cf-note ok">Thanks — your message was sent. I'll be in touch soon.</p>}
          {status === "error" && <p className="cf-note err">Couldn't send ({error}). You can copy my email below.</p>}
        </form>

        {/* Three info cards */}
        <div className="contact-cards reveal">
          <div className="c-card">
            <span className="c-ico"><IconMail /></span>
            <span className="c-label">Email</span>
            <a className="c-val" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <button className={`copy-pill${copied === "email" ? " done" : ""}`} onClick={() => copy(PROFILE.email, "email")} aria-label="Copy email address">
              {copied === "email" ? <><IconCheck /> Copied!</> : <><IconCopy /> Copy</>}
            </button>
          </div>
          <div className="c-card">
            <span className="c-ico"><IconPhone /></span>
            <span className="c-label">Phone</span>
            <a className="c-val" href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}>{PROFILE.phone}</a>
            <button className={`copy-pill${copied === "phone" ? " done" : ""}`} onClick={() => copy(PROFILE.phone, "phone")} aria-label="Copy phone number">
              {copied === "phone" ? <><IconCheck /> Copied!</> : <><IconCopy /> Copy</>}
            </button>
          </div>
          <div className="c-card">
            <span className="c-ico"><IconPin /></span>
            <span className="c-label">Location</span>
            <span className="c-val">{PROFILE.location}</span>
            <span className="c-sub">Open to remote &amp; on-site</span>
          </div>
        </div>

        {/* Social links with icons */}
        <div className="socials-row reveal">
          {PROFILE.socials.map((soc) => (
            <a key={soc.label} className="soc-btn" href={soc.url} target="_blank" rel="noreferrer">
              {socialIcon(soc.label)}<span>{soc.label}</span>
            </a>
          ))}
          <a className="soc-btn accent" href={PROFILE.resume} target="_blank" rel="noreferrer">
            <IconResume /><span>Résumé</span>
          </a>
        </div>
      </div>
    </section>
  );
}