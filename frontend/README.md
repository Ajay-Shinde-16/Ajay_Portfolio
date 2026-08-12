# Frontend — React + Vite

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Structure

```
src/
├── App.jsx              layout: assembles all sections
├── main.jsx            React entry point
├── index.css          the "Dusk Terminal" design system
├── data/content.js    ← edit your content here
├── hooks/             useTheme (persisted), useReveal (scroll animations)
├── lib/api.js         talks to the Spring Boot backend
├── assets/            your photo
└── components/        Nav, Hero, Icosahedron, Stats, About, Skills,
                       Projects, Timeline, Contact, Footer
```

Set `VITE_API_URL` in a `.env` file to point at your deployed backend
(see `.env.example`).
