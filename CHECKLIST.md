# Final checklist — before you share the link

These are the only things left, and they're things only you can do (I couldn't
from a sandbox). None require touching component code.

## Must do
- [ ] **Project screenshots.** Cards currently show a styled placeholder cover.
      Add a real screenshot per project: give the project an `image` field in
      `frontend/src/data/projects.json` (and the identical
      `backend/src/main/resources/projects.json`), e.g.
      `"image": "/shots/skillbridge.png"`, and drop the file in `frontend/public/shots/`.
- [ ] **GitHub links.** Both `code` links point to your profile
      (`github.com/Ajay-Shinde-16`). Point each at the actual repo.
- [ ] **About text.** The two "About" paragraphs are my wording — rewrite them
      in your voice (`frontend/src/data/content.js` → `ABOUT`).
- [ ] **Your domain.** After deploying, set the real URL in:
      - `frontend/index.html` → `og:url` and the JSON-LD `url`
      - `frontend/public/robots.txt` → `Sitemap:`
      - `frontend/public/sitemap.xml` → `<loc>`

## Should do
- [ ] **Verify architecture diagrams.** Open each project card → check the
      `Client → API → DB` flow and services match reality
      (`projects.json` → each project's `architecture`).
- [ ] **Run the backend test:** `cd backend && mvn test` (couldn't run here —
      Maven Central is blocked in the build sandbox).
- [ ] **Set secrets in production:** `APP_ADMIN_TOKEN`, and `MAIL_USERNAME` /
      `MAIL_PASSWORD` if you want contact emails (see README).
- [ ] **Add your CORS origin:** put the deployed frontend URL in
      `backend/.../application.properties` → `app.cors.allowed-origins`.

## Nice to have (optional)
- [ ] Add a 3rd/4th project — the filter bar shines with more projects.
- [ ] Replace the placeholder social-preview if you rebrand.

Everything else — theme toggle, animated stats, project modals with architecture
diagrams, contact form + email + spam protection, copy-to-clipboard, floating
résumé preview, scroll-spy nav, SEO/manifest, accessibility — is done and tested
to build cleanly.
