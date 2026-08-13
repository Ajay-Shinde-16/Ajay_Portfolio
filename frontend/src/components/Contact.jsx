import { useState } from "react";
import { PROFILE } from "../data/content";

// ── Web3Forms ────────────────────────────────────────────────────────────────
// 1. Go to https://web3forms.com  →  enter Ajay.shinde1606@gmail.com  →  they
//    email you an Access Key.
// 2. Paste it below (or set VITE_WEB3FORMS_KEY in Vercel and it'll be picked up).
// Web3Forms sends from its own trusted domain and sets the visitor's address as
// Reply-To, so the email reliably lands in your inbox and "Reply" goes to them.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "d949f255-d4ff-4752-96f8-8c53ac9299bb";

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
    // Honeypot: if the hidden field is filled, silently pretend success (it's a bot).
    if (form.website) { setStatus("ok"); setForm({ name: "", email: "", message: "", website: "" }); return; }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio contact — ${form.name}`,
          from_name: "Portfolio Contact",
          name: form.name,
          email: form.email,     // becomes the Reply-To, so you reply to the visitor
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("ok");
        setForm({ name: "", email: "", message: "", website: "" });
      } else {
        setStatus("error");
        setError(data.message || "Submission failed.");
      }
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
          {status === "error" && <p className="cf-note err">Couldn't send ({error}). You can copy my email below.</p>}
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