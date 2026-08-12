<<<<<<< HEAD
# Ajay Shinde — Portfolio (React + Spring Boot)

A full-stack developer portfolio.

- **Frontend:** React 18 + Vite. Hand-built rotating 3D icosahedron (no libraries), light/dark theme with persistence, scroll animations, and a working contact form.
- **Backend:** Java 17 + Spring Boot 3. Serves the projects list and stores contact-form messages in an H2 database.

```
portfolio/
├── frontend/     React + Vite app
└── backend/      Spring Boot API
```

---

## 1. Run the backend (Spring Boot)

Requirements: **JDK 17+** and **Maven** (or use the `mvnw` wrapper if you add one).

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

| Method | Endpoint         | Purpose                              |
|--------|------------------|--------------------------------------|
| GET    | `/api/projects`  | Returns the featured projects (JSON) |
| POST   | `/api/contact`   | Saves a contact-form message         |
| GET    | `/api/contact`   | Lists received messages (demo/admin) |
| GET    | `/h2-console`    | Browse the in-memory database        |

The database is in-memory, so messages reset on restart. To keep them, see the
note at the bottom of `backend/src/main/resources/application.properties`.

## 2. Run the frontend (React + Vite)

Requirements: **Node.js 18+**.

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

- The projects section fetches from the backend and falls back to local data if
  the API isn't running, so the site works standalone too.
- The contact form POSTs to the backend; if the API is down it shows a friendly
  message pointing to the email address.

To point the frontend at a deployed API, copy `.env.example` to `.env` and set
`VITE_API_URL`.

## 3. Build for production

```bash
cd frontend && npm run build     # outputs to frontend/dist
cd backend && mvn clean package  # outputs a runnable jar in backend/target
```

---

## Editing your content

Almost everything the site shows lives in **`frontend/src/data/content.js`** —
your name, links, skills, projects, experience, and stats. Edit that one file
and the whole site updates.

The projects also come from the backend (`backend/.../service/ProjectService.java`);
keep the two in sync, or delete the backend fetch in `Projects.jsx` if you'd
rather drive everything from `content.js`.

Your résumé lives at `frontend/public/AjayShinde_CV.pdf` and your photo at
`frontend/src/assets/`.

---

## Deploying

- **Frontend** → Vercel / Netlify (static build from `frontend`).
- **Backend** → Render / Railway / Fly.io (Spring Boot jar). Add your deployed
  frontend URL to the allowed origins in `backend/.../config/WebConfig.java`.

Built from scratch — no templates.

---

## Contact form — how it works now

- Submissions are validated, stored in H2 (file-backed, survives restarts), and
  you get an **email notification** (once SMTP is configured — see below).
- A **honeypot** field and a **per-IP rate limit** (5 / 10 min) block bots.
- `GET /api/contact` is **token-protected** — pass header `X-Admin-Token: <your token>`.
  Set the token via `APP_ADMIN_TOKEN` (defaults to `change-me`).

### Enabling email (Gmail example)
1. Google Account → Security → App passwords → generate one for "Mail".
2. Run the backend with:
   ```bash
   MAIL_USERNAME=you@gmail.com MAIL_PASSWORD=your-app-password \
   APP_ADMIN_TOKEN=some-long-secret mvn spring-boot:run
   ```
Without these, the app still runs and simply logs each new message.

---

## Deploying

**Frontend → Vercel**
- Import the `frontend` folder. `vercel.json` is already set up (Vite + SPA rewrite).
- Add an env var `VITE_API_URL` pointing to your deployed backend.

**Backend → Render / Railway / Fly.io (Docker)**
```bash
cd backend
docker build -t portfolio-backend .
docker run -p 8080:8080 -e APP_ADMIN_TOKEN=secret portfolio-backend
```
Then add your deployed frontend URL to `app.cors.allowed-origins` (env or properties).

### Checklist before sharing the link
- [ ] Set `og:url` in `frontend/index.html` to your real domain (so previews link correctly).
- [ ] Point both project **GitHub** buttons to the actual repos (currently your profile).
- [ ] Replace the project cover art with real screenshots (give each project an `image`).
- [ ] Read through the About text and make it your own voice.
=======
# Ajay_Portfolio
>>>>>>> 26387ac5fecb66b746e55329b7472aa7b5511768
