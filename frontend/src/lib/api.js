// Base URL of the Spring Boot backend.
// Override in production with a .env file: VITE_API_URL=https://your-api.com
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/api/projects`);
  if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
  return res.json();
}

export async function sendContact({ name, email, message }) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).message || "";
    } catch (_) {}
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json();
}
