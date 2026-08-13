// ============================================================================
//  Edit your content here — everything the site renders comes from this file.
// ============================================================================

export const PROFILE = {
  name: "Ajay Shinde",
  logo: "ajay",
  tagline1: "full-stack systems,",
  tagline2: "built to scale.",
  availability: "Open to full-stack / backend roles · 2026",
  location: "Pune, Maharashtra, India",
  lede:
    "Software developer specialising in Java, Spring Boot and React.js. I build scalable full-stack applications with a strong foundation in data structures, algorithms and database optimisation.",
  email: "Ajay.shinde1606@gmail.com",
  phone: "+91 93704 63004",
  resume: "/AjayShinde_CV.pdf", // served from /public
  socials: [
    { label: "GitHub", url: "https://github.com/Ajay-Shinde-16" },
    { label: "LinkedIn", url: "https://linkedin.com/in/ajayshinde16" },
    { label: "Email", url: "mailto:Ajay.shinde1606@gmail.com" },
  ],
};

export const ROLES = [
  "Java + Spring Boot developer",
  "React.js front-end",
  "full-stack engineer",
  "DSA problem-solver",
];

export const STATS = [
  { value: 30, suffix: "%", k: "faster API response" },
  { value: 99.9, suffix: "%", decimals: 1, k: "production uptime" },
  { value: 1000, suffix: "+", comma: true, k: "concurrent users" },
  { value: 25, suffix: "+", k: "REST endpoints shipped" },
];

export const MARQUEE = [
  "Java", "Spring Boot", "Hibernate", "React.js", "Node.js",
  "Express.js", "MySQL", "MongoDB", "Docker", "Kubernetes", "REST APIs", "JWT",
];

export const ABOUT = [
  "I'm <b>Ajay</b>, a software developer from Pune with a Post-Graduate Certificate in Advanced Computing from <b>CDAC</b> and a BE in Computer Engineering.",
  "I work across the stack — <b>Java &amp; Spring Boot</b> on the backend, <b>React.js</b> on the front — and I care about the parts users never see: fast queries, clean REST design, and systems that hold up under load. My internship taught me to chase real numbers (response times, uptime, bug counts), and my projects are where I push those numbers further.",
  "I like turning a vague problem into a shipped, measurable feature — a skill-match algorithm, a QR ticketing flow, a notification system that actually fires in under a second.",
];

export const NOW = [
  { k: "focus →", v: "Full-stack development with Java & Spring Boot" },
  { k: "learning →", v: "System design & scalable architecture" },
  { k: "based in →", v: "Pune, Maharashtra, India" },
];

export const SKILLS = [
  { icon: "</>", title: "Languages", items: ["Java", "C", "C++", "JavaScript", "SQL", "HTML5", "CSS3"] },
  { icon: "{ }", title: "Backend", items: ["Spring Boot", "Hibernate", "Node.js", "Express.js", "REST APIs", "JWT"] },
  { icon: "[ ]", title: "Frontend", items: ["React.js", "Bootstrap", "Chart.js", "Vite"] },
  { icon: "#", title: "Databases", items: ["MySQL", "Oracle", "MongoDB"] },
  { icon: "⌘", title: "Dev Tools", items: ["Git", "GitHub", "Postman", "Docker", "Kubernetes", "Linux", "Eclipse", "VS Code"] },
  { icon: "∑", title: "Core CS", items: ["DSA", "OOP", "Operating Systems", "Computer Networks"] },
];

// Featured projects — canonical source is data/projects.json (shared with the
// backend's resources/projects.json). Edit the JSON, not this line.
// Used directly on the frontend and as a fallback if the API isn't running.
import projectsData from "./projects.json";
export const PROJECTS = projectsData;

export const TIMELINE = [
  {
    type: "Education",
    when: "Feb 2026 – Jul 2026",
    title: "PGCP in Advanced Computing (PG-DAC)",
    org: "CDAC, Bangalore",
    desc: "Post-Graduate Certificate in Advanced Computing — 80.75%, First Class with Distinction.",
  },
  {
    type: "Work",
    when: "Jul 2024 – Dec 2024",
    title: "Java Backend Developer Intern",
    org: "SoftCrowd Technologies · Remote",
    desc: "Built and optimised backend services in Java, Spring Boot and Hibernate — cut API response time by 30%, improved system efficiency 40% via REST API work, and reduced bug reports by 20% working with cross-functional teams.",
  },
  {
    type: "Education",
    when: "Aug 2019 – Jun 2023",
    title: "BE, Computer Engineering",
    org: "Amrutvahini College of Engineering, Sangamner",
    desc: "CGPA 7.79 — First Class with Distinction.",
  },
  {
    type: "Education",
    when: "Feb 2017 – Apr 2018",
    title: "Higher Secondary (XII)",
    org: "Pune Board",
    desc: "Higher Secondary Certificate — 66%.",
  },
  {
    type: "Education",
    when: "Mar 2015 – May 2016",
    title: "Secondary (X)",
    org: "Pune Board",
    desc: "Secondary School Certificate — 81.20%.",
  },
];

export const CERTS = [
  { title: "PG Certificate in Advanced Computing (PGCPAC)", org: "CDAC, Bangalore" },
  { title: "Full-Stack Web Development (MERN)", org: "Apna College" },
];

export const NAV = [
  { num: "01", label: "about", href: "#about" },
  { num: "02", label: "skills", href: "#skills" },
  { num: "03", label: "work", href: "#work" },
  { num: "04", label: "journey", href: "#journey" },
];
